import FiltersClient from '@/components/FiltersClient';
import ResultsServer from '@/components/ResultsServer';
import MapIsland from '@/components/MapIsland';
import Header from '@/components/Header';

interface Place {
  id: string;
  name: string;
  image_url: string;
  short_description: string;
  location: string;
  category: string;
  founded_year: string;
  phone_number: string;
  facebook_url: string;
  instagram_url: string;
  website_url: string;
  long_description: string;
}

export const dynamic = 'force-dynamic';

async function searchListings(
  searchParams: Record<string, string | string[] | undefined>
): Promise<Place[]> {
  const apiUrl = process.env.API || 'http://localhost:3001';
  const queryParams = new URLSearchParams();

  if (searchParams.category) {
    queryParams.append('category', String(searchParams.category));
  }
  if (searchParams.name) {
    queryParams.append('name', String(searchParams.name));
  }
  if (searchParams.location) {
    queryParams.append('location', String(searchParams.location));
  }

  const url = `${apiUrl}/places${
    queryParams.toString() ? `?${queryParams.toString()}` : ''
  }`;

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return [];

  const places: Place[] = await res.json();

  let filtered = places;

  if (searchParams.category) {
    filtered = filtered.filter((p) => p.category === searchParams.category);
  }
  if (searchParams.name) {
    const q = String(searchParams.name).toLowerCase();
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(q));
  }
  if (searchParams.location) {
    const q = String(searchParams.location).toLowerCase();
    filtered = filtered.filter((p) => p.location.toLowerCase().includes(q));
  }

  return filtered;
}

export default async function Search({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const results = await searchListings(searchParams);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="mt-6">
        <FiltersClient initial={searchParams} />
      </div>

      <div className="mt-4">
        <ResultsServer data={results} />
      </div>

      <div className="mt-6">
        <MapIsland points={results.map((r) => r.location)} />
      </div>
    </div>
  );
}
