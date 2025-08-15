"use client";

import React from "react";
import { useSession } from "next-auth/react";

const Page = () => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );
  }

  const { name, email, role } = {
    name: session?.user?.name || "No Name",
    email: session?.user?.email || "No Email",
    role: session?.user?.role || "No Role",
  };

  return (
    <div className=" bg-gray-100 flex items-center justify-center py-4 mt-16 md:mt-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        {/* Profile Avatar */}
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-md">
          {name.charAt(0)}
        </div>

        {/* Name */}
        <h1 className="mt-4 text-2xl font-semibold text-gray-800">{name}</h1>

        {/* Role */}
        <p className="mt-1 text-sm text-gray-500">{role}</p>

        {/* Divider */}
        <div className="my-4 border-t border-gray-200"></div>

        {/* Email */}
        <div className="flex items-center justify-center gap-2">
          <svg
            className="w-5 h-5 text-indigo-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 12l-4-4-4 4m8 0l-4 4-4-4"
            />
          </svg>
          <span className="text-gray-600">{email}</span>
        </div>

      </div>
    </div>
  );
};

export default Page;
