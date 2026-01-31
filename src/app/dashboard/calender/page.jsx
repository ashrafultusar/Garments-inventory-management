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
  Calendar as CalendarIcon 
} from "lucide-react";

export default function CalenderPage() {
  const [calenders, setCalenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCalenders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/calender");
      if (!res.ok) throw new Error("Failed to fetch calenders");
      const data = await res.json();
      setCalenders(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load calenders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalenders();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this calender?")) return;
    try {
      const res = await fetch(`/api/calender/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete calender");
      toast.success("Calender deleted!");
      fetchCalenders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete calender");
    }
  };

  // Filter for search
  const filteredData = calenders.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-10 md:pt-10 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 mt-6 lg:mt-0">
          <div className="flex items-center gap-3">
            <div className="bg-[#e0fcf6] p-2.5 rounded-lg border border-[#c6f6eb]">
              <CalendarIcon className="text-[#0694a2]" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1e293b]">Calendar</h1>
              <p className="text-sm text-gray-500 font-medium">Manage schedules and events</p>
            </div>
          </div>
          <Link 
            href="/dashboard/calender/createCalender" 
            className="inline-flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-5 py-2.5 rounded-lg font-semibold transition shadow-sm shadow-blue-200"
          >
            <Plus size={18} /> Add Event
          </Link>
        </div>

        {/* SEARCH BAR */}
        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition shadow-sm"
          />
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Events</p>
            <p className="text-3xl font-extrabold text-gray-900 mt-1">{calenders.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Active</p>
            <p className="text-3xl font-extrabold text-[#0694a2] mt-1">{calenders.length}</p>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-bold text-[#475569] uppercase tracking-wider">Event Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#475569] uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#475569] uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                   <tr>
                    <td colSpan={3} className="py-20">
                      <div className="flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div></div>
                    </td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map((c) => (
                    <tr key={c._id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4 text-sm font-semibold text-[#1e293b]">{c.name}</td>
                      <td className="px-6 py-4 text-sm text-[#475569] font-medium">{c.location || "N/A"}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/dashboard/calender/profile/${c._id}`}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                          >
                            <Eye size={19} />
                          </Link>
                          <Link
                            href={`/dashboard/calender/edit/${c._id}`}
                            className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition"
                          >
                            <Pencil size={19} />
                          </Link>
                          <button
                            onClick={() => handleDelete(c._id)}
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
                    <td colSpan={3} className="text-center py-12 text-gray-400 font-medium">No events found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}