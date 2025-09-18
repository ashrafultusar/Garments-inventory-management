"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function OrderTableData({
  orderId,
  tableData = [],
  currentStep,
  usedRowIndexes,
  setUsedRowIndexes,
  sillName,
  createdBatches,
  setCreatedBatches,
}) {
  const [batchData, setBatchData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch existing batches when step = "In Process"
  useEffect(() => {
    if (currentStep === 2 && orderId) {
      const fetchBatches = async () => {
        try {
          setLoading(true);
          const res = await fetch(`/api/batch?orderId=${orderId}`);
          if (!res.ok) throw new Error("Failed to fetch batches");
          const data = await res.json();

          const usedIndexes = data
            .flatMap((batchDoc) => batchDoc.batches || [])
            .flatMap((b) => b.rows?.map((r) => r.idx) || []);

          setUsedRowIndexes([...new Set(usedIndexes)]); // unique indexes
          setCreatedBatches(data);
        } catch (err) {
          console.error(err);
          toast.error("Failed to fetch batches");
        } finally {
          setLoading(false);
        }
      };

      fetchBatches();
    } else {
      setBatchData([]);
    }
  }, [currentStep, orderId, setUsedRowIndexes, setCreatedBatches]);

  if (tableData.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic">
        No table data available for this order.
      </p>
    );
  }

  const keys = Object.keys(tableData[0]).filter(
    (k) => k !== "id" && k !== "_id"
  );

  // Select / unselect row
  const handleSelectRow = (idx) => {
    // Only prevent selecting rows that are already used
    if (usedRowIndexes.includes(idx)) return;

    const isAlreadyInBatch = batchData.some((row) => row.idx === idx);
    if (isAlreadyInBatch) {
      setBatchData((prev) => prev.filter((row) => row.idx !== idx));
    } else {
      setBatchData((prev) => [...prev, { ...tableData[idx], idx }]);
    }
  };

  const isRowSelected = (idx) => batchData.some((row) => row.idx === idx);

  // Confirm batch
  const confirmBatch = async () => {
    if (batchData.length === 0) {
      toast.error("Please select at least one row");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        orderId,
        batchName: `Batch ${createdBatches.length + 1}`,
        sillBatchName: `${sillName} ${createdBatches.length + 1}`,
        rows: batchData.map((row) => ({
          rollNo: row.rollNo,
          goj: row.goj,
          idx: row.idx,
        })),
        selectedProcesses: [],
      };

      const res = await fetch("/api/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const newBatch = await res.json();

      if (res.ok) {
        toast.success("Batch created successfully!");

        // Permanently mark selected rows as used
        setUsedRowIndexes((prev) =>
          Array.from(new Set([...prev, ...batchData.map((r) => r.idx)]))
        );

        // Refresh batch list
        const fetchRes = await fetch(`/api/batch?orderId=${orderId}`);
        const updatedData = await fetchRes.json();
        setCreatedBatches(updatedData);

        // Reset selection for next batch
        setBatchData([]);
      } else {
        toast.error(newBatch.message || "Batch creation failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while creating batch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="font-semibold text-gray-700 mb-3">Processing Details</h3>

      {loading && (
        <p className="text-sm text-gray-500 italic">Loading batches...</p>
      )}

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-3 py-2 border text-center">Select</th>
              {keys.map((key) => (
                <th key={key} className="px-4 py-2 border text-left">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, idx) => (
              <tr
                key={idx}
                className={`hover:bg-gray-50 ${
                  isRowSelected(idx) ? "bg-blue-50" : ""
                } ${usedRowIndexes.includes(idx) ? "opacity-50" : ""}`}
              >
                <td className="px-3 py-2 border text-center">
                  <input
                    type="checkbox"
                    disabled={usedRowIndexes.includes(idx) || currentStep !== 2}
                    checked={isRowSelected(idx)}
                    onChange={() => handleSelectRow(idx)}
                  />
                </td>
                {keys.map((key, i) => (
                  <td key={i} className="px-4 py-2 border">
                    {row[key] ?? "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Batch Preview */}
      {batchData?.length > 0 && (
        <div className="mt-6">
          <div className="p-4 border rounded-lg bg-gray-50 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-700">
                Batch {createdBatches?.length + 1}
              </h4>
              <button
                onClick={confirmBatch}
                disabled={loading}
                className="px-4 py-1 text-sm bg-green-600 cursor-pointer text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Create Batch"}
              </button>
            </div>

            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  {keys.map((key) => (
                    <th key={key} className="px-4 py-2 border text-left">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {batchData.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    {keys.map((key, j) => (
                      <td key={j} className="px-4 py-2 border">
                        {row[key] ?? "N/A"}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Totals row */}
                <tr className="font-semibold bg-gray-200">
                  {keys.map((key, i) => {
                    if (key === "goj") {
                      const gojSum = batchData.reduce(
                        (acc, row) => acc + (Number(row.goj) || 0),
                        0
                      );
                      return (
                        <td key={i} className="px-4 py-2 border">
                          Total: {gojSum}
                        </td>
                      );
                    }
                    if (key === "rollNo") {
                      const rollNoSum = batchData.reduce(
                        (acc, row) => acc + (Number(row.rollNo) || 0),
                        0
                      );
                      return (
                        <td key={i} className="px-4 py-2 border">
                          Total: {rollNoSum}
                        </td>
                      );
                    }
                    return <td key={i} className="px-4 py-2 border"></td>;
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
