"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FaRegEdit, FaSave, FaTimes, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";

const CompletedBatch = ({ orderId }) => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ price: "", total: "" });
  const [searchTerm, setSearchTerm] = useState("");

  
  const BILLING_CATEGORIES = ["client", "dyeing", "calender"];

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const res = await fetch(`/api/batch/completed/billing-summary/${orderId}`);
        const data = await res.json();
        if (!res.ok) throw new Error();
        setSummaries(data.data || []);
      } catch {
        toast.error("Failed to load billing summaries");
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchSummaries();
  }, [orderId]);

 
  const processedData = useMemo(() => {

    const filtered = summaries?.filter((item) => {
      if (!searchTerm) return true;
      return item.invoiceNumber?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });

  
    return filtered?.reduce((acc, item) => {
      if (!acc[item.summaryType]) acc[item.summaryType] = [];
      acc[item.summaryType].push(item);
      return acc;
    }, {});
  }, [summaries, searchTerm]);

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
      setSummaries((prev) =>
        prev?.map((item) => (item._id === id ? { ...item, ...editValues } : item))
      );
      setEditingId(null);
      toast.success("Billing updated");
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* search section*/}
      <div className="p-4 bg-white border-b sticky top-0 z-10 shadow-sm">
        <h1 className="text-md font-bold text-gray-700 mb-3">Client Billing</h1>
        <div className="relative max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSearch className="text-gray-400" size={14} />
          </span>
          <input
            type="text"
            placeholder="Search by Invoice ID..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="p-3">
        {loading ? (
          <p className="text-center text-sm py-10 text-gray-500">Loading...</p>
        ) : (
          //service sequience wise loop 
          BILLING_CATEGORIES.map((type) => {
            const items = processedData?.[type] || [];
            return (
              <div key={type} className="mb-6">
                <h2 className="text-[11px] font-black uppercase text-gray-500 mb-3 border-l-4 border-blue-500 pl-2 tracking-wider">
                  {type} Billing
                </h2>

                <div className="space-y-3">
                  {items?.length > 0 ? (
                    items?.map((item) => (
                      <div key={item._id} className="bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
                        {/* Batch Info Card */}
                        <div className="bg-gray-100 p-2 rounded-lg mb-2 border border-gray-200">
                          <p className="text-[13px] font-bold text-gray-800 leading-tight uppercase">
                            {item?.batchName} • {item?.colour} • {item?.finishingType} • 
                            <span className="text-blue-600 ml-1">{item?.invoiceNumber}</span>
                          </p>
                        </div>

                        {/* Calculation Area */}
                        <div className="flex items-center justify-between gap-1">
                          {/* Qty */}
                          <div className="flex-1 bg-gray-50 rounded-lg py-1 text-center border border-gray-200">
                            <p className="text-[10px] text-gray-500 font-bold">Goj</p>
                            <p className="text-xs font-black">{item.totalQty}</p>
                          </div>

                          <span className="text-red-400 font-bold text-xs">×</span>

                          {/* Price Input/Text */}
                          <div className={`flex-1 rounded-lg py-1 text-center border ${editingId === item._id ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                            <p className="text-[10px] text-gray-500 font-bold uppercase">Price</p>
                            {editingId === item._id ? (
                              <input
                                type="number"
                                className="w-full bg-transparent text-center font-bold text-xs outline-none"
                                value={editValues.price}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const newPrice = parseFloat(val);
                                  const total = isNaN(newPrice) ? "" : (newPrice * item.totalQty).toFixed(1);
                                  setEditValues({ ...editValues, price: val, total });
                                }}
                              />
                            ) : (
                              <p className="text-xs font-black">৳{item.price || "0"}</p>
                            )}
                          </div>

                          <div className="flex flex-col gap-[2px]">
                            <div className="w-3 h-[1.5px] bg-gray-400"></div>
                            <div className="w-3 h-[1.5px] bg-gray-400"></div>
                          </div>

                          {/* Total Input/Text */}
                          <div className={`flex-1 rounded-lg py-1 text-center border ${editingId === item._id ? 'border-blue-400 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                            <p className="text-[10px] text-gray-500 font-bold uppercase">Total</p>
                            {editingId === item._id ? (
                              <input
                                type="number"
                                className="w-full bg-transparent text-center font-bold text-xs outline-none"
                                value={editValues.total}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const newTotal = parseFloat(val);
                                  const price = (isNaN(newTotal) || !item.totalQty) ? "" : (newTotal / item.totalQty).toFixed(1);
                                  setEditValues({ ...editValues, total: val, price });
                                }}
                              />
                            ) : (
                              <p className="text-xs font-black text-gray-700">৳{item.total || "0"}</p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-1 pl-1">
                            <button
                              onClick={() => (editingId === item._id ? handleSave(item._id) : handleEdit(item))}
                              className={`p-2 rounded-lg border transition-all ${
                                editingId === item._id ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
                              }`}
                            >
                              {editingId === item._id ? <FaSave size={12} /> : <FaRegEdit size={12} />}
                            </button>
                            {editingId === item._id && (
                              <button onClick={() => setEditingId(null)} className="p-2 bg-gray-200 rounded-lg text-gray-600">
                                <FaTimes size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    
                    <div className="py-4 text-center border border-dashed border-gray-300 rounded-xl bg-gray-50/50">
                      <p className="text-[10px] text-gray-400 italic">No {type} records found.</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CompletedBatch;