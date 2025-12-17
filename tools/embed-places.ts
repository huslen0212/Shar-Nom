import { PrismaClient } from '@prisma/client';
import { pipeline } from '@xenova/transformers';
import * as dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

// ... (дээрх import хэсгүүд хэвээрээ)

async function main() {
  console.log("Холболт шалгаж байна...");
  
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

  // ШҮҮЛТҮҮРГҮЙГЭЭР БҮХ ӨГӨГДЛИЙГ ТАТАЖ ҮЗЭХ
  const allPlaces = await prisma.place.findMany();
  
  console.log(`DB-ээс нийт олдсон мөрний тоо: ${allPlaces.length}`);

  if (allPlaces.length === 0) {
    console.log("АНХААР: Өгөгдлийн сан хоосон байна эсвэл буруу DB рүү холбогдоод байна!");
    return;
  }

  // Зөвхөн embedding нь хоосон байгааг шүүх (Memory дээр)
  const placesToEmbed = allPlaces.filter(p => !p.embedding || (Array.isArray(p.embedding) && p.embedding.length === 0));
  
  console.log(`Векторжуулах шаардлагатай: ${placesToEmbed.length}`);

  for (const p of placesToEmbed) {
    const text = `${p.name}. ${p.long_description || ''}`;
    try {
      const output = await embedder(text, { pooling: 'mean', normalize: true });
      const vector = Array.from(output.data) as number[];

      await prisma.place.update({
        where: { id: p.id },
        data: { embedding: vector }
      });
      console.log(`✅ Амжилттай: ${p.name}`);
    } catch (err) {
      console.error(`❌ Алдаа: ${p.name}`, err);
    }
  }
}
// ...

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());