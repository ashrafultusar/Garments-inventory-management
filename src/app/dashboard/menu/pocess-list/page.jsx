"use client";
import { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { LuTrash2 } from "react-icons/lu";
import { toast } from "react-toastify";

const Page = () => {
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formValue, setFormValue] = useState({ name: "", price: "" });
  const [deleteId, setDeleteId] = useState(null);

  const fetchProcesses = async () => {
    try {
      const res = await fetch("/api/menu/process");
      const data = await res.json();
      setProcesses(data);
    } catch (error) {
      toast.error("Failed to fetch process list");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProcesses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = formValue.name.trim();
    const price = Number(formValue.price);

    if (!name || isNaN(price)) {
      return toast.error("Please enter valid name and price");
    }

    setLoading(true);

    try {
      let res;
      if (editingId) {
        res = await fetch(`/api/menu/process/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, price }),
        });
        if (!res.ok) {
          const err = await res.json();
          toast.error(err.error || "Failed to update");
          return;
        }
        toast.success("Updated successfully");
      } else {
        res = await fetch("/api/menu/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, price }),
        });
        if (!res.ok) {
          const err = await res.json();
          toast.error(err.error || "Failed to add");
          return;
        }
        toast.success("Added successfully");
      }

      setFormValue({ name: "", price: "" });
      setEditingId(null);
      fetchProcesses();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id, currentName, currentPrice) => {
    setEditingId(id);
    setFormValue({ name: currentName, price: currentPrice });
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/menu/process/${deleteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Deleted successfully");
        fetchProcesses();
      } else {
        const err = await res.json();
        toast.error(err.error || "Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Something went wrong while deleting");
    } finally {
      setDeleteId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormValue({ name: "", price: "" });
  };

  return (
    <div className="py-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {editingId ? "Update Process" : "Add Process"}
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          name="name"
          value={formValue.name}
          onChange={(e) => setFormValue({ ...formValue, name: e.target.value })}
          placeholder="Enter process name"
          className="border px-4 py-2 rounded"
        />
        <input
          type="number"
          name="price"
          value={formValue.price}
          onChange={(e) => setFormValue({ ...formValue, price: e.target.value })}
          placeholder="Enter price"
          className="border px-4 py-2 rounded"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            {loading ? (editingId ? "Updating..." : "Adding...") : editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {processes.length ? (
              processes.map((proc, i) => (
                <tr key={proc._id} className="text-center border-t">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">{proc.name}</td>
                  <td className="px-4 py-2">{proc.price}</td>
                  <td className="px-4 py-2 flex gap-3 justify-center">
                    <button
                      onClick={() => handleEdit(proc._id, proc.name, proc.price)}
                      title="Edit"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      onClick={() => confirmDelete(proc._id)}
                      title="Delete"
                      className="text-red-600 hover:text-red-800"
                    >
                      <LuTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No processes found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80 text-center">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this process?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
