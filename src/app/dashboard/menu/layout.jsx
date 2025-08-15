'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { name: "Finishing Type", href: "/dashboard/menu/finishingType" },
  { name: "Clothe Type", href: "/dashboard/menu/clotheType" },
  { name: "Colour", href: "/dashboard/menu/colour" },
  { name: "Sill Name", href: "/dashboard/menu/sillName" },
  { name: "Quality", href: "/dashboard/menu/quality" },
];

export default function MenuLayout({ children }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row mt-16 md:mt-2">

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden cursor-pointer px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white text-sm font-medium"
      >
        {isOpen ? "Close Menu" : "Open Menu"}
      </button>

      {/* Sidebar */}
      <aside
        className={`w-full md:w-60 bg-gray-100 dark:bg-gray-900 border-r dark:border-gray-700 p-4 transition-all duration-300
        ${isOpen ? "block" : "hidden"} md:block`}
      >
        <nav className="flex flex-col gap-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  px-4 py-3 rounded-md text-base font-medium transition duration-200
                  ${isActive
                    ? "bg-blue-500 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"}
                `}
                onClick={() => setIsOpen(false)} // close menu on mobile
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 text-sm md:text-base">
        {children}
      </main>
    </div>
  );
}
