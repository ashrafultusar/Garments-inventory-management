"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { 
  Plus, 
  Search, 
  Eye, 
  Pencil, 
  Trash2, 
  ShieldCheck 
} from "lucide-react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{message}</h2>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2 rounded-lg font-medium transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium transition cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminPage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState(null);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admins");
      if (!res.ok) throw new Error(`Status: ${res.status}`);
      const fetchedAdmins = await res.json();
      setAdmins(fetchedAdmins);
    } catch (err) {
      setError("Failed to load admins.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedAdminId(id);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`/api/admins/${selectedAdminId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setAdmins((prev) => prev.filter((admin) => admin._id !== selectedAdminId));
      toast.success("Admin deleted successfully");
    } catch (error) {
      toast.error("Error deleting admin");
    } finally {
      setModalOpen(false);
    }
  };

  useEffect(() => { fetchAdmins(); }, []);

  // Filter logic for search
  const filteredAdmins = admins.filter(admin => 
    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-100">
              <ShieldCheck className="text-blue-600" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1e293b]">Admin Management</h1>
              <p className="text-sm text-gray-500">Manage system administrators</p>
            </div>
          </div>
          <Link 
            href="/dashboard/signup" 
            className="inline-flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-5 py-2.5 rounded-lg font-medium transition shadow-sm shadow-blue-200"
          >
            <Plus size={18} /> Add Admin
          </Link>
        </div>

        {/* SEARCH BAR */}
        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search admins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm"
          />
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Admins</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{admins.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{admins.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Inactive</p>
            <p className="text-3xl font-bold text-gray-400 mt-1">0</p>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAdmins.map((admin) => (
                  <tr key={admin._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{admin.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{admin.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-[11px] font-bold bg-blue-50 text-blue-600 rounded-full uppercase">
                        Admin
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                      
                      
                        <button 
                          onClick={() => handleDeleteClick(admin._id)}
                          className="p-1.5 text-white bg-red-600 hover:text-red-600 hover:bg-red-50 rounded-md transition cursor-pointer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* EMPTY STATE */}
          {!loading && filteredAdmins.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-gray-500 font-medium">No admins found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this admin?"
      />
    </div>
  );
};

export default AdminPage;