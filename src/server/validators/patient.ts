// server/validators/patient.ts
import { z } from "zod";

export const patientCreateSchema = z.object({
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide").optional(),
  phone: z.string().optional(),
  dob: z.string().optional(), // ou z.date() si tu veux une vraie date
  notes: z.string().optional(),
});

export const patientUpdateSchema = patientCreateSchema.partial().extend({
  id: z.string(), // obligatoire pour l'update
});