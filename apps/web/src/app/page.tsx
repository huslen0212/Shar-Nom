import { Suspense } from 'react';
import Header from '@/components/Header';
import SearchSection, { Place } from '@/components/Search';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// ISR tohirgoo
export const revalidate = 60;

// Server-ees fetch hiih function
async function getPlaces(): Promise<Place[]> {
  const res = await fetch('http://localhost:3001/places', {
    next: { revalidate: 60 },
  });
  return res.json();
}

export default async function Home() {
  const initialPlaces = await getPlaces();

  return (
    <div className="min-h-screen bg-white text-black">
      <Header />

      <Suspense fallback={<p className="text-center mt-10">Ачаалж байна...</p>}>
        <SearchSection initialPlaces={initialPlaces} />
      </Suspense>

      <div className="flex justify-center mt-6 pb-10">
        <Link href="/all-places">
          <Button>Бүгдийг үзэх</Button>
        </Link>
      </div>
    </div>
  );
}
