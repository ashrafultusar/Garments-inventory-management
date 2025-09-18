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

  // ✅ handle input change
  const handleInputChange = (batchIndex, rowIndex, value) => {
    const updated = [...batches];
    updated[batchIndex].rows[rowIndex].idx = value;
    setBatches(updated);
  };

  // ✅ save only one batch
  const handleSave = async (batchIndex) => {
    try {
      const res = await fetch(`/api/batch`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          batchIndex,
          batchData: batches[batchIndex],
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Batch indexes saved!");
        setBatches(data.batches);
      } else {
        toast.error(data.message || "Save failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while saving");
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">All Batches</h3>

      {loading ? (
        <p className="text-gray-500">Loading batches...</p>
      ) : batches.length === 0 ? (
        <p className="text-gray-500">No batches found for this order.</p>
      ) : (
        <div className="space-y-6">
          {batches.map((batch, bIdx) => (
            <div
              key={bIdx}
              className="border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <h4 className="font-medium text-gray-700 mb-3">
                {batch.batchName || `Batch ${bIdx + 1}`}
              </h4>

              {batch.rows && batch.rows.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-3 py-2 border">Roll No</th>
                          <th className="px-3 py-2 border">Goj</th>
                          <th className="px-3 py-2 border">Index</th>
                        </tr>
                      </thead>
                      <tbody>
                        {batch.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="text-center">
                            <td className="px-3 py-2 border">{row.rollNo}</td>
                            <td className="px-3 py-2 border">{row.goj}</td>
                            <td className="px-3 py-2 border">
                              <input
                                type="number"
                                value={row.idx || ""}
                                className="w-24 border rounded px-2 py-1 text-center"
                                onChange={(e) =>
                                  handleInputChange(bIdx, rIdx, e.target.value)
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* ✅ Save button for this batch */}
                  <button
                    onClick={() => handleSave(bIdx)}
                    className="mt-3 px-2 py-1 md:px-4  md:py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
                  >
                    Delivered
                  </button>
                </>
              ) : (
                <p className="text-sm text-gray-500 mt-2">
                  No rows available for this batch.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
