'use client';

interface MapIslandProps {
  points: string[];
}

export default function MapIsland({ points }: MapIslandProps) {
  return (
    <div className="p-6 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Газрын зураг</h2>
        <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="mb-2">Газрын зураг энд харагдана</p>
            <p className="text-sm">
              Байршил:{' '}
              {points.length > 0 ? points.join(', ') : 'Байршил олдсонгүй'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
