// components/AllProductCopmonent/FilterCategorySidebar.tsx
"use client";

import { useFilters } from "@/app/contexts/FilterContext";
import { FilterInput } from "./FilterInput";

export const FilterCategorySidebar = () => {
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
    <div
      className={`${
        isSidebarOpen ? "" : ""
      }  w-full font-montserrat p-5 bg-white shadow-md h-full z-40 overflow-y-auto`}
    >
        
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Filters</h2>
        <button
          onClick={clearFilters}
          className="text-sm text-rose-600 hover:text-rose-800 font-medium"
        >
          Clear all
        </button>
      </div>

      {/* Promotions */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
          Special Offers
        </h3>
        <button
          onClick={handlePromotionToggle}
          className={`w-full py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center justify-center space-x-2 ${
            filters.promotionFilter === "true"
              ? "bg-rose-100 text-rose-700 border border-rose-200"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <svg
            className={`w-5 h-5 ${
              filters.promotionFilter === "true"
                ? "text-rose-500"
                : "text-gray-400"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
          <span>Show Promotions</span>
        </button>
      </div>

      {/* Categories Section */}
      <div className="mb-6">
      
        <div className="space-y-1">
          {categories.map((category) => (
            <div key={category._id}>
              <button
                onClick={() => handleCategoryChange(category._id)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  filters.category === category._id
                    ? "bg-rose-50 text-rose-700"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{category.title}</span>
                  {category.hasSubcategories && (
                    <svg
                      className={`w-4 h-4 transform transition-transform ${
                        filters.category === category._id ? "rotate-90" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </div>
              </button>

              {/* Subcategories */}
              {filters.category === category._id &&
                category.hasSubcategories && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-2">
                    {subCategories[category._id]?.map((subCat) => (
                      <button
                        key={subCat._id}
                        onClick={() => handleSubCategoryChange(subCat._id)}
                        className={`w-full text-left px-3 py-1.5 rounded-md transition-colors text-sm ${
                          filters.subCategory === subCat._id
                            ? "bg-rose-50 text-rose-700"
                            : "hover:bg-gray-50 text-gray-600"
                        }`}
                      >
                        {subCat.title}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
