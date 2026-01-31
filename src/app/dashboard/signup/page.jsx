// "use client";
// import React from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";
// import { signIn } from "next-auth/react";

// const SignUp = () => {
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const form = e.target;
//     const name = form.name.value;
//     const email = form.email.value;
//     const password = form.password.value;

//     try {
//       const res = await fetch("/api/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, email, password }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         toast.success("Registration successful");
//         router.push("/dashboard/admins");
//         form.reset();
//       } else {
//         toast.error(data.error || "Registration failed");
//       }
//     } catch {
//       toast.error("Something went wrong");
//     }
//   };

//   // const handleGoogleSignUp = () => {
//   //   signIn("google", { callbackUrl: "/dashboard/order" });
//   // };

//   return (
//     <div className="flex w-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800">
//       <div
//         className="hidden bg-cover lg:block lg:w-1/2"
//         style={{
//           backgroundImage:
//             "url('https://images.unsplash.com/photo-1606660265514-358ebbadc80d?auto=format&fit=crop&w=1575&q=80')",
//         }}
//       ></div>

//       <form onSubmit={handleSubmit} className="w-full px-6 py-8 md:px-8 lg:w-1/2">
//         <div className="flex justify-center mx-auto">
//           <img className="w-auto h-7 sm:h-8" src="https://merakiui.com/images/logo.svg" alt="Logo" />
//         </div>

//         <p className="mt-3 text-xl text-center text-gray-600 dark:text-gray-200">
//           Create your account
//         </p>

//         {/* Google signup */}
//         {/* <button
//           onClick={handleGoogleSignUp}
//           type="button"
//           className="flex items-center justify-center mt-4 text-gray-600 w-full border rounded-lg hover:bg-gray-50"
//         >
//           <div className="px-4 py-2">
//             <svg className="w-6 h-6" viewBox="0 0 40 40">
//               <path fill="#EA4335" d="M20 3.5c4.6 0 8.5 1.8 11.3 4.8l-4.6 4.6C25.2 11.2 22.8 10 20 10c-5.3 0-9.6 4.3-9.6 9.6s4.3 9.6 9.6 9.6c4.9 0 8.5-3.3 9.3-7.9h-9.3v-6.3h16c.2 1.1.3 2.2.3 3.5 0 9.5-6.5 16.3-16.3 16.3C10.5 34.8 3.5 27.8 3.5 19S10.5 3.5 20 3.5z" />
//             </svg>
//           </div>
//           <span className="w-5/6 px-4 py-3 font-bold text-center">
//             Sign up with Google
//           </span>
//         </button> */}

//         {/* Email/password form */}
//         <div className="flex items-center justify-between mt-4">
//           <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4"></span>
//           <span className="text-xs text-center text-gray-500 uppercase">
//             or register with email
//           </span>
//           <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/4"></span>
//         </div>

//         <div className="mt-4">
//           <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">Name</label>
//           <input id="name" name="name" type="text" required className="block w-full px-4 py-2 border rounded-lg focus:border-blue-400 focus:ring focus:ring-blue-300" />
//         </div>

//         <div className="mt-4">
//           <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">Email</label>
//           <input id="email" name="email" type="email" required className="block w-full px-4 py-2 border rounded-lg focus:border-blue-400 focus:ring focus:ring-blue-300" />
//         </div>

//         <div className="mt-4">
//           <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">Password</label>
//           <input id="password" name="password" type="password" required className="block w-full px-4 py-2 border rounded-lg focus:border-blue-400 focus:ring focus:ring-blue-300" />
//         </div>

//         <div className="mt-6">
//           <button type="submit" className="w-full px-6 py-3 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700">Sign Up</button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default SignUp;

"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { 
  ArrowLeft, 
  UserPlus, 
  Mail, 
  Lock, 
  User,
  ShieldCheck
} from "lucide-react";

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

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center p-4">
      
      {/* ===== BACK BUTTON ===== */}
      <div className="w-full max-w-lg mb-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-medium cursor-pointer group"
        >
          <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 group-hover:border-blue-100 transition-all">
            <ArrowLeft size={18} />
          </div>
          <span className="text-sm">Back to Dashboard</span>
        </button>
      </div>

      {/* ===== FORM CARD ===== */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
        <div className="px-8 py-10">
          
          {/* LOGO & TITLE */}
          <div className="flex flex-col items-center mb-10">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200 mb-4 transform transition-transform hover:scale-105">
               <ShieldCheck className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create Admin</h1>
            <p className="text-gray-500 text-sm mt-1.5 font-medium">Add a new administrator to the system</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* NAME INPUT */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <User size={19} />
                </div>
                <input 
                    id="name" 
                    name="name" 
                    type="text" 
                    required 
                    placeholder="e.g. Shakib Rahman"
                    className="block w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-gray-800 placeholder:text-gray-400" 
                />
              </div>
            </div>

            {/* EMAIL INPUT */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Mail size={19} />
                </div>
                <input 
                    id="email" 
                    name="email" 
                    type="email" 
                    required 
                    placeholder="admin@garments.com"
                    className="block w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-gray-800 placeholder:text-gray-400" 
                />
              </div>
            </div>

            {/* PASSWORD INPUT */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={19} />
                </div>
                <input 
                    id="password" 
                    name="password" 
                    type="password" 
                    required 
                    placeholder="••••••••"
                    className="block w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-gray-800 placeholder:text-gray-400" 
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-4">
              <button 
                type="submit" 
                className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-bold text-white bg-[#2563eb] hover:bg-[#1d4ed8] rounded-xl transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 active:scale-[0.98] cursor-pointer"
              >
                <UserPlus size={19} />
                Register Admin
              </button>
            </div>
          </form>

          {/* FOOTER */}
          <div className="mt-10 pt-6 border-t border-gray-100">
            <p className="text-center text-[11px] text-gray-400 uppercase tracking-widest font-bold">
              Secure Management System &copy; 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;