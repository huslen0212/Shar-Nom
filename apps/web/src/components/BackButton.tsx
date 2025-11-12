'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

interface BackButtonProps {
  label?: string;
  className?: string;
}

export default function BackButton({ label = 'Буцах' }: BackButtonProps) {
  const router = useRouter();

  return <Button onClick={() => router.back()}>{label}</Button>;
}
