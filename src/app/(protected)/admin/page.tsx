import { redirect } from "next/navigation";
import AdminPageClientContent from "./AdminPageClientContent";
import { createClient } from "@/utils/supabase/server";

export default async function AdminPageContent() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  const email = data.user?.email ?? "";

  return (
    <div className='flex bg-gray-100 min-h-screen'>
      <main className='flex-1 p-6'>
        <AdminPageClientContent email={email} />
      </main>
    </div>
  );
}
