"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import { BookingSchema, ProfileUpdateSchema } from "../../schemas";
import { Prisma, WeekDay } from "@prisma/client";
import { AvailableSlot, User } from "../../types";
import { createClient } from "@/utils/supabase/server";

export async function fetchAvailability(): Promise<AvailableSlot[]> {
  try {
    const slots = await db.timeSlot.findMany({
      where: {
        hodId: "17dd6169-568f-45f6-9eb4-ba2deeeb020a", // Ensure this is the correct HoD ID
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
    console.error("Error fetching availability:", error);
    throw new Error("Unable to fetch availability");
  }
}

export async function createBooking(data: z.infer<typeof BookingSchema>) {
  const { date, startTime, endTime } = data;

  const supabase = createClient();
  const { data: userData, error } = await supabase.auth.getUser();

  if (error || !userData?.user) {
    throw new Error("User is not authenticated");
  }

  console.log("User data", userData?.user);
  const studentId = userData.user.id;
  console.log(studentId);

  const userExists = await db.user.findUnique({
    where: { id: studentId },
  });

  if (!userExists) {
    throw new Error("User not found in the database");
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

  // Fetch all time slots for the hodId and day to see what's in the database
  const existingTimeSlots = await db.timeSlot.findMany({
    where: {
      hodId: "17dd6169-568f-45f6-9eb4-ba2deeeb020a",
      day: bookingDay,
    },
  });

  if (existingTimeSlots.length === 0) {
    throw new Error("No available time slots for the selected day.");
  }

  // Extract the time portion from the existing time slots
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
    const bookingDate = new Date(date); // Assuming 'date' is in local time (WAT)

    // Set chosen start time in local time (WAT)
    const bookingStartTimeLocal = new Date(bookingDate);
    bookingStartTimeLocal.setHours(chosenStartHours, chosenStartMinutes);
    console.log("Chosen Start Time (Local WAT):", bookingStartTimeLocal);

    // Convert local start time (WAT) to UTC
    const bookingStartTimeUTC = new Date(bookingStartTimeLocal.getTime()); // Subtract 1 hour  - + 1 * 60 * 60 * 1000
    console.log("Converted Start Time (UTC):", bookingStartTimeUTC);

    // Set chosen end time in local time (WAT)
    const bookingEndTimeLocal = new Date(bookingDate);
    bookingEndTimeLocal.setHours(chosenEndHours, chosenEndMinutes);
    console.log("Chosen End Time (Local WAT):", bookingEndTimeLocal);

    // Convert local end time (WAT) to UTC
    const bookingEndTimeUTC = new Date(bookingEndTimeLocal.getTime()); // Subtract 1 hour - + 1 * 60 * 60 * 1000
    console.log("Converted End Time (UTC):", bookingEndTimeUTC);

    // Prepare appointment data
    const appointmentData: Prisma.AppointmentCreateInput = {
      title: `Appointment with HoD on ${date}`,
      description: `Appointment booked by student ID ${studentId}`,
      date: bookingDate, // This is assumed to be local (WAT)
      status: "PENDING", // or "CONFIRMED" based on your logic
      startTime: bookingStartTimeUTC,
      endTime: bookingEndTimeUTC,
      createdBy: { connect: { id: studentId } },
      timeSlot: { connect: { id: existingTimeSlots[0].id } }, // Connecting the relevant time slot
    };

    console.log("Creating Appointment with Data:", appointmentData);

    // Create the appointment
    const appointment = await db.appointment.create({
      data: appointmentData,
    });

    console.log("Appointment Created:", appointment);

    return appointment;
  } else {
    throw new Error(
      "The chosen time slot is not available for the selected day."
    );
  }
}

export async function getAllAppointments() {
  // Assuming `createClient` correctly returns a Supabase client
  const supabase = createClient();
  const { data: userData, error } = await supabase.auth.getUser();

  if (error || !userData?.user) {
    throw new Error("User is not authenticated");
  }

  const studentId = userData.user.id;

  // Fetch appointments where the student is either the creator or the booker
  const appointments = await db.appointment.findMany({
    where: {
      OR: [{ createdById: studentId }, { bookedById: studentId }],
    },
    include: {
      timeSlot: true, // Include timeSlot details if needed
    },
    orderBy: {
      date: "desc", // Optional: Order by date, most recent first
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
    // Assuming you have a user id in the session or passed as a parameter
    const updatedUser = await db.user.update({
      where: { email }, // Assuming email is unique
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
