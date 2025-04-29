// components/AllProductCopmonent/ProductsPage.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// import { Product } from "@/components/AllProductCopmonent/types";
// import { FilterSidebar } from "@/components/AllProductCopmonent/FilterSidebar";
import { StatsCards } from "@/components/AllProductCopmonent/StatsCards";
import { Pagination } from "@/components/AllProductCopmonent/Pagination";
import { FilterSidebar } from "@/components/AllProductCopmonent/FilterSidebar";
import { useFilters } from "../contexts/FilterContext";
import toast from "react-hot-toast";
import ProductCard from "@/components/Card/ProductCard";
import { ProductGridSkeleton } from "@/components/AllProductCopmonent/ProductSkeleton";

export const ProductsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

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
          `http://localhost:8000${endpoint}?${new URLSearchParams(
            apiParams
          ).toString()}`
        );
        const data = await response.json();

        setProducts(data.products);
        setTotalPages(data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, filters]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    // Update URL with page parameter
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("page", JSON.stringify({ searchPage: page }));
    router.push(`?${urlParams.toString()}`, undefined, { shallow: true });
  };

  // start add product

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
            // Add the calculated price as a new field for easy reference
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
      // Calculate prices for existing items in cart
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
    <div className="flex min-h-screen max-w-screen-4xl mx-auto px-4">
      {/* Sidebar for desktop - always visible on md+ screens */}
      <div className="hidden md:block md:w-72 flex-shrink-0 sticky top-0 h-screen overflow-y-auto transition-all duration-300">
        <FilterSidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 p-4 md:p-5 relative">
        {/* Mobile filter toggle button - only visible on small screens */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden mb-4 p-2 bg-gray-200 rounded-md sticky top-4 z-10 transition-all hover:bg-gray-300 active:scale-95"
        >
          {isSidebarOpen ? (
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Hide Filters
            </span>
          ) : (
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Show Filters
            </span>
          )}
        </button>

        {/* Mobile sidebar overlay and sidebar */}
        <div
          className={`fixed inset-0 z-20 md:hidden transition-opacity duration-300 ${
            isSidebarOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        </div>

        <div
          className={`fixed inset-y-0 left-0 w-72 bg-white z-30 overflow-y-auto transform transition-all duration-300 ease-in-out md:hidden ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <FilterSidebar />
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
