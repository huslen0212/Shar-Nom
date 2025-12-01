import { Suspense } from 'react';
import Header from '@/components/Header';
import PlacesGrid from '@/components/PlacesGrid';
import BackButton from '@/components/BackButton';

export interface Place {
  id: string;
  name: string;
  image_url: string;
  founded_year: string;
  location: string;
  short_description: string;
  category: string;
  phone_number: string;
  facebook_url: string;
  instagram_url: string;
  website_url: string;
  long_description: string;
}

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

async function PlacesSection() {
  const res = await fetch(`${process.env.API_URL}/places`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return <p className="text-center mt-10 text-red-500">Алдаа гарлаа...</p>;
  }

  const places: Place[] = await res.json();

  const sortedPlaces = places.sort((a, b) =>
    a.name.localeCompare(b.name, 'mn', { sensitivity: 'base' })
  );

  return <PlacesGrid places={sortedPlaces} />;
}

export default function AllPlacesPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Header />

      <div className="px-6 md:px-12 mt-4">
        <BackButton />
      </div>

      <div className="flex-1 px-6 md:px-12 py-6">
        <Suspense
          fallback={
            <p className="text-center mt-10 text-gray-500">Ачаалж байна...</p>
          }
        >
          <PlacesSection />
        </Suspense>
      </div>
    </div>
  );
}
