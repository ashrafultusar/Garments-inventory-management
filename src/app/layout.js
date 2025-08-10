import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import NextAuthProvider from "@/Providers/NextAuthProvider";
import SessionWrapper from "@/components/SessionWrapper";

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
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NextAuthProvider>
          <SessionWrapper>
            {children}
            <ToastContainer />
          </SessionWrapper>
        </NextAuthProvider>
      </body>
    </html>
  );
}
