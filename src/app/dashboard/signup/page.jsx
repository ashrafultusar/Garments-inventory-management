"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";

const SignUp = () => {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Registration successful");
        router.push("/dashboard/admins");
        form.reset();
      } else {
        toast.error(data.error || "Registration failed");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleGoogleSignUp = () => {
    signIn("google", { callbackUrl: "/dashboard/order" });
  };

  return (
    <div className="flex w-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800">
      <div
        className="hidden bg-cover lg:block lg:w-1/2"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1606660265514-358ebbadc80d?auto=format&fit=crop&w=1575&q=80')",
        }}
      ></div>

      <form onSubmit={handleSubmit} className="w-full px-6 py-8 md:px-8 lg:w-1/2">
        <div className="flex justify-center mx-auto">
          <img className="w-auto h-7 sm:h-8" src="https://merakiui.com/images/logo.svg" alt="Logo" />
        </div>

        <p className="mt-3 text-xl text-center text-gray-600 dark:text-gray-200">
          Create your account
        </p>

        {/* Google signup */}
        <button
          onClick={handleGoogleSignUp}
          type="button"
          className="flex items-center justify-center mt-4 text-gray-600 w-full border rounded-lg hover:bg-gray-50"
        >
          <div className="px-4 py-2">
            <svg className="w-6 h-6" viewBox="0 0 40 40">
              <path fill="#EA4335" d="M20 3.5c4.6 0 8.5 1.8 11.3 4.8l-4.6 4.6C25.2 11.2 22.8 10 20 10c-5.3 0-9.6 4.3-9.6 9.6s4.3 9.6 9.6 9.6c4.9 0 8.5-3.3 9.3-7.9h-9.3v-6.3h16c.2 1.1.3 2.2.3 3.5 0 9.5-6.5 16.3-16.3 16.3C10.5 34.8 3.5 27.8 3.5 19S10.5 3.5 20 3.5z" />
            </svg>
          </div>
          <span className="w-5/6 px-4 py-3 font-bold text-center">
            Sign up with Google
          </span>
        </button>

        {/* Email/password form */}
        <div className="flex items-center justify-between mt-4">
          <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4"></span>
          <span className="text-xs text-center text-gray-500 uppercase">
            or register with email
          </span>
          <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/4"></span>
        </div>

        <div className="mt-4">
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">Name</label>
          <input id="name" name="name" type="text" required className="block w-full px-4 py-2 border rounded-lg focus:border-blue-400 focus:ring focus:ring-blue-300" />
        </div>

        <div className="mt-4">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">Email</label>
          <input id="email" name="email" type="email" required className="block w-full px-4 py-2 border rounded-lg focus:border-blue-400 focus:ring focus:ring-blue-300" />
        </div>

        <div className="mt-4">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">Password</label>
          <input id="password" name="password" type="password" required className="block w-full px-4 py-2 border rounded-lg focus:border-blue-400 focus:ring focus:ring-blue-300" />
        </div>

        <div className="mt-6">
          <button type="submit" className="w-full px-6 py-3 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700">Sign Up</button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
