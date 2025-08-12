"use client";

import React, { useState } from "react";
import { toast } from "react-toastify"; 

const Page = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    date: "",
    invoiceNumber: "", // Added Invoice Number
    companyName: "", // Changed from customerName to companyName
    clotheType: "",
    finishingWidth: "",
    quality: "",
    sillName: "",
    colour: "",
    finishingType: "",
    totalGoj: "",
    totalBundle: "",
    dyeingName: "",
    transporterName: "",
  });

  // Handles changes to form input fields and updates the state
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      // Send form data to the API endpoint
      const res = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Convert formData object to JSON string
      });

      // Check if the response was successful
      if (res.ok) {
        const data = await res.json(); // Parse JSON response
        toast.success("Order created successfully!"); // Show success notification
        // Reset form fields after successful submission
        setFormData({
          date: "",
          invoiceNumber: "",
          companyName: "",
          clotheType: "",
          finishingWidth: "",
          quality: "",
          sillName: "",
          colour: "",
          finishingType: "",
          totalGoj: "",
          totalBundle: "",
          dyeingName: "",
          transporterName: "",
        });
      } else {
        toast.error("Failed to save order"); // Show error notification for failed save
      }
    } catch (error) {
      toast.error("Something went wrong"); // Show generic error notification for network issues
      console.error("Error:", error); // Log the error to console for debugging
    }
  };

  return (
    <section className="max-w-4xl mx-auto p-8 bg-white border border-gray-200 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
        📝 Order Form
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
          {/* Dynamically render input fields based on an array */}
          {[
            ["date", "Date", "date"],
            ["invoiceNumber", "Invoice Number", "text"], // New Invoice Number field
            ["companyName", "Company Name", "text"], // Updated label for customerName
            ["finishingWidth", "Finishing প্রস্থ (inch)", "number"],
            ["quality", "Quality", "number"],
            ["sillName", "Sill Name", "text"],
            ["colour", "Colour", "text"],
            ["totalGoj", "Total Goj", "number"],
            ["totalBundle", "Total Bundle", "number"],
            ["dyeingName", "Dyeing Name", "text"],
            ["transporterName", "Transporter Name", "text"],
          ].map(([id, label, type]) => (
            <div key={id} className="flex flex-col">
              <label htmlFor={id} className="mb-1 font-medium text-sm">
                {label}
              </label>
              <input
                id={id}
                type={type}
                required
                value={formData[id]}
                onChange={handleChange}
                className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ))}

          {/* Separate select input for Clothe Type */}
          <div className="flex flex-col">
            <label htmlFor="clotheType" className="mb-1 font-medium text-sm">
              Clothe Type
            </label>
            <select
              id="clotheType"
              value={formData.clotheType}
              required
              onChange={handleChange}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Type</option>
              <option value="Cotton">Cotton</option>
              <option value="Polyester">Polyester</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>

          {/* Separate select input for Finishing Type */}
          <div className="flex flex-col">
            <label htmlFor="finishingType" className="mb-1 font-medium text-sm">
              Finishing Type
            </label>
            <select
              id="finishingType"
              value={formData.finishingType}
              onChange={handleChange}
              required
              className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Finishing</option>
              <option value="Soft">Soft</option>
              <option value="Hard">Hard</option>
              <option value="Normal">Normal</option>
            </select>
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition duration-200 cursor-pointer"
          >
            Submit Order
          </button>
        </div>
      </form>
    </section>
  );
};

export default Page;
