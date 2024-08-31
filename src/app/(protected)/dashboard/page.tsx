import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import DashboardPageClientContent from "./DashboardClientContent";
import { getUserEmail } from "@/fetchdatafromdb/getuser";

export const metadata = {
  title: "Student Dashboard",
};

async function DashboardPageContent() {
  const { email, error } = await getUserEmail();

  if (error || !email) {
    redirect("/login");
  }

  return (
    <div className='flex bg-gray-100 min-h-[100vh]'>
      <main className='flex-1 p-6'>
        <DashboardPageClientContent email={email} />
      </main>
    </div>
  );
}

export default DashboardPageContent;
