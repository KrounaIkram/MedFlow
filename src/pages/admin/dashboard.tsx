// pages/api/admin/clinic.ts
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AdminDashboard() {
  const {  session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") {
      router.push("/login");
    }
  }, [session, status, router]);

  if (!session || session.user.role !== "ADMIN") return null;

  if (req.method === "GET") {
    const clinic = await prisma.clinic.findFirst({
      where: { ownerId: session.user.id },
    });
    return res.status(200).json(clinic);
  }

  if (req.method === "PUT") {
    const { name, address, phone, email, logo } = req.body;

    const clinic = await prisma.clinic.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!clinic) {
      return res.status(404).json({ error: "Clinique non trouvée" });
    }

    const updated = await prisma.clinic.update({
      where: { id: clinic.id },
      data: { name, address, phone, email, logo },
    });

    return res.status(200).json(updated);
  }

  res.setHeader("Allow", ["GET", "PUT"]);
  return res.status(405).json({ error: "Méthode non autorisée" });
}
