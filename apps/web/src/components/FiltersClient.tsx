'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from './ui/select';

import { useState, useEffect } from 'react';

interface FiltersClientProps {
  initial: Record<string, string | string[] | undefined>;
}

interface Place {
  category: string;
}

export default function FiltersClient({ initial }: FiltersClientProps) {
  const router = useRouter();

  const [category, setCategory] = useState<string>(
    initial.category ? String(initial.category) : 'all'
  );

  const [name, setName] = useState<string>(String(initial.name || ''));
  const [location, setLocation] = useState<string>(
    String(initial.location || '')
  );
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API || 'http://localhost:3001';
        const res = await fetch(`${apiUrl}/places`);

        if (res.ok) {
          const places: Place[] = await res.json();
          const uniqueCategories = Array.from(
            new Set(places.map((place) => place.category).filter(Boolean))
          );
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Категори татахад алдаа:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();

    const categoryParam = category === 'all' ? '' : category;

    if (categoryParam) params.set('category', categoryParam);
    if (name) params.set('name', name);
    if (location) params.set('location', location);

    router.push(`/yellow-book/search?${params.toString()}`);
  };

  return (
    <div className="bg-white py-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex gap-4">
          {/* Нэр */}
          <Input
            type="text"
            placeholder="Нэрээр хайх..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1"
          />

          {/* Байршил */}
          <Input
            type="text"
            placeholder="Байршлаар хайх..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1"
          />

          {/* Категори Select */}
          <Select
            value={category}
            onValueChange={(value) => setCategory(value)}
            disabled={loading}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Бүх төрөл" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Бүх төрөл</SelectItem>

              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Хайх */}
          <Button onClick={handleSearch}>Хайх</Button>
        </div>
      </div>
    </div>
  );
}
