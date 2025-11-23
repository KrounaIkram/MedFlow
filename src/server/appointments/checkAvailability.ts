// server/appointments/checkAvailability.ts
import { prisma } from "../../lib/prisma";

export async function isDoctorAvailable(
  doctorId: string,
  startDate: Date,
  durationInMinutes: number
): Promise<boolean> {
  const start = startDate;
  const end = new Date(startDate.getTime() + durationInMinutes * 60 * 1000);

  const appointments = await prisma.appointment.findMany({
    where: {
      doctorId,
      status: "SCHEDULED",
    },
  });

  for (const appt of appointments) {
    const apptStart = appt.date;
    const apptEnd = new Date(apptStart.getTime() + appt.duration * 60 * 1000);

    // Chevauchement si : nouveau commence pendant existant OU existant commence pendant nouveau
    if (start < apptEnd && end > apptStart) {
      return false;
    }
  }

  return true;
}