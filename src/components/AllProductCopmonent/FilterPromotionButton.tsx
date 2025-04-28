// components/AllProductCopmonent/FilterCategorySidebar.tsx
"use client";

import { useFilters } from "@/app/contexts/FilterContext";
import { FilterInput } from "./FilterInput";

export const FilterPromotionButton = () => {
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
    <div className="flex justify-center items-center">
      <button
        onClick={handlePromotionToggle}
        className="px-8 py-3 bg-gradient-to-r font-montserrat from-rose-700 to-rose-900 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:shadow-rose-400/20 transition-all duration-300 hover:scale-105"
      >
        View All Promotion Products
      </button>
    </div>
  );
};
