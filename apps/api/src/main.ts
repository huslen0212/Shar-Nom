import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import { Groq } from 'groq-sdk';
import Redis from 'ioredis';

interface Place {
  id: number;
  name: string;
  category?: string | null;
  location?: string | null;
  embedding?: number[];
  long_description?: string | null;
  founded_year?: number | null;
}

interface ScoredPlace extends Place {
  finalScore: number;
}

interface TransformerModule {
  pipeline: (task: string, model: string) => Promise<(text: string, options?: object) => Promise<{ data: number[] | Float32Array }>>;
}

const app = express();
const prisma = new PrismaClient();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  retryStrategy(times) {
    return Math.min(times * 50, 2000);
  },
});

app.use(cors());
app.use(express.json());

app.get('/places', async (_req: Request, res: Response) => {
  try {
    const places = await prisma.place.findMany(); 
    return res.json(places);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Өгөгдөл татахад алдаа гарлаа.' });
  }
});

app.get('/places/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const place = await prisma.place.findUnique({
      where: { id: Number(id) },
    });
    if (!place) {
      return res.status(404).json({ error: 'Place олдсонгүй.' });
    }
    return res.json(place);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Өгөгдөл татахад алдаа гарлаа.' });
  }
});

function cosineSimilarity(vecA: number[], vecB: number[]) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

app.post('/api/ai/yellow-books/search', async (req: Request, res: Response) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'Асуулт хоосон байна.' });

  try {
    const cacheKey = `search:${Buffer.from(question).toString('base64')}`;
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    // Dynamic import-ыг төрөлтэй болгов
    const transformers = await (import('@xenova/transformers') as unknown as Promise<TransformerModule>);
    const embedder = await transformers.pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    const output = await embedder(question, { pooling: 'mean', normalize: true });
    const questionVector = Array.from(output.data) as number[];

    const lowerQuestion = question.toLowerCase();
    const categories = ['музей', 'ресторан', 'кофе', 'зочид буудал', 'эмнэлэг', 'сургууль', 'тоглоомын төв'];
    const detectedCategory = categories.find(cat => lowerQuestion.includes(cat));

    const allPlaces = await prisma.place.findMany({
      where: { 
        NOT: { embedding: { equals: [] } } 
      }
    }) as Place[];

    // 4. Scoring (Төрлийг зааж өгөв)
    const scoredPlaces: ScoredPlace[] = allPlaces.map((p: Place) => {
      let score = cosineSimilarity(questionVector, p.embedding as number[]);
      const pName = p.name.toLowerCase();
      const pCat = (p.category || '').toLowerCase();
      const pLoc = (p.location || '').toLowerCase();

      if (detectedCategory && pCat.includes(detectedCategory)) {
        score += 0.5;
      }
      if (lowerQuestion.includes(pName)) score += 0.3;
      if (lowerQuestion.includes(pLoc)) score += 0.2;
      if (detectedCategory && !pCat.includes(detectedCategory)) {
        score -= 0.2; 
      }

      return { ...p, finalScore: score };
    });

    // 5. Filter & Sort (Төрлийг зааж өгөв)
    const topPlaces = scoredPlaces
      .filter((p: ScoredPlace) => p.finalScore > 0.3)
      .sort((a: ScoredPlace, b: ScoredPlace) => b.finalScore - a.finalScore)
      .slice(0, 4);

    const context = topPlaces.length > 0 
      ? topPlaces.map((p: ScoredPlace) => `- ${p.name} (${p.category}): ${p.long_description || 'Тайлбаргүй'}`).join('\n')
      : "Хэрэглэгчийн хүсэлтэд тохирох газар олдсонгүй.";

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Чи бол "Шар ном" лавлахын туслах. 
          Дүрэм 1: Зөвхөн өгөгдсөн context доторх газруудыг санал болго. 
          Дүрэм 2: Хэрэв context хоосон бол "Уучлаарай, таны хайсан ангилалд тохирох газар олдсонгүй" гэж хариул.`
        },
        { role: 'user', content: `Асуулт: ${question}\n\nБоломжит газрууд:\n${context}` }
      ],
      model: 'llama-3.1-8b-instant',
    });

    const result = { 
      answer: chatCompletion.choices[0]?.message?.content, 
      sources: topPlaces.map((p: ScoredPlace) => ({ id: p.id, name: p.name, location: p.location, category: p.category }))
    };

    await redis.set(cacheKey, JSON.stringify(result), 'EX', 3600);
    return res.json(result);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'AI хайлтад алдаа гарлаа.' });
  }
});

const host = process.env.HOST ?? 'localhost';
const port = 3001;
app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});