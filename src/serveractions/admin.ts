"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import { AvailabilitySchema, ProfileUpdateSchema } from "../../schemas";
// import { AvailabilitySchema, ProfileUpdateSchema } from "@/schemas";

// serveractions/admin.ts
export const fetchAllAppointments = async () => {
  try {
    const appointments = await db.appointment.findMany({
      orderBy: {
        date: "asc", // Optional: Order by date, latest one first
      },
    });
    return appointments;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return { error: "Failed to fetch appointments" };
  }
};

export const createAvailability = async (
  data: z.infer<typeof AvailabilitySchema>
) => {
  // Validate the data against the schema
  const parsedData = AvailabilitySchema.parse(data);

  // Loop through each slot and create a TimeSlot entry in the database
  const slots = await Promise.all(
    parsedData.slots.map(async (slot) => {
      return db.timeSlot.create({
        data: {
          day: slot.day,
          startTime: new Date(`1970-01-01T${slot.startTime}:00Z`), // Use a fixed date
          endTime: new Date(`1970-01-01T${slot.endTime}:00Z`), // Use a fixed date
          hodId: "17dd6169-568f-45f6-9eb4-ba2deeeb020a",
        },
      });
    })
  );
  // console.log(parsedData);

  return slots;
};

// Approve or Cancel Appointment
export const updateAppointmentStatus = async (
  appointmentId: string,
  status: "APPROVED" | "CANCELED"
) => {
  try {
    const appointment = await db.appointment.update({
      where: { id: appointmentId },
      data: { status },
    });
    return appointment;
  } catch (error) {
    console.error("Error updating appointment status:", error);
    return { error: "Failed to update appointment status" };
  }
};

// export const updateProfile = async (
//   hodId: string,
//   data: z.infer<typeof ProfileUpdateSchema>
// ) => {
//   try {
//     const profile = await db.hod.update({
//       where: { id: hodId },
//       data: {
//         name: data.name,
//         email: data.email,
//         department: data.department,
//         matricno: data.matricno,
//       },
//     });
//     return { success: "Profile updated successfully", profile };
//   } catch (error) {
//     console.error("Error updating profile:", error);
//     return { error: "Failed to update profile" };
//   }
// };
