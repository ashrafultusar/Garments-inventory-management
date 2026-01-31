"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";

const DyeingPage = () => {
  const [dyeings, setDyeings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDyeings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dyeings");
      if (!res.ok) throw new Error("Failed to fetch dyeings");
      const data = await res.json();
      setDyeings(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dyeings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDyeings();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this dyeing?")) return;
    try {
      const res = await fetch(`/api/dyeings/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete dyeing");
      toast.success("Dyeing deleted!");
      fetchDyeings();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete dyeing");
    }
  };

  return (
    <div className="py-6 mt-10 md:-mt-4 space-y-8">
      {/* Create Button */}
      <div className="flex justify-end">
        <Link
          href="/dashboard/dyeing/createDyeing"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition duration-200"
        >
          + Create Dyeing
        </Link>
      </div>

      {/* Table Section */}
      <section className="bg-white p-6 rounded-2xl shadow-md overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">Dyeings</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                #
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Location
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Employees
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              /* Center Spinner */
              <tr>
                <td colSpan={5} className="py-20">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-solid"></div>
                  </div>
                </td>
              </tr>
            ) : dyeings?.length > 0 ? (
              dyeings?.map((d, index) => (
                <tr key={d._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">{index + 1}</td>
                  <td className="px-4 py-2 text-sm font-medium text-gray-900">
                    {d.name}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {d.location}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {d.employees?.map((e) => e.employeeName).join(", ") ||
                      "N/A"}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <div className="flex gap-2">
                      <Link
                        href={`/dashboard/dyeing/profile/${d._id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                      >
                        View
                      </Link>
                      <Link
                        href={`/dashboard/dyeing/edit/${d._id}`}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(d._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              /* No Data State */
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500">
                  No dyeings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default DyeingPage;
