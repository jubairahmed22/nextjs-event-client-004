"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFilters } from "@/app/contexts/FilterContext";
import { FilterInput } from "./FilterInput";
import { FilterPagination } from "../FilterPagination";

export const FilterParentsDetails = ({
  productCategory,
  productSubCategory,
}) => {
  const router = useRouter();
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

  // Automatically expand the category if productCategory is provided
  useEffect(() => {
    if (productCategory) {
      setExpandedCategories([productCategory]);
    }
  }, [productCategory]);

  // Filter categories to only show the matching one if productCategory is provided
  const filteredCategories = productCategory
    ? categories.filter((category) => category._id === productCategory)
    : categories;

  // Filter subcategories to only show the matching one if productSubCategory is provided
  const getFilteredSubCategories = (categoryId: string) => {
    if (!subCategories[categoryId]) return [];
    if (productSubCategory) {
      return subCategories[categoryId].filter(
        (subCat) => subCat._id === productSubCategory
      );
    }
    return subCategories[categoryId];
  };

  // Toggle subcategory visibility
  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Handle subcategory navigation
  const handleSubCategoryNavigation = (categoryId: string, subCategoryId: string) => {
    // Update the filters first
    handleSubCategoryChange(subCategoryId);
    
    // Then navigate to the subcategory page
    router.push(`/all-products?category=${categoryId}&subcategory=${subCategoryId}`);
  };

  return (
    <div
 
    >
   

   <div className="flex flex-row items-center">
  <button
    onClick={clearFilters}
    className="font-montserrat text-lg text-black hover:underline duration-200"
  >
    All Products
  </button>

 <div>
 {filteredCategories.length > 0 && (
    <div className="">
      {filteredCategories.map((category) => (
        <div className="flex flex-row" key={category._id}>
          <div className="flex flex-row items-center  text-lg justify-between px-3 rounded-md transition-colors
            cursor-pointer
            ${
              filters.category === category._id
                ? 'text-rose-900  font-montserrat'
                : 'hover:text-black text-black'
            }"
          >
            <button
              onClick={() => {
                handleCategoryChange(category._id);
                router.push(`/all-products?category=${category._id}`);
              }}
              className="flex-grow text-left"
            >
              {`>`} <span className="hover:underline duration-200">{category.title}</span>
            </button>

            {/* {category.hasSubcategories && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCategoryExpansion(category._id);
                }}
                aria-label={`Toggle ${category.title} subcategories`}
              >
                <svg
                  className={`w-4 h-4 transform transition-transform ${
                    expandedCategories.includes(category._id)
                      ? 'rotate-90'
                      : ''
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
              </button>
            )} */}
          </div>

          {expandedCategories.includes(category._id) && category.hasSubcategories && (
            <div className="">
              {getFilteredSubCategories(category._id)?.map((subCat) => (
                <button
                  key={subCat._id}
                  onClick={() => handleSubCategoryNavigation(category._id, subCat._id)}
                  className={`block w-full text-left text-lg rounded-md transition-colors
                    ${
                      filters.subCategory === subCat._id
                        ? 'text-rose-900 '
                        : 'hover:text-black duration-300 text-black'
                    }`}
                >
                  {`>`} <span className="hover:underline duration-200">{subCat.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )}
 </div>
</div>




     
    </div>
  );
};