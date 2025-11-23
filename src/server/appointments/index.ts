import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import { requireRole } from "../../server/rbac";
import { appointmentCreateSchema } from "../../server/validators/appointment";
import { getDurationForType } from "../../server/appointments/utils";
import { isDoctorAvailable } from "../../server/appointments/checkAvailability";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  // ADMIN / DOCTOR / RECEPTIONIST peuvent créer
  const session = await requireRole(req, res, ["ADMIN", "DOCTOR", "RECEPTIONIST"]);
  if (!session) return;

  if (req.method === "POST") {
    const parse = appointmentCreateSchema.safeParse(req.body);
    if (!parse.success)
      return res.status(400).json({ error: parse.error.format() });

    const { date, type, doctorId, patientId, notes } = parse.data;

    const appointmentDate = new Date(date);
    const duration = getDurationForType(type);

    const available = await isDoctorAvailable(doctorId, appointmentDate, duration);
    if (!available)
      return res.status(409).json({ error: "Doctor not available at this time" });

    const appt = await prisma.appointment.create({
      data: {
        date: appointmentDate,
        duration,
        type,
        doctorId,
        patientId,
        notes
      }
    });

    return res.status(201).json(appt);
  }

  // Lister pour calendrier (tous les rôles sauf patient)
  if (req.method === "GET") {
    const session = await requireRole(req, res, ["ADMIN", "DOCTOR", "RECEPTIONIST"]);
    if (!session) return;

    const { doctorId, patientId, from, to } = req.query;

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctorId ? String(doctorId) : undefined,
        patientId: patientId ? String(patientId) : undefined,
        date: {
          gte: from ? new Date(String(from)) : undefined,
          lte: to ? new Date(String(to)) : undefined
        }
      },
      orderBy: { date: "asc" }
    });

    return res.status(200).json(appointments);
  }

  return res.status(405).end();
}
