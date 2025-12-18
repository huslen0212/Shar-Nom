import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import type { Session, User } from 'next-auth';

const globalForPrisma = global as unknown as {
  prisma?: PrismaClient;
};

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        if (!email) return null;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.email,
          role: user.role,
        } as User;
      },
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      const incomingEmail = user.email.toLowerCase().trim();
      const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
      const isAdmin = incomingEmail === adminEmail;

      await prisma.user.upsert({
        where: { email: user.email },
        update: isAdmin ? { role: 'admin' } : {},
        create: {
          email: user.email,
          role: isAdmin ? 'admin' : 'user',
        },
      });

      if (account?.provider === 'github') {
        await fetch('http://localhost:3001/internal/notify-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
          }),
        });
      }

      return isAdmin ? '/admin' : true;
    },

    async session({ session }: { session: Session }) {
      if (!session.user?.email) return session;

      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      session.user.role = dbUser?.role ?? 'user';
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
