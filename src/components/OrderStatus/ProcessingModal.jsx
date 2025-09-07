export default function ProcessingModal({
    orderId,
    confirmChange,
    onClose,
  }) {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-2">Mark Completed Process</h3>
        <p className="text-sm text-gray-500 mb-4">#{orderId}</p>
  
      
  
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
  