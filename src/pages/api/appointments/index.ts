// pages/api/appointments/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { requireRole } from "../../../server/rbac";
import { z } from "zod";
import { isDoctorAvailable } from "../../../server/appointments/checkAvailability";

// Durée par type
const DurationByType = {
  CONSULTATION: 30,
  URGENCY: 60,
  FOLLOW_UP: 20,
  CONTROL: 45,
} as const;

// Schema pour création RDV
const createSchema = z.object({
  date: z.string().datetime({ message: "Date invalide (format ISO requis)" }),
  type: z.enum(["CONSULTATION", "URGENCY", "FOLLOW_UP", "CONTROL"]),
  doctorName: z.string().min(3, "Nom du docteur requis"),
  patientName: z.string().min(3, "Nom du patient requis").optional(), // facultatif pour PATIENT
  notes: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await requireRole(req, res, ["ADMIN", "DOCTOR", "RECEPTIONIST", "PATIENT"]);
  if (!session) return;

  // Récupère le User complet depuis la DB
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) return res.status(400).json({ error: "Utilisateur introuvable" });

  // POST - Créer un RDV
  if (req.method === "POST") {
    const parse = createSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: parse.error.format() });

    const { date: dateString, type, doctorName, patientName, notes } = parse.data;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return res.status(400).json({ error: "Date invalide" });

    // --- Recherche docteur ---
    const doctor = await prisma.user.findFirst({
      where: { role: "DOCTOR", name: { contains: doctorName, mode: "insensitive" } },
    });
    if (!doctor) return res.status(400).json({ error: `Docteur "${doctorName}" non trouvé` });

    // --- Recherche / création patient ---
    let patient;

    if (user.role === "PATIENT") {
      // Cherche le Patient lié à cet utilisateur
      patient = await prisma.patient.findFirst({
        where: { ownerId: user.id },
      });

      // Si pas de patient, crée-le automatiquement
      if (!patient) {
        const [firstNamePart, ...lastNameParts] = (user.name || "Inconnu").split(" ");
const firstName = firstNamePart;
const lastName = lastNameParts.join(" ");

        patient = await prisma.patient.create({
          data: {
            firstName,
            lastName: lastName || "",
            email: user.email,
            owner: { connect: { id: user.id } },
          },
        });
      }
    } else {
      // Recherche patient par nom complet pour ADMIN/DOCTOR/RECEPTIONIST
      if (!patientName) return res.status(400).json({ error: "Nom du patient requis" });

      const [firstName, ...lastNameParts] = patientName.trim().split(" ");
      const lastName = lastNameParts.join(" ");

      patient = await prisma.patient.findFirst({
        where: {
          firstName: { contains: firstName, mode: "insensitive" },
          ...(lastName ? { lastName: { contains: lastName, mode: "insensitive" } } : {}),
        },
      });

      if (!patient) return res.status(400).json({ error: `Patient "${patientName}" non trouvé` });
    }

    const duration = DurationByType[type];

    // --- Vérif disponibilité docteur ---
    const available = await isDoctorAvailable(doctor.id, date, duration);
    if (!available) return res.status(409).json({ error: "Docteur non disponible à cette heure" });

    // --- Vérif patient ---
    if (user.role === "PATIENT" && user.id !== patient.ownerId) {
      return res.status(403).json({ error: "Vous ne pouvez créer que vos propres RDV" });
    }

    // --- Création RDV ---
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
      include: {
        doctor: { select: { name: true } },
        patient: { select: { firstName: true, lastName: true } },
      },
    });

    return res.status(201).json({
      message: "Rendez-vous créé avec succès !",
      appointment,
    });
  }

  // GET - Liste tous les RDV ou ceux du patient
  if (req.method === "GET") {
    if (user.role === "PATIENT") {
      const patient = await prisma.patient.findFirst({ where: { ownerId: user.id } });
      if (!patient) return res.status(200).json([]);

      const appts = await prisma.appointment.findMany({
        where: { patientId: patient.id },
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
