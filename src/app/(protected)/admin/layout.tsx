import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import DashboardNav from "@/components/dashboardNav";
import DashboardFooter from "@/components/hospitals/dashboardfooter";
import { getUserEmail } from "@/fetchdatafromdb/getuser";

const adminLinks = [
  { label: "Profile", path: "/admin" },
  { label: "Set Availability", path: "/admin/availability" },
  { label: "View Appointments", path: "/admin/appointments" },
];

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { email, error } = await getUserEmail();

  if (error || !email) {
    redirect("/login");
  }

  return (
    <div className='flex flex-col h-full'>
      <DashboardNav email={email} />
      <div className='flex bg-gray-100 min-h-[100vh]'>
        <Sidebar links={adminLinks} role='HOD' />
        <main className='flex-1 p-6'>{children}</main>
      </div>
      <DashboardFooter />
    </div>
  );
}
