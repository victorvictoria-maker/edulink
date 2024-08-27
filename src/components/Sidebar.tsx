"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa"; // Import the hamburger and close icons

interface SidebarLink {
  label: string;
  path: string;
}

interface SidebarProps {
  links: SidebarLink[];
  role: string;
}

const Sidebar = ({ links, role }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = (link: string) => {
    router.push(link);
    setIsOpen(false); // Close the sidebar after clicking a link
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Hamburger Menu Icon for Small Screens */}
      <div className='md:hidden p-4'>
        <FaBars
          className='text-2xl cursor-pointer text-[#104a36]'
          onClick={toggleSidebar}
        />
      </div>

      {/* Sidebar Container */}
      <nav
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 w-64 pl-4 border-r border-[#a30000]/10 z-50`}
      >
        {/* Close Icon for Small Screens */}
        {isOpen && (
          <div className='absolute top-4 right-4 md:hidden'>
            <FaTimes
              className='text-2xl cursor-pointer text-[#104a36]'
              onClick={toggleSidebar}
            />
          </div>
        )}

        <h1 className='pt-12 mb-5 text-3xl font-bold text-[#104a36]'>{role}</h1>
        <ul>
          {links.map((link) => (
            <li
              key={link.path}
              className={`mb-4 font-semibold text-xl cursor-pointer ${
                pathname === link.path ? "text-[#104a36]" : ""
              }`}
              onClick={() => handleLinkClick(link.path)}
            >
              {link.label}
            </li>
          ))}
        </ul>
      </nav>

      {/* Overlay for Small Screens */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black opacity-50 z-40'
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
