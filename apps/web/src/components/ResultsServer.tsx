import PlacesGrid from './PlacesGrid';

interface Place {
  id: string;
  name: string;
  image_url: string;
  short_description: string;
  location: string;
  category: string;
}

interface ResultsServerProps {
  data: Place[];
}

export default function ResultsServer({ data }: ResultsServerProps) {
  if (data.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Таны хайсан газар байхгүй байна.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">
          Олдсон газрууд: {data.length}
        </h2>
        <PlacesGrid places={data} />
      </div>
    </div>
  );
}
