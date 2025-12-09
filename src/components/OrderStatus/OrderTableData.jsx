// "use client";
// import React, { useState, useEffect } from "react";
// import { FaCheckSquare, FaRegSquare } from "react-icons/fa";
// import BatchCreator from "../Batch/BatchCreator";

// export default function OrderTableData({
//   orderId,
//   tableData = [],
//   currentStep,
//   usedRowIndexes,
//   setUsedRowIndexes,
//   sillName,
//   createdBatches,
//   setCreatedBatches,selectedOrder
// }) {
//   const [batchData, setBatchData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [allSelected, setAllSelected] = useState(false);

//   // ✅ Fetch existing used rows from DB
//   useEffect(() => {
//     if (currentStep === 2 && orderId) {
//       const fetchBatches = async () => {
//         try {
//           setLoading(true);
//           const res = await fetch(`/api/batch/${orderId}`);
//           const data = await res.json();
  
//           const batchArray = Array.isArray(data) ? data : [data];
  
//           // ✅ Flatten idx arrays correctly
//           const usedIndexes = batchArray
//             .flatMap((batchDoc) => batchDoc.batches || [])
//             .flatMap((b) =>
//               (b.rows || [])
//                 .map((r) => r.idx)
//                 .flat() 
//                 .filter((x) => typeof x === "number")
//             );
  
//           // ✅ Make unique
//           setUsedRowIndexes([...new Set(usedIndexes)]);
//           setCreatedBatches(batchArray);
//         } catch (err) {
//           console.error(err);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchBatches();
//     } else {
//       setBatchData([]);
//     }
//   }, [currentStep, orderId, setUsedRowIndexes, setCreatedBatches]);
  

//   if (tableData.length === 0)
//     return (
//       <p className="text-sm text-gray-500 italic">
//         No table data available for this order.
//       </p>
//     );

//   const keys = Object.keys(tableData[0]).filter(
//     (k) => k !== "id" && k !== "_id"
//   );

//   // ✅ Select/unselect single row (cannot select if already used)
//   const handleSelectRow = (idx) => {
//     if (usedRowIndexes.includes(idx)) return;
//     const isAlreadyInBatch = batchData.some((row) => row.idx === idx);

//     if (isAlreadyInBatch) {
//       setBatchData((prev) => prev.filter((row) => row.idx !== idx));
//     } else {
//       setBatchData((prev) => [...prev, { ...tableData[idx], idx }]);
//     }
//   };

//   // ✅ All select only unused rows
//   const handleSelectAll = () => {
//     if (allSelected) {
//       setBatchData([]);
//       setAllSelected(false);
//     } else {
//       const availableRows = tableData
//         .map((row, idx) => ({ ...row, idx }))
//         .filter((r) => !usedRowIndexes.includes(r.idx));

//       setBatchData(availableRows);
//       setAllSelected(true);
//     }
//   };

//   const isRowSelected = (idx) => batchData.some((row) => row.idx === idx);

//   useEffect(() => {
//     const selectableCount = tableData.filter(
//       (_, idx) => !usedRowIndexes.includes(idx)
//     ).length;
//     setAllSelected(
//       batchData.length > 0 &&
//         batchData.length === selectableCount &&
//         currentStep === 2
//     );
//   }, [batchData, usedRowIndexes, tableData, currentStep]);

//   return (
//     <div className="mt-6">
//       <h3 className="font-semibold text-gray-700 mb-3">Processing Details</h3>

      

//       <div className="overflow-x-auto border rounded-lg">
//         <table className="w-full text-sm border-collapse">
//           <thead className="bg-gray-100 text-gray-700">
//             <tr>
//               <th className="px-3 py-2 border text-center">
//                 {currentStep === 2 ? (
//                   <button
//                     onClick={handleSelectAll}
//                     title="Select All"
//                     className="text-lg text-blue-600 hover:text-blue-800"
//                   >
//                     {allSelected ? <FaCheckSquare /> : <FaRegSquare />}
//                   </button>
//                 ) : (
//                   "Select"
//                 )}
//               </th>
//               {keys?.map((key) => (
//                 <th key={key} className="px-4 py-2 border text-left">
//                   {key}
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           <tbody>
//             {tableData.map((row, idx) => {
//               const isUsed = usedRowIndexes.includes(idx);
//               const isSelected = isRowSelected(idx);
//               return (
//                 <tr
//                   key={idx}
//                   className={`${
//                     isUsed
//                       ? "bg-gray-100 opacity-50 cursor-not-allowed"
//                       : isSelected
//                       ? "bg-blue-50"
//                       : "hover:bg-gray-50"
//                   }`}
//                 >
//                   <td className="px-3 py-2 border text-center">
//                     <input
//                       type="checkbox"
//                       disabled={isUsed || currentStep !== 2}
//                       checked={isSelected}
//                       onChange={() => handleSelectRow(idx)}
//                     />
//                   </td>
//                   {keys.map((key, i) => (
//                     <td key={i} className="px-4 py-2 border">
//                       {row[key] ?? "N/A"}
//                     </td>
//                   ))}
//                 </tr>
//               );
//             })}

//             <tr className="font-semibold bg-gray-200">
//               <td className="px-3 py-2 border text-center">Total</td>
//               {keys?.map((key, i) => {
//                 if (key === "goj") {
//                   const gojSum = tableData.reduce(
//                     (acc, row) => acc + (Number(row.goj) || 0),
//                     0
//                   );
//                   return (
//                     <td key={i} className="px-4 py-2 border">
//                       {gojSum}
//                     </td>
//                   );
//                 }
//                 if (key === "rollNo") {
//                   return (
//                     <td key={i} className="px-4 py-2 border">
//                       {tableData.length}
//                     </td>
//                   );
//                 }
//                 return <td key={i} className="px-4 py-2 border"></td>;
//               })}
//             </tr>
//           </tbody>
//         </table>
//       </div>

//       {/* ✅ Pass props down */}
//       <BatchCreator
//         orderId={orderId}
//         sillName={sillName}
//         batchData={batchData}
//         setBatchData={setBatchData}
//         keys={keys}
//         createdBatches={createdBatches}
//         setCreatedBatches={setCreatedBatches}
//         setUsedRowIndexes={setUsedRowIndexes}
//         selectedOrder={selectedOrder} 
//       />
//     </div>
//   );
// }

"use client";
import React, { useState, useEffect } from "react";
import { FaCheckSquare, FaRegSquare } from "react-icons/fa";
import BatchCreator from "../Batch/BatchCreator";

