"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function BatchList({ orderId }) {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/batch/${orderId}`);
        const data = await res.json();

        if (res.ok) {
          setBatches(data.batches || []);
        } else {
          toast.error(data.error || "Failed to load batches");
        }
      } catch (err) {
        console.error(err);
        toast.error("Server error while fetching batches");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchBatches();
  }, [orderId]);
console.log(batches);
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">All Batches</h3>

      {loading ? (
        <p className="text-gray-500">Loading batches...</p>
      ) : batches.length === 0 ? (
        <p className="text-gray-500">No batches found for this order.</p>
      ) : (
        <div className="space-y-4">
          {batches.map((batch, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              {/* ✅ Batch Info */}
              <h4 className="font-medium text-gray-700">
                {batch.batchName || `Batch ${idx + 1}`}
              </h4>

              {/* ✅ Rows Table */}
              {batch.rows && batch.rows.length > 0 ? (
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-sm border border-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-3 py-2 border">Roll No</th>
                        <th className="px-3 py-2 border">Goj</th>
                        <th className="px-3 py-2 border">Index</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batch.rows.map((row, i) => (
                        <tr key={i} className="text-center">
                          <td className="px-3 py-2 border">{row.rollNo}</td>
                          <td className="px-3 py-2 border">{row.goj}</td>
                          <td className="px-3 py-2 border">{row.idx}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-2">
                  No rows available for this batch.
                </p>
              )}

              {/* ✅ Processes */}
              <div className="mt-3">
                <p className="text-sm font-medium">Processes:</p>
                {batch.selectedProcesses?.length > 0 ? (
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    {batch.selectedProcesses.map((proc, i) => (
                      <li key={i}>
                        {proc.name} – ${proc.price}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No processes selected</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
