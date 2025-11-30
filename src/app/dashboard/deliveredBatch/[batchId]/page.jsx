"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function EditBatchPage({ params }) {
  const { batchId } = use(params);
  const router = useRouter();

  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBatch = async () => {
    try {
      const res = await fetch(`/api/batch/delivered/${batchId}`);
      const data = await res.json();

      if (res.ok) {
        setBatch(data.batch);
      } else toast.error(data.error);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load batch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatch();
  }, []);

  const updateRowField = (rowIndex, key, value) => {
    setBatch((prev) => {
      const newRows = [...prev.rows];
      newRows[rowIndex][key] = value;
      return { ...prev, rows: newRows };
    });
  };

  const addIndex = (rowIndex) => {
    const newIndex = prompt("Enter new index:");
    if (!newIndex) return;

    setBatch((prev) => {
      const newRows = [...prev.rows];
      newRows[rowIndex].idx.push(Number(newIndex));
      return { ...prev, rows: newRows };
    });
  };

  const removeIndex = (rowIndex, idxIndex) => {
    setBatch((prev) => {
      const newRows = [...prev.rows];
      newRows[rowIndex].idx.splice(idxIndex, 1);
      return { ...prev, rows: newRows };
    });
  };

  const addExtra = (rowIndex) => {
    const extra = prompt("Enter new extra input:");
    if (!extra) return;

    setBatch((prev) => {
      const newRows = [...prev.rows];
      newRows[rowIndex].extraInputs.push(extra);
      return { ...prev, rows: newRows };
    });
  };

  const removeExtra = (rowIndex, extraIndex) => {
    setBatch((prev) => {
      const newRows = [...prev.rows];
      newRows[rowIndex].extraInputs.splice(extraIndex, 1);
      return { ...prev, rows: newRows };
    });
  };

  const saveChanges = async () => {
    try {
      const res = await fetch(`/api/batch/delivered/${batchId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updatedRows: batch.rows }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Batch updated!");
        router.back();
      } else {
        toast.error(data.error);
      }
    } catch (e) {
      console.error(e);
      toast.error("Update failed");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  if (!batch) return <p className="p-6 text-red-500">Batch not found.</p>;

  return (
    <div className="mt-6 p-6 max-w-4xl mx-auto">
      <div
        className="mb-5 text-center
      "
      >
        <h2 className="text-xl font-semibold text-gray-800">
          Edit Batch: {batch.batchName}
        </h2>
      </div>

      <div className="border rounded-lg shadow-sm bg-white overflow-hidden">
        <div className="bg-gray-100 px-4 py-3 border-b">
          <h3 className="text-lg font-medium text-gray-700">
            Batch Rows ({batch.rows?.length})
          </h3>
        </div>

        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200">
              <thead className="bg-gray-100">
                <tr className="text-center">
                  <th className="px-3 py-2 border">Roll No</th>
                  <th className="px-3 py-2 border">Goj</th>
                  <th className="px-3 py-2 border">Index (Editable)</th>
                  <th className="px-3 py-2 border">Extras (Editable)</th>
                </tr>
              </thead>

              <tbody>
                {batch.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="text-center">
                    {/* ROLL NO */}
                    <td className="px-3 py-2 border">{row.rollNo}</td>

                    {/* GOJ */}
                    <td className="px-3 py-2 border">{row.goj}</td>

                    {/* INDEX FIELD */}
                    <td className="px-3 py-2 border">
                      <div className="flex flex-col gap-2 items-center">
                        {row.idx.map((value, idxIndex) => (
                          <input
                            key={idxIndex}
                            type="number"
                            value={value}
                            className="px-2 py-1 border rounded w-20 text-center"
                            onChange={(e) =>
                              updateRowField(
                                rIdx,
                                "idx",
                                row.idx.map((v, i) =>
                                  i === idxIndex ? Number(e.target.value) : v
                                )
                              )
                            }
                          />
                        ))}
                      </div>
                    </td>

                    {/* EXTRA INPUTS FIELD */}
                    <td className="px-3 py-2 border">
                      <div className="flex flex-col gap-2 items-center">
                        {row.extraInputs.map((ex, exIdx) => (
                          <input
                            key={exIdx}
                            type="text"
                            value={ex}
                            className="px-2 py-1 border rounded w-32 text-center"
                            onChange={(e) =>
                              updateRowField(
                                rIdx,
                                "extraInputs",
                                row.extraInputs.map((v, i) =>
                                  i === exIdx ? e.target.value : v
                                )
                              )
                            }
                          />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="pt-4 text-gray-700">
            <span className="font-medium">Note: </span>
            {batch.note?.trim() || "Not Assigned"}
          </p>
        </div>
      </div>
      <div className="flex justify-between items-center gap-5">
        <button
          onClick={saveChanges}
          className="mt-6 w-full cursor-pointer bg-red-500 text-white py-3 rounded-md text-lg hover:bg-red-600"
        >
        Cancel
        </button>
        <button
          onClick={saveChanges}
          className="mt-6 w-full cursor-pointer bg-green-500 text-white py-3 rounded-md text-lg hover:bg-green-600"
        >
          Save Changes
        </button>{" "}
      </div>
    </div>
  );
}
