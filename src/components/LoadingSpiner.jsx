"use client";
import { useEffect, useState } from "react";

export default function LoadingSpiner({ onFinish }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          onFinish(); // call when loading complete
          return 100;
        }
        return prev + 2; // speed of loading
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="flex items-center justify-center h-screen bg-white flex-col">
      <div className="w-64 bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
        <div
          className="bg-teal-400 h-2 rounded-full transition-all duration-200"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-xl font-semibold">{progress}%</p>
      <p className="text-gray-500 text-sm mt-2">
        Please wait while the application is loading...
      </p>
    </div>
  );
}
