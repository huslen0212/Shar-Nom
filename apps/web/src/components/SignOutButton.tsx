'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    // Sign out without automatic redirect, then navigate client-side to avoid URL issues
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <Button variant="default" onClick={handleSignOut}>
      Гарах
    </Button>
  );
}
