import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: "ADMIN" | "DOCTOR" | "RECEPTIONIST" | "PATIENT";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "ADMIN" | "DOCTOR" | "RECEPTIONIST" | "PATIENT";
    id?: string;
  }
}