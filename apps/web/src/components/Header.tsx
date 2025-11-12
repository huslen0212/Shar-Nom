import { Button } from '@/components/ui/button';
import { PlusIcon, User } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex justify-between items-center p-6 bg-white text-black shadow-md">
      <h1 className="text-3xl font-bold tracking-tight font-sans">Шар ном</h1>

      <div className="flex items-center gap-4">
        <Link href="/upload-page">
          <Button className="flex items-center gap-2 bg-black text-white hover:bg-white hover:text-black border border-black transition">
            <PlusIcon className="w-5 h-5" />
            <span>Нэмэх</span>
          </Button>
        </Link>
        <Button className="flex items-center gap-2 bg-black text-white hover:bg-white hover:text-black border border-black transition">
          <User className="w-5 h-5" />
          <span>Нэвтрэх</span>
        </Button>
      </div>
    </header>
  );
}
