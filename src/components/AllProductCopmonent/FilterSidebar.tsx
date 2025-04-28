// components/AllProductCopmonent/FilterSidebar.tsx
"use client";

import { useFilters } from "@/app/contexts/FilterContext";
import { FilterInput } from "./FilterInput";

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

  return (
    <div
      className={`${
        isSidebarOpen ? "block" : "hidden"
      } md:block w-72 font-montserrat p-5 bg-white shadow-md fixed md:static h-full z-40 overflow-y-auto`}
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

      {/* Title Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
          Search
        </h3>
        <FilterInput
          label=""
          id="title"
          name="title"
          value={filters.title}
          onChange={handleFilterChange}
          placeholder="Search by title"
        />
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
          Price Range
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="minPrice"
              className="block text-xs text-gray-500 mb-1"
            >
              Min price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">$</span>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                min="0"
                value={filters.minPrice || ""}
                onChange={handlePriceChange}
                placeholder="0"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="maxPrice"
              className="block text-xs text-gray-500 mb-1"
            >
              Max price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">$</span>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                min="0"
                value={filters.maxPrice || ""}
                onChange={handlePriceChange}
                placeholder="Any"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
              />
            </div>
          </div>
        </div>
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
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
          Categories
        </h3>
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
