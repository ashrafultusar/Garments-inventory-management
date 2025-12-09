import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="text-center">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Image
            src="/Image/logo.png"
            alt="Dashboard Logo"
            width={70}
            height={70}
            className="object-contain rounded-xl shadow-md"
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Welcome to the Dashboard
        </h1>

        {/* Tagline */}
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          Manage your tasks, insights, and activities — all in one place.
        </p>

      </div>
    </div>
  );
}
