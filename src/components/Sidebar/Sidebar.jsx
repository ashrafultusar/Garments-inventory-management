// "use client";
// import Link from "next/link";
// import Image from "next/image";
// import { useState, useRef, useEffect } from "react";
// import { FaBars, FaCartArrowDown } from "react-icons/fa";
// import { LuUsers } from "react-icons/lu";
// import { IoClose } from "react-icons/io5";
// import { signOut, useSession } from "next-auth/react";
// import { FiSettings, FiLogOut } from "react-icons/fi";
// import { MenuIcon } from "lucide-react";
// import { usePathname } from "next/navigation";

// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const { data: session } = useSession();
//   const pathname = usePathname();
//   const imageSrc = session?.user?.image
//     ? session?.user?.image
//     : "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=634&q=80";

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <>
//       {/* Mobile/Tablet Navbar */}
//       <div className="no-print md:hidden cursor-pointer fixed top-0 left-0 right-0 z-50 bg-gray-800 text-white flex justify-between items-center px-4 py-3 shadow-md ">
//         {/* Hamburger */}
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="p-2 rounded-md cursor-pointer text-white"
//         >
//           {isOpen ? <IoClose size={20} /> : <FaBars size={20} />}
//         </button>

//         {/* Logo */}
//         <Link href="/dashboard/order">
//           <Image
//             src="/Image/logo.png"
//             alt="Logo"
//             width={100}
//             height={30}
//             className="h-8 w-auto"
//           />
//         </Link>
//       </div>

//       {/* Sidebar */}
//       <aside
//         className={`fixed top-0 left-0 z-40 h-screen w-64 px-4 py-8 overflow-y-auto 
//           bg-white border-r dark:bg-gray-900 dark:border-gray-700 
//           flex flex-col 
//           transition-transform duration-300 ease-in-out
//           ${isOpen ? "translate-x-0" : "-translate-x-full"} 
//           md:translate-x-0 md:static md:h-screen`}
//       >
//         {/* Logo for desktop */}
//         <div className="no-print hidden md:flex items-center justify-center">
//           <Link href="/dashboard/order">
//             <Image
//               className="w-auto h-8"
//               src="/Image/logo.png"
//               alt="Logo"
//               width={100}
//               height={30}
//               priority
//             />
//           </Link>
//         </div>

//         {/* Navigation */}

//         <nav className="mt-14 flex flex-col gap-2">
//           {[
//             {
//               href: "/dashboard/order",
//               label: "Order",
//               icon: <FaCartArrowDown />,
//             },
//             {
//               href: "/dashboard/customer",
//               label: "Customer",
//               icon: <LuUsers />,
//             },
//             {
//               href: "/dashboard/dyeing",
//               label: "Dyeing",
//               icon: <LuUsers />,
//             },
//             {
//               href: "/dashboard/calender",
//               label: "Calender",
//               icon: <LuUsers />,
//             },
//             {
//               href: "/dashboard/accounts",
//               label: "Accounts",
//               icon: <LuUsers />,
//             },
//             {
//               href: "/dashboard/admins",
//               label: "All Admin",
//               icon: <LuUsers />,
//             },
           
//           ].map(({ href, label, icon }) => {
//             const isActive = pathname === href;

//             return (
//               <Link
//                 key={href}
//                 href={href}
//                 className={`flex items-center px-4 py-2 rounded-md gap-2 uppercase transition
//           ${
//             isActive
//               ? "bg-blue-600 text-white dark:bg-blue-500"
//               : "text-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
//           }
//         `}
//               >
//                 {icon}
//                 {label}
//               </Link>
//             );
//           })}
//         </nav>

//         {/* User Info Dropdown */}
//         <div className="mt-auto relative" ref={dropdownRef}>
//           <div
//             onClick={() => setDropdownOpen(!dropdownOpen)}
//             className="flex items-center gap-2 cursor-pointer"
//           >
//             <Image
//               className="object-cover rounded-full h-9 w-9"
//               src={imageSrc}
//               alt="avatar"
//               width={36}
//               height={36}
//             />
//             <span>{session?.user?.name || "Guest"}</span>
//           </div>

//           {dropdownOpen && (
//             <div className="absolute bottom-14 w-60 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
//               {/* Profile Info */}
//               <div className="px-4 py-3 border-b  border-gray-200 dark:border-gray-700 flex justify-between items-center">
//                 <div>
//                   <p className="font-medium text-gray-800 dark:text-gray-200">
//                     {session?.user?.name || "Guest"}
//                   </p>
//                   <p className="text-sm text-gray-500 truncate">
//                     {session?.user?.email || "No email"}
//                   </p>
//                 </div>
//                 <Image
//                   className="object-cover rounded-full h-9 w-9"
//                   src={imageSrc}
//                   alt="avatar"
//                   width={36}
//                   height={36}
//                 />
//               </div>

//               {/* Settings */}
//               <Link
//                 href="/dashboard/setting"
//                 className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 gap-2"
//               >
//                 <FiSettings size={18} />
//                 Settings
//               </Link>
//               <Link
//                 href="/dashboard/menu"
//                 className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 gap-2"
//               >
//                 <MenuIcon size={18} />
//                 Menu
//               </Link>

//               {/* Logout */}
//               {session && (
//                 <button
//                   onClick={() => signOut()}
//                   className="flex items-center w-full px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700 gap-2"
//                 >
//                   <FiLogOut size={18} />
//                   Log Out
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       </aside>

//       {/* Overlay for mobile */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
//           onClick={() => setIsOpen(false)}
//         />
//       )}
//     </>
//   );
// };

// export default Sidebar;

'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { 
  ShoppingCart, 
  Users, 
  Palette, 
  CalendarDays, 
  WalletCards, 
  ShieldCheck,
  ChevronRight, 
  ChevronLeft, 
  Menu,
  X,
  Settings,
  LogOut,
  LayoutGrid
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true); 
  const [isMobileOpen, setIsMobileOpen] = useState(false); 
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { data: session } = useSession();
  const pathname = usePathname();

  const imageSrc = session?.user?.image || "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=634&q=80";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Relevant Icons based on categories
  const menuItems = [
    { href: "/dashboard/order", label: "Order", icon: ShoppingCart },
    { href: "/dashboard/customer", label: "Customer", icon: Users },
    { href: "/dashboard/dyeing", label: "Dyeing", icon: Palette },
    { href: "/dashboard/calender", label: "Calender", icon: CalendarDays },
    { href: "/dashboard/accounts", label: "Accounts", icon: WalletCards },
    { href: "/dashboard/admins", label: "Adminnistration", icon: ShieldCheck },
  ];

  return (
    <>
      {/* ===== MOBILE HEADER ===== */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#1e2634] text-white fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-md">
             <Image src="/Image/logo.png" alt="Logo" width={20} height={20} className="brightness-200" />
          </div>
          <span className="text-sm font-semibold">Admin Panel</span>
        </div>
        <button className="cursor-pointer" onClick={() => setIsMobileOpen(!isMobileOpen)}>
          {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          bg-[#1e2634] text-gray-400
          transition-all duration-300 ease-in-out
          ${isOpen ? "w-72" : "w-20"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static h-screen flex flex-col
        `}
      >
        <div className="flex flex-col h-full">
          
          {/* ===== LOGO SECTION ===== */}
          <Link href={'/'} className="relative flex items-center gap-3 px-4 py-6">
            <div className="bg-blue-600 p-2 rounded-md shrink-0">
               <Image src="/Image/logo.png" alt="Logo" width={24} height={24} className="brightness-200" />
            </div>

            <div className={`${!isOpen && "lg:hidden opacity-0"} transition-opacity duration-200`}>
              <h1 className="text-md font-bold text-white leading-none whitespace-nowrap">
              NM-Dyeing
              </h1>
              <p className="text-[11px] text-gray-500 mt-1 uppercase tracking-wider font-semibold">Management</p>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="hidden lg:flex absolute -right-3 top-8
                bg-blue-600 text-white shadow-lg
                rounded-full p-1 hover:bg-blue-700 cursor-pointer z-50"
            >
              {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>
          </Link>

          {/* ===== NAVIGATION MENU ===== */}
          <div className="flex-1 overflow-y-auto px-3">
            <p className={`text-[10px] uppercase tracking-[2px] text-gray-500 mb-4 mt-4 px-3 font-bold ${!isOpen && "lg:hidden"}`}>
              Main Menu
            </p>

            <nav className="space-y-1.5">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`
                      flex items-center gap-3
                      px-3 py-2.5
                      text-sm font-medium
                      rounded-lg
                      transition-all duration-200
                      ${isActive 
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                        : "hover:bg-white/5 hover:text-white"
                      }
                    `}
                  >
                    <Icon size={20} className={`shrink-0 ${isActive ? "text-white" : "text-gray-400"}`} />
                    <span className={`${!isOpen && "lg:hidden opacity-0"} whitespace-nowrap`}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* ===== USER INFO & DROPDOWN ===== */}
          <div className="px-3 py-4 border-t border-white/5 relative" ref={dropdownRef}>
            <div 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
            >
              <Image
                className="object-cover rounded-full h-9 w-9 border border-gray-600"
                src={imageSrc}
                alt="avatar"
                width={36}
                height={36}
              />
              <div className={`${!isOpen && "lg:hidden opacity-0"} overflow-hidden`}>
                <p className="text-sm font-medium text-white truncate">{session?.user?.name || "Guest"}</p>
                <p className="text-[11px] text-gray-500 truncate">Admin</p>
              </div>
            </div>

            {dropdownOpen && (
              <div className="absolute bottom-16 left-3 right-3 bg-[#262f3f] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                <Link
                  href="/dashboard/setting"
                  className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-white/5 gap-3"
                >
                  <Settings size={18} /> Settings
                </Link>
                <Link
                  href="/dashboard/menu"
                  className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-white/5 gap-3"
                >
                  <LayoutGrid size={18} /> Menu
                </Link>
                {session && (
                  <button
                    onClick={() => signOut()}
                    className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 gap-3 border-t border-white/5 cursor-pointer text-left"
                  >
                    <LogOut size={18} /> Log Out
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;