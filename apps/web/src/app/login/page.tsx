'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import type { SignInResponse } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Login() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

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

    const signInResult = (await signIn('credentials', {
      email,
      redirect: false,
    })) as SignInResponse | undefined;

    if (signInResult?.error) {
      setError('Нэвтрэх үед алдаа гарлаа.');
      return;
    }

    if (data.role === 'admin') {
      router.push('/admin');
      return;
    }

    router.push('/');
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
