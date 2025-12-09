import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      const isAdmin = user.email === process.env.ADMIN_EMAIL;

      // Үндсэн user бүртгэл + админ role тохируулах
      await prisma.user.upsert({
        where: { email: user.email },
        update: {
          role: isAdmin ? "admin" : "user",
        },
        create: {
          email: user.email,
          role: isAdmin ? "admin" : "user",
        },
      });

      return true;
    },

    async session({ session }) {
      if (!session.user?.email) return session;

      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      session.user.role = dbUser?.role ?? "user";

      return session;
    },
  },
});

export { handler as GET, handler as POST };
