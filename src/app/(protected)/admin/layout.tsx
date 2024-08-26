import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import DashboardNav from "@/components/dashboardNav";
import DashboardFooter from "@/components/hospitals/dashboardfooter";

export const metadata = {
  title: "Admin Page",
};

const adminLinks = [
  { label: "Profile", path: "/admin" },
  { label: "Set Availability", path: "/admin/availability" },
  { label: "View Appointments", path: "/admin/appointments" },
];

const AdminLayout = async ({ children }: { children: ReactNode }) => {
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
        <Sidebar links={adminLinks} role='HOD' />
        <main className='flex-1 p-6'>{children}</main>
      </div>
      <DashboardFooter />
    </div>
  );
};

export default AdminLayout;
