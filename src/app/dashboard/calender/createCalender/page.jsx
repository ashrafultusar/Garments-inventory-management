"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function CreateCalender() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", location: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/calender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to create calender");

      toast.success("Calender created successfully!");
      router.push("/dashboard/calender");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-16 md:mt-20 lg:mt-8 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Create Calender</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Calender Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />


<div className="flex justify-between">
<button  className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-3 rounded  transition duration-200 cursor-pointer" onClick={()=>router.back()}>Cancel</button>

        <button
          type="submit"
          className="cursor-pointer px-6  bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Create
        </button>
        </div>
      </form>
    </div>
  );
}
