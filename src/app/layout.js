import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar/Sidebar";
import { ToastContainer } from "react-toastify";
import NextAuthProvider from "@/Providers/NextAuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Garments Inventory",
  description: "Garments Inventory Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider>
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-4 bg-gray-100 min-h-screen">
              {children}
              <ToastContainer />
            </main>
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
