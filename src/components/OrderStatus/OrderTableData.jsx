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
  processes,
  setProcesses,
  createdBatches,
  setCreatedBatches,
}) {
  const [batchData, setBatchData] = useState([]);
  const [isBatchConfirmed, setIsBatchConfirmed] = useState(false);

  

  useEffect(() => {
    if (currentStep !== 2) {
      setBatchData([]);
      setIsBatchConfirmed(false);
    }
  }, [currentStep]);

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

  const handleSelectRow = (idx) => {
    if (currentStep !== 2 || usedRowIndexes.includes(idx) || isBatchConfirmed)
      return;

    const isAlreadyInBatch = batchData.some((row) => row.idx === idx);
    if (isAlreadyInBatch) {
      setBatchData((prev) => prev.filter((row) => row.idx !== idx));
    } else {
      setBatchData((prev) => [
        ...prev,
        { ...tableData[idx], inputValue: "", idx },
      ]);
    }
  };

  const handleInputChange = (idx, value) => {
    if (isBatchConfirmed) return;
    setBatchData((prev) =>
      prev.map((row) => (row.idx === idx ? { ...row, inputValue: value } : row))
    );
  };

  const isRowSelected = (idx) => batchData.some((row) => row.idx === idx);

  const confirmBatch = async () => {
    if (batchData.length === 0) {
      toast.error("Please select at least one row");
      return;
    }

    if (!Array.isArray(processes) || !processes.some((p) => p.selected)) {
      toast.error(
        "Please select at least one process from Current Processing List"
      );
      return;
    }

    try {
      const payload = {
        orderId,
        batchName: `Batch ${createdBatches.length + 1}`,
        sillBatchName: `${sillName} ${createdBatches.length + 1}`,
        rows: batchData.map((row) => ({
          rollNo: row.rollNo,
          goj: row.goj,
          inputValue: row.inputValue,
          idx: row.idx,
        })),
        selectedProcesses: processes
          .filter((p) => p.selected)
          .map((p) => ({ name: p.name, price: p.price })),
      };

      const res = await fetch("/api/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const newBatch = await res.json();

      if (res.ok) {
        toast.success("Batch created successfully!");
        // ✅ Merge new used rows with old ones
        setUsedRowIndexes((prev) =>
          Array.from(new Set([...prev, ...batchData.map((r) => r.idx)]))
        );
        setCreatedBatches((prev) => [...prev, newBatch]);
        setBatchData([]);
        setIsBatchConfirmed(true);

        setProcesses((prev) => prev.map((p) => ({ ...p, selected: false })));
      } else {
        toast.error(newBatch.message || "Batch creation failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while creating batch");
    }
  };

  return (
    <div className="mt-6">
      <h3 className="font-semibold text-gray-700 mb-3">Processing Details</h3>

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

      {batchData.length > 0 && (
        <div className="mt-6">
          <div className="p-4 border rounded-lg bg-gray-50 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-700">
                Batch {createdBatches.length + 1}
              </h4>
              {!isBatchConfirmed ? (
                <button
                  onClick={confirmBatch}
                  className="px-4 py-1 text-sm bg-green-600 cursor-pointer text-white rounded hover:bg-green-700"
                >
                  Completed Process
                </button>
              ) : (
                <span className="text-green-600 text-sm font-semibold">
                  ✅ Confirmed
                </span>
              )}
            </div>

            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  {keys.map((key) => (
                    <th key={key} className="px-4 py-2 border text-left">
                      {key}
                    </th>
                  ))}
                  <th className="px-4 py-2 border">Extra Input</th>
                </tr>
              </thead>
              <tbody>
                {batchData?.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    {keys?.map((key, j) => (
                      <td key={j} className="px-4 py-2 border">
                        {row[key] ?? "N/A"}
                      </td>
                    ))}
                    <td className="px-4 py-2 border">
                      <input
                        type="number"
                        value={row.inputValue}
                        onChange={(e) =>
                          handleInputChange(row.idx, e.target.value)
                        }
                        onWheel={(e) => e.target.blur()}
                        className="w-24 px-2 py-1 border rounded"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
