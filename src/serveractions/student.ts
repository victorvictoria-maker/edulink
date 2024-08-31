"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import { BookingSchema, ProfileUpdateSchema } from "../../schemas";
import { Prisma, WeekDay } from "@prisma/client";
import { AvailableSlot, BookingResult, User } from "../../types";
import { createClient } from "@/utils/supabase/server";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

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
      startTime: slot.startTime.toISOString().slice(11, 16),
      endTime: slot.endTime.toISOString().slice(11, 16),
    }));
  } catch (error) {
    console.error("Error fetching availability:", error);
    return [];
  }
}

export async function createBooking(
  data: z.infer<typeof BookingSchema>
): Promise<BookingResult> {
  const { date, startTime, endTime } = data;

  const supabase = createClient();
  const { data: userData, error } = await supabase.auth.getUser();

  if (error || !userData?.user) {
    // throw new Error("User is not authenticated");
    return { error: "User is not authenticated" };
  }

  console.log("User data", userData?.user);
  const studentId = userData.user.id;
  const studentEmail = userData.user.email;
  console.log(studentId);

  const userExists = await db.user.findUnique({
    where: { id: studentId },
  });

  if (!userExists) {
    return { error: "User not found in the database" };
    // throw new Error("User not found in the database");
  }

  const bookingDate = new Date(date);
  console.log("Chosen date", date);
  console.log("Chosen startTime", startTime);
  console.log("Chosen endtime", endTime);
  console.log("Booking Date", bookingDate);

  const dayMap = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  const bookingDay = dayMap[bookingDate.getDay()] as WeekDay;

  console.log("Booking Day:", bookingDay);

  const existingTimeSlots = await db.timeSlot.findMany({
    where: {
      hodId: "17dd6169-568f-45f6-9eb4-ba2deeeb020a",
      day: bookingDay,
    },
  });

  if (existingTimeSlots.length === 0) {
    return { error: "No available time slots for the selected day." };

    // throw new Error("No available time slots for the selected day.");
  }

  // Extraction of time portion from the existing time slots
  const [existingStartHours, existingStartMinutes] =
    existingTimeSlots[0].startTime
      .toISOString()
      .substr(11, 5)
      .split(":")
      .map(Number);
  const [existingEndHours, existingEndMinutes] = existingTimeSlots[0].endTime
    .toISOString()
    .substr(11, 5)
    .split(":")
    .map(Number);

  console.log(
    "Existing start time for the Day:",
    `${existingStartHours}:${existingStartMinutes}`
  );
  console.log(
    "Existing end time for the Day:",
    `${existingEndHours}:${existingEndMinutes}`
  );

  // Parse chosen start and end times
  const [chosenStartHours, chosenStartMinutes] = startTime
    .split(":")
    .map(Number);
  const [chosenEndHours, chosenEndMinutes] = endTime.split(":").map(Number);

  // Check if the chosen times fall within the available time slots
  const isStartTimeValid =
    chosenStartHours > existingStartHours ||
    (chosenStartHours === existingStartHours &&
      chosenStartMinutes >= existingStartMinutes);

  const isEndTimeValid =
    chosenEndHours < existingEndHours ||
    (chosenEndHours === existingEndHours &&
      chosenEndMinutes <= existingEndMinutes);

  if (isStartTimeValid && isEndTimeValid) {
    console.log(
      "The chosen time slot is valid and falls within the available time slot for the day."
    );

    // Convert chosen times to local Date objects
    const bookingDate = new Date(date);

    // Set chosen start time in local time (WAT)
    const bookingStartTimeLocal = new Date(bookingDate);
    bookingStartTimeLocal.setHours(chosenStartHours, chosenStartMinutes);
    console.log("Chosen Start Time (Local WAT):", bookingStartTimeLocal);

    // Convert local start time (WAT) to UTC
    const bookingStartTimeUTC = new Date(bookingStartTimeLocal.getTime());
    console.log("Converted Start Time (UTC):", bookingStartTimeUTC);

    // Set chosen end time in local time (WAT)
    const bookingEndTimeLocal = new Date(bookingDate);
    bookingEndTimeLocal.setHours(chosenEndHours, chosenEndMinutes);
    console.log("Chosen End Time (Local WAT):", bookingEndTimeLocal);

    // Convert local end time (WAT) to UTC
    const bookingEndTimeUTC = new Date(bookingEndTimeLocal.getTime());
    console.log("Converted End Time (UTC):", bookingEndTimeUTC);

    // Checking if it has not been chosen by someone else
    const conflictingBooking = await db.appointment.findFirst({
      where: {
        timeSlotId: existingTimeSlots[0].id,
        date: bookingDate,
        startTime: {
          lte: new Date(bookingStartTimeUTC),
        },
        endTime: {
          gte: new Date(bookingEndTimeUTC),
        },
        status: {
          in: ["PENDING", "APPROVED"],
        },
      },
    });

    if (conflictingBooking) {
      return { error: "The chosen time slot has already been booked." };
      // throw new Error("The chosen time slot has already been booked.");
    }

    // Prepare appointment data
    const appointmentData: Prisma.AppointmentCreateInput = {
      title: `Appointment with HoD on ${date}`,
      description: `Appointment booked by student ID ${studentId}`,
      date: bookingDate, // This is assumed to be local (WAT)
      status: "PENDING",
      startTime: bookingStartTimeUTC,
      endTime: bookingEndTimeUTC,
      createdBy: { connect: { id: studentId } },
      timeSlot: { connect: { id: existingTimeSlots[0].id } },
    };

    console.log("Creating Appointment with Data:", appointmentData);

    // Creation of the appointment
    const appointment = await db.appointment.create({
      data: appointmentData,
    });

    await resend.emails.send({
      from: "Edulink - appointment booking <onboarding@resend.dev>",
      to: "victorvictoria0001@gmail.com",
      subject: `New Booking for ${bookingDate.toLocaleDateString()} ${startTime}-${endTime}`,
      text: `A new appointment has been booked by student with email ${studentEmail} for ${startTime} to ${endTime}. Please log in to your dashboard for more details.`,
    });

    console.log("Appointment Created:", appointment);

    return appointment;
  } else {
    return {
      error: "The chosen time slot is not available for the selected day.",
    };

    // throw new Error(

    //   "The chosen time slot is not available for the selected day."
    // );
  }
}

export async function getAllAppointments() {
  const supabase = createClient();
  const { data: userData, error } = await supabase.auth.getUser();

  if (error || !userData?.user) {
    throw new Error("User is not authenticated");
  }

  const studentId = userData.user.id;

  const appointments = await db.appointment.findMany({
    where: {
      OR: [{ createdById: studentId }, { bookedById: studentId }],
    },
    include: {
      timeSlot: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  return appointments;
}

export async function fetchUserDetailsByEmail(
  email: string
): Promise<User | null> {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      console.error("User not found");
      return null;
    }

    // Map the result to the User type
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      department: user.department,
      matricNo: user.matricNo,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw new Error("Unable to fetch user details");
  }
}

export async function updateUserProfile(
  data: z.infer<typeof ProfileUpdateSchema>
) {
  const { name, email, department, matricNo } = data;

  try {
    const updatedUser = await db.user.update({
      where: { email },
      data: {
        name,
        email,
        department,
        matricNo,
      },
    });

    return { success: "Profile updated successfully!", user: updatedUser };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "An error occurred while updating the profile." };
  }
}
