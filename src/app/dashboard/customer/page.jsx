"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/customers");
      if (!res.ok) throw new Error("Failed to fetch customers");
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    try {
      const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete customer");
      toast.success("Customer deleted!");
      fetchCustomers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete customer");
    }
  };

  return (
    <div className="py-6 mt-10 md:-mt-4 space-y-8">
      {/* Create Button */}
      <div className="flex justify-end">
        <Link
          href="/dashboard/customer/createCustomer"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition duration-200"
        >
          + Create Customer
        </Link>
      </div>

      {/* Table Section */}
      <section className="bg-white p-6 rounded-2xl shadow-md overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">Customers</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">#</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Company</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Owner</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Phone</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Employees</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              /* Loading Spinner Row */
              <tr>
                <td colSpan={6} className="py-20">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-solid "></div>
                  </div>
                </td>
              </tr>
            ) : customers.length > 0 ? (
              customers.map((c, index) => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">{index + 1}</td>
                  <td className="px-4 py-2 text-sm font-medium text-gray-900">{c.companyName}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{c.ownerName}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{c.phoneNumber}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {c.employeeList?.join(", ") || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <div className="flex gap-2">
                      <Link
                        href={`/dashboard/customer/profile/${c?._id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                      >
                        View
                      </Link>
                      <Link
                        href={`/dashboard/customer/edit/${c._id}`}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              /* Empty State Row */
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-500">
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default CustomerPage;