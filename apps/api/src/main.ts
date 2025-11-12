import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// GET /places — buh gazruudiig avah
app.get('/places', async (req, res) => {
  try {
    const places = await prisma.place.findMany(); 
    res.json(places);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Өгөгдөл татахад алдаа гарлаа.' });
  }
});

app.get('/places/:id', async (req, res) => {
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

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3001;
app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
