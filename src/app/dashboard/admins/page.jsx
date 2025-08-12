"use client";

import { useState, useEffect } from "react";

const AdminPage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  // Load admins on component mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
        Admin List
      </h1>

      {loading && <p className="text-center text-gray-600 text-lg">Loading admins...</p>}

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
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition"
                    >
                      Update
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
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
    </div>
  );
};

export default AdminPage;
