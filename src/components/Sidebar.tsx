"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
    setIsOpen(false);
  };

  return (
    <nav className='w-64  pl-4   border shadow-sm border-r-[#a30000]/10 '>
      <h1 className='mt-12 mb-5 text-3xl font-bold text-[#104a36]'> {role}</h1>
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
  );
};

export default Sidebar;
