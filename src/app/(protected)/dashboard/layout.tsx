import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { ReactNode } from "react";
import DashboardNav from "@/components/dashboardNav";
import DashboardFooter from "@/components/hospitals/dashboardfooter";
import { getUserEmail } from "@/fetchdatafromdb/getuser";

const studentLinks = [
  { label: "Profile", path: "/dashboard" },
  { label: "Book Appointment", path: "/dashboard/appointments/book" },
  { label: "View Appointments", path: "/dashboard/appointments/view" },
];

export default async function StudentLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { email, error } = await getUserEmail();

  if (error || !email) {
    redirect("/login");
  }

  return (
    <div className='h-full'>
      <DashboardNav email={email} />

      <div className='flex bg-gray-100  min-h-[100vh]'>
        <Sidebar links={studentLinks} role='Student' />
        <main className='flex-1 p-6'>{children}</main>
      </div>

      <DashboardFooter />
    </div>
  );
}
