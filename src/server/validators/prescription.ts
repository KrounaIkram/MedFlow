// server/validators/prescription.ts
import { z } from "zod";

export const medicationSchema = z.object({
  name: z.string().min(1, "Nom du médicament requis"),
  dosage: z.string().optional(),
  frequency: z.string().optional(),
  duration: z.string().optional(),
  notes: z.string().optional(),
});

export const prescriptionCreateSchema = z.object({
  consultationId: z.string().min(1, "Consultation requise"), // ← obligatoire
  patientId: z.string().min(1, "Patient requis"),
  medications: z.array(medicationSchema).min(1, "Au moins un médicament requis"),
  notes: z.string().optional(),
});

export const prescriptionUpdateSchema = z.object({
  medications: z.array(medicationSchema).min(1).optional(),
  notes: z.string().optional(),
});