"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function CalendarBatch({ orderId }) {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDeliveredBatches = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/batch/${orderId}`);
        const data = await res.json();

        if (res.ok) {
          const deliveredBatches = (data.batches || []).filter(
            (batch) => batch.status === "calender"
          );
          setBatches(deliveredBatches);
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

    if (orderId) fetchDeliveredBatches();
  }, [orderId]);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Delivered Batches
      </h3>

      {loading ? (
        <p className="text-gray-500">Loading delivered batches...</p>
      ) : batches.length === 0 ? (
        <p className="text-gray-500">
          No delivered batches found for this order.
        </p>
      ) : (
        <div className="space-y-6">
          {batches?.map((batch, bIdx) => (
            <div
              key={bIdx}
              className="border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <h4 className="font-medium text-gray-700 mb-3">
                {batch.batchName || `Batch ${bIdx + 1}`} ✅
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 border">Roll No</th>
                      <th className="px-3 py-2 border">Goj</th>
                      <th className="px-3 py-2 border">Index</th>
                      <th className="px-3 py-2 border">Extras</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batch?.rows?.map((row, rIdx) => (
                      <tr key={rIdx} className="text-center">
                        <td className="px-3 py-2 border">{row?.rollNo}</td>
                        <td className="px-3 py-2 border">{row?.goj}</td>
                        <td className="px-3 py-2 border">{row?.idx || "-"}</td>
                        <td className="px-3 py-2 border">
                          {row.extraInputs?.length
                            ? row.extraInputs.join(", ")
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  {/* Column-wise Totals */}
                  {batch.rows.length > 0 && (
                    <tfoot>
                      <tr className="text-center font-semibold bg-gray-50">
                        {/* Roll No: count of rows */}
                        <td className="px-3 py-2 border">
                          {batch.rows.length}
                        </td>

                        {/* Goj: sum of numeric values */}
                        <td className="px-3 py-2 border">
                          {batch.rows.reduce(
                            (sum, row) => sum + (Number(row.goj) || 0),
                            0
                          )}
                        </td>

                        {/* Index: sum of idx */}
                        <td className="px-3 py-2 border">
                          {batch.rows.reduce(
                            (sum, row) => sum + (Number(row.idx) || 0),
                            0
                          )}
                        </td>

                        {/* Extras: sum of all numeric values inside extraInputs */}
                        <td className="px-3 py-2 border">
                          {batch.rows.reduce(
                            (sum, row) =>
                              sum +
                              (row.extraInputs
                                ? row.extraInputs.reduce(
                                    (s, val) => s + (Number(val) || 0),
                                    0
                                  )
                                : 0),
                            0
                          )}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>

                {/* Info Section */}
                <table className="w-full text-sm mt-4 border rounded">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-3 py-2 text-left">Field</th>
                      <th className="border px-3 py-2 text-left">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Calendar", batch?.calender],
                      ["Colour", batch?.colour],
                      ["Dyeing", batch?.dyeing],
                      ["Finishing Type", batch?.finishingType],
                      ["Sill Name", batch?.sillName],
                    ]
                      .filter(([_, value]) => value)
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
              </div>

              <p className="pt-3">
                Note: {batch?.note?.trim() || "Not Assigned"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
