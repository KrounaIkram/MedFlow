// server/validators/appointment.ts
import { z } from "zod";

// Mapping type → durée (en minutes) – ne touche pas à ça, c’est la source unique de vérité
const DurationByType = {
  CONSULTATION: 30,
  FOLLOW_UP: 20,
  CONTROL: 45,
  URGENCY: 60,
} as const;

export const appointmentCreateSchema = z
  .object({
    date: z.string().min(1, "Date required"), // ISO string
    type: z.enum(["CONSULTATION", "URGENCY", "FOLLOW_UP", "CONTROL"]),
    doctorId: z.string().min(1),
    patientId: z.string().min(1),
    notes: z.string().optional(),
  })
  // ← On ajoute duration automatiquement, sans que le front ait à l’envoyer
  .transform((data) => ({
    ...data,
    date: new Date(data.date),               // on convertit direct en Date
    duration: DurationByType[data.type],      // ← duration ajoutée magiquement
  }));

export const appointmentUpdateSchema = z.object({
  date: z.string().optional(),
  type: z.enum(["CONSULTATION", "URGENCY", "FOLLOW_UP", "CONTROL"]).optional(),
  status: z.enum(["SCHEDULED", "CANCELLED", "DONE"]).optional(),
  notes: z.string().optional(),
});