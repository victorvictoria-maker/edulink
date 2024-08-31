"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import { AvailabilitySchema, ProfileUpdateSchema } from "../../schemas";
import { AvailableSlot } from "../../types";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

// serveractions/admin.ts
export const fetchAllAppointments = async () => {
  try {
    const appointments = await db.appointment.findMany({
      orderBy: {
        date: "asc",
      },
    });
    return appointments;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return { error: "Failed to fetch appointments" };
  }
};

export async function fetchAvailability(): Promise<AvailableSlot[]> {
  try {
    const slots = await db.timeSlot.findMany({
      where: {
        hodId: "17dd6169-568f-45f6-9eb4-ba2deeeb020a",
      },
      orderBy: [{ day: "asc" }, { startTime: "asc" }],
    });

    return slots.map((slot) => ({
      id: slot.id,
      day: slot.day,
      startTime: slot.startTime.toISOString().slice(11, 16), // Extract HH:MM from ISO string
      endTime: slot.endTime.toISOString().slice(11, 16), // Extract HH:MM from ISO string
    }));
  } catch (error) {
    console.error("Error fetching availability", error);
    return [];
  }
}

export async function deleteAvailabilityById(availabilityId: string) {
  try {
    await db.timeSlot.delete({
      where: { id: availabilityId },
    });
    return { success: "Record deleted successffuly!" };
  } catch (error) {
    console.error("Error deleting timeslot:", error);
    return { error: "Error deleting record!" };
  }
}

export const createAvailability = async (
  data: z.infer<typeof AvailabilitySchema>
) => {
  // Validate the data against the schema
  const parsedData = AvailabilitySchema.parse(data);

  const slots = await Promise.all(
    parsedData.slots.map(async (slot) => {
      return db.timeSlot.create({
        data: {
          day: slot.day,
          startTime: new Date(`1970-01-01T${slot.startTime}:00Z`),
          endTime: new Date(`1970-01-01T${slot.endTime}:00Z`),
          hodId: "17dd6169-568f-45f6-9eb4-ba2deeeb020a",
        },
      });
    })
  );

  return slots;
};

export const updateAppointmentStatus = async (
  appointmentId: string,
  status: "APPROVED" | "CANCELED"
) => {
  try {
    const appointment = await db.appointment.findUnique({
      where: { id: appointmentId },
      select: { createdById: true, date: true, startTime: true, endTime: true },
    });

    if (!appointment) {
      // throw new Error("Appointment not found");
      return { error: "Appointment not found" };
    }

    const user = await db.user.findUnique({
      where: { id: appointment.createdById },
    });

    if (!user) {
      // throw new Error("User not found");
      return { error: "User not found" };
    }

    const updatedAppointment = await db.appointment.update({
      where: { id: appointmentId },
      data: { status },
    });

    let emailSubject, emailText;

    if (status === "APPROVED") {
      emailSubject = "Your Appointment has been Approved";
      emailText = `Dear ${
        user.name
      }, your appointment scheduled on ${appointment.date.toLocaleDateString()} from ${appointment.startTime.toLocaleTimeString()} to ${appointment.endTime.toLocaleTimeString()} has been approved.`;
    } else {
      emailSubject = "Your Appointment has been Canceled";
      emailText = `Dear ${
        user.name
      }, your appointment scheduled on ${appointment.date.toLocaleDateString()} from ${appointment.startTime.toLocaleTimeString()} to ${appointment.endTime.toLocaleTimeString()} has been canceled.`;
    }

    await resend.emails.send({
      from: "Edulink - appointment booking <onboarding@resend.dev>",
      to: user.email,
      // to: "victorvictoria0001@gmail.com",
      subject: emailSubject,
      text: emailText,
    });

    return updatedAppointment;
  } catch (error) {
    console.error("Error updating appointment status:", error);
    return { error: "Failed to update appointment status" };
  }
};
