// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import { FaRegEdit, FaSave } from "react-icons/fa";
// import { toast } from "react-toastify";

// const CompletedBatch = ({ orderId, clientName = "J.M Fabrics" }) => {
//   const [summaries, setSummaries] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Edit state
//   const [editingId, setEditingId] = useState(null);
//   const [editValues, setEditValues] = useState({
//     price: "",
//     total: "",
//   });

//   // Fetch summaries
//   useEffect(() => {
//     const fetchSummaries = async () => {
//       try {
//         const res = await fetch(
//           `/api/batch/completed/billing-summary/${orderId}`
//         );
//         const data = await res.json();

//         if (!res.ok) throw new Error();

//         setSummaries(data.data);
//       } catch {
//         toast.error("Failed to load billing summaries");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (orderId) fetchSummaries();
//   }, [orderId]);

//   // Group by summaryType
//   const groupedSummaries = useMemo(() => {
//     return summaries?.reduce((acc, item) => {
//       if (!acc[item.summaryType]) acc[item.summaryType] = [];
//       acc[item.summaryType].push(item);
//       return acc;
//     }, {});
//   }, [summaries]);

//   // Edit handlers
//   const handleEdit = (item) => {
//     setEditingId(item._id);
//     setEditValues({
//       price: item.price,
//       total: item.total,
//     });
//   };

//   const handleSave = async (id) => {
//     try {
//       const res = await fetch(`/api/batch/completed/update-billing/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(editValues),
//       });

//       if (!res.ok) throw new Error();

//       setSummaries((prev) =>
//         prev?.map((item) =>
//           item._id === id ? { ...item, ...editValues } : item
//         )
//       );

//       setEditingId(null);
//       toast.success("Billing updated successfully");
//     } catch {
//       toast.error("Failed to update billing");
//     }
//   };

//   return (
//     <div className="p-6 min-h-screen">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <h1 className="text-xl mb-6">Client (Name ex: {clientName}) Billing</h1>

//         {loading && <p className="text-center">Loading summaries...</p>}

//         {!loading && summaries.length === 0 && (
//           <p className="text-center text-gray-500">
//             No billing summaries found.
//           </p>
//         )}

//         {!loading &&
//           Object.entries(groupedSummaries).map(([type, items]) => (
//             <div key={type} className="mb-10">
//               {/* Section Header */}
//               <h2 className="text-lg font-semibold mb-4 capitalize border-b pb-2">
//                 {type} Billing
//               </h2>

//               <div className="overflow-x-auto">
//                 <div className="space-y-4 min-w-[700px] w-max">
//                   {items?.map((item) => (
//                  <div
//                  key={item._id}
//                  className="flex items-center gap-2 bg-[#f9f3d1] px-3 py-2 rounded-xl border border-gray-300 w-fit min-w-[520px]"
//                >
               
                 
//                       {/* Batch Info */}
//                       <div className="flex-1 bg-[#b0b4b8] p-3 rounded-2xl border min-h-[60px] flex items-center">
//                         <p className="text-sm font-medium">
//                           {item.batchName} + {item.summaryType} + {item.colour}{" "}
//                           + {item.finishingType}
//                         </p>
//                       </div>

//                       {/* Qty */}
//                       <div className="w-20 bg-[#b0b4b8] p-2 rounded-xl border text-center min-h-[60px] flex flex-col justify-center">
//                         <span className="text-xs">গজ</span>
//                         <span className="font-bold text-sm">
//                           {item.totalQty}
//                         </span>
//                       </div>

//                       <div className="text-red-600 text-4xl font-bold">×</div>

