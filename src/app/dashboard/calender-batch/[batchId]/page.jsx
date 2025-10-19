"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function EditCalendarBatchPage() {
  const { batchId } = useParams();
  const router = useRouter();
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        // ব্যাচ ID ব্যবহার করে ডেটা ফেচ করা হচ্ছে
        const res = await fetch(`/api/batch/calenderbatch/${batchId}`);
        const data = await res.json();

        if (res.ok) {
          setBatch(data.batch);
        } else {
          toast.error(data.error);
        }
      } catch (err) {
        console.error(err);
        toast.error("Server error while fetching batch");
      } finally {
        setLoading(false);
      }
    };

    if (batchId) fetchBatch();
  }, [batchId]);

  // শুধুমাত্র idx এবং extraInputs ফিল্ড আপডেট করার ফাংশন
  const handleChange = (e, rowIndex, field) => {
    if (!batch) return;
    const newRows = [...batch.rows];
    
    if (field === "extraInputs") {
      // কমা সেপারেটেড ভ্যালুগুলিকে অ্যারেতে কনভার্ট করা হচ্ছে
      newRows[rowIndex][field] = e.target.value.split(",").map((v) => v.trim());
    } else {
      newRows[rowIndex][field] = e.target.value;
    }
    setBatch({ ...batch, rows: newRows });
  };

  const handleSave = async () => {
    if (!batch) return;
    try {
      const res = await fetch(`/api/batch/calenderbatch/${batchId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        // শুধুমাত্র rows ডেটা আপডেট করার জন্য পাঠানো হচ্ছে
        body: JSON.stringify({ rows: batch.rows }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Batch updated successfully");
        router.back(); // সফল আপডেটের পর আগের পেইজে ফিরে যাওয়া
      } else {
        toast.error(data.error || "Failed to update batch");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while updating batch");
    }
  };

  if (loading) return <p className="p-6">Loading batch...</p>;
  if (!batch) return <p className="p-6 text-red-600">Batch not found or not a calendar batch</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{batch.batchName}</h2>
      
      <table className="w-full border text-center shadow-lg bg-white">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2">Roll No (Read-Only)</th>
            <th className="border px-4 py-2">Goj (Read-Only)</th>
            <th className="border px-4 py-2">Index (Editable)</th>
            <th className="border px-4 py-2">Extras (Editable, comma separated)</th>
          </tr>
        </thead>
        <tbody>
          {batch.rows.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              {/* Roll No: Read-Only */}
              <td className="border px-4 py-2">{row.rollNo}</td>
              
              {/* Goj: Read-Only */}
              <td className="border px-4 py-2">{row.goj}</td>
              
              {/* Index: Editable Input */}
              <td className="border px-4 py-2">
                <input
                  type="number"
                  value={row.idx || ""}
                  onChange={(e) => handleChange(e, idx, "idx")}
                  className="w-20 text-center border rounded p-1 focus:border-blue-500"
                />
              </td>
              
              {/* Extras: Editable Input */}
              <td className="border px-4 py-2">
                <input
                  type="text"
                  value={row.extraInputs?.join(", ") || ""}
                  onChange={(e) => handleChange(e, idx, "extraInputs")}
                  className="w-full border rounded p-1 focus:border-blue-500"
                  placeholder="e.g., 5, 10, 2"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleSave}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow-md transition duration-200"
      >
        Save Changes
      </button>
       <button
        onClick={() => router.back()}
        className="mt-6 ml-4 bg-gray-400 hover:bg-gray-500 text-white font-semibold px-6 py-2 rounded shadow-md transition duration-200"
      >
        Cancel
      </button>
    </div>
  );
}