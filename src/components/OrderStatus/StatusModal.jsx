export default function StatusModal({ selectedStep, confirmChange, onClose }) {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-4">Change Order Status</h3>
        <p className="text-gray-600 mb-6">
          The order will be moved to <b>{selectedStep?.title}</b>.
        </p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={confirmChange}
          >
            Confirm
          </button>
        </div>
      </div>
    );
  }
  