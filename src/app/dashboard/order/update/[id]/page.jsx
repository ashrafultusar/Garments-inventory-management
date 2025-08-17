"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function UpdateOrderPage() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
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

  const [loading, setLoading] = useState(true);

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/order/${id}`);
        if (!res.ok) throw new Error("Failed to fetch order");
        const data = await res.json();

        setFormData({
          date: data.date ? data.date.split("T")[0] : "", // ✅ fix for date input
          invoiceNumber: data.invoiceNumber || "",
          companyName: data.companyName || "",
          clotheType: data.clotheType || "",
          finishingWidth: data.finishingWidth || "",
          quality: data.quality || "",
          sillName: data.sillName || "",
          colour: data.colour || "",
          finishingType: data.finishingType || "",
          totalGoj: data.totalGoj || "",
          totalBundle: data.totalBundle || "",
          dyeingName: data.dyeingName || "",
          transporterName: data.transporterName || "",
        });
      } catch (err) {
        console.error(err);
        toast.error("Error loading order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/order/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Order updated successfully!");
        router.push("/dashboard/order");
      } else {
        toast.error("Failed to update order");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Something went wrong");
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <section className="max-w-4xl mx-auto p-8 bg-white border border-gray-200 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
        ✏ Edit Order
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
          {[
            ["date", "Date", "date"],
            ["invoiceNumber", "Invoice Number", "text"],
            ["companyName", "Company Name", "text"],
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
                value={formData[id]}
                onChange={handleChange}
                required
                className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ))}

          <div className="flex flex-col">
            <label htmlFor="clotheType" className="mb-1 font-medium text-sm">
              Clothe Type
            </label>
            <select
              id="clotheType"
              value={formData.clotheType}
              onChange={handleChange}
              required
              className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Type</option>
              <option value="Cotton">Cotton</option>
              <option value="Polyester">Polyester</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>

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

        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition duration-200 cursor-pointer"
          >
            Update Order
          </button>
        </div>
      </form>
    </section>
  );
}
