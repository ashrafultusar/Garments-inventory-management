"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";

export default function BatchEditPage() {
  const { batchId } = useParams();
  const router = useRouter();
  const [batch, setBatch] = useState(null);
  const [parentId, setParentId] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch batch data
  useEffect(() => {
    const fetchBatch = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/batch/allbatch/${batchId}`);
        const data = await res.json();
        if (res.ok) {
          setBatch(data.embeddedBatch);
          setParentId(data.parentBatchDocId);
        } else {
          toast.error(data.error || "Batch Note found");
        }
      } catch (error) {
        toast.error("Server error");
      } finally {
        setLoading(false);
      }
    };
    if (batchId) fetchBatch();
  }, [batchId]);

  // 🔹 Update a specific row’s field
  const handleRowChange = (index, field, value) => {
    const updatedRows = [...batch.rows];
    updatedRows[index][field] = value;
    setBatch({ ...batch, rows: updatedRows });
  };

  // 🔹 Save batch
  const handleSave = async () => {
    try {
      const res = await fetch(`/api/batch/calenderbatch/edit/${batchId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(batch),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Batch Update Successfully!");
        router.back();
      } else {
        toast.error(data.error || "Update Faield");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  if (loading) return <p>loading...</p>
  if (!batch) return <p>Batch Note Found</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white border border-gray-200 shadow-md rounded-xl p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {batch.batchName} ✏️
        </h2>
        <span className="bg-green-200 text-green-700 px-3 py-1 rounded text-sm">
          {batch.status}
        </span>
      </div>

      {/* Table */}
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-300 rounded">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border px-3 py-2">Roll No</th>
              <th className="border px-3 py-2">Goj</th>
              <th className="border px-3 py-2">Index</th>
              <th className="border px-3 py-2">Extras</th>
            </tr>
          </thead>
          <tbody>
            {batch.rows.map((row, i) => (
              <tr key={i} className="text-center">
                <td className="border px-3 py-2">{row.rollNo}</td>

                {/* 🔹 Goj read-only */}
                <td className="border px-3 py-2">
                  <input
                    type="number"
                    className="w-20 border rounded px-1 py-0.5 text-center bg-gray-100 text-gray-500 cursor-not-allowed"
                    value={row.goj}
                    readOnly
                  />
                </td>

                {/* 🔹 Index editable */}
                <td className="border px-3 py-2">
                  <input
                    type="number"
                    className="w-20 border rounded px-1 py-0.5 text-center"
                    value={row.idx?.[0] || ""}
                    onChange={(e) =>
                      handleRowChange(i, "idx", [Number(e.target.value)])
                    }
                  />
                </td>

                {/* 🔹 Extras editable */}
                <td className="border px-3 py-2">
                  <input
                    type="text"
                    className="w-24 border rounded px-1 py-0.5 text-center"
                    value={row.extraInputs?.join(", ") || ""}
                    onChange={(e) =>
                      handleRowChange(
                        i,
                        "extraInputs",
                        e.target.value
                          ? e.target.value.split(",").map((v) => v.trim())
                          : []
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info Table */}
      <table className="w-full text-sm mt-5 border border-gray-300 rounded">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="border px-3 py-2 text-left">Field</th>
            <th className="border px-3 py-2 text-left">Value</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["CALENDAR", batch.calender],
            ["COLOUR", batch.colour],
            ["DYEING", batch.dyeing],
            ["FINISHING TYPE", batch.finishingType],
            ["SILL NAME", batch.sillName],
          ]
            .filter(([_, v]) => v)
            .map(([label, value], idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-gray-50" : ""}
              >
                <td className="border px-3 py-2 font-medium uppercase">
                  {label}
                </td>
                <td className="border px-3 py-2">{value}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <p className="pt-3 text-gray-600 text-sm">
        Note: {batch.note?.trim() || "Not Assigned"}
      </p>

      <div className="mt-5 flex justify-between">
       <Link href="/dashboard/order"> <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer">Go Back</button></Link>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
