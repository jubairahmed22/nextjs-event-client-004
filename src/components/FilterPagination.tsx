"use client";

import { useFilters } from "@/app/contexts/FilterContext";

export const FilterPagination = () => {
  const { 
    currentPage, 
    totalPages, 
    handlePageChange,
    totalProducts,
    loading
  } = useFilters();

  if (loading || totalPages <= 1) return null;

  // Calculate visible page numbers with smart truncation
  const getVisiblePages = () => {
    const visiblePages = [];
    const maxVisible = 5; // Maximum pages to show at once
    
    // Always show first page
    visiblePages.push(1);
    
    // Calculate start and end of middle pages
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);
    
    // Adjust if we're near the start or end
    if (currentPage <= 3) {
      end = Math.min(4, totalPages - 1);
    } else if (currentPage >= totalPages - 2) {
      start = Math.max(totalPages - 3, 2);
    }
    
    // Add ellipsis if needed after first page
    if (start > 2) {
      visiblePages.push('...');
    }
    
    // Add middle pages
    for (let i = start; i <= end; i++) {
      visiblePages.push(i);
    }
    
    // Add ellipsis if needed before last page
    if (end < totalPages - 1) {
      visiblePages.push('...');
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      visiblePages.push(totalPages);
    }
    
    return visiblePages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-col font-montserrat sm:flex-row items-center justify-between gap-4 mt-8 px-4">
      <div className="text-sm text-gray-600 whitespace-nowrap">
        Showing page {currentPage} of {totalPages} ({totalProducts} items)
      </div>
      
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-rose-100 text-rose-700 hover:bg-rose-200"
          }`}
          aria-label="Previous page"
        >
          Previous
        </button>
        
        <div className="flex items-center gap-1">
          {visiblePages.map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2 py-1">...</span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageChange(page as number)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base ${
                  currentPage === page
                    ? "bg-rose-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            )
          ))}
        </div>
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-rose-100 text-rose-700 hover:bg-rose-200"
          }`}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
};