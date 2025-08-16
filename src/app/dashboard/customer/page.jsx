"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const CustomerPage = () => {
  const initialForm = {
    companyName: "",
    ownerName: "",
    address: "",
    phoneNumber: "",
    employeeList: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [customers, setCustomers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customers");
      if (!res.ok) throw new Error("Failed to fetch customers");
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load customers");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/customers/${editingId}` : "/api/customers";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save customer");

      toast.success(editingId ? "Customer updated!" : "Customer added!");
      setFormData(initialForm);
      setEditingId(null);
      fetchCustomers();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const handleEdit = (customer) => {
    setFormData({
      companyName: customer.companyName,
      ownerName: customer.ownerName,
      address: customer.address,
      phoneNumber: customer.phoneNumber,
      employeeList: customer.employeeList.join(", "),
    });
    setEditingId(customer._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  const handleCancelEdit = () => {
    setFormData(initialForm);
    setEditingId(null);
  };

  return (
    <div className="py-6 mt-10 md:-mt-4 space-y-8">
      {/* Form */}
      <section className="bg-white p-6 rounded-2xl shadow-md max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">
          {editingId ? "✏ Edit Customer" : "🏢 Add Customer"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            ["companyName", "Company Name", "text"],
            ["ownerName", "Owner Name", "text"],
            ["address", "Address", "text"],
            ["phoneNumber", "Phone Number", "tel"],
          ].map(([id, label, type]) => (
            <div key={id} className="flex flex-col">
              <label htmlFor={id} className="mb-1 font-medium">
                {label}
              </label>
              <input
                id={id}
                type={type}
                value={formData[id]}
                onChange={handleChange}
                required
                className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ))}
          <div className="flex flex-col">
            <label htmlFor="employeeList" className="mb-1 font-medium">
              Employee List
            </label>
            <textarea
              id="employeeList"
              value={formData.employeeList}
              onChange={handleChange}
              placeholder="Enter employee names separated by commas"
              className="rounded-lg border border-gray-300 px-4 py-2 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition duration-200"
            >
              {editingId ? "Update Customer" : "Save Customer"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-400 hover:bg-gray-500 text-white font-medium px-6 py-3 rounded-lg transition duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Table */}
      <section className="bg-white p-6 rounded-2xl shadow-md overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">Customers</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                #
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Company
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Owner
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Phone
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
            {customers?.slice().map((c, index) => (
              <tr
                key={c._id}
                className={editingId === c._id ? "bg-yellow-50" : ""}
              >
                <td className="px-4 py-2 text-sm">{index + 1}</td>
                <td className="px-4 py-2 text-sm">{c.companyName}</td>
                <td className="px-4 py-2 text-sm">{c.ownerName}</td>
                <td className="px-4 py-2 text-sm">{c.phoneNumber}</td>
                <td className="px-4 py-2 text-sm">
                  {c.employeeList.join(", ") || "N/A"}
                </td>
                <td className="px-4 py-2 text-sm flex gap-2">
                  <button
                    onClick={() => handleEdit(c)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
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
