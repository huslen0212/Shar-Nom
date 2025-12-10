'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Login() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleEmail = async () => {
    setError('');

    const res = await fetch('/api/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (data.status === 'no_account') {
      setError('Бүртгэлгүй имэйл байна.');
      return;
    }

    if (data.role === 'admin') {
      signIn('github', { callbackUrl: '/admin' });
      return;
    }

    signIn('github', { callbackUrl: '/' });
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[360px] p-4 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            Нэвтрэх
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && <p className="text-red-500 text-center">{error}</p>}

          <Input
            type="email"
            placeholder="Цахим шуудан"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button className="w-full" onClick={handleEmail}>
            Цахим шуудангаар нэвтрэх
          </Button>

          <div className="flex items-center justify-center">
            <span className="text-sm text-gray-400">эсвэл</span>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => signIn('github', { callbackUrl: '/' })}
          >
            GitHub-аар нэвтрэх
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