//                       {/* Price Input Section */}
//                       <div className="w-20 bg-[#b0b4b8] p-2 rounded-xl border text-center min-h-[60px] flex flex-col justify-center">
//                         <span className="text-xs">Price</span>
//                         {editingId === item._id ? (
//                           <input
//                             type="number"
//                             value={editValues.price}
//                             onChange={(e) => {
//                               const val = e.target.value;
//                               const newPrice = parseFloat(val);
//                               // Price চেঞ্জ করলে Total অটো আপডেট হবে এবং ১ ঘর দশমিক থাকবে
//                               const calculatedTotal = isNaN(newPrice)
//                                 ? ""
//                                 : (newPrice * item.totalQty).toFixed(1);

//                               setEditValues({
//                                 price: val, // ইনপুট যেমন আছে তেমনই থাকবে (টাইপিং এর সুবিধার জন্য)
//                                 total: calculatedTotal,
//                               });
//                             }}
//                             className="w-full text-sm text-center rounded"
//                           />
//                         ) : (
//                           <span className="font-bold text-sm">
//                             {item.price}
//                           </span>
//                         )}
//                       </div>

//                       {/* Equals */}
//                       <div className="space-y-1">
//                         <div className="w-6 h-1 bg-red-600"></div>
//                         <div className="w-6 h-1 bg-red-600"></div>
//                       </div>

//                       {/* Total Input Section */}
//                       <div className="w-20 bg-[#b0b4b8] p-2 rounded-2xl border text-center min-h-[60px] flex flex-col justify-center">
//                         <span className="text-xs">Total</span>
//                         {editingId === item._id ? (
//                           <input
//                             type="number"
//                             value={editValues.total}
//                             onChange={(e) => {
//                               const val = e.target.value;
//                               const newTotal = parseFloat(val);
//                               const calculatedPrice =
//                                 isNaN(newTotal) || !item.totalQty
//                                   ? ""
//                                   : (newTotal / item.totalQty).toFixed(1);

//                               setEditValues({
//                                 total: val,
//                                 price: calculatedPrice,
//                               });
//                             }}
//                             className="w-full text-sm text-center rounded"
//                           />
//                         ) : (
//                           <span className="font-bold text-sm">
//                             {item.total}
//                           </span>
//                         )}
//                       </div>

//                       {/* Action */}
//                       <button
//                         onClick={() =>
//                           editingId === item._id
//                             ? handleSave(item._id)
//                             : handleEdit(item)
//                         }
//                         className="bg-[#8cc48c] px-4 py-2 rounded-2xl border h-[60px] w-24 flex items-center justify-center"
//                       >
//                         {editingId === item._id ? <FaSave /> : <FaRegEdit />}
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// };

// export default CompletedBatch;

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FaRegEdit, FaSave, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const CompletedBatch = ({ orderId, clientName = "J.M Fabrics" }) => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ price: "", total: "" });

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const res = await fetch(`/api/batch/completed/billing-summary/${orderId}`);
        const data = await res.json();
        if (!res.ok) throw new Error();
        setSummaries(data.data);
      } catch {
        toast.error("Failed to load billing summaries");
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchSummaries();
  }, [orderId]);

  const groupedSummaries = useMemo(() => {
    return summaries?.reduce((acc, item) => {
      if (!acc[item.summaryType]) acc[item.summaryType] = [];
      acc[item.summaryType].push(item);
      return acc;
    }, {});
  }, [summaries]);

  const handleEdit = (item) => {
    setEditingId(item._id);
    setEditValues({ price: item.price, total: item.total });
  };

  const handleSave = async (id) => {
    try {
      const res = await fetch(`/api/batch/completed/update-billing/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editValues),
      });
      if (!res.ok) throw new Error();
      setSummaries((prev) => prev?.map((item) => (item._id === id ? { ...item, ...editValues } : item)));
      setEditingId(null);
      toast.success("Billing updated");
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="w-full bg-white">
      <div className="p-4 border-b">
        <h1 className="text-md font-bold text-gray-700">
          Client ({clientName}) Billing
        </h1>
      </div>

      <div className="p-3">
        {loading ? (
          <p className="text-center text-sm py-4">Loading...</p>
        ) : summaries.length === 0 ? (
          <p className="text-center text-sm text-gray-400">No summaries found.</p>
        ) : (
          Object.entries(groupedSummaries).map(([type, items]) => (
            <div key={type} className="mb-6">
              <h2 className="text-xs font-bold uppercase text-gray-500 mb-3 border-l-4 border-blue-500 pl-2">
                {type} Billing
              </h2>

              <div className="space-y-3">
                {items?.map((item) => (
                  <div key={item._id} className="bg-[#fdf8e1] border border-gray-200 rounded-lg p-2 shadow-sm">
                    {/* Top Section: Batch Info */}
                    <div className="bg-[#b0b4b8] p-2 rounded-lg mb-2 border border-gray-300">
                      <p className="text-[14px] font-bold text-gray-800 leading-tight uppercase">
                        {item?.batchName} • {item?.colour} • {item?.finishingType}
                      </p>
                    </div>

                    {/* Calculation Section */}
                    <div className="flex items-center justify-between gap-1">
                      {/* Qty */}
                      <div className="flex-1 bg-[#b0b4b8] rounded-lg py-1 text-center border border-gray-300 min-w-[50px]">
                        <p className="text-[12px] text-gray-600 uppercase">গজ</p>
                        <p className="text-xs font-bold">{item.totalQty}</p>
                      </div>

                      <span className="text-red-500 font-bold text-sm">×</span>

                      {/* Price */}
                      <div className="flex-1 bg-[#b0b4b8] rounded-lg py-1 text-center border border-gray-300 min-w-[50px]">
                        <p className="text-[12px] text-gray-600 uppercase">Price</p>
                        {editingId === item._id ? (
                          <input
                            type="number"
                            className="w-full bg-transparent text-center font-bold text-[12px] outline-none border-b border-blue-600"
                            value={editValues.price}
                            onChange={(e) => {
                              const val = e.target.value;
                              const newPrice = parseFloat(val);
                              const calculatedTotal = isNaN(newPrice) ? "" : (newPrice * item.totalQty).toFixed(1);
                              setEditValues({ ...editValues, price: val, total: calculatedTotal });
                            }}
                          />
                        ) : (
                          <p className="text-xs font-bold">{item.price || "0"}</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-[2px]">
                         <div className="w-3 h-[2px] bg-red-600"></div>
                         <div className="w-3 h-[2px] bg-red-600"></div>
                      </div>

                      {/* Total */}
                      <div className="flex-1 bg-[#b0b4b8] rounded-lg py-1 text-center border border-gray-300 min-w-[60px]">
                        <p className="text-[12px] text-gray-600 uppercase">Total</p>
                        {editingId === item._id ? (
                          <input
                            type="number"
                            className="w-full bg-transparent text-center font-bold text-xs outline-none border-b border-blue-600"
                            value={editValues.total}
                            onChange={(e) => {
                              const val = e.target.value;
                              const newTotal = parseFloat(val);
                              const calculatedPrice = isNaN(newTotal) || !item.totalQty ? "" : (newTotal / item.totalQty).toFixed(1);
                              setEditValues({ ...editValues, total: val, price: calculatedPrice });
                            }}
                          />
                        ) : (
                          <p className="text-xs font-bold">{item.total || "0"}</p>
                        )}
                      </div>

                      {/* Action */}
                      <button
                        onClick={() => (editingId === item._id ? handleSave(item._id) : handleEdit(item))}
                        className={`p-2 rounded-lg border transition-colors ${
                          editingId === item._id ? "bg-blue-500 text-white" : "bg-[#8cc48c] text-gray-800"
                        }`}
                      >
                        {editingId === item._id ? <FaSave size={12} /> : <FaRegEdit size={12} />}
                      </button>
                      
                      {editingId === item._id && (
                        <button onClick={() => setEditingId(null)} className="text-gray-400">
                          <FaTimes size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CompletedBatch;