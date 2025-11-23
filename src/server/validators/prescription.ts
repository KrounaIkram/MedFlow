import { z } from "zod";

export const medicationSchema = z.object({
  name: z.string().min(1),
  dosage: z.string().optional(),
  frequency: z.string().optional(),
  duration: z.string().optional(),
  notes: z.string().optional()
});

export const prescriptionCreateSchema = z.object({
  consultationId: z.string().min(1),
  doctorId: z.string().min(1),
  patientId: z.string().min(1),
  medications: z.array(medicationSchema).min(1),
  notes: z.string().optional()
});

export const prescriptionUpdateSchema = z.object({
  medications: z.array(medicationSchema).min(1).optional(),
  notes: z.string().optional()
});
