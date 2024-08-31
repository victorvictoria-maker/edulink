"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BookingSchema } from "../../../../../../schemas";
import { createBooking, fetchAvailability } from "@/serveractions/student";
import { WeekDay } from "@prisma/client";
import { AvailableSlot } from "../../../../../../types";
import { toast } from "react-toastify";

type BookingFormData = z.infer<typeof BookingSchema>;

const dayMap: Record<WeekDay, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

const BookAppointment = () => {
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(BookingSchema),
  });

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        const slots: AvailableSlot[] = await fetchAvailability();
        setAvailableSlots(slots);
      } catch (error) {
        console.error("Error fetching available slots:", error);
      }
    };

    fetchAvailableSlots();
  }, []);

  const onSubmit = async (formData: BookingFormData) => {
    setIsSubmitting(true);

    try {
      const result = await createBooking(formData);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success("Booking successful!");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("An unexpected error occurred while creating the booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='p-4 max-w-2xl mx-auto '>
      <h1 className='text-2xl font-bold mb-4'>Book an Appointment</h1>

      <div className='mt-6'>
        <h2 className='text-xl font-semibold mb-2'>Available Slots</h2>
        <ul>
          {availableSlots.length > 0 ? (
            availableSlots.map((slot) => (
              <li key={slot.id} className='border p-2 rounded mb-2'>
                <p>
                  {dayMap[slot.day]} - {slot.startTime} to {slot.endTime}
                </p>
              </li>
            ))
          ) : (
            <p>No available slots</p>
          )}
        </ul>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='bg-white p-4 rounded shadow-md'
      >
        <div className='mb-4'>
          <label htmlFor='date' className='block text-sm font-medium mb-1'>
            Date
          </label>
          <input
            type='date'
            id='date'
            {...register("date")}
            className='border border-gray-300 rounded px-3 py-2 w-full'
          />
          {errors.date && (
            <p className='text-red-500 text-xs mt-1'>{errors.date.message}</p>
          )}
        </div>

        <div className='mb-4'>
          <label htmlFor='startTime' className='block text-sm font-medium mb-1'>
            Start Time
          </label>
          <input
            type='time'
            id='startTime'
            {...register("startTime")}
            className='border border-gray-300 rounded px-3 py-2 w-full'
          />
          {errors.startTime && (
            <p className='text-red-500 text-xs mt-1'>
              {errors.startTime.message}
            </p>
          )}
        </div>

        <div className='mb-4'>
          <label htmlFor='endTime' className='block text-sm font-medium mb-1'>
            End Time
          </label>
          <input
            type='time'
            id='endTime'
            {...register("endTime")}
            className='border border-gray-300 rounded px-3 py-2 w-full'
          />
          {errors.endTime && (
            <p className='text-red-500 text-xs mt-1'>
              {errors.endTime.message}
            </p>
          )}
        </div>

        <button
          type='submit'
          className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-opacity ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Booking..." : "Book Appointment"}
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;
