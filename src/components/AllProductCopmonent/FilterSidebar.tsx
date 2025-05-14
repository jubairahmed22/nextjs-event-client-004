"use client";

import { useState, useEffect } from "react";
import { useFilters } from "@/app/contexts/FilterContext";
import { FilterSidebarPagination } from "../FilterSidebarPagination";

interface FilterSidebarProps {
  onClose?: () => void;
}

export const FilterSidebar = ({ onClose }: FilterSidebarProps) => {
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

  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (
      filters.category &&
      subCategories[filters.category] &&
      !expandedCategories.includes(filters.category)
    ) {
      setExpandedCategories((prev) => [...prev, filters.category]);
    }
  }, [filters.category, subCategories]);

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handlePromotionClick = () => {
    handlePromotionToggle();
    onClose?.();
  };

  const handleCategoryClick = (categoryId: string) => {
    handleCategoryChange(categoryId);
    onClose?.();
  };

  const handleSubCategoryClick = (subCategoryId: string) => {
    handleSubCategoryChange(subCategoryId);
    onClose?.();
  };

  const handleResetFilters = () => {
    clearFilters();
    onClose?.();
  };

  return (
    <div className="font-montserrat">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 sm:mb-6">
        <button
          onClick={handleResetFilters}
          className="text-xs sm:text-sm text-rose-600 hover:text-rose-800 font-medium 
      flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-rose-50"
          aria-label="Reset all filters"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 sm:h-4 w-3.5 sm:w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Reset All
        </button>
      </div>

      {/* Promotions Section */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-[0.65rem] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 sm:mb-3 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 sm:h-4 w-3.5 sm:w-4 mr-1.5 sm:mr-2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
            />
          </svg>
          Special Offers
        </h3>
        <button
          onClick={handlePromotionClick}
          className={`w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-all duration-200 flex items-center justify-between
      ${
        filters.promotionFilter === "true"
          ? "bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 border-2 border-rose-200 shadow-sm"
          : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-sm"
      }`}
          aria-pressed={filters.promotionFilter === "true"}
        >
          <span className="font-medium flex items-center text-sm sm:text-base">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 sm:h-5 w-4 sm:w-5 mr-1.5 sm:mr-2 ${
                filters.promotionFilter === "true"
                  ? "text-rose-500"
                  : "text-gray-400"
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Promotions Only
          </span>
          <div
            className={`w-4 sm:w-5 h-4 sm:h-5 rounded flex items-center justify-center transition-colors
        ${
          filters.promotionFilter === "true"
            ? "bg-rose-500 text-white"
            : "border-2 border-gray-300 group-hover:border-gray-400"
        }`}
          >
            {filters.promotionFilter === "true" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-2.5 sm:h-3 w-2.5 sm:w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </button>
      </div>

      {/* Categories Section */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-[0.65rem] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 sm:mb-3 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 sm:h-4 w-3.5 sm:w-4 mr-1.5 sm:mr-2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
          Categories
        </h3>
        <div className="space-y-1.5 sm:space-y-2">
          {categories.map((category) => (
            <div key={category._id} className="group">
              <div className="flex items-center bg-gray-50 rounded-lg overflow-hidden transition-all duration-200 hover:bg-gray-100">
                <button
                  onClick={() => handleCategoryClick(category._id)}
                  className={`flex-grow text-left font-medium text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3 transition-all duration-200 flex items-center justify-between
              ${
                filters.category === category._id
                  ? "bg-rose-500 text-white"
                  : "text-gray-700 hover:text-gray-900"
              }`}
                  aria-expanded={expandedCategories.includes(category._id)}
                >
                  <span className="truncate">{category.title}</span>
                  <div className="flex items-center">
                    {filters.category === category._id && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 sm:h-4 w-3.5 sm:w-4 ml-1.5 sm:ml-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>

                {category.hasSubcategories && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCategoryExpansion(category._id);
                    }}
                    className={`p-1.5 sm:p-2 mr-0.5 sm:mr-1 rounded-md transition-colors
                ${
                  filters.category === category._id
                    ? "text-gray-900"
                    : "text-gray-900"
                }`}
                    aria-label={`${
                      expandedCategories.includes(category._id)
                        ? "Collapse"
                        : "Expand"
                    } ${category.title} subcategories`}
                  >
                    <svg
                      className={`w-3.5 sm:w-4 h-3.5 sm:h-4 transform transition-transform ${
                        expandedCategories.includes(category._id)
                          ? "rotate-90"
                          : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Subcategories */}
              {expandedCategories.includes(category._id) &&
                category.hasSubcategories && (
                  <div className="ml-3 sm:ml-4 mt-1.5 sm:mt-2 space-y-1 sm:space-y-1.5 border-l-2 border-gray-200 pl-2 sm:pl-3 py-1 sm:py-1.5">
                    {subCategories[category._id]?.map((subCat) => (
                      <button
                        key={subCat._id}
                        onClick={() => handleSubCategoryClick(subCat._id)}
                        className={`w-full text-left px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md transition-colors text-xs sm:text-sm flex items-center
                    ${
                      filters.subCategory === subCat._id
                        ? "bg-rose-100 text-rose-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                      >
                        <span
                          className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full mr-1.5 sm:mr-2 ${
                            filters.subCategory === subCat._id
                              ? "bg-rose-500"
                              : "bg-gray-400"
                          }`}
                        ></span>
                        {subCat.title}
                        {filters.subCategory === subCat._id && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 sm:h-3.5 w-3 sm:w-3.5 ml-auto text-rose-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>

      <FilterSidebarPagination />
    </div>
  );
};
