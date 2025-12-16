import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { Session } from "next-auth";
import { User } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        if (!email) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        return { id: user.id, email: user.email, name: user.email, role: user.role } as User;
      },
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],

  callbacks: {
    async signIn({ user }: { user: User }) {
      if (!user.email) return false;

      const incomingEmail = user.email.toLowerCase().trim();
      const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
      const isAdmin = incomingEmail === adminEmail;

      await prisma.user.upsert({
        where: { email: user.email },
        update: isAdmin ? { role: "admin" } : {},
        create: { email: user.email, role: isAdmin ? "admin" : "user" },
      });

      return isAdmin ? '/admin' : true;
    },

    async session({ session }: { session: Session }) {
      if (!session.user?.email) return session;

      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      session.user.role = dbUser?.role ?? "user";
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
