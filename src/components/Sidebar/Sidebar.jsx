"use client";
import Link from "next/link";
import Image from "next/image";
import { FaCartArrowDown } from "react-icons/fa";
import { LuUsers } from "react-icons/lu";

const Sidebar = () => {
  return (
    <aside className="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-white border-r dark:bg-gray-900 dark:border-gray-700">
      <Link href="/">
        <Image
          className="w-auto h-6 sm:h-7"
          src="https://merakiui.com/images/logo.svg"
          alt="Logo"
          width={100}
          height={30}
        />
      </Link>

      <nav className="mt-6 space-y-2">
        <Link
          href="/order"
          className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md dark:bg-gray-800 dark:text-gray-200 gap-1 uppercase"
        >
          <FaCartArrowDown />
          Order
        </Link>

        <Link
          href="/customer"
          className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md dark:bg-gray-800 dark:text-gray-200 gap-1 uppercase"
        >
          <LuUsers />
          Customer
        </Link>
      </nav>

      <div className="flex items-center px-4 mt-auto">
        <Image
          className="object-cover rounded-full h-9 w-9"
          src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=634&q=80"
          alt="avatar"
          width={36}
          height={36}
        />
        <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">
          John Doe
        </span>
      </div>
    </aside>
  );
};

export default Sidebar;
