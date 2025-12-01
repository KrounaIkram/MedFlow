import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    role: "ADMIN" | "DOCTOR" | "RECEPTIONIST" | "PATIENT";
  }

  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "DOCTOR" | "RECEPTIONIST" | "PATIENT";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "ADMIN" | "DOCTOR" | "RECEPTIONIST" | "PATIENT";
  }
}