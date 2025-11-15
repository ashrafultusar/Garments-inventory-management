"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import Loading from "@/app/loading";


export default function SessionWrapper({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showLoader, setShowLoader] = useState(true);

  // ✅ Always show loader for 3 seconds on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000); // 3 seconds → change to 5000 for 5 sec

    return () => clearTimeout(timer);
  }, []);

  // ✅ Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // ✅ Show loader if session is loading OR timer active
  if (status === "loading" || showLoader) {
    return <Loading></Loading>
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {session && <Sidebar />}
      {/* <Sidebar /> */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
    </div>
  );
}
