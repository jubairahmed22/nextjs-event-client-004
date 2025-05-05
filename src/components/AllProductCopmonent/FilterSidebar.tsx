"use client";

import { useState } from "react";
import { useFilters } from "@/app/contexts/FilterContext";
import { FilterInput } from "./FilterInput";
import { FilterPagination } from "../FilterPagination";
import { FilterSidebarPagination } from "../FilterSidebarPagination";

export const FilterSidebar = () => {
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

  // State to track expanded categories
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Toggle subcategory visibility
  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
    md:translate-x-0 transform transition-transform duration-300 ease-in-out
    w-full font-sans p-6 bg-white fixed md:static h-full z-40 overflow-y-auto
    shadow-lg md:shadow-none border-r border-gray-100`}
>
  {/* Header */}
  <div className="flex justify-between items-center mb-8">
    <h2 className="text-2xl font-bold text-gray-900">Filters</h2>
    <button
      onClick={clearFilters}
      className="text-sm text-rose-500 hover:text-rose-700 font-medium 
        flex items-center gap-1 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      Reset All
    </button>
  </div>

  {/* Promotions Section */}
  <div className="mb-8">
    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
      </svg>
      Special Offers
    </h3>
    <button
      onClick={handlePromotionToggle}
      className={`w-full py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3
        ${filters.promotionFilter === "true"
          ? "bg-gradient-to-r from-rose-50 to-pink-50 text-rose-600 border border-rose-200 shadow-sm"
          : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-sm"
        }`}
    >
      <div className={`w-5 h-5 rounded flex items-center justify-center 
        ${filters.promotionFilter === "true" 
          ? "bg-rose-500 text-white" 
          : "border-2 border-gray-300"}`}>
        {filters.promotionFilter === "true" && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <span className="font-medium">Show Promotions Only</span>
    </button>
  </div>

  {/* Categories Section */}
  <div className="mb-8">
    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
      Categories
    </h3>
    <div className="space-y-2">
      {categories.map((category) => (
        <div key={category._id} className="group">
          <div className="flex items-center bg-gray-50 rounded-lg overflow-hidden">
            <button
              onClick={() => handleCategoryChange(category._id)}
              className={`flex-grow text-left px-4 py-3 transition-all duration-200 flex items-center
                ${filters.category === category._id
                  ? "bg-rose-500 text-white"
                  : "hover:bg-gray-100 text-gray-700"
                }`}
            >
              <span className="truncate">{category.title}</span>
              {filters.category === category._id && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            {category.hasSubcategories && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCategoryExpansion(category._id);
                }}
                className={`p-2 mr-1 rounded-md transition-colors
                  ${filters.category === category._id 
                    ? "text-white hover:bg-rose-600" 
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"}`}
              >
                <svg
                  className={`w-4 h-4 transform transition-transform ${expandedCategories.includes(category._id) ? "rotate-90" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Subcategories */}
          {expandedCategories.includes(category._id) && category.hasSubcategories && (
            <div className="ml-4 mt-2 space-y-1.5 border-l-2 border-gray-200 pl-3 py-1">
              {subCategories[category._id]?.map((subCat) => (
                <button
                  key={subCat._id}
                  onClick={() => handleSubCategoryChange(subCat._id)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm flex items-center
                    ${filters.subCategory === subCat._id
                      ? "bg-rose-100 text-rose-700 font-medium"
                      : "hover:bg-gray-100 text-gray-600"
                    }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></span>
                  {subCat.title}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
 <FilterSidebarPagination></FilterSidebarPagination>

</div>
  );
};
