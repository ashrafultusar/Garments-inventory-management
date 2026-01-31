"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const CreateCustomerPage = () => {
  const router = useRouter();

  const initialForm = {
    companyName: "",
    ownerName: "",
    address: "",
    phoneNumber: "",
    employeeList: "",
    searchText: "",
  };

  const [formData, setFormData] = useState(initialForm);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save customer");

      toast.success("Customer added successfully!");
      router.push("/dashboard/customer");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="py-6 mt-10 md:mt-14 lg:mt-4 space-y-8">
      <section className="bg-white p-6 rounded-2xl shadow-md max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">🏢 Add Customer</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            ["companyName", "Company Name", "text"],
            ["ownerName", "Owner Name", "text"],
            ["address", "Address", "text"],
            ["phoneNumber", "Phone Number", "tel"],
            ["searchText", "Search Text", "text"],
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
                className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          {/* Employee List */}
          <div className="flex flex-col">
            <label htmlFor="employeeList" className="mb-1 font-medium">
              Employee List
            </label>
            <textarea
              id="employeeList"
              value={formData.employeeList}
              onChange={handleChange}
              placeholder="Enter employee names separated by commas"
              className="rounded-lg border border-gray-300 px-4 py-2 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-between gap-2">
            {" "}
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-3 rounded-lg transition duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition duration-200 cursor-pointer"
            >
              Create Customer
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default CreateCustomerPage;
