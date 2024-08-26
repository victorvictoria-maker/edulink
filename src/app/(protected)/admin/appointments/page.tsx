"use client";

import { useState, useEffect } from "react";
import {
  fetchAllAppointments,
  updateAppointmentStatus,
} from "@/serveractions/admin";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewAppointmentsForHod: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await fetchAllAppointments();
        if (Array.isArray(data)) {
          setAppointments(data);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err: any) {
        setError("Failed to fetch appointments");
        toast.error("Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const handleStatusChange = async (
    appointmentId: string,
    status: "APPROVED" | "CANCELED"
  ) => {
    try {
      const result = await updateAppointmentStatus(appointmentId, status);
      if ("error" in result) {
        throw new Error(result.error);
      }
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );
      toast.success(`Appointment ${status.toLowerCase()} successfully!`);
    } catch (error: any) {
      setError(error.message || "Failed to update appointment status");
      toast.error(error.message || "Failed to update appointment status");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className='text-red-500'>{error}</div>;

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "PENDING"
  );

  const attendedAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "APPROVED" || appointment.status === "CANCELED"
  );

  return (
    <div className='container mx-auto p-4'>
      <ToastContainer />
      <h1 className='text-2xl font-bold mb-4'>All Appointments</h1>

      {/* Section for Pending Appointments */}
      <h2 className='text-xl font-semibold mb-4'>Pending Appointments</h2>
      {pendingAppointments.length === 0 ? (
        <p className='text-center text-gray-600'>
          No pending appointments found.
        </p>
      ) : (
        <ul className='space-y-4 mb-8'>
          {pendingAppointments.map((appointment) => (
            <li
              key={appointment.id}
              className='p-4 rounded-lg shadow-lg bg-yellow-100 border-yellow-500 border-2'
            >
              <div className='flex flex-col space-y-2'>
                <p className='text-lg font-semibold'>
                  <strong>Title:</strong> {appointment.title}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(appointment.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Status:</strong> {appointment.status}
                </p>
                <p>
                  <strong>Time Slot:</strong>{" "}
                  {new Date(appointment.startTime).toLocaleTimeString("en-NG", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                    timeZone: "Africa/Lagos",
                  })}{" "}
                  -{" "}
                  {new Date(appointment.endTime).toLocaleTimeString("en-NG", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                    timeZone: "Africa/Lagos",
                  })}
                </p>
                <div className='flex space-x-2'>
                  <button
                    onClick={() =>
                      handleStatusChange(appointment.id, "APPROVED")
                    }
                    className='bg-green-500 text-white px-4 py-2 rounded'
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(appointment.id, "CANCELED")
                    }
                    className='bg-red-500 text-white px-4 py-2 rounded'
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Section for Attended Appointments */}
      <h2 className='text-xl font-semibold mb-4'>Attended Appointments</h2>
      {attendedAppointments.length === 0 ? (
        <p className='text-center text-gray-600'>
          No attended appointments found.
        </p>
      ) : (
        <ul className='space-y-4'>
          {attendedAppointments.map((appointment) => (
            <li
              key={appointment.id}
              className={`p-4 rounded-lg shadow-lg ${
                appointment.status === "APPROVED"
                  ? "bg-green-100 border-green-500"
                  : "bg-red-100 border-red-500"
              } border-2`}
            >
              <div className='flex flex-col space-y-2'>
                <p className='text-lg font-semibold'>
                  <strong>Title:</strong> {appointment.title}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(appointment.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Status:</strong> {appointment.status}
                </p>
                <p>
                  <strong>Time Slot:</strong>{" "}
                  {new Date(appointment.startTime).toLocaleTimeString("en-NG", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                    timeZone: "Africa/Lagos",
                  })}{" "}
                  -{" "}
                  {new Date(appointment.endTime).toLocaleTimeString("en-NG", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                    timeZone: "Africa/Lagos",
                  })}
                </p>
                <p
                  className={
                    appointment.status === "APPROVED"
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {appointment.status === "APPROVED" ? "Approved" : "Canceled"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewAppointmentsForHod;
