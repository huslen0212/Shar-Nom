import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      role: "admin", 
    },
  });

  const places = [
    {
      name: "Төв Номын Сан",
      founded_year: 1950,
      image_url: "https://shar-nom.s3.eu-north-1.amazonaws.com/nominSan.jpg",
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
      image_url: "https://example.com/https://shar-nom.s3.eu-north-1.amazonaws.com/gandan.jpg.jpg",
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
      image_url: "https://example.com/https://shar-nom.s3.eu-north-1.amazonaws.com/bogdMuzei.jpg.jpg",
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
      image_url: "https://example.com/https://shar-nom.s3.eu-north-1.amazonaws.com/suhbaatar.jpg.jpg",
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
      image_url: "https://example.com/https://shar-nom.s3.eu-north-1.amazonaws.com/cingisMuzei.jpg.jpg",
      short_description: "Монголын түүх, соёлын өвийг дэлгэн үзүүлдэг музей.",
      long_description: "Монголын Үндэсний музей нь Монголын түүх, соёлын өвийг дэлгэн үзүүлдэг том музей юм. Музейд эртний олдвор, уламжлалт хувцас, гар урлал, археологийн эд зүйлс хадгалагдсан. Судлаачид болон жуулчдад зориулсан үзэсгэлэн, сургалт, лекцүүдийг тогтмол зохион байгуулдаг. Мөн Монголын төр, нийгмийн хөгжил, түүхийн чухал үйл явдлуудыг харуулсан үзмэрүүдтэй. Орчин үеийн технологи ашиглан мультимедиа дэлгэц, гарын авлагаар үзэгчдэд мэдээлэл өгдөг.",
      location: "Улаанбаатар, Сүхбаатар дүүрэг",
      phone_number: "9512356",
      facebook_url: "https://www.facebook.com/National.Library.of.Mongolia",
      instagram_url: "https://www.facebook.com/National.Library.of.Mongolia",
      website_url: "https://www.facebook.com/National.Library.of.Mongolia",
      category: "Музей",
    },
      {
    name: "Tom N Toms Coffee",
    founded_year: 2011,
    image_url: "https://shar-nom.s3.eu-north-1.amazonaws.com/images.jpg", // чи өөрөө тавина
    short_description: "Олон улсын сүлжээ кофе шоп.",
    long_description:
      "Tom N Toms Coffee нь Өмнөд Солонгосоос гаралтай олон улсын кофе шопын сүлжээ бөгөөд Улаанбаатар хотод хэд хэдэн салбартай. Энд төрөл бүрийн кофе, цай, амттан, хөнгөн зуушаар үйлчилдэг. Чимээгүй орчин нь уулзалт, ажил хийх, амрахад тохиромжтой.",
    location: "Улаанбаатар, Сүхбаатар дүүрэг",
    phone_number: "99112233",
    facebook_url: "https://www.facebook.com/tomntomsmongolia",
    instagram_url: "https://www.instagram.com/tomntomsmongolia",
    website_url: "",
    category: "Кофе шоп",
  },
  {
    name: "The Bull Hot Pot Restaurant",
    founded_year: 2018,
    image_url: "https://shar-nom.s3.eu-north-1.amazonaws.com/bull.jpg",
    short_description: "Халуун тогооны чиглэлээр мэргэшсэн ресторан.",
    long_description:
      "The Bull Hot Pot Restaurant нь халуун тогооны соёлыг Монголд түгээн дэлгэрүүлсэн ресторан юм. Үйлчлүүлэгчид өөрийн хүссэн орц найрлага, амтлагчийг сонгон хоолоо бэлтгэх боломжтой. Найз нөхөд, гэр бүлээрээ хооллох, уулзалт хийхэд тохиромжтой орчинтой.",
    location: "Улаанбаатар, Баянзүрх дүүрэг",
    phone_number: "98001122",
    facebook_url: "https://www.facebook.com/thebullhotpot",
    instagram_url: "",
    website_url: "",
    category: "Ресторан",
  },
  {
    name: "Pizza Hut Mongolia",
    founded_year: 2015,
    image_url: "https://shar-nom.s3.eu-north-1.amazonaws.com/pizza.jpg",
    short_description: "Олон улсын пиццаны ресторан.",
    long_description:
      "Pizza Hut нь дэлхийд алдартай пиццаны брэнд бөгөөд Монголд албан ёсны салбаруудтай. Энд пицца, паста, салат, ундаа зэрэг өргөн сонголттой. Гэр бүл, хүүхдүүдтэйгээ ирэхэд тохиромжтой тухтай орчин бүрдсэн.",
    location: "Улаанбаатар, Чингэлтэй дүүрэг",
    phone_number: "75750000",
    facebook_url: "https://www.facebook.com/pizzahutmongolia",
    instagram_url: "https://www.instagram.com/pizzahutmongolia",
    website_url: "",
    category: "Ресторан",
  },
  {
    name: "Playtime Game Center",
    founded_year: 2017,
    image_url: "https://shar-nom.s3.eu-north-1.amazonaws.com/platime.jpg",
    short_description: "Орчин үеийн тоглоомын төв.",
    long_description:
      "Playtime Game Center нь хүүхэд, залуусын чөлөөт цагаа өнгөрүүлэхэд зориулагдсан тоглоомын төв юм. Энд PlayStation, PC game, VR тоглоом зэрэг орчин үеийн тоног төхөөрөмжүүд байрладаг. Найз нөхдөөрөө хамт тоглож, зугаацахад тохиромжтой.",
    location: "Улаанбаатар, Хан-Уул дүүрэг",
    phone_number: "99008877",
    facebook_url: "",
    instagram_url: "",
    website_url: "",
    category: "Тоглоомын төв",
  },
  {
    name: "Sky Resort",
    founded_year: 2009,
    image_url: "https://shar-nom.s3.eu-north-1.amazonaws.com/sky.jpg",
    short_description: "Уулын цанын болон амралтын цогцолбор.",
    long_description:
      "Sky Resort нь Улаанбаатар хотын ойролцоо байрлах уулын цанын болон амралтын цогцолбор юм. Өвлийн улиралд цана, сноуборд, зуны улиралд амралт, арга хэмжээ зохион байгуулах боломжтой. Гэр бүл, жуулчид, спорт сонирхогчдод тохиромжтой газар.",
    location: "Улаанбаатар, Хан-Уул дүүрэг",
    phone_number: "77110011",
    facebook_url: "https://www.facebook.com/skyresortmongolia",
    instagram_url: "",
    website_url: "https://www.skyresort.mn",
    category: "Амралт/Зугаа цэнгэл",
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
