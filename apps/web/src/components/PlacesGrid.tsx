import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export interface Place {
  id: string;
  name: string;
  short_description: string;
  image_url: string;
  location: string;
}

interface PlacesGridProps {
  places: Place[];
}

export default function PlacesGrid({ places }: PlacesGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-10 mt-10">
      {places.map((place) => (
        <Link key={place.id} href={`/yellow-book/${place.id}`}>
          <Card
            className="
              border-none rounded-2xl group 
              transition-all duration-500 ease-out 
              shadow-[2px_4px_15px_rgba(0.15,0.15,0.15,0.15)] 
              hover:shadow-[0_10px_25px_rgba(0,0,0,0.25)] 
              hover:scale-[1.03]
              flex flex-col h-full
            "
          >
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-t-2xl">
              <img
                src={place.image_url || '/default.jpg'}
                alt={place.name}
                className="w-full h-full object-cover object-center 
               transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>

            <CardHeader>
              <CardTitle className="flex justify-center text-center text-lg">
                {place.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-1">
              <p className="text-sm text-gray-500 line-clamp-3">
                {place.short_description}
              </p>
              <p className="text-sm text-gray-700 mt-3">
                Байршил: {place.location}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
