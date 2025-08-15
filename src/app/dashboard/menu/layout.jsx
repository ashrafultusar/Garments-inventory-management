'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Finishing Type", href: "/dashboard/menu/finishingType" },
  { name: "Clothe Type", href: "/dashboard/menu/clotheType" },
  { name: "Colour", href: "/dashboard/menu/colour" },
  { name: "Sill Name", href: "/dashboard/menu/sillName" },
  { name: "Quality", href: "/dashboard/menu/quality" },
 
];

export default function MenuLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-100 border-r dark:bg-gray-900 dark:border-gray-700 p-4">
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-md transition ${
                pathname === item.href
                  ? "bg-gray-300 dark:bg-gray-700 font-bold"
                  : "hover:bg-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
