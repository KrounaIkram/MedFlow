import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../../../lib/prisma";
import { compare } from "bcryptjs";

// ✅ Assurer que NEXTAUTH_SECRET existe
const secret = process.env.NEXTAUTH_SECRET;
if (!secret) {
  throw new Error("Environment variable NEXTAUTH_SECRET is not set!");
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  secret, // ✅ string garanti
  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as
          | "ADMIN"
          | "DOCTOR"
          | "RECEPTIONIST"
          | "PATIENT";
      }
      return session;
    },
  },

  pages: {
    signIn: "/login", // optionnel : page de login custom
  },
};

export default NextAuth(authOptions);
