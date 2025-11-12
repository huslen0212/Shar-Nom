'use client';

import { useState } from 'react';
import PlacesGrid from '@/components/PlacesGrid';
import { Button } from './ui/button';
import { Search } from 'lucide-react';

export interface Place {
  id: string;
  name: string;
  image: string;
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

interface Props {
  initialPlaces: Place[];
}

export default function SearchSection({ initialPlaces }: Props) {
  const places = initialPlaces;
  const [nameSearch, setNameSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const uniqueCategories = Array.from(
    new Set(places.map((place) => place.category))
  );

  const handleCategoryFilter = (category: string) => {
    setCategoryFilter((prev) => (prev === category ? null : category));
  };

  const filteredPlaces = places.filter((place) => {
    const matchesName = place.name
      .toLowerCase()
      .includes(nameSearch.toLowerCase());
    const matchesCategory = categoryFilter
      ? place.category === categoryFilter
      : true;
    return matchesName && matchesCategory;
  });

  return (
    <div className="mt-6 flex flex-col items-center">
      <div className="relative w-[400px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

        <input
          type="text"
          placeholder="Газрын нэрээр хайх..."
          className="w-full pl-10 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={nameSearch}
          onChange={(e) => setNameSearch(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3 mt-6">
        <span className="font-medium text-lg">Төрөл:</span>
        {uniqueCategories.map((category) => (
          <Button
            key={category}
            variant={categoryFilter === category ? 'outline' : 'default'}
            className={`transition ${
              categoryFilter === category
                ? 'bg-white text-black border border-gray-400'
                : ''
            }`}
            onClick={() => handleCategoryFilter(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="mt-6 w-full flex justify-center">
        <PlacesGrid places={filteredPlaces} />
      </div>
    </div>
  );
}
