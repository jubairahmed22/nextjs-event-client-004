// components/AllProductCopmonent/ProductSkeleton.tsx
import React from "react";

export const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="relative pb-[100%] bg-gray-200"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 10 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
};
