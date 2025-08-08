"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FaBars, FaCartArrowDown } from "react-icons/fa";
import { LuUsers } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { signOut, useSession } from "next-auth/react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  const imageSrc = session?.user?.image
    ? session.user.image
    : "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=634&q=80";

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 text-white bg-gray-800 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <IoClose size={20} /> : <FaBars size={20} />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <section
        className={`
          fixed top-0 left-0 z-40 h-screen w-64 px-4 py-8 overflow-y-auto 
          bg-white border-r dark:bg-gray-900 dark:border-gray-700 
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:h-screen
        `}
      >
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
          <Link
            href="/customer"
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md dark:bg-gray-800 dark:text-gray-200 gap-1 uppercase"
          >
            <LuUsers />
            All Admin
          </Link>

          <Link
            href="/signup"
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md dark:bg-gray-800 dark:text-gray-200 gap-1 uppercase"
          >
            <LuUsers />
            Registration
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
            {session?.user?.name}
          </span>
        </div>
        <button
          onClick={() => signOut()}
          type="submit"
          className="w-full mt-4 px-6 py-3 text-sm font-medium tracking-wide text-white capitalize cursor-pointer transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
        >
          Log Out
        </button>
      </section>
    </>
  );
};

export default Sidebar;
