'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import HeaderClient from '@/components/HeaderClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Place {
  id: string | number;
  name: string;
  location?: string;
  category?: string;
}

export default function AssistantPage() {
  const [question, setQuestion] = useState('');
  const [sources, setSources] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setSources([]);

    try {
      const res = await fetch(
        'http://localhost:3001/api/ai/yellow-books/search',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question }),
        }
      );

      if (!res.ok) throw new Error('Network error');
      const data = await res.json();

      setSources(data.sources || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderClient />
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">🤖 AI Туслах (Шар ном)</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Жишээ: Сүхбаатар дүүрэгт кофе шоп хаана байна?"
              />
              <Button type="submit" disabled={loading}>
                {loading ? 'Хайж байна…' : 'Хайх'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {sources.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-4">
            {sources.map((p) => (
              <Link key={p.id} href={`/yellow-book/${p.id}`}>
                <Card className="hover:shadow-lg transition cursor-pointer h-full border hover:border-black group">
                  <CardContent className="p-4 space-y-1">
                    <h3 className="font-semibold text-lg group-hover:text-blue-600 transition">
                      {p.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      📍 {p.location || 'Байршил тодорхойгүй'}
                    </p>
                    {p.category && (
                      <span className="inline-block text-xs bg-gray-200 px-2 py-1 rounded">
                        {p.category}
                      </span>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
