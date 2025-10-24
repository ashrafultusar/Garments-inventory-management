"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { FaPrint, FaEye } from "react-icons/fa";

export default function BillingBatch({ orderId }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch invoice-wise batches
  const fetchBillingData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/batch/invoice/billing/${orderId}`);
      const data = await res.json();

      if (res.ok) {
        setInvoices(
          data.invoices.map((inv) => ({
            ...inv,
            isExpanded: false,
          }))
        );
      } else {
        toast.error(data.error || "Failed to load invoice data");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while fetching invoice batches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) fetchBillingData();
  }, [orderId]);

  const toggleExpand = (invoiceNumber) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.invoiceNumber === invoiceNumber
          ? { ...inv, isExpanded: !inv.isExpanded }
          : inv
      )
    );
  };

  if (loading) return <p>Loading billing invoices...</p>;

  if (!invoices.length)
    return <p className="text-gray-500">No invoice billing data found.</p>;

  return (
    <div className="mt-6 space-y-6">
      {invoices.map((inv, iIdx) => {
        const isExpanded = inv.isExpanded;
        const isMultiple = inv.batchCount > 1;

        // 🧾 If multiple batches, merge all rows together
        const mergedRows = isMultiple
          ? inv.batches.flatMap((b) =>
              (b.rows || []).map((r) => ({
                ...r,
                batchName: b.batchName,
                sillName: b.sillName,
                colour: b.colour,
                finishingType: b.finishingType,
              }))
            )
          : [];

        return (
          <div
            key={inv.invoiceNumber}
            className="border rounded-lg shadow-sm border-gray-200 overflow-hidden"
          >
            <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
              <h4 className="font-medium text-gray-700">
                Invoice:{" "}
                <span className="text-blue-600 font-semibold">
                  {inv.invoiceNumber}
                </span>{" "}
                <span className="text-sm text-orange-500">
                  ({isMultiple ? "Merged" : "Single"})
                </span>
              </h4>
              <div className="flex items-center gap-3 text-gray-600">
                <button
                  onClick={() => toggleExpand(inv.invoiceNumber)}
                  className="hover:text-blue-600 transition"
                  title="View Details"
                >
                  <FaEye size={18} />
                </button>
                <FaPrint
                  size={18}
                  className="hover:text-green-600 cursor-pointer transition"
                  title="Print"
                />
              </div>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white border-t border-gray-200 overflow-hidden"
                >
                  <div className="p-4 overflow-x-auto">
                    {isMultiple ? (
                      <table className="w-full text-sm border border-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-3 py-2 border">Batch Name</th>
                            <th className="px-3 py-2 border">Roll No</th>
                            <th className="px-3 py-2 border">Goj</th>
                            <th className="px-3 py-2 border">Index</th>
                            <th className="px-3 py-2 border">Extras</th>
                            <th className="px-3 py-2 border">Sill</th>
                            <th className="px-3 py-2 border">Colour</th>
                            <th className="px-3 py-2 border">Finishing</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mergedRows.map((row, idx) => (
                            <tr key={idx} className="text-center">
                              <td className="px-3 py-2 border">
                                {row.batchName}
                              </td>
                              <td className="px-3 py-2 border">{row.rollNo}</td>
                              <td className="px-3 py-2 border">{row.goj}</td>
                              <td className="px-3 py-2 border">
                                {Array.isArray(row.idx)
                                  ? row.idx.join(", ")
                                  : row.idx || "-"}
                              </td>
                              <td className="px-3 py-2 border">
                                {row.extraInputs?.length
                                  ? row.extraInputs.join(", ")
                                  : "—"}
                              </td>
                              <td className="px-3 py-2 border">{row.sillName}</td>
                              <td className="px-3 py-2 border">{row.colour}</td>
                              <td className="px-3 py-2 border">
                                {row.finishingType}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      inv.batches.map((b, bIdx) => (
                        <div key={bIdx} className="mb-4">
                          <h5 className="text-gray-700 font-medium mb-2">
                            {b.batchName}
                          </h5>
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
                              {b.rows.map((r, rIdx) => (
                                <tr key={rIdx} className="text-center">
                                  <td className="px-3 py-2 border">{r.rollNo}</td>
                                  <td className="px-3 py-2 border">{r.goj}</td>
                                  <td className="px-3 py-2 border">
                                    {Array.isArray(r.idx)
                                      ? r.idx.join(", ")
                                      : r.idx || "-"}
                                  </td>
                                  <td className="px-3 py-2 border">
                                    {r.extraInputs?.length
                                      ? r.extraInputs.join(", ")
                                      : "—"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
