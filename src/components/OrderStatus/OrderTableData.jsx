import React, { useState } from "react";

export default function OrderTableData({ tableData = [] }) {
  const [selectedRows, setSelectedRows] = useState([]);

  if (tableData.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic">
        No table data available for this order.
      </p>
    );
  }

  // প্রথম object থেকে id বাদ দিয়ে বাকি keys নেব
  const keys = Object.keys(tableData[0]).filter((k) => k !== "id" && k !== "_id");

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(tableData.map((_, idx) => idx));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (idx) => {
    setSelectedRows((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const isAllSelected = selectedRows.length === tableData.length;

  return (
    <div className="mt-6">
      <h3 className="font-semibold text-gray-700 mb-3">Processing Details</h3>
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-3 py-2 border text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
              </th>
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
                  selectedRows.includes(idx) ? "bg-blue-50" : ""
                }`}
              >
                <td className="px-3 py-2 border text-center">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(idx)}
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

      {selectedRows.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          <span className="font-medium">{selectedRows.length}</span> row
          selected
        </div>
      )}
    </div>
  );
}
