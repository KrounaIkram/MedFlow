// server/rbac.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt"; // si tu utilises next-auth
// sinon je te donne version JWT manuelle plus bas

export interface AuthSession {
  user: {
    id: string;
    role: "ADMIN" | "DOCTOR" | "RECEPTIONIST" | "PATIENT";
  };
}

export async function requireRole(
  req: NextApiRequest,
  res: NextApiResponse,
  allowedRoles: string[]
): Promise<AuthSession | null> {
  const token = await getToken({ req });

  if (!token) {
    res.status(401).json({ error: "Not authenticated" });
    return null;
  }

  // token.sub = ID utilisateur
  const session: AuthSession = {
    user: {
      id: token.sub as string,
      role: token.role as any
    }
  };

  if (!allowedRoles.includes(session.user.role)) {
    res.status(403).json({ error: "Forbidden" });
    return null;
  }

  return session;
}
