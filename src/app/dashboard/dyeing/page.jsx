"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Eye, 
  Pencil, 
  Trash2, 
  Droplets 
} from "lucide-react";

const DyeingPage = () => {
  const [dyeings, setDyeings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchDyeings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dyeings");
      if (!res.ok) throw new Error("Failed to fetch dyeings");
      const data = await res.json();
      setDyeings(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dyeings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDyeings();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this dyeing unit?")) return;
    try {
      const res = await fetch(`/api/dyeings/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete dyeing");
      toast.success("Dyeing unit deleted!");
      fetchDyeings();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete dyeing");
    }
  };

  // Filter for search
  const filteredData = dyeings?.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-14  p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 mt-6 lg:mt-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-100">
              <Droplets className="text-blue-600" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1e293b]">Dyeing Management</h1>
              <p className="text-sm text-gray-500 font-medium">Monitor and manage dyeing units</p>
            </div>
          </div>
          <Link 
            href="/dashboard/dyeing/createDyeing" 
            className="inline-flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-5 py-2.5 rounded-lg font-semibold transition shadow-sm shadow-blue-200"
          >
            <Plus size={18} /> Create Dyeing
          </Link>
        </div>

        {/* SEARCH BAR */}
        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search units..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition shadow-sm"
          />
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Units</p>
            <p className="text-3xl font-extrabold text-gray-900 mt-1">{dyeings?.length || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Active Units</p>
            <p className="text-3xl font-extrabold text-green-600 mt-1">{dyeings?.length || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Capacity</p>
            <p className="text-3xl font-extrabold text-blue-600 mt-1">100%</p>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-bold text-[#475569] uppercase tracking-wider">Unit Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#475569] uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#475569] uppercase tracking-wider">Employees</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#475569] uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                   <tr>
                    <td colSpan={4} className="py-20 text-center">
                      <div className="flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div></div>
                    </td>
                  </tr>
                ) : filteredData?.length > 0 ? (
                  filteredData.map((d) => (
                    <tr key={d._id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4 text-sm font-semibold text-[#1e293b]">{d.name}</td>
                      <td className="px-6 py-4 text-sm text-[#475569] font-medium">{d.location}</td>
                      <td className="px-6 py-4 text-sm text-[#475569]">
                        <div className="max-w-[200px] truncate" title={d.employees?.map((e) => e.employeeName).join(", ")}>
                            {d.employees?.map((e) => e.employeeName).join(", ") || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/dashboard/dyeing/profile/${d._id}`}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                          >
                            <Eye size={19} />
                          </Link>
                          <Link
                            href={`/dashboard/dyeing/edit/${d._id}`}
                            className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition"
                          >
                            <Pencil size={19} />
                          </Link>
                          <button
                            onClick={() => handleDelete(d._id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition cursor-pointer"
                          >
                            <Trash2 size={19} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-gray-400 font-medium">No dyeing units found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DyeingPage;