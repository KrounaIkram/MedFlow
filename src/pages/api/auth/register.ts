import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { hash } from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 chars"),
  role: z.enum(["ADMIN", "DOCTOR", "RECEPTIONIST", "PATIENT"]).optional()
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  // ------------------------
  // 🎯 FIX CORS ICI
  // ------------------------
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Répond au préflight OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  // ------------------------

  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const parse = schema.safeParse(req.body);
  if (!parse.success)
    return res.status(400).json({ error: parse.error.format() });

  const { name, email, password, role } = parse.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: "Email already exists" });

  const hashed = await hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: role as "ADMIN" | "DOCTOR" | "RECEPTIONIST" | "PATIENT"
    }
  });

  let patient = null;
  if ((role ?? "PATIENT") === "PATIENT") {
    patient = await prisma.patient.create({
      data: {
        firstName: name.split(" ")[0] || name,
        lastName: name.split(" ")[1] || "",
        email,
        owner: { connect: { id: user.id } }
      }
    });
  }

  return res.status(201).json({ message: "User created", user, patient });
}
