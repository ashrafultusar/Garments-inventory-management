"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";

const EditCustomerPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [formData, setFormData] = useState({
    companyName: "",
    ownerName: "",
    address: "",
    phoneNumber: "",
    employeeList: "",
    searchText: "",
  });

  // fetch existing customer
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await fetch(`/api/customers/${id}`);
        if (!res.ok) throw new Error("Failed to fetch customer");

        const data = await res.json();
        setFormData({
          companyName: data.companyName,
          ownerName: data.ownerName,
          address: data.address,
          phoneNumber: data.phoneNumber,
          employeeList: data.employeeList?.join(", "),
          searchText: data.searchText || "",
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load customer data");
      }
    };

    if (id) fetchCustomer();
  }, [id]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/customers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update customer");

      toast.success("Customer updated!");
      router.push("/dashboard/customer");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="py-6 mt-10 md:-mt-4 space-y-8">
      <section className="bg-white p-6 rounded-2xl shadow-md max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">✏ Edit Customer</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            ["companyName", "Company Name", "text"],
            ["ownerName", "Owner Name", "text"],
            ["address", "Address", "text"],
            ["phoneNumber", "Phone Number", "tel"],
            ["searchText", "Search Text", "text"],
          ].map(([id, label, type]) => (
            <div key={id} className="flex flex-col">
              <label htmlFor={id} className="mb-1 font-medium">{label}</label>
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

          <div className="flex flex-col">
            <label htmlFor="employeeList" className="mb-1 font-medium">Employee List</label>
            <textarea
              id="employeeList"
              value={formData.employeeList}
              onChange={handleChange}
              placeholder="Enter employee names separated by commas"
              className="rounded-lg border border-gray-300 px-4 py-2 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer font-medium"
            >
              Update Customer
            </button>

            <button
              type="button"
              onClick={() => router.push("/dashboard/customer")}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg font-medium cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default EditCustomerPage;
