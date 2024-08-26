import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { ReactNode } from "react";
import DashboardNav from "@/components/dashboardNav";
import DashboardFooter from "@/components/hospitals/dashboardfooter";

export const metadata = {
  title: "Student Dashboard",
};

const studentLinks = [
  { label: "Profile", path: "/dashboard" },
  { label: "Book Appointment", path: "/dashboard/appointments/book" },
  { label: "View Appointments", path: "/dashboard/appointments/view" },
];

const StudentLayout = async ({ children }: { children: ReactNode }) => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  const email = data.user?.email ?? "";

  return (
    <div>
      <DashboardNav email={email} />

      <div className='flex bg-gray-100 min-h-screen'>
        <Sidebar links={studentLinks} role='Student' />
        <main className='flex-1 p-6'>{children}</main>
      </div>

      <DashboardFooter />
    </div>
  );
};

export default StudentLayout;
