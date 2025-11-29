import { Suspense } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import PlacesGrid from '@/components/PlacesGrid';

// ISR tohirgoo
export const revalidate = 60;

// Streamed section
async function PlacesSection() {
  const listings = await fetch(
    process.env.API || 'http://localhost:3001/places',
    {
      next: { revalidate: 60 },
    }
  ).then((r) => r.json());

  return <PlacesGrid places={listings} />;
}

export default async function Page() {
  return (
    <div className="min-h-screen bg-white text-black pb-5">
      <Header />

      <div className="flex items-center justify-center gap-6 mt-8">
        <Link href="/yellow-book/search">
          <Button>Хайлт хийх</Button>
        </Link>

        {/* <Link href="/all-places">
          <Button>Бүгдийг үзэх</Button>
        </Link> */}
      </div>

      <Suspense fallback={<p className="text-center mt-10">Ачаалж байна...</p>}>
        <PlacesSection />
      </Suspense>
    </div>
  );
}
