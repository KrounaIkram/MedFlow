// pages/api/appointments/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { requireRole } from "../../../server/rbac";
import { z } from "zod";
import { isDoctorAvailable } from "../../../server/appointments/checkAvailability";

// Durée par type de RDV
export function getDurationForType(type: string) {
  switch (type) {
    case "CONSULTATION": return 30;
    case "URGENCY": return 15;
    case "FOLLOW_UP": return 20;
    case "CONTROL": return 10;
    default: return 30;
  }
}

// Schema création RDV
const createSchema = z.object({
  date: z.string().datetime(),
  type: z.enum(["CONSULTATION", "URGENCY", "FOLLOW_UP", "CONTROL"]),
  doctorName: z.string(),
  patientName: z.string(),
  notes: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await requireRole(req, res, ["ADMIN", "DOCTOR", "RECEPTIONIST", "PATIENT"]);
  if (!session) return;

  // POST - Créer un RDV
  if (req.method === "POST") {
    const parse = createSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: parse.error.format() });

    const { date: dateStr, type, doctorName, patientName, notes } = parse.data;
    const date = new Date(dateStr);
    const duration = getDurationForType(type);

    // Vérif disponibilité docteur
    const available = await isDoctorAvailable(doctorName, date, duration);
    if (!available) return res.status(409).json({ error: "Docteur non disponible à cette heure" });

    // Optionnel : patient ne peut créer que pour lui-même
    if (session.user.role === "PATIENT" && session.user.id !== patientName) {
      return res.status(403).json({ error: "Vous ne pouvez créer que vos propres RDV" });
    }

    // Recherche docteur par nom
    const doctor = await prisma.user.findFirst({
      where: { role: "DOCTOR", name: { contains: doctorName, mode: "insensitive" } },
    });
    if (!doctor) return res.status(400).json({ error: `Docteur "${doctorName}" non trouvé` });

    // Recherche patient par nom complet
    const [firstName, ...lastNameParts] = patientName.trim().split(" ");
    const lastName = lastNameParts.join(" ");

    const patient = await prisma.patient.findFirst({
      where: {
        firstName: { contains: firstName, mode: "insensitive" },
        ...(lastName ? { lastName: { contains: lastName, mode: "insensitive" } } : {}),
      },
    });
    if (!patient) return res.status(400).json({ error: `Patient "${patientName}" non trouvé` });

    // Création du RDV avec les IDs corrects
    const appointment = await prisma.appointment.create({
      data: {
        date,
        duration,
        type,
        status: "SCHEDULED",
        doctorId: doctor.id,
        patientId: patient.id,
        notes,
      },
      include: { doctor: true, patient: true },
    });

    return res.status(201).json({
      message: "Rendez-vous créé avec succès !",
      appointment,
    });
  }

  // GET - Liste tous les RDV
  if (req.method === "GET") {
    if (session.user.role === "PATIENT") {
      const appts = await prisma.appointment.findMany({
        where: { patientId: session.user.id },
        include: { doctor: true },
        orderBy: { date: "asc" },
      });
      return res.status(200).json(appts);
    }

    const appts = await prisma.appointment.findMany({
      include: { doctor: true, patient: true },
      orderBy: { date: "asc" },
    });
    return res.status(200).json(appts);
  }

  return res.status(405).end();
}
