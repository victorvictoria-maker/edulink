import { db } from "@/lib/db";
import { Resend } from "resend";
import cron from "node-cron";

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendReminderEmails() {
  const hoursBeforeAppointment = 12;
  const now = new Date();
  const reminderTime = new Date(
    now.getTime() + hoursBeforeAppointment * 60 * 60 * 1000
  );

  const appointments = await db.appointment.findMany({
    where: {
      startTime: {
        gte: now,
        lte: reminderTime,
      },
      status: {
        in: ["APPROVED"],
      },
    },
    include: {
      createdBy: true,
      timeSlot: {
        include: {
          hod: true,
        },
      },
    },
  });

  console.log(appointments);

  for (const appointment of appointments) {
    const { createdBy, timeSlot, startTime, endTime } = appointment;

    await resend.emails.send({
      from: "Edulink - appointment booking <onboarding@resend.dev>",
      to: createdBy.email,
      subject: "Appointment Reminder",
      text: `Dear ${
        createdBy.name
      }, this is a reminder for your upcoming appointment scheduled on ${startTime.toLocaleDateString()} from ${startTime.toLocaleTimeString()} to ${endTime.toLocaleTimeString()}.`,
    });

    await resend.emails.send({
      from: "Edulink - appointment booking <onboarding@resend.dev>",
      to: timeSlot.hod.email,
      subject: "Appointment Reminder",
      text: `Dear ${
        timeSlot.hod.name
      }, this is a reminder for an upcoming appointment with ${
        createdBy.name
      } scheduled on ${startTime.toLocaleDateString()} from ${startTime.toLocaleTimeString()} to ${endTime.toLocaleTimeString()}.`,
    });
  }
}

// Schedule the function to run every 30 minutes
// cron.schedule("*/30 * * * *", () => {
//   sendReminderEmails().catch((error) =>
//     console.error("Failed to send reminder emails:", error)
//   );
// });

cron.schedule("* * * * *", () => {
  sendReminderEmails().catch((error) =>
    console.error("Failed to send reminder emails:", error)
  );
});
