
"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { FaPrint, FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import PrintBillingInvoice from "../Print/PrintBillingInvoice/PrintBillingInvoice";

export default function BillingBatch({ orderId }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderInfo, setOrderInfo] = useState({});
  const printRef = useRef();
  const [selectedInvoiceToPrint, setSelectedInvoiceToPrint] = useState(null);

  // ✅ NEW: per invoice price inputs (Client/Dyeing/Calender)
  const [priceByInvoice, setPriceByInvoice] = useState({});
  // shape: { [invoiceNumber]: { client: "", dyeing: "", calender: "" } }


  // ✅ Fetch invoice-wise batches
  const fetchBillingData = async () => {
    try {
      setLoading(true);

      const [invoiceRes, orderRes] = await Promise.all([
        fetch(`/api/batch/invoice/billing/${orderId}`),
        fetch(`/api/order/${orderId}`),
      ]);

      const invoiceData = await invoiceRes.json();
      const orderData = await orderRes.json();

      if (invoiceRes.ok) {
        const mapped = invoiceData.invoices.map((inv) => ({
          ...inv,
          isExpanded: false,
        }));
        setInvoices(mapped);

        // ✅ init input state for each invoice
        setPriceByInvoice((prev) => {
          const next = { ...prev };
          mapped.forEach((inv) => {
            const key = inv.invoiceNumber;
            if (!next[key])
              next[key] = { client: "", dyeing: "", calender: "" };
          });
          return next;
        });
      } else {
        // toast.error(invoiceData.error || "Failed to load invoice data");
      }

      if (orderRes.ok) {
        setOrderInfo(orderData);
      } else {
        toast.error(orderData.error || "Failed to load order info");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while fetching order/invoice data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) fetchBillingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleDeleteInvoice = async (invoiceNumber) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;

    try {
      const res = await fetch(`/api/batch/invoice/delete/${invoiceNumber}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Invoice deleted and batches reverted to Delivered!");
        setInvoices((prev) =>
          prev.filter((inv) => inv.invoiceNumber !== invoiceNumber)
        );
        setPriceByInvoice((prev) => {
          const next = { ...prev };
          delete next[invoiceNumber];
          return next;
        });
      } else {
        toast.error(data.error || "Failed to delete invoice");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while deleting invoice");
    }
  };

  // ✅ Print state set only
  const handlePrint = (invoice) => {
    if (!invoice) return;
    setSelectedInvoiceToPrint({ ...invoice, orderInfo });
  };

  // ✅ Print when state ready
  useEffect(() => {
    if (selectedInvoiceToPrint) {
      const printArea = printRef.current.cloneNode(true);
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.top = "0";
      tempDiv.style.left = "0";
      tempDiv.style.width = "100%";
      tempDiv.style.background = "white";
      tempDiv.style.zIndex = "9999";
      tempDiv.appendChild(printArea);

      document.body.appendChild(tempDiv);
      window.print();

      setTimeout(() => {
        document.body.removeChild(tempDiv);
        setSelectedInvoiceToPrint(null);
      }, 500);
    }
  }, [selectedInvoiceToPrint]);

  // =========================
  // ✅ Helpers for sum/calc
  // =========================
  const toNumber = (v) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };

  const sumIdx = (idx) => {
    if (Array.isArray(idx)) return idx.reduce((s, x) => s + toNumber(x), 0);
    return toNumber(idx);
  };

  const sumExtras = (extraInputs) => {
    if (!Array.isArray(extraInputs)) return 0;
    return extraInputs.reduce((s, x) => s + toNumber(x), 0);
  };

  // ✅ Index sum + Extras sum (per invoice)
  const getInvoiceTotals = (inv) => {
    let idxTotal = 0;
    let extrasTotal = 0;

    (inv?.batches || []).forEach((b) => {
      (b?.rows || []).forEach((r) => {
        idxTotal += sumIdx(r?.idx);
        extrasTotal += sumExtras(r?.extraInputs);
      });
    });

    const totalQty = idxTotal + extrasTotal;
    return { idxTotal, extrasTotal, totalQty };
  };

  const handlePriceChange = (invoiceNumber, key, value) => {
    setPriceByInvoice((prev) => ({
      ...prev,
      [invoiceNumber]: {
        ...(prev[invoiceNumber] || { client: "", dyeing: "", calender: "" }),
        [key]: value,
      },
    }));
  };

  const calcBill = (invoiceNumber, key, totalQty) => {
    const price = toNumber(priceByInvoice?.[invoiceNumber]?.[key]);
    return price * totalQty;
  };


  if (loading) return <p>Loading billing invoices...</p>;
  if (!invoices.length)
    return <p className="text-gray-500">No invoice billing data found.</p>;

  return (
    <div className="mt-6 space-y-6">
      {invoices?.map((inv) => {
        const isExpanded = inv.isExpanded;
        const isMultiple = inv.batchCount > 1;

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

        const { idxTotal, extrasTotal, totalQty } = getInvoiceTotals(inv);

        const summaryRows = [
          { label: "Client", key: "client" },
          { label: "Dyeing", key: "dyeing" },
          { label: "Calender", key: "calender" },
        ];

        return (
          <div
            key={inv.invoiceNumber}
            className="border rounded-lg shadow-sm border-gray-200 overflow-hidden"
          >
            <div className="flex justify-between items-center bg-gray-100 px-4 py-3 no-print">
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
                  className="hover:text-blue-600 transition cursor-pointer"
                  title="View Details"
                >
                  <FaEye size={18} />
                </button>

                <button
                  onClick={() => handlePrint(inv)}
                  className="hover:text-green-600 transition cursor-pointer"
                  title="Print Invoice"
                >
                  <FaPrint size={18} />
                </button>

                <MdDelete
                  size={20}
                  onClick={() => handleDeleteInvoice(inv?.invoiceNumber)}
                  className="text-red-500 hover:text-red-600 cursor-pointer transition"
                  title="Delete Invoice"
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
                    {/* ✅ batch table */}
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
                          {mergedRows?.map((row, idx) => (
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
                              <td className="px-3 py-2 border">
                                {row.sillName}
                              </td>
                              <td className="px-3 py-2 border">{row.colour}</td>
                              <td className="px-3 py-2 border">
                                {row.finishingType}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      inv?.batches?.map((b, bIdx) => (
                        <div key={bIdx} className="mb-4">
                          <h5 className="text-gray-700 font-medium mb-2">
                            {b?.batchName}
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
                              {b?.rows?.map((r, rIdx) => (
                                <tr key={rIdx} className="text-center">
                                  <td className="px-3 py-2 border">
                                    {r?.rollNo}
                                  </td>
                                  <td className="px-3 py-2 border">{r?.goj}</td>
                                  <td className="px-3 py-2 border">
                                    {Array.isArray(r?.idx)
                                      ? r.idx.join(", ")
                                      : r?.idx || "-"}
                                  </td>
                                  <td className="px-3 py-2 border">
                                    {r?.extraInputs?.length
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
                    {/* Summary rows as TABLE */}
                    <div className="mt-4">
                      <table className="w-full text-sm border border-gray-200">
                        <tbody>
                          {/* ✅ Summary info row like table header note */}
                          <tr className="bg-gray-50">
                            <td
                              className="px-3 py-2 border font-medium text-gray-700"
                              colSpan={6}
                            >
                              Index = {idxTotal} | Extras = {extrasTotal} |
                              Total Qty = {totalQty}
                            </td>
                          </tr>

                          {summaryRows.map((r) => {
                            const priceVal =
                              priceByInvoice?.[inv.invoiceNumber]?.[r.key] ??
                              "";
                            const totalBill = calcBill(
                              inv.invoiceNumber,
                              r.key,
                              totalQty
                            );

                            return (
                              <tr key={r.key} className="text-center">
                                {/* label */}
                                <td className="px-3 py-2 border text-left font-medium text-gray-700">
                                  {r.label}
                                </td>

                                {/* × */}
                                <td className="px-3 py-2 border text-red-500 font-bold text-lg">
                                  ×
                                </td>

                                {/* price input */}
                                <td className="px-3 py-2 border">
                                  <input
                                    type="number"
                                    value={priceVal}
                                    onChange={(e) =>
                                      handlePriceChange(
                                        inv.invoiceNumber,
                                        r.key,
                                        e.target.value
                                      )
                                    }
                                    placeholder="Price"
                                    className="w-full max-w-[90px] mx-auto border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 text-center"
                                  />
                                </td>

                                {/* = */}
                                <td className="px-3 py-2 border font-bold text-lg text-gray-600">
                                  =
                                </td>

                                {/* total */}
                                <td className="px-3 py-2 border font-semibold text-gray-700">
                                  {totalBill}
                                </td>

                             
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* ✅ Hidden printable area */}
      <div style={{ display: "none" }}>
        <div ref={printRef} className="print-only">
          {selectedInvoiceToPrint && (
            <PrintBillingInvoice order={selectedInvoiceToPrint} />
          )}
        </div>
      </div>
    </div>
  );
}