export default function OrderTableData({
  orderId,
  tableData = [],
  currentStep,
  usedRowIndexes,        // এখানে আমরা এখন rowKey রাখব (যেমন "1-97.5")
  setUsedRowIndexes,
  sillName,
  createdBatches,
  setCreatedBatches,
  selectedOrder,
}) {
  const [batchData, setBatchData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allSelected, setAllSelected] = useState(false);

  // helper: row থেকে আমাদের identity বানাই
  const makeRowKey = (row) => {
    if (!row) return "";
    return `${row.rollNo ?? ""}-${row.goj ?? ""}`; // সবসময় string
  };

  // ✅ step 2 এ গেলে backend থেকে সব used rowKey আনছি
  useEffect(() => {
    if (currentStep === 2 && orderId) {
      const fetchBatches = async () => {
        try {
          setLoading(true);
          const res = await fetch(`/api/batch/${orderId}`);
          const raw = await res.json();

          let batchDocs = [];
          if (Array.isArray(raw)) {
            // যদি [] বা [batchDoc] আসে
            batchDocs = raw;
          } else if (raw && raw.batches) {
            // যদি একটাই batchDoc আসে
            batchDocs = [raw];
          }

          if (!batchDocs.length) {
            setUsedRowIndexes([]);
            setCreatedBatches([]);
            return;
          }

          // 🔥 সব batch-এর rows থেকে সব rowKey বের করছি (rollNo+goj)
          const usedRowKeys = batchDocs
            .flatMap((doc) => doc.batches || [])
            .flatMap((b) => b.rows || [])
            .map((r) => `${r.rollNo ?? ""}-${r.goj ?? ""}`)
            .filter((k) => k !== "-" && k !== "--");

          setUsedRowIndexes([...new Set(usedRowKeys)]);
          setCreatedBatches(
            batchDocs.length === 1 ? batchDocs[0].batches || [] : batchDocs
          );
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchBatches();
    } else {
      setBatchData([]);
    }
  }, [currentStep, orderId, setUsedRowIndexes, setCreatedBatches]);

  if (tableData.length === 0)
    return (
      <p className="text-sm text-gray-500 italic">
        No table data available for this order.
      </p>
    );

  const keys = Object.keys(tableData[0]).filter(
    (k) => k !== "id" && k !== "_id"
  );

  // ✅ single row select – যদি already used থাকে, কিছুই করতে দিবো না
  const handleSelectRow = (idx) => {
    const row = tableData[idx];
    if (!row) return;

    const rowKey = makeRowKey(row);
    if (usedRowIndexes.includes(rowKey)) return; // lifetime locked

    const isAlreadyInBatch = batchData.some(
      (r) => makeRowKey(r) === rowKey
    );

    if (isAlreadyInBatch) {
      setBatchData((prev) =>
        prev.filter((r) => makeRowKey(r) !== rowKey)
      );
    } else {
      setBatchData((prev) => [...prev, { ...row, idx }]);
    }
  };

  // ✅ সব unused row select / unselect
  const handleSelectAll = () => {
    if (allSelected) {
      setBatchData([]);
      setAllSelected(false);
    } else {
      const availableRows = tableData
        .map((row, idx) => ({ ...row, idx }))
        .filter(
          (r) => !usedRowIndexes.includes(makeRowKey(r))
        );

      setBatchData(availableRows);
      setAllSelected(true);
    }
  };

  const isRowSelected = (idx) => {
    const row = tableData[idx];
    if (!row) return false;
    const rowKey = makeRowKey(row);
    return batchData.some((r) => makeRowKey(r) === rowKey);
  };

  // ✅ সব selectable row already select হয়েছে কিনা
  useEffect(() => {
    const selectableCount = tableData.filter(
      (row) => !usedRowIndexes.includes(makeRowKey(row))
    ).length;

    setAllSelected(
      batchData.length > 0 &&
        batchData.length === selectableCount &&
        currentStep === 2
    );
  }, [batchData, usedRowIndexes, tableData, currentStep]);

  return (
    <div className="mt-6">
      <h3 className="font-semibold text-gray-700 mb-3">
        Processing Details
      </h3>

      {loading && (
        <p className="text-xs text-gray-400 mb-2">
          Loading used rows...
        </p>
      )}

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-3 py-2 border text-center">
                {currentStep === 2 ? (
                  <button
                    onClick={handleSelectAll}
                    title="Select All"
                    className="text-lg text-blue-600 hover:text-blue-800"
                  >
                    {allSelected ? <FaCheckSquare /> : <FaRegSquare />}
                  </button>
                ) : (
                  "Select"
                )}
              </th>
              {keys?.map((key) => (
                <th key={key} className="px-4 py-2 border text-left">
                  {key}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {tableData.map((row, idx) => {
              const rowKey = makeRowKey(row);
              const isUsed = usedRowIndexes.includes(rowKey);
              const isSelected = isRowSelected(idx);

              return (
                <tr
                  key={idx}
                  className={`${
                    isUsed
                      ? "bg-gray-100 opacity-50 cursor-not-allowed"
                      : isSelected
                      ? "bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-3 py-2 border text-center">
                    <input
                      type="checkbox"
                      disabled={isUsed || currentStep !== 2}
                      checked={isSelected}
                      onChange={() => handleSelectRow(idx)}
                    />
                  </td>
                  {keys.map((key, i) => (
                    <td key={i} className="px-4 py-2 border">
                      {row[key] ?? "N/A"}
                    </td>
                  ))}
                </tr>
              );
            })}

            <tr className="font-semibold bg-gray-200">
              <td className="px-3 py-2 border text-center">Total</td>
              {keys?.map((key, i) => {
                if (key === "goj") {
                  const gojSum = tableData.reduce(
                    (acc, row) => acc + (Number(row.goj) || 0),
                    0
                  );
                  return (
                    <td key={i} className="px-4 py-2 border">
                      {gojSum}
                    </td>
                  );
                }
                if (key === "rollNo") {
                  return (
                    <td key={i} className="px-4 py-2 border">
                      {tableData.length}
                    </td>
                  );
                }
                return <td key={i} className="px-4 py-2 border"></td>;
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Batch Creator */}
      <BatchCreator
        orderId={orderId}
        sillName={sillName}
        batchData={batchData}
        setBatchData={setBatchData}
        keys={keys}
        setUsedRowIndexes={setUsedRowIndexes}
        selectedOrder={selectedOrder}
      />
    </div>
  );
}

