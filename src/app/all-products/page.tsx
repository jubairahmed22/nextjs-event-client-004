// components/AllProductCopmonent/ProductsPage.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { StatsCards } from "@/components/AllProductCopmonent/StatsCards";
import { Pagination } from "@/components/AllProductCopmonent/Pagination";
import { FilterSidebar } from "@/components/AllProductCopmonent/FilterSidebar";
import { useFilters } from "../contexts/FilterContext";
import toast from "react-hot-toast";
import ProductCard from "@/components/Card/ProductCard";
import { ProductGridSkeleton } from "@/components/AllProductCopmonent/ProductSkeleton";
import { FilterSearchAllProducts } from "@/components/AllProductCopmonent/FilterSearchAllProducts";

export const ProductsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0)
  const { filters, isSidebarOpen, setIsSidebarOpen } = useFilters();

  // Initialize page from URL params
  useEffect(() => {
    const pageParam = searchParams.get("page");
    if (pageParam) {
      try {
        const parsedPage = JSON.parse(pageParam);
        setCurrentPage(parsedPage.searchPage || 1);
      } catch (e) {
        console.error("Error parsing page parameter:", e);
      }
    }
  }, [searchParams]);

  // Fetch products from the appropriate endpoint based on promotion filter
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Determine which endpoint to use
        const endpoint =
          filters.promotionFilter === "true"
            ? "/web/products/discount"
            : "/web/all-products";

        // Prepare API params
        const apiParams: Record<string, string> = {
          page: currentPage.toString(),
        };

        // Add promotion filter if active
        if (filters.promotionFilter === "true") {
          apiParams.Promotion = "true";
          apiParams.showWebsite = "true";
        }

        // Add other filters if they exist
        if (filters.title) apiParams.title = filters.title;
        if (filters.category) apiParams.category = filters.category;
        if (filters.subCategory) apiParams.subCategory = filters.subCategory;
        if (filters.minPrice) apiParams.minPrice = filters.minPrice;
        if (filters.maxPrice) apiParams.maxPrice = filters.maxPrice;
        if (filters.SelectedType) apiParams.SelectedType = filters.SelectedType;
        if (filters.productCode) apiParams.productCode = filters.productCode;

        // Fetch products
        const response = await fetch(
          `https://server-gs.vercel.app${endpoint}?${new URLSearchParams(
            apiParams
          ).toString()}`
        );
        const data = await response.json();

        setProducts(data.products);
        setTotalPages(data.totalPages);
        setTotalProducts(data.totalProducts || 0);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, filters]);

  // In ProductsPage.tsx
useEffect(() => {
  // Reset to page 1 when filters change (except for page changes)
  setCurrentPage(1);
}, [filters.category, filters.subCategory, filters.promotionFilter, filters.title, filters.minPrice, filters.maxPrice]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    // Update URL with page parameter
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("page", JSON.stringify({ searchPage: page }));
    router.push(`?${urlParams.toString()}`, undefined, { shallow: true });
  };

  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [wishlistedProducts, setWishlistedProducts] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const wishlistedIds = new Set<string>(
        cart.map((item: EventProduct) => item._id)
      );
      setWishlistedProducts(wishlistedIds);
    } catch (error) {
      console.error("Error loading wishlist:", error);
    }
  }, []);

  const calculateDiscountedPrice = (product: EventProduct): number => {
    if (product.Promotion === "true") {
      const perDayPricing = parseFloat(product.perDayPricing);
      const promotionValue = parseFloat(product.promotionValue);

      if (product.promotionType === "$") {
        return perDayPricing - promotionValue;
      } else if (product.promotionType === "%") {
        return perDayPricing - (perDayPricing * promotionValue) / 100;
      }
    }
    return parseFloat(product.perDayPricing);
  };

  const toggleWishlist = useCallback((product: EventProduct) => {
    try {
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const productIndex = existingCart.findIndex(
        (item: EventProduct) => item._id === product._id
      );

      let updatedCart: EventProduct[];
      if (productIndex > -1) {
        updatedCart = existingCart.filter(
          (item: EventProduct) => item._id !== product._id
        );
        toast.success(`${product.title} removed from wishlist!`, {
          position: "bottom-center",
        });
      } else {
        // Calculate the final price before adding to cart
        const finalPrice = calculateDiscountedPrice(product);

        updatedCart = [
          ...existingCart,
          {
            ...product,
            quantity: 1,
            perDayPricing: finalPrice,
          },
        ];

        toast.success(`${product.title} added to wishlist!`, {
          position: "bottom-center",
        });
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setWishlistedProducts((prev) => {
        const updated = new Set(prev);
        productIndex > -1
          ? updated.delete(product._id)
          : updated.add(product._id);
        return updated;
      });
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Failed to update wishlist");
    }
  }, []);

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const cartWithCalculatedPrices = cart.map((item: EventProduct) => ({
        ...item,
        perDayPricing: calculateDiscountedPrice(item),
      }));

      localStorage.setItem("cart", JSON.stringify(cartWithCalculatedPrices));
      const wishlistedIds = new Set<string>(
        cart.map((item: EventProduct) => item._id)
      );
      setWishlistedProducts(wishlistedIds);
    } catch (error) {
      console.error("Error loading wishlist:", error);
    }
  }, []);

  return (
    <div className="flex min-h-screen max-w-screen-3xl mx-auto px-4">
      {/* Main content area */}
      <div className="flex-1 p-4 md:p-5 relative">
        {/* Filter button and dropdown */}
        <div className="relative mb-4 flex">
          {/* Sidebar Toggle Button */}
          <div className="flex flex-row items-center gap-5">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex text-xl font-semibold font-montserrat items-center gap-2 px-4 py-2 bg-transparent text-gray-700 hover:text-blue-600 rounded-md hover:bg-gray-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
            </svg>
            <span>Filters</span>
          </button>
          <div className="mt-3">
          <FilterSearchAllProducts></FilterSearchAllProducts>
          </div>
          </div>

          {/* Sidebar */}
          <div
            className={`fixed inset-0 z-40 flex transition-opacity duration-300 ease-in-out ${
              showFilterDropdown
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
         
            onClick={() => setShowFilterDropdown(false)}
          >
            <div
              className={`absolute left-0 top-0 h-full w-96 bg-white shadow-xl transform transition-all duration-300 ease-in-out ${
                showFilterDropdown ? "translate-x-0" : "-translate-x-full"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-full  p-6">
                {/* <div className="flex justify-between items-center mb-6">
                  <button
                    onClick={() => setShowFilterDropdown(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div> */}
                <FilterSidebar />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div
            className={`transition-all duration-200 ${
              isSidebarOpen ? "md:blur-0 blur-sm" : "blur-0"
            }`}
          >
            <ProductGridSkeleton count={10} />
          </div>
        ) : (
          <>
            <div
              className={`transition-all duration-200 ${
                isSidebarOpen ? "md:blur-0 blur-sm" : "blur-0"
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    isWishlisted={wishlistedProducts.has(product._id)}
                    onToggleWishlist={toggleWishlist}
                  />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalProducts={totalProducts}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
