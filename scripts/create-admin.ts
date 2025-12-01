// scripts/create-admin.ts
import { hash } from "bcrypt";
import { prisma } from "../src/lib/prisma";

async function createAdmin() {
  const email = "admin@clinique.tn";
  const password = await hash("admin123", 12);

  await prisma.user.create({
    data: {
      email,
      password,
      role: "ADMIN",
      name: "Admin Principal",
    },
  });

  console.log("✅ Admin créé !");
}

createAdmin().catch(console.error);
