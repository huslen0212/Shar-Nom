import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const places = [
    {
      name: "Төв Номын Сан",
      founded_year: 1950,
      image_url: "https://example.com/library.jpg",
      short_description: "Төв Номын Сан нь олон төрлийн ном, сэтгүүл, судалгааны материалтай.",
      long_description: "Төв Номын Сан нь Монгол Улсын үндэсний номын сан бөгөөд олон төрлийн ном, сэтгүүл, судалгааны материалтай. Энд унших чимээгүй бүс, бүлгийн судалгааны өрөөнүүд болон компьютерийн өрөөтэй. Оюутан, судлаачид болон ном сонирхогчид номын сангийн нөөцөөс ашиглах боломжтой. Мөн сургалт, семинар, лекц зохион байгуулагддаг. Орчин үеийн дижитал бааз, интернет холболттой компьютерийн өрөө нь судалгааг хөнгөвчилдөг.",
      location: "Улаанбаатар, Сүхбаатар дүүрэг",
      phone_number: "99123456",
      facebook_url: "https://www.facebook.com/National.Library.of.Mongolia",
      instagram_url: "https://www.facebook.com/National.Library.of.Mongolia",
      website_url: "https://www.facebook.com/National.Library.of.Mongolia",
      category: "Номын сан",
    },
    {
      name: "Гандантэгчэнлин хийд",
      founded_year: 1835,
      image_url: "https://example.com/gandan.jpg",
      short_description: "Монголын хамгийн том буддын шашны хийд.",
      long_description: "Гандантэгчэнлин хийд нь Монголын хамгийн том, хамгийн чухал буддын шашны хийд юм. Энд олон лам нар амьдардаг бөгөөд оюутан, жуулчдад зориулсан бясалгалын өрөөнүүд байдаг. Хийд нь олон соёлын болон шашны арга хэмжээг тогтмол зохион байгуулагддаг. Мөн сүмийн музей, эртний бурхдын баримлуудтай. Монголын соёл, түүхийг ойлгоход чухал төв юм.",
      location: "Улаанбаатар, Чингэлтэй дүүрэг",
      phone_number: "98123456",
      facebook_url: "https://www.facebook.com/National.Library.of.Mongolia",
      instagram_url: "https://www.facebook.com/National.Library.of.Mongolia",
      website_url: "https://www.facebook.com/National.Library.of.Mongolia",
      category: "Музей/Шашны газар",
    },
    {
      name: "Богд хааны ордон музей",
      founded_year: 1893,
      image_url: "https://example.com/bogd_palace.jpg",
      short_description: "Түүхэн дурсгалт байр, музей болжээ.",
      long_description: "Богд хааны ордон нь түүхэн дурсгалт байр бөгөөд Богд хааны гэр байсан. Одоо музей болж Монголын түүх, соёлын өвийг дэлгэн үзүүлдэг. Музейд хувцас, эд хэрэгсэл, уран зураг, гэрэлт хөшөө зэрэг үзмэрүүд бий. Жуулчид болон судлаачид Монголын хаадын түүхийг танин мэдэх боломжтой. Мөн ордны гоёл чимэглэл, архитектурыг сонирхох боломжтой.",
      location: "Улаанбаатар, Баянзүрх дүүрэг",
      phone_number: "97123546",
      facebook_url: "https://www.facebook.com/National.Library.of.Mongolia",
      instagram_url: "https://www.facebook.com/National.Library.of.Mongolia",
      website_url: "https://www.facebook.com/National.Library.of.Mongolia",
      category: "Музей",
    },
    {
      name: "Сүхбаатарын талбай",
      founded_year: 1946,
      image_url: "https://example.com/sukhbaatar_square.jpg",
      short_description: "Улаанбаатарын төв талбай.",
      long_description: "Сүхбаатарын талбай нь Улаанбаатарын төвд байрлах алдартай талбай юм. Энд төрийн барилга, хөшөө, дурсгалууд байдаг. Талбай нь олон нийтийн арга хэмжээ, тэмдэглэлт үйл явдлуудыг зохион байгуулахад тохиромжтой. Жуулчид болон оршин суугчид амралт, зураг авахад их ирдэг. Мөн нээлттэй орчин нь хотын амьдралын төв болсон газар юм.",
      location: "Улаанбаатар, Сүхбаатар дүүрэг",
      phone_number: "96123456",
      facebook_url: "https://www.facebook.com/National.Library.of.Mongolia",
      instagram_url: "https://www.facebook.com/National.Library.of.Mongolia",
      website_url: "https://www.facebook.com/National.Library.of.Mongolia",
      category: "Талбай/Дурсгалт газар",
    },
    {
      name: "Монголын Үндэсний музей",
      founded_year: 1924,
      image_url: "https://example.com/national_museum.jpg",
      short_description: "Монголын түүх, соёлын өвийг дэлгэн үзүүлдэг музей.",
      long_description: "Монголын Үндэсний музей нь Монголын түүх, соёлын өвийг дэлгэн үзүүлдэг том музей юм. Музейд эртний олдвор, уламжлалт хувцас, гар урлал, археологийн эд зүйлс хадгалагдсан. Судлаачид болон жуулчдад зориулсан үзэсгэлэн, сургалт, лекцүүдийг тогтмол зохион байгуулдаг. Мөн Монголын төр, нийгмийн хөгжил, түүхийн чухал үйл явдлуудыг харуулсан үзмэрүүдтэй. Орчин үеийн технологи ашиглан мультимедиа дэлгэц, гарын авлагаар үзэгчдэд мэдээлэл өгдөг.",
      location: "Улаанбаатар, Сүхбаатар дүүрэг",
      phone_number: "9512356",
      facebook_url: "https://www.facebook.com/National.Library.of.Mongolia",
      instagram_url: "https://www.facebook.com/National.Library.of.Mongolia",
      website_url: "https://www.facebook.com/National.Library.of.Mongolia",
      category: "Музей",
    },
  ];

  for (const place of places) {
    await prisma.place.create({ data: place });
  }

  console.log("Seed finished.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
