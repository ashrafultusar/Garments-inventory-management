"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function CalenderPage() {
  const [calenders, setCalenders] = useState([]);

  const fetchCalenders = async () => {
    try {
      const res = await fetch("/api/calender");
      if (!res.ok) throw new Error("Failed to fetch calenders");
      const data = await res.json();
      setCalenders(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load calenders");
    }
  };

  useEffect(() => {
    fetchCalenders();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this calender?")) return;
    try {
      const res = await fetch(`/api/calender/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete calender");
      toast.success("Calender deleted!");
      fetchCalenders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete calender");
    }
  };

  return (
    <div className="py-6 mt-10 md:-mt-4 space-y-8">
      {/* Create Button */}
      <div className="flex justify-end">
        <Link
          href="/dashboard/calender/createCalender"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition duration-200"
        >
          + Create Calender
        </Link>
      </div>

      {/* Table */}
      <section className="bg-white p-6 rounded-2xl shadow-md overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">Calenders</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">#</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Location</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {calenders?.map((c, index) => (
              <tr key={c._id}>
                <td className="px-4 py-2 text-sm">{index + 1}</td>
                <td className="px-4 py-2 text-sm">{c.name}</td>
                <td className="px-4 py-2 text-sm">{c.location}</td>
                <td className="px-4 py-2 text-sm flex gap-2">
                  <Link
                    href={`/dashboard/calender/edit/${c._id}`}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {calenders.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No calenders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
