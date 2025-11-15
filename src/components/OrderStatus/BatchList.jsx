"use client";
import { Delete, Edit, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

export default function BatchList({ orderId }) {
  const router = useRouter();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const storageKey = `batches-${orderId}`;

  useEffect(() => {
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (Array.isArray(parsed)) {
          setBatches(parsed);
        }
      } catch (e) {
        console.error("Error parsing localStorage data", e);
      }
    }
  }, [orderId]);

  useEffect(() => {
    if (batches.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(batches));
    } else {
      localStorage.removeItem(storageKey);
    }
  }, [batches, storageKey]);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/batch/${orderId}`);
        const data = await res.json();

        if (res.ok) {
          const pendingBatches = (data.batches || []).filter(
            (batch) => batch.status === "pending"
          );

          const savedData = localStorage.getItem(storageKey);
          if (savedData) {
            try {
              const parsed = JSON.parse(savedData);
              if (Array.isArray(parsed)) {
                setBatches(parsed);
              } else {
                setBatches(pendingBatches);
              }
            } catch {
              setBatches(pendingBatches);
            }
          } else {
            setBatches(pendingBatches);
          }
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
  }, [orderId, storageKey]);

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

  const addExtraInput = (batchIndex, rowIndex) => {
    const updated = [...batches];
    if (!updated[batchIndex].rows[rowIndex].extraInputs) {
      updated[batchIndex].rows[rowIndex].extraInputs = [];
    }
    updated[batchIndex].rows[rowIndex].extraInputs.push("");
    setBatches(updated);
  };

  const handleExtraInputChange = (batchIndex, rowIndex, inputIndex, value) => {
    const updated = [...batches];
    updated[batchIndex].rows[rowIndex].extraInputs[inputIndex] = value;
    setBatches(updated);
  };

  const handleStatusChange = async (batchIndex, newStatus) => {
    const batch = batches[batchIndex];
    if (!batch) return;

    const updatedBatch = {
      ...batch,
      status: newStatus,
      note: batch.note || "",
      rows: batch.rows.map((row) => ({
        ...row,
        extraInputs: row.extraInputs || [],
      })),
    };

    try {
      const res = await fetch(`/api/batch`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          batchId: batch._id,
          batchData: updatedBatch,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          `Batch "${updatedBatch.batchName}" status updated to "${newStatus}"!`
        );
        setBatches((prev) => {
          const filtered = prev.filter((b) => b._id !== batch._id);
          localStorage.setItem(storageKey, JSON.stringify(filtered));
          return filtered;
        });
      } else {
        toast.error(data.message || "Failed to update batch");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error while updating batch");
    }
  };

  const handleDelete = async (batchIndex) => {
    if (!confirm("Are you sure you want to delete this batch?")) return;

    try {
      const batchId = batches[batchIndex]._id;
      const res = await fetch(`/api/batch/${orderId}?batchId=${batchId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Batch deleted successfully!");
        const filtered = (data.batches || []).filter(
          (batch) => batch.status === "pending"
        );
        setBatches(filtered);
        localStorage.setItem(storageKey, JSON.stringify(filtered));
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while deleting batch");
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Pending Batches
      </h3>

      {loading ? (
        <p className="text-gray-500">Loading batches...</p>
      ) : batches.length === 0 ? (
        <p className="text-gray-500">
          No pending batches found for this order.
        </p>
      ) : (
        <div className="space-y-6">
          {batches?.map((batch, bIdx) => {
            const hasCalender = batch.selectedProcesses?.some(
              (p) =>
                (typeof p === "string" && p.toLowerCase() === "calender") ||
                (p?.name?.toLowerCase && p.name.toLowerCase() === "calender")
            );

            const buttonLabel = hasCalender ? "Calender" : "Delivered";
            const newStatus = hasCalender ? "calender" : "delivered";

            return (
              <div
                key={bIdx}
                className="border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700">
                    {batch?.batchName || `Batch ${bIdx + 1}`}
                  </h4>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleStatusChange(bIdx, newStatus)}
                      className={`px-2 py-1 border rounded text-sm cursor-pointer ${
                        hasCalender
                          ? "text-blue-600 bg-blue-100"
                          : "text-green-600 bg-green-100"
                      }`}
                    >
                      {buttonLabel}
                    </button>
                    <button onClick={() => handleDelete(bIdx)}>
                      <Delete className="text-sm cursor-pointer text-red-600" />
                    </button>
                    <button
                      onClick={() =>
                        router.push(`/dashboard/allbatch/${batch._id}`)
                      }
                    >
                      <Edit className="cursor-pointer text-green-400" />
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

                {batch?.rows?.length > 0 ? (
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
                        {batch?.rows?.map((row, rIdx) => (
                          <tr key={rIdx} className="text-center">
                            <td className="px-3 py-2 border">{row?.rollNo}</td>
                            <td className="px-3 py-2 border">{row?.goj}</td>
                            <td className="px-3 py-2 border">
                              <input
                                type="number"
                                className="w-24 border rounded px-2 py-1 text-center"
                               
                                onChange={(e) =>
                                  handleInputChange(bIdx, rIdx, e.target.value)
                                }
                              />
                            </td>
                            <td className="px-3 py-2 border">
                              <div className="space-y-1">
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

                      {batch?.rows?.length > 0 && (
                        <tfoot>
                          <tr className="text-center font-semibold bg-gray-50">
                            <td className="px-3 py-2 border">
                              {batch?.rows?.length}
                            </td>
                            <td className="px-3 py-2 border">
                              {batch.rows.reduce(
                                (sum, row) => sum + (Number(row.goj) || 0),
                                0
                              )}
                            </td>
                            <td className="px-3 py-2 border">
                              {batch?.rows?.reduce(
                                (sum, row) => sum + (Number(row.idx) || 0),
                                0
                              )}
                            </td>
                            <td className="px-3 py-2 border">
                              {batch?.rows?.reduce(
                                (sum, row) =>
                                  sum + (row.extraInputs?.length || 0),
                                0
                              )}
                            </td>
                          </tr>
                        </tfoot>
                      )}
                    </table>

                    {/* ✅ COLLAPSIBLE SECTION BELOW */}
                    <button
                      onClick={() =>
                        setExpandedIndex(expandedIndex === bIdx ? null : bIdx)
                      }
                      className="flex items-center justify-between w-full px-3 py-2 mt-3 bg-gray-100 border rounded text-sm text-gray-700 cursor-pointer"
                    >
                      <span className="cursor-pointer">Show Batch Details</span>
                      {expandedIndex === bIdx ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    <AnimatePresence>
                      {expandedIndex === bIdx && (
                        <motion.div
                          key="collapse-content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="overflow-x-auto my-3">
                            <table className="w-full text-sm border border-gray-200">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-3 py-2 border text-left w-1/3">
                                    Field
                                  </th>
                                  <th className="px-3 py-2 border text-left">
                                    Value
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="px-3 py-2 border font-medium">
                                    COLOUR
                                  </td>
                                  <td className="px-3 py-2 border">
                                    {batch.colour || "—"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2 border font-medium">
                                    DYEING
                                  </td>
                                  <td className="px-3 py-2 border">
                                    {batch.dyeing || "—"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2 border font-medium">
                                    FINISHING TYPE
                                  </td>
                                  <td className="px-3 py-2 border">
                                    {batch.finishingType || "—"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2 border font-medium">
                                    SILL NAME
                                  </td>
                                  <td className="px-3 py-2 border">
                                    {batch.sillName || "—"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2 border font-medium">
                                    PROCESS LIST
                                  </td>
                                  <td className="px-3 py-2 border">
                                    {batch.selectedProcesses?.length > 0
                                      ? batch.selectedProcesses
                                          .map((p) => p.name)
                                          .join(", ")
                                      : "—"}
                                  </td>
                                </tr>
                                {batch.calender && (
                                  <tr>
                                    <td className="px-3 py-2 border font-medium">
                                      CALENDER
                                    </td>
                                    <td className="px-3 py-2 border">
                                      {batch.calender}
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                 
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-2">
                    No rows available for this batch.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
