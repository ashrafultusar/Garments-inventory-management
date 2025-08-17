import React from "react";

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const pages = [...Array(totalPages).keys()].map((i) => i + 1);

  return (
    <div className="flex items-center justify-between mt-6">
      {/* Pagination buttons centered */}
      <div className="flex justify-center items-center gap-2 flex-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 cursor-pointer border rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 border rounded-md cursor-pointer ${
              currentPage === page ? "bg-black text-white" : "bg-white"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border rounded-md disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>
      </div>

      {/* Items per page dropdown (right side) */}
      <div>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="border text-center border-gray-300 rounded py-2 min-w-[60px] cursor-pointer"
        >
          <option value={12}>12</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
    </div>
  );
};

export default PaginationControls;
