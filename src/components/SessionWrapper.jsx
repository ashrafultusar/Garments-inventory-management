"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";

export default function SessionWrapper({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();


  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);


  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex">
      {session && <Sidebar />}
      <main className="flex-1 p-4 bg-gray-100 min-h-screen">{children}</main>
    </div>
  );
}
