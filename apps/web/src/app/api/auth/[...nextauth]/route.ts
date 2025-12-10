import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";
import { Session } from "next-auth";
import { User } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],

  callbacks: {
    async signIn({ user }: { user: User }) {
      if (!user.email) return false;

      const isAdmin = user.email === process.env.ADMIN_EMAIL;

      await prisma.user.upsert({
        where: { email: user.email },
        update: { role: isAdmin ? "admin" : "user" },
        create: { email: user.email, role: isAdmin ? "admin" : "user" },
      });

      return true;
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
