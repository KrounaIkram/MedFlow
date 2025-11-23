import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // create admin user with hashed password (password: adminpass)
  const passwordHash = await hash("adminpass", 10);

  await prisma.user.upsert({
    where: { email: "admin@medflow.test" },
    update: {},
    create: {
      email: "admin@medflow.test",
      name: "Admin MedFlow",
      role: "ADMIN",
      password: passwordHash
    }
  });

  await prisma.patient.createMany({
    data: [
      { firstName: "Sami", lastName: "Ben Ali", email: "sami@test.local", phone: "21600000000" },
      { firstName: "Meriem", lastName: "Kaar", email: "meriem@test.local" }
    ],
    skipDuplicates: true
  });

  console.log("Seed finished");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
