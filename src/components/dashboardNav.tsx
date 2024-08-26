import Image from "next/image";
import { LogoutButton } from "./LogoutButton";

const DashboardNav = ({ email }: { email: string }) => {
  return (
    <nav className='bg-gradient-to-r from-[#000] via-[#a30000] to-[#000] p-4 flex items-center justify-between'>
      {/* Left: User Greeting */}
      <div className='flex items-center'>
        <p className='text-white text-lg'>Hi 👋, {email}</p>
      </div>

      {/* Center: Finding Hospitals Line */}
      <div className='flex-1 text-center hidden lg:block'>
        <div className='text-white text-xl font-semibold animate-slideInLeft'>
          Connect with your Head of Department
        </div>
      </div>

      {/* Right: Logout Button */}
      {/* <div className='flex items-center'> */}
      <LogoutButton />
      {/* </div> */}
    </nav>
  );
};

export default DashboardNav;
