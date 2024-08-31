"use client";

import { getAllAppointments } from "@/serveractions/student";
import React, { useEffect, useState } from "react";

const ViewAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const data = await getAllAppointments();
        setAppointments(data);
      } catch (err: any) {
        setError("Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='container mx-auto p-4 '>
      <h1 className='text-2xl font-bold mb-4'>Your Appointments</h1>
      {appointments.length === 0 ? (
        <p className='text-center text-gray-600'>You have no appointments.</p>
      ) : (
        <ul className='space-y-4'>
          {appointments.map((appointment) => {
            // Conversion of startTime and endTime to local time from UTC
            const startTime = new Date(appointment.startTime);
            const endTime = new Date(appointment.endTime);

            // Local time for displaying the appointment times
            const localStartTime = startTime.toLocaleTimeString("en-NG", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
              timeZone: "Africa/Lagos",
            });

            const localEndTime = endTime.toLocaleTimeString("en-NG", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
              timeZone: "Africa/Lagos",
            });

            console.log("Time Slot (WAT):", localStartTime, "-", localEndTime);

            return (
              <li
                key={appointment.id}
                className={`p-4 rounded-lg shadow-lg ${
                  appointment.status === "PENDING"
                    ? "bg-yellow-100 border-yellow-500"
                    : "bg-green-100 border-green-500"
                } ${
                  appointment.status === "CANCELED"
                    ? "bg-red-100 border-red-500"
                    : "bg-green-100 border-green-500"
                } border-2`}
              >
                <div className='flex flex-col space-y-2'>
                  <p className='text-lg font-semibold'>
                    <strong>Title:</strong> {appointment.title}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(appointment.date).toLocaleDateString("en-NG", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={` ${
                        appointment.status === "PENDING"
                          ? "text-yellow-600 font-semibold"
                          : "text-green-600 font-semibold"
                      } ${
                        appointment.status === "CANCELED"
                          ? "text-red-600 font-semibold"
                          : "text-green-600 font-semibold"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </p>
                  <p>
                    <strong>Time Slot:</strong>{" "}
                    {new Date(appointment.startTime).toLocaleTimeString(
                      "en-NG",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        timeZone: "Africa/Lagos",
                      }
                    )}{" "}
                    -{" "}
                    {new Date(appointment.endTime).toLocaleTimeString("en-NG", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "Africa/Lagos",
                    })}
                  </p>
                  <p>
                    {new Date(appointment.startTime).toLocaleString("en-NG", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "Africa/Lagos",
                    })}{" "}
                    -{" "}
                    {new Date(appointment.endTime).toLocaleString("en-NG", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "Africa/Lagos",
                    })}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ViewAppointments;
