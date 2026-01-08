"use client";

import React, { useEffect, useState } from "react";
import { FaRegEdit, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";

const CompletedBatch = ({ orderId, clientName = "J.M Fabrics" }) => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({
    price: "",
    total: "",
  });

  // Fetch summaries
  useEffect(() => {
    if (!orderId) return;

    const loadSummaries = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/batch/completed/billing-summary/${orderId}`
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to load summaries");
        setSummaries(data);
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Failed to load billing summaries");
      } finally {
        setLoading(false);
      }
    };

    loadSummaries();
  }, [orderId]);

  // Start edit
  const handleEdit = (item) => {
    setEditingId(item._id);
    setEditValues({
      price: item.price,
      total: item.total,
    });
  };

  // Save edit
  const handleSave = async (id) => {
    try {
      const res = await fetch(`/api/batch/completed/update-billing/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editValues),
      });

      if (!res.ok) throw new Error();

      // Update UI
      setSummaries((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, ...editValues } : item
        )
      );

      setEditingId(null);
      toast.success("Billing updated successfully");
    } catch {
      toast.error("Failed to update billing");
    }
  };

  // Create bill (dummy)
  const handleCreateBill = (item) => {
    console.log("Creating bill for:", item);
    toast.success(`Creating bill for ${item.batchName}`);
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <h1 className="text-3xl font-normal mb-4 text-black">
          Client (Name ex: {clientName}) Billing:
        </h1>

        {/* Select all */}
        <div className="flex items-center gap-2 mb-6">
          <input
            type="checkbox"
            className="w-5 h-5 border-gray-400"
            id="selectAll"
          />
          <label htmlFor="selectAll" className="text-sm">
            Select all batch
          </label>
        </div>

        {/* Loading */}
        {loading && <p className="text-center">Loading summaries...</p>}

        {/* No data */}
        {!loading && summaries.length === 0 && (
          <p className="text-gray-500 text-center">
            No billing summaries found.
          </p>
        )}

        {/* Row list */}
        {!loading && summaries.length > 0 && (
          <div className="overflow-x-auto max-w-full">
            <div className="space-y-4 min-w-[1100px] w-max">
              {summaries.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 bg-[#f9f3d1] p-3 rounded border border-gray-300 whitespace-nowrap flex-shrink-0"
                >
                  {/* Batch Details */}
                  <div className="flex-1 bg-[#b0b4b8] p-3 rounded-2xl border border-gray-600 min-h-[60px] flex items-center">
                    <p className="text-sm font-medium">
                      {item?.batchName || "N/A"} +{" "}
                      {item?.summaryType || "Cloth Type"} +{" "}
                      {item?.dyeingColor || "Dyeing"} +{" "}
                      {item?.finishingType || "finishingType"}
                    </p>
                  </div>

                  {/* Goj Total */}
                  <div className="w-20 bg-[#b0b4b8] p-2 rounded-xl border border-gray-600 text-center flex flex-col justify-center min-h-[60px]">
                    <span className="text-xs">গজ</span>
                    <span className="font-bold text-sm">{item?.totalQty}</span>
                  </div>

                  {/* Multiply */}
                  <div className="text-red-600 text-4xl font-bold">×</div>

                  {/* Price */}
                  <div className="w-20 bg-[#b0b4b8] p-2 rounded-xl border border-gray-600 text-center flex flex-col justify-center min-h-[60px]">
                    <span className="text-xs">Price</span>
                    {editingId === item._id ? (
                      <input
                        type="number"
                        value={editValues.price}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            price: e.target.value,
                          })
                        }
                        className="w-full text-sm text-center rounded"
                      />
                    ) : (
                      <span className="font-bold text-sm">{item.price}</span>
                    )}
                  </div>

                  {/* Equal */}
                  <div className="space-y-1">
                    <div className="w-6 h-1 bg-red-600"></div>
                    <div className="w-6 h-1 bg-red-600"></div>
                  </div>

                  {/* Total */}
                  <div className="w-20 bg-[#b0b4b8] p-2 rounded-2xl border border-gray-600 text-center flex flex-col justify-center min-h-[60px]">
                    <span className="text-xs">Total</span>
                    {editingId === item._id ? (
                      <input
                        type="number"
                        value={editValues.total}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            total: e.target.value,
                          })
                        }
                        className="w-full text-sm text-center rounded"
                      />
                    ) : (
                      <span className="font-bold text-sm">{item.total}</span>
                    )}
                  </div>

                  {/* Action */}
                  {editingId === item._id ? (
                    <button
                      onClick={() => handleSave(item._id)}
                      className="bg-[#8cc48c] px-4 py-2 rounded-2xl border border-gray-600 h-[60px] w-24 flex items-center justify-center"
                    >
                      <FaSave />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-[#8cc48c] hover:bg-[#7ab37a] px-4 py-2 rounded-2xl border border-gray-600 h-[60px] w-24 flex items-center justify-center"
                    >
                      <FaRegEdit />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedBatch;
