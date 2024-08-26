"use client";

import { usePathname } from "next/navigation";
import ProfilePage from "./profile/page";
import SetAvailability from "./availability/page";
import ViewAppointments from "./appointments/page";

export default function AdminPageClientContent({ email }: { email: string }) {
  const pathname = usePathname();

  const renderContent = (): JSX.Element => {
    switch (pathname) {
      case "/admin/availability":
        return <SetAvailability />;
      case "/admin/appointments":
        return <ViewAppointments />;
      default:
        return <ProfilePage email={email} />;
    }
  };

  return <>{renderContent()}</>;
}
