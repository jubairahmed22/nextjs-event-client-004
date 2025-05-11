// components/AllProductCopmonent/FilterRentalEvents.tsx
"use client";

import { useFilters } from "@/app/contexts/FilterContext";
import { FilterInput } from "./FilterInput";
import { FilterPagination } from "../FilterPagination";
import Image from "next/image";
import { motion } from 'framer-motion';

export const FilterRentalEvents = () => {
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

  const text = "Décor Rental";
const letters = text.split("");

  return (
    <div className="max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-8 my-20">
  

<motion.div className="text-start mb-16">
  <h1 className="mb-4 text-lg md:text-2xl lg:text-6xl uppercase font-playfairDisplay font-bold">
    <span className="relative inline-block">
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5,
            delay: i * 0.05 
          }}
          className="relative text-transparent bg-clip-text bg-gradient-to-r from-rose-700 to-rose-900"
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </span>
  </h1>
</motion.div>
     
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category._id}
            className="relative h-[400px] rounded-lg overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:scale-[1.02] border border-gray-200 dark:border-gray-700 cursor-pointer"
            onClick={() => handleCategoryChange(category._id)}
          >
            {/* Image Background */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                className="w-full h-full object-cover rounded-lg transition-all duration-700 group-hover:scale-110"
                src={category.singleImage || "/placeholder-category.jpg"}
                alt={category.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-lg opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-end p-6">
              {/* Title with hover effects */}
              <div className="transform transition-all duration-500 group-hover:-translate-y-2">
                <h1 className="text-4xl font-bold text-white mb-2 text-center [text-shadow:_0_2px_8px_rgba(0,0,0,0.7)] font-playfairDisplay tracking-tight">
                  {category.title}
                </h1>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-56">
      <FilterPagination />
      </div>
    </div>
  );
};
