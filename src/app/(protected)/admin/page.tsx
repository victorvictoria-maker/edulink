import { redirect } from "next/navigation";
import AdminPageClientContent from "./AdminPageClientContent";
import { createClient } from "@/utils/supabase/server";
import { getUserEmail } from "@/fetchdatafromdb/getuser";

export const metadata = {
  title: "Admin Page",
};

async function AdminPageContent() {
  const { email, error } = await getUserEmail();

  if (error || !email) {
    redirect("/login");
  }

  return (
    <div className='flex bg-gray-100 min-h-screen'>
      <main className='flex-1 p-6'>
        <AdminPageClientContent email={email as string} />
        {/* email={email as string}  */}
      </main>
    </div>
  );
}

export default AdminPageContent;
