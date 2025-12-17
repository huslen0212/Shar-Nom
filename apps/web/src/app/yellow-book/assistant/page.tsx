'use client';

import { useState } from 'react';
import HeaderClient from '@/components/HeaderClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AssistantPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setAnswer('');
    setPlaces([]);

    try {
      const res = await fetch(
        'http://localhost:3001/api/ai/yellow-books/search',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question }),
        }
      );

      const data = await res.json();
      setAnswer(data.answer);
      setPlaces(data.places || []);
    } catch (err) {
      setAnswer('Алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderClient />

      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {/* Search box */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">🤖 AI Туслах (Шар ном)</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="flex gap-2">
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Жишээ: Оюутанд зориулсан номын сан хаана байна вэ?"
              />
              <Button type="submit" disabled={loading}>
                {loading ? 'Хайж байна…' : 'Асуух'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Answer */}
        {answer && (
          <Card className="bg-white border-l-4 border-black">
            <CardContent className="p-4 text-gray-800">{answer}</CardContent>
          </Card>
        )}

        {/* Places */}
        {places.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-4">
            {places.map((p) => (
              <Card key={p.id} className="hover:shadow-lg transition">
                <CardContent className="p-4 space-y-1">
                  <h3 className="font-semibold text-lg">{p.name}</h3>
                  <p className="text-sm text-gray-600">
                    📍 {p.location || 'Байршил тодорхойгүй'}
                  </p>
                  <span className="inline-block text-xs bg-gray-200 px-2 py-1 rounded">
                    {p.category}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !answer && places.length === 0 && (
          <p className="text-center text-gray-400">
            Асууулт бичээд AI-гаас зөвлөгөө аваарай 🙂
          </p>
        )}
      </div>
    </div>
  );
}
