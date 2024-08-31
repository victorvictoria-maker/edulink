import { AppointmentStatus, WeekDay } from "@prisma/client";

export interface AvailableSlot {
  id: string;
  day: WeekDay;
  startTime: string;
  endTime: string;
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  role: "HOD" | "STUDENT";
  matricNo?: string | null;
  department: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingResult =
  | { error: string }
  | {
      id: string;
      title: string;
      description: string | null;
      date: Date;
      status: AppointmentStatus;
      startTime: Date;
      endTime: Date;
      createdById: string;
      bookedById: string | null;
      timeSlotId: string;
      createdAt: Date;
      updatedAt: Date;
    };
