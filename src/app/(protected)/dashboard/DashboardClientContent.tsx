"use client";

import { usePathname } from "next/navigation";
import ProfilePage from "./profile/page";
import BookAppointment from "./appointments/book/page";
import ViewAppointments from "./appointments/view/page";
// import SetAvailability from "./availability/page";
// import ViewAppointments from "./appointments/page";

export default function DashboardPageClientContent({
  email,
}: {
  email: string;
}) {
  const pathname = usePathname();
  console.log(email);

  const renderContent = (): JSX.Element => {
    switch (pathname) {
      case "/dashboard/appointments/book":
        return <BookAppointment />;
      case "/dashboard/appointments/view":
        return <ViewAppointments />;
      default:
        return <ProfilePage email={email} />;
    }
  };

  return <>{renderContent()}</>;
}
