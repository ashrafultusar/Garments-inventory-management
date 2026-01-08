"use client";

import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { toast } from "react-toastify";

const CompletedBatch = ({ orderId, clientName = "J.M Fabrics" }) => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch completed batch billing summary
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
console.log(summaries);
  const handleCreateBill = (item) => {
    console.log("Creating bill for:", item);
    toast.success(`Creating bill for ${item.batchName}`);
  };

  return (
    <div className="p-6 min-h-screen bg-[#faf7e6]">
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

        {loading && <p className="text-center">Loading summaries...</p>}

        {!loading && summaries.length === 0 && (
          <p className="text-gray-500 text-center">
            No billing summaries found.
          </p>
        )}

        {/* Row list with horizontal scroll */}
        {!loading && summaries.length > 0 && (
          <div className="overflow-x-auto">
            <div className="space-y-4 min-w-[1100px]">
              {summaries.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 bg-[#f9f3d1] p-3 rounded border border-gray-300 whitespace-nowrap"
                >
                  {/* Batch Details */}
                  <div className="flex-1 bg-[#b0b4b8] p-3 rounded-2xl border border-gray-600 min-h-[60px] flex items-center">
                    <p className="text-sm font-medium">
                      {item?.batchName || "N/A"} +{" "}
                      {item?.summaryType || "Cloth Type"} +
                      {item?.dyeingColor || "Dyeing"} +
                      {item?.finishingType || "finishingType"}
                    </p>
                  </div>

                  {/* Goj Total */}
                  <div className="w-20 bg-[#b0b4b8] p-2 rounded-xl border border-gray-600 text-center flex flex-col justify-center min-h-[60px]">
                    <span className="text-xs">গজ</span>
                    <span className="font-bold text-sm">total</span>
                  </div>

                  {/* Multiply */}
                  <div className="text-red-600 text-4xl font-bold">×</div>

                  {/* Price */}
                  <div className="w-20 bg-[#b0b4b8] p-2 rounded-2xl border border-gray-600 text-center flex items-center justify-center min-h-[60px]">
                    <span className="font-semibold">{item?.price}</span>
                  </div>

                  {/* Equal */}
                  <div className="space-y-1">
                    <div className="w-6 h-1 bg-red-600"></div>
                    <div className="w-6 h-1 bg-red-600"></div>
                  </div>

                  {/* Total Bill */}
                  <div className="w-20 bg-[#b0b4b8] p-2 rounded-2xl border border-gray-600 text-center flex flex-col justify-center min-h-[60px]">
                    <span className="text-xs">Total</span>
                    <span className="font-bold text-sm">{item?.total}</span>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => handleCreateBill(item)}
                    className="bg-[#8cc48c] hover:bg-[#7ab37a] px-4 py-2 rounded-2xl border border-gray-600 h-[60px] w-24 flex items-center justify-center"
                  >
                    <FaRegEdit />
                  </button>
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
