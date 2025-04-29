"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Image from "next/image";

interface Product {
  productId: string;
  _id: string;
  title: string;
  singleImage: string;
  category?: string;
  categoryTitle?: string;
  subCategory?: string;
  subCategoryTitle?: string;
}

const ProductSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim().length > 2) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/web/search/products?title=${encodeURIComponent(
          searchTerm
        )}&page=1`
      );
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.products);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = (product: Product) => {
    setSearchTerm("");
    setSearchResults([]);
    router.push(`/all-products/${product._id || product.productId}`);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto font-roboto">
      {/* Input Container */}
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
          <Search className="w-5 h-5" />
        </div>

        {/* Input Field */}
        <input
          type="text"
          placeholder="Search for products..."
          className="w-full pl-10 pr-10 py-3 text-sm rounded-2xl border border-gray-300 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600 transition-all duration-200 placeholder:text-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search products"
        />

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <div className="h-4 w-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Dropdown Results */}
      {searchResults.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-80 overflow-y-auto animate-fadeIn">
          {searchResults.map((product) => (
            <div
              key={product._id || product.productId}
              onClick={() => handleProductClick(product)}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 border-b border-gray-100 dark:border-gray-700"
            >
              {/* Product Image */}
              <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden">
                <Image
                  src={product.singleImage || "/placeholder-product.jpg"}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 48px) 100vw, 48px"
                  priority={false}
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-800 dark:text-white truncate">
                  {product.title}
                </h3>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {product.categoryTitle && (
                    <span>{product.categoryTitle}</span>
                  )}
                  {product.subCategoryTitle && (
                    <span> → {product.subCategoryTitle}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
