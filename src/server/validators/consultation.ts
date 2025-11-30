// server/validators/consultation.ts
import { z } from "zod";

export const consultationCreateSchema = z.object({

  patientId: z.string().min(1, "Patient ID is required"),
  datetime: z.coerce.date(),
  duration: z.number().int().positive().optional(),
  diagnosis: z.string().min(1, "Diagnosis is required").optional(), // Optionnel mais si présent, non vide
  notes: z.string().optional(),
});

export const consultationUpdateSchema = z.object({
  datetime: z.string().datetime().optional(),
  duration: z.number().int().positive().optional(),
  diagnosis: z.string().optional(),
  notes: z.string().optional(),
});