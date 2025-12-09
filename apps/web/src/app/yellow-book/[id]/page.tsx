import Image from 'next/image';
import { notFound } from 'next/navigation';
import HeaderClient from '@/components/HeaderClient';
import BackButton from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Place {
  id: string;
  name: string;
  long_description: string;
  image_url: string;
  founded_year: string;
  location: string;
  category: string;
  phone_number: string;
  facebook_url: string;
  instagram_url: string;
  website_url: string;
}

interface PageProps {
  params: { id: string };
}

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
// 7 хоног = 604800 секунд
const REVALIDATE_7_DAYS = 604800;

const apiUrl = process.env.API || 'http://localhost:3001';

export default async function YellowBookPage({ params }: PageProps) {
  const { id } = params;

  const res = await fetch(`${apiUrl}/places/${id}`, {
    next: { revalidate: REVALIDATE_7_DAYS },
  });

  if (!res.ok) {
    notFound();
  }

  const place: Place = await res.json();

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderClient />

      <div className="ml-5 mt-4">
        <BackButton />
      </div>

      <div className="max-w-4xl mx-auto px-6 mb-5 py-8 bg-white rounded-lg shadow-2xl">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image */}
          <div className="relative w-full md:w-1/3 h-64">
            <Image
              src={place.image_url || '/default.jpg'}
              alt={place.name}
              fill
              className="rounded-md object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-4">{place.name}</h1>
            <p className="text-gray-700 mb-4">{place.long_description}</p>

            <div className="space-y-2 text-sm mb-6">
              <div className="flex">
                <span className="font-semibold w-32">Үүссэн он:</span>
                <span className="text-gray-700">{place.founded_year}</span>
              </div>

              <div className="flex">
                <span className="font-semibold w-32">Байршил:</span>
                <span className="text-gray-700">{place.location}</span>
              </div>

              <div className="flex">
                <span className="font-semibold w-32">Төрөл:</span>
                <span className="text-gray-700">{place.category}</span>
              </div>

              <div className="flex">
                <span className="font-semibold w-32">Утас:</span>
                <span className="text-gray-700">{place.phone_number}</span>
              </div>

              <div className="flex">
                <span className="font-semibold w-32">Facebook хаяг:</span>
                <span className="text-gray-700 underline">
                  <Link href={place.facebook_url}>{place.facebook_url}</Link>
                </span>
              </div>

              <div className="flex">
                <span className="font-semibold w-32">Instagram хаяг:</span>
                <span className="text-gray-700 underline">
                  <Link href={place.instagram_url}>{place.instagram_url}</Link>
                </span>
              </div>

              <div className="flex">
                <span className="font-semibold w-32">Веб:</span>
                <span className="text-gray-700 underline">
                  <Link href={place.website_url}>{place.website_url}</Link>
                </span>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block mb-2 font-medium">Сэтгэгдэл:</label>
              <textarea
                placeholder="Та энд сэтгэгдлээ бичнэ үү..."
                className="w-full h-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <Button>Илгээх</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
