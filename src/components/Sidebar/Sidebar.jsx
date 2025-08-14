"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { FaBars, FaCartArrowDown } from "react-icons/fa";
import { LuUsers } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { signOut, useSession } from "next-auth/react";
import { IoMdArrowDropdown } from "react-icons/io";
import { FiSettings, FiLogOut } from "react-icons/fi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { data: session } = useSession();

  const imageSrc = session?.user?.image
    ? session.user.image
    : "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=634&q=80";

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 text-white bg-gray-800 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <IoClose size={20} /> : <FaBars size={20} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 px-4 py-8 overflow-y-auto 
          bg-white border-r dark:bg-gray-900 dark:border-gray-700 
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:h-screen`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center">
          <Link href="/">
            <Image
              className="w-auto h-8"
              src="https://merakiui.com/images/logo.svg"
              alt="Logo"
              width={100}
              height={30}
              priority
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex flex-col gap-2">
          <Link
            href="/dashboard/order"
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md dark:bg-gray-800 dark:text-gray-200 gap-2 uppercase hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <FaCartArrowDown />
            Order
          </Link>

          <Link
            href="/dashboard/customer"
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md dark:bg-gray-800 dark:text-gray-200 gap-2 uppercase hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <LuUsers />
            Customer
          </Link>

          <Link
            href="/dashboard/admins"
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md dark:bg-gray-800 dark:text-gray-200 gap-2 uppercase hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <LuUsers />
            All Admin
          </Link>

          <Link
            href="/dashboard/signup"
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md dark:bg-gray-800 dark:text-gray-200 gap-2 uppercase hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <LuUsers />
            Registration
          </Link>
        </nav>

        {/* User Info Dropdown */}
        <div className="mt-auto relative" ref={dropdownRef}>
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <p>
            <Image
              className="object-cover rounded-full h-9 w-9"
              src={imageSrc}
              alt="avatar"
              width={36}
              height={36}
            />
            </p>
            <span>{session?.user?.name || "Guest"}</span>
          </div>

          {dropdownOpen && (
            <div className="absolute bottom-14  w-60 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
              {/* Profile Info */}
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {session?.user?.name || "Guest"}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {session?.user?.email || "No email"}
                </p>
              </div>

              {/* Settings */}
              <Link
                href="/dashboard/settings"
                className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 gap-2"
              >
                <FiSettings size={18} />
                Settings
              </Link>

              {/* Logout */}
              {session && (
                <button
                  onClick={() => signOut()}
                  className="flex items-center w-full px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 gap-2"
                >
                  <FiLogOut size={18} />
                  Log Out
                </button>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
