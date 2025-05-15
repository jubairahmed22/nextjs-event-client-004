// components/AllProductCopmonent/FilterSidebar.tsx
"use client";

import { useFilters } from "@/app/contexts/FilterContext";
import { FilterInput } from "./FilterInput";
import { FilterPagination } from "../FilterPagination";

export const FilterSearchAllProducts = () => {
  const {
    isSidebarOpen,
    categories,
    subCategories,
    filters,
    handleFilterChange,
    handlePriceChange,
    handlePromotionToggle,
    handleCategoryChange,
    handleSubCategoryChange,
    clearFilters,
  } = useFilters();

  return (
    <div>
      {/* Search Filter */}
      <div className=" font-montserrat w-full lg:w-96">
        <div className="font-montserrat w-full lg:w-96 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            id="title"
            name="title"
            value={filters.title}
            onChange={handleFilterChange}
            placeholder="Search by title"
            className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg  focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-white dark:border-gray-white dark:placeholder-gray-900 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
