import { Suspense } from 'react';
import HeaderClient from '@/components/HeaderClient';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import PlacesGrid from '@/components/PlacesGrid';

export const revalidate = 60;

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const apiUrl = process.env.API || 'http://localhost:3001';

async function PlacesSection() {
  const listings = await fetch(`${apiUrl}/places`, {
    cache: 'no-store',
  }).then((r) => r.json());

  return <PlacesGrid places={listings} />;
}

export default async function Page() {
  return (
    <div className="min-h-screen bg-white text-black pb-5">
      <HeaderClient />

      <div className="flex items-center justify-center gap-6 mt-8">
        <Link href="/yellow-book/search">
          <Button>Хайлт хийх</Button>
        </Link>

        <Link href="/all-places">
          <Button>Бүгдийг үзэх</Button>
        </Link>

        <Link href="/yellow-book/assistant">
          <Button>AI хайлт</Button>
        </Link>
      </div>

      <Suspense fallback={<p className="text-center mt-10">Ачаалж байна...</p>}>
        <PlacesSection />
      </Suspense>
    </div>
  );
}
