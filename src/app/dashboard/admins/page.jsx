"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{message}</h2>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
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
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState(null);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/admins");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const fetchedAdmins = await res.json();
      setAdmins(fetchedAdmins);
    } catch (err) {
      console.error("Error fetching admins:", err);
      setError("Failed to load admins. Please try again.");
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
      const res = await fetch(`/api/admins/${selectedAdminId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete admin");
      }

      setAdmins((prev) =>
        prev.filter((admin) => admin._id !== selectedAdminId)
      );
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Error deleting admin");
    } finally {
      setModalOpen(false);
      setSelectedAdminId(null);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-16">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
        Admin List
      </h1>

      {loading && (
        <p className="text-center text-gray-600 text-lg">Loading admins...</p>
      )}

      {error && <p className="text-center text-red-600 text-lg">{error}</p>}

      {!loading && !error && admins.length === 0 && (
        <p className="text-center text-gray-600 text-lg">No admins found.</p>
      )}

      {!loading && !error && admins.length > 0 && (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin, idx) => (
                <tr
                  key={admin._id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="border border-gray-300 px-6 py-4 text-gray-800">
                    {admin.name}
                  </td>
                  <td className="border border-gray-300 px-6 py-4 text-gray-800">
                    {admin.email}
                  </td>
                  <td className="border border-gray-300 px-6 py-4 flex gap-3">
                    <button
                      onClick={() => handleDeleteClick(admin?._id)}
                      className="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-3 py-1 rounded transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
