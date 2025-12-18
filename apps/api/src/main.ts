import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import { Groq } from 'groq-sdk';
import Redis from 'ioredis';
import crypto from 'crypto';
import { enqueueJob } from './queue';
import './worker';


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
  pipeline: (
    task: string,
    model: string
  ) => Promise<
    (
      text: string,
      options?: object
    ) => Promise<{ data: number[] | Float32Array }>
  >;
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

function cosineSimilarity(vecA: number[], vecB: number[]) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  const dot = vecA.reduce((s, a, i) => s + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((s, a) => s + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((s, b) => s + b * b, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

app.post('/users/:id/send-welcome', async (req: Request, res: Response) => {
  const id = req.params.id;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user?.email) {
    return res.status(404).json({ message: 'User not found or no email' });
  }

  const payload = {
    to: user.email,
    subject: 'Шар номд тавтай морил',
    template: 'welcome',
    data: {
      name: user.email,
    },
  };

  const keyBase = `${payload.template}:${payload.to}:${JSON.stringify(
    payload.data
  )}`;

  const dedupeKey = `email:${crypto
    .createHash('sha256')
    .update(keyBase)
    .digest('hex')}`;

  await enqueueJob('SendEmail', payload, { dedupeKey });

  return res.json({ ok: true });
});

app.get('/places', async (_req: Request, res: Response) => {
  try {
    const places = await prisma.place.findMany();
    return res.json(places);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Өгөгдөл татахад алдаа гарлаа.' });
  }
});

app.get('/places/:id', async (req: Request, res: Response) => {
  try {
    const place = await prisma.place.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!place) {
      return res.status(404).json({ error: 'Place олдсонгүй.' });
    }

    return res.json(place);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Өгөгдөл татахад алдаа гарлаа.' });
  }
});

app.post('/api/ai/yellow-books/search', async (req: Request, res: Response) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'Асуулт хоосон байна.' });
  }

  try {
    const cacheKey = `search:${Buffer.from(question).toString('base64')}`;
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const transformers = (await import(
      '@xenova/transformers'
    )) as unknown as TransformerModule;

    const embedder = await transformers.pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2'
    );

    const output = await embedder(question, {
      pooling: 'mean',
      normalize: true,
    });

    const questionVector = Array.from(output.data) as number[];

    const lowerQuestion = question.toLowerCase();
    const categories = [
      'музей',
      'ресторан',
      'кофе',
      'зочид буудал',
      'эмнэлэг',
      'сургууль',
      'тоглоомын төв',
    ];

    const detectedCategory = categories.find((c) =>
      lowerQuestion.includes(c)
    );

    const allPlaces = (await prisma.place.findMany({
      where: {
        NOT: { embedding: { equals: [] } },
      },
    })) as Place[];

    const scored: ScoredPlace[] = allPlaces.map((p) => {
      let score = cosineSimilarity(
        questionVector,
        (p.embedding || []) as number[]
      );

      const pName = p.name.toLowerCase();
      const pCat = (p.category || '').toLowerCase();
      const pLoc = (p.location || '').toLowerCase();

      if (detectedCategory && pCat.includes(detectedCategory)) score += 0.5;
      if (lowerQuestion.includes(pName)) score += 0.3;
      if (lowerQuestion.includes(pLoc)) score += 0.2;
      if (detectedCategory && !pCat.includes(detectedCategory)) score -= 0.2;

      return { ...p, finalScore: score };
    });

    const topPlaces = scored
      .filter((p) => p.finalScore > 0.3)
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, 4);

    const context =
      topPlaces.length > 0
        ? topPlaces
            .map(
              (p) =>
                `- ${p.name} (${p.category}): ${
                  p.long_description || 'Тайлбаргүй'
                }`
            )
            .join('\n')
        : 'Хэрэглэгчийн хүсэлтэд тохирох газар олдсонгүй.';

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content:
            'Чи бол "Шар ном" лавлахын туслах. Зөвхөн өгөгдсөн газруудыг санал болго.',
        },
        {
          role: 'user',
          content: `Асуулт: ${question}\n\nБоломжит газрууд:\n${context}`,
        },
      ],
    });

    const result = {
      answer: completion.choices[0]?.message?.content,
      sources: topPlaces.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        location: p.location,
      })),
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
