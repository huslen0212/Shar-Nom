'use client';

import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusIcon, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';

export default function HeaderClient() {
  const { data: session } = useSession();

  return (
    <header className="flex justify-between items-center p-6 bg-white text-black shadow-md">
      <Link href="/" className="flex items-center gap-3">
        <Image src="/sharnom.png" alt="Logo" width={60} height={60} />
        <h1 className="text-3xl font-bold tracking-tight font-sans">Шар ном</h1>
      </Link>

      <div className="flex items-center gap-4">
        <Link href="/upload-page">
          <Button className="flex items-center gap-2 bg-black text-white hover:bg-white hover:text-black border border-black transition">
            <PlusIcon className="w-5 h-5" />
            <span>Нэмэх</span>
          </Button>
        </Link>

        {session?.user ? (
          <div className="flex items-center gap-4">
            {/* Black badge with white text */}
            <Badge className="bg-black text-white px-3 py-1 text-sm">
              {session.user.email}
            </Badge>

            <Button
              onClick={() => signOut()}
              className="flex items-center gap-2 bg-black text-white hover:bg-white hover:text-black border border-black transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Гарах</span>
            </Button>
          </div>
        ) : (
          <Link href="/login">
            <Button className="flex items-center gap-2 bg-black text-white hover:bg-white hover:text-black border border-black transition">
              <User className="w-5 h-5" />
              <span>Нэвтрэх</span>
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
