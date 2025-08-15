"use client";
import { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { LuTrash2 } from "react-icons/lu";
import { toast } from "react-toastify";

const Page = () => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formValue, setFormValue] = useState("");
  const [deleteId, setDeleteId] = useState(null); // for modal

  const fetchTypes = async () => {
    try {
      const res = await fetch("/api/menu/finishing-type");
      const data = await res.json();
      setTypes(data);
    } catch (error) {
      toast.error("Failed to fetch finishing types");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = formValue.trim();
    if (!name) return toast.error("Please enter a finishing type");

    setLoading(true);

    try {
      let res;
      if (editingId) {
        res = await fetch(`/api/menu/finishing-type/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
        if (!res.ok) {
          const err = await res.json();
          toast.error(err.error || "Failed to update");
          return;
        }
        toast.success("Updated successfully");
      } else {
        res = await fetch("/api/menu/finishing-type", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
        if (!res.ok) {
          const err = await res.json();
          toast.error(err.error || "Failed to add");
          return;
        }
        toast.success("Added successfully");
      }

      setFormValue("");
      setEditingId(null);
      fetchTypes();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id, currentName) => {
    setEditingId(id);
    setFormValue(currentName);
  };

  const confirmDelete = (id) => {
    setDeleteId(id); // show modal
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/menu/finishing-type/${deleteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Deleted successfully");
        fetchTypes();
      } else {
        const err = await res.json();
        toast.error(err.error || "Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Something went wrong while deleting");
    } finally {
      setDeleteId(null); // close modal
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormValue("");
  };

  return (
    <div className="py-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {editingId ? "Update Finishing Type" : "Upload Finishing Type"}
      </h2>

      <form onSubmit={handleSubmit} className="mb-6 flex gap-4">
        <input
          type="text"
          name="finishingType"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Enter finishing type"
          className="border px-4 py-2 flex-1 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
      </form>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {types.length ? (
              types.map((type, i) => (
                <tr key={type._id} className="text-center border-t">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">{type.name}</td>
                  <td className="px-4 py-2 flex gap-3 justify-center">
                    <button
                      onClick={() => handleEdit(type._id, type.name)}
                      title="Edit"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      onClick={() => confirmDelete(type._id)}
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
                <td colSpan="3" className="text-center py-4">
                  No finishing types found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80 text-center">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6 text-gray-600">Are you sure you want to delete this finishing type?</p>
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
