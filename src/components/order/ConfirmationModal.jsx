import React from "react";

const ConfirmationModal = ({ showConfirmModal, onCancel, onConfirm }) => {
  if (!showConfirmModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-60">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
        <p className="mb-6">
          Are you sure you want to delete this order? This action cannot be undone.
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-gray-300 cursor-pointer rounded hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 cursor-pointer py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;