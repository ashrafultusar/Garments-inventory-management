"use client";
import useAppData from "@/hook/useAppData";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function BatchCreator({
  orderId,
  batchData,
  setBatchData,
  keys,
  createdBatches,
  setCreatedBatches,
  setUsedRowIndexes,
}) {
  const [loading, setLoading] = useState(false);
  const { data } = useAppData();

  // Selected dropdowns store _id
  const [selectedClothe, setSelectedClothe] = useState("");
  const [selectedColour, setSelectedColour] = useState("");
  const [selectedFinishing, setSelectedFinishing] = useState("");
  const [selectedSill, setSelectedSill] = useState("");

  if (!batchData?.length) return null;

  // Generic dropdown component
  const Dropdown = ({ label, options, selected, setSelected }) => (
    <div className="w-32 mb-1">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="block w-full py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 cursor-pointer"
      >
        <option value="" disabled>
          Select
        </option>
        {options.map((opt) => (
          <option key={opt._id} value={opt._id}>
            {opt.name}
          </option>
        ))}
      </select>
      {selected && (
        <p className="mt-2 cursor-pointer text-sm text-gray-600">
          Selected:{" "}
          <span className="font-semibold">
            {options.find((o) => o._id === selected)?.name}
          </span>
        </p>
      )}
    </div>
  );

  // Confirm and create batch
  const confirmBatch = async () => {
    if (
      !selectedClothe ||
      !selectedColour ||
      !selectedFinishing ||
      !selectedSill
    ) {
      toast.error("Please select all dropdowns!");
      return;
    }

    if (batchData.length === 0) {
      toast.error("Please select at least one row");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        orderId,
        sillName: selectedSill,
        clotheType: selectedClothe,
        colour: selectedColour,
        finishingType: selectedFinishing,
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

        // Mark selected rows as used
        setUsedRowIndexes((prev) =>
          Array.from(new Set([...prev, ...batchData.map((r) => r.idx)]))
        );

        // Refresh batch list
        const fetchRes = await fetch(`/api/batch?orderId=${orderId}`);
        const updatedData = await fetchRes.json();
        setCreatedBatches(updatedData);

        // Reset selection
        setBatchData([]);
        setSelectedClothe("");
        setSelectedColour("");
        setSelectedFinishing("");
        setSelectedSill("");
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

        <table className="w-full text-sm border-collapse mt-4">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {keys?.map((key) => (
                <th key={key} className="px-4 py-2 border text-left">
                  {key}
                </th>
              ))}
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
              </tr>
            ))}
            <tr className="font-semibold bg-gray-200">
              {keys.map((key, i) => {
                let value = "";
                if (key === "goj")
                  value = batchData.reduce(
                    (acc, row) => acc + (Number(row.goj) || 0),
                    0
                  );
                if (key === "rollNo") value = batchData.length;
                return (
                  <td key={i} className="px-4 py-2 border">
                    Total: {value}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex justify-center gap-4 mt-4 flex-wrap py-4 border rounded-lg bg-gray-50 shadow-sm ">
        <Dropdown
          label="Clothe Type"
          options={data?.clotheTypes || []}
          selected={selectedClothe}
          setSelected={setSelectedClothe}
        />
        <Dropdown
          label="Colour"
          options={data?.colours || []}
          selected={selectedColour}
          setSelected={setSelectedColour}
        />
        <Dropdown
          label="Finishing Type"
          options={data?.finishingTypes || []}
          selected={selectedFinishing}
          setSelected={setSelectedFinishing}
        />
        <Dropdown
          label="Sill Name"
          options={data?.sillNames || []}
          selected={selectedSill}
          setSelected={setSelectedSill}
        />
      </div>
    </div>
  );
}
