"use client";

import { useFilters } from "@/app/contexts/FilterContext";

export const FilterSidebarPagination = () => {
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
    <div className="flex items-center justify-center gap-2 mt-8">
  {/* Previous button */}
  <button
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1}
    className="p-2 rounded-md disabled:opacity-50 hover:bg-gray-100"
    aria-label="Previous page"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  </button>
  
  {/* Page numbers */}
  <div className="flex items-center gap-1">
    {visiblePages.map((page, index) => (
      page === '...' ? (
        <span key={`ellipsis-${index}`} className="px-2">...</span>
      ) : (
        <button
          key={page}
          onClick={() => handlePageChange(page as number)}
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentPage === page
              ? "bg-rose-500 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      )
    ))}
  </div>
  
  {/* Next button */}
  <button
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === totalPages}
    className="p-2 rounded-md disabled:opacity-50 hover:bg-gray-100"
    aria-label="Next page"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
  </button>
</div>
  );
};