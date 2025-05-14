"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const getVisiblePages = () => {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex justify-center lg:text-xl text-sm mt-6 space-x-1 font-montserrat">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      {/* {visiblePages[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={`px-3 py-1 rounded-md ${
              1 === currentPage
                ? "bg-rose-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            1
          </button>
          {visiblePages[0] > 2 && <span className="px-3 py-1">...</span>}
        </>
      )} */}

      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-md ${
            currentPage === page
              ? "bg-rose-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
          }`}
        >
          {page}
        </button>
      ))}

      {/* {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="px-3 py-1">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className={`px-3 py-1 rounded-md ${
              totalPages === currentPage
                ? "bg-rose-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            {totalPages}
          </button>
        </>
      )} */}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};