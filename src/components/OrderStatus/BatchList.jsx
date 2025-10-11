"use client";
import { Delete, Edit, Plus } from "lucide-react";
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

  const handleInputChange = (batchIndex, rowIndex, value) => {
    const updated = [...batches];
    updated[batchIndex].rows[rowIndex].idx = value;
    setBatches(updated);
  };

  const handleNoteChange = (batchIndex, value) => {
    const updated = [...batches];
    updated[batchIndex].note = value;
    setBatches(updated);
  };

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
        toast.success("Batch updated successfully!");
        setBatches(data.batches);
      } else {
        toast.error(data.message || "Save failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while saving");
    }
  };

  const handleDelete = async (batchIndex) => {
    if (!confirm("Are you sure you want to delete this batch?")) return;

    try {
      const res = await fetch(`/api/batch/${batches[batchIndex]._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Batch deleted!");
        setBatches(data.batches || []);
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while deleting batch");
    }
  };

  // Add a new extra input for a row
  const addExtraInput = (batchIndex, rowIndex) => {
    const updated = [...batches];
    if (!updated[batchIndex].rows[rowIndex].extraInputs) {
      updated[batchIndex].rows[rowIndex].extraInputs = [];
    }
    updated[batchIndex].rows[rowIndex].extraInputs.push("");
    setBatches(updated);
  };

  // Handle change for dynamic extra inputs
  const handleExtraInputChange = (batchIndex, rowIndex, inputIndex, value) => {
    const updated = [...batches];
    updated[batchIndex].rows[rowIndex].extraInputs[inputIndex] = value;
    setBatches(updated);
  };

  const handleDelivered = async (batchIndex) => {
    const batch = batches[batchIndex];
    if (batch.status === "delivered") return;
  
    try {
      const updatedBatch = { ...batch, status: "delivered" };
  
      const res = await fetch(`/api/batch`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          batchIndex,
          batchData: updatedBatch,
        }),
      });
  
      const data = await res.json();
      if (res.ok) {
        toast.success(`Batch "${updatedBatch.batchName}" marked as delivered!`);
        setBatches(data.batches);
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while updating status");
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
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-700">
                  {batch.batchName || `Batch ${bIdx + 1}`}
                </h4>
                <div>
                 
                  <button onClick={() => handleDelete(bIdx)}>
                    <Delete className="text-sm text-red-600" />
                  </button>
                  <button
                    onClick={() => handleDelivered(bIdx)}
                    className={`px-2 py-1 border rounded text-green-600 text-sm ${
                      batch.status === "delivered"
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-green-100"
                    }`}
                    disabled={batch.status === "delivered"}
                  >
                    Delivered
                  </button>
                </div>
              </div>

              {/* Note Section */}
              <div className="mb-3">
                <label className="block text-sm text-gray-600 mb-1">
                  Note:
                </label>
                <textarea
                  className="w-full border rounded p-2 text-sm"
                  value={batch.note || ""}
                  onChange={(e) => handleNoteChange(bIdx, e.target.value)}
                  placeholder="Add your note here..."
                />
              </div>

              {batch?.rows && batch.rows.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-3 py-2 border">Roll No</th>
                        <th className="px-3 py-2 border">Goj</th>
                        <th className="px-3 py-2 border">Index</th>
                        <th className="px-3 py-2 border">Extra Input(s)</th>
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
                              className="w-24 border rounded px-2 py-1 text-center"
                              value={row.idx || ""}
                              onChange={(e) =>
                                handleInputChange(bIdx, rIdx, e.target.value)
                              }
                            />
                          </td>
                          <td className="px-3 py-2 border">
                            <div className="space-y-1">
                              {/* Existing extra inputs */}
                              {row.extraInputs?.map((input, idx) => (
                                <input
                                  key={idx}
                                  type="text"
                                  className="w-full border rounded px-2 py-1 text-center"
                                  value={input}
                                  placeholder="Optional"
                                  onChange={(e) =>
                                    handleExtraInputChange(
                                      bIdx,
                                      rIdx,
                                      idx,
                                      e.target.value
                                    )
                                  }
                                />
                              ))}
                              {/* + button */}
                              <button
                                type="button"
                                onClick={() => addExtraInput(bIdx, rIdx)}
                                className="flex items-center px-2 py-1 border rounded text-blue-500 hover:bg-blue-100 text-sm"
                              >
                                <Plus className="mr-1 w-4 h-4" />
                                Add
                              </button>
                            </div>
                          </td>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
