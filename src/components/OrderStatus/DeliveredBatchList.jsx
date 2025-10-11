"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function DeliveredBatchCard({ orderId }) {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDeliveredBatches = async () => {
      if (!orderId) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/batch/${orderId}`);
        const data = await res.json();

        if (res.ok) {
          const delivered = (data.batches || []).filter(
            (batch) => batch.status === "delivered"
          );
          setBatches(delivered);
        } else {
          toast.error(data.error || "Failed to load delivered batches");
        }
      } catch (err) {
        console.error(err);
        toast.error("Server error while fetching delivered batches");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveredBatches();
  }, [orderId]);

  if (loading)
    return <p className="text-gray-500 mt-4">Loading delivered batches...</p>;

  if (!batches.length)
    return <p className="text-gray-500 mt-4">No delivered batches found.</p>;

  return (
    <div className="space-y-4 mt-6">
      {batches.map((batch, bIdx) => (
        <div
          key={batch._id || bIdx}
          className="border rounded-lg p-4 shadow-sm bg-green-50"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-700">{batch.batchName}</h4>
            <span className="text-green-700 bg-green-200 px-2 py-1 rounded text-sm font-semibold">
              Delivered
            </span>
          </div>

          {/* Note */}
          <div className="mb-3">
            <label className="block text-sm text-gray-600 mb-1">Note:</label>
            <div className="w-full border rounded p-2 text-sm bg-white">
              {batch.note && batch.note !== "" ? batch.note : "—"}
            </div>
          </div>

          {/* Table */}
          {batch.rows && batch.rows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table-fixed w-full border border-gray-300 text-sm">
                <thead className="bg-green-100">
                  <tr>
                    <th className="w-1/4 p-2 border">Roll No</th>
                    <th className="w-1/4 p-2 border">Goj</th>
                    <th className="w-1/4 p-2 border">Index</th>
                    <th className="w-1/4 p-2 border">Extra Input(s)</th>
                  </tr>
                </thead>
                <tbody>
                  {batch.rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="text-center border-b border-gray-200"
                    >
                      <td className="p-2">{row.rollNo}</td>
                      <td className="p-2">{row.goj}</td>
                      <td className="p-2">{row.idx || "—"}</td>
                      <td className="p-2">
                        {row.extraInputs && row.extraInputs.length > 0
                          ? row.extraInputs.join(", ")
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-2">No rows available.</p>
          )}
        </div>
      ))}
    </div>
  );
}
