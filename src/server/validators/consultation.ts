import { z } from "zod";

export const consultationCreateSchema = z.object({
  doctorName: z.string().min(1, "Doctor name is required"),
  patientName: z.string().min(1, "Patient name is required"),
  datetime: z.string().min(1), // ISO date string
  duration: z.number().int().positive().optional(),
  diagnosis: z.string().optional(),
  notes: z.string().optional()
});

export const consultationUpdateSchema = z.object({
  datetime: z.string().optional(),
  duration: z.number().int().positive().optional(),
  diagnosis: z.string().optional(),
  notes: z.string().optional()
});
