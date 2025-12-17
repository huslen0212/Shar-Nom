import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import { Groq } from 'groq-sdk';
import Redis from 'ioredis';

// --- Төрлүүдийн тодорхойлолт ---
interface TransformerModule {
  pipeline: (task: string, model: string) => Promise<any>;
}

const app = express();
const prisma = new PrismaClient();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Алдаа 1: Redis-ийг ашиглахгүй бол comment болгох эсвэл хайлтад ашиглах
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  retryStrategy(times) {
    return Math.min(times * 50, 2000);
  },
});

app.use(cors());
app.use(express.json());

// GET /places — buh gazruudiig avah
app.get('/places', async (_req: Request, res: Response) => {
  try {
    const places = await prisma.place.findMany(); 
    return res.json(places); // return нэмэв
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

    // 1. Асуултыг вектор болгох
    const { pipeline } = await (eval('import("@xenova/transformers")') as Promise<TransformerModule>);
    const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    const output = await embedder(question, { pooling: 'mean', normalize: true });
    const questionVector = Array.from(output.data) as number[];

    const lowerQuestion = question.toLowerCase();

    // 2. Хэрэглэгчийн хүсэлтээс ангиллыг таних (Музей, Ресторан гэх мэт)
    // Энэ хэсэг нь зураг дээрх шиг холимог үр дүн гарахаас сэргийлнэ.
    const categories = ['музей', 'ресторан', 'кофе', 'зочид буудал', 'эмнэлэг', 'сургууль', 'тоглоомын төв'];
    const detectedCategory = categories.find(cat => lowerQuestion.includes(cat));

    // 3. Өгөгдөл татах (Бүх өгөгдлийг биш, хэрэгцээтэйг нь шүүх)
    const allPlaces = await prisma.place.findMany({
      where: { 
        NOT: { embedding: { equals: [] } } 
      }
    });

    // 4. Scoring (Оноо өгөх логикийг чангатгах)
    const scoredPlaces = allPlaces.map((p) => {
      let score = cosineSimilarity(questionVector, p.embedding as number[]);
      const pName = p.name.toLowerCase();
      const pCat = (p.category || '').toLowerCase();
      const pLoc = (p.location || '').toLowerCase();

      // А. Ангиллын тааралтыг маш өндөр оноогоор шагнах (Хамгийн чухал засалт)
      if (detectedCategory && pCat.includes(detectedCategory)) {
        score += 0.5; // Ангилал таарвал жагсаалтын эхэнд гаргана
      }

      // Б. Нэр болон байршлын оноо
      if (lowerQuestion.includes(pName)) score += 0.3;
      if (lowerQuestion.includes(pLoc)) score += 0.2;

      // В. Хэрэв хэрэглэгч "Музей" гэсэн боловч энэ нь "Ресторан" бол оноог хасах (Penalty)
      if (detectedCategory && !pCat.includes(detectedCategory)) {
        score -= 0.2; 
      }

      return { ...p, finalScore: score };
    });

    // 5. Босго оноо тогтоох (Маш бага оноотой үр дүнг хасах)
    const topPlaces = scoredPlaces
      .filter(p => p.finalScore > 0.3) // 0.3-аас бага оноотой бол хамааралгүй гэж үзнэ
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, 4);

    // 6. LLM-д "хатуу" заавар өгөх
    const context = topPlaces.length > 0 
      ? topPlaces.map(p => `- ${p.name} (${p.category}): ${p.long_description || 'Тайлбаргүй'}`).join('\n')
      : "Хэрэглэгчийн хүсэлтэд тохирох газар олдсонгүй.";

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Чи бол "Шар ном" лавлахын туслах. 
          Дүрэм 1: Зөвхөн өгөгдсөн context доторх газруудыг санал болго. 
          Дүрэм 2: Хэрэв context хоосон бол "Уучлаарай, таны хайсан ангилалд тохирох газар олдсонгүй" гэж хариул.
          Дүрэм 3: Хамааралгүй (жишээ нь музей хайхад ресторан) газар БҮҮ санал болго.`
        },
        { role: 'user', content: `Асуулт: ${question}\n\nБоломжит газрууд:\n${context}` }
      ],
      model: 'llama-3.1-8b-instant',
    });

    const result = { 
      answer: chatCompletion.choices[0]?.message?.content, 
      sources: topPlaces.map(p => ({ id: p.id, name: p.name, location: p.location, category: p.category }))
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