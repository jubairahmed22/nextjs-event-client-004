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
import { motion, AnimatePresence } from "framer-motion";

export const ProductsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
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
            : "/web/main/all-products";

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
  }, [
    filters.category,
    filters.subCategory,
    filters.promotionFilter,
    filters.title,
    filters.minPrice,
    filters.maxPrice,
  ]);

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

  const [lastScrollY, setLastScrollY] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setHeaderVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className="flex flex-col  max-w-screen-3xl mx-auto ">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 h-20 px-4 w-full bg-white border-b border-gray-100 flex gap-5 items-center">
        <button
          onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          className="flex text-xl font-semibold font-montserrat items-center gap-2 px-4 py-2 bg-transparent text-gray-700 hover:text-rose-600 rounded-md hover:bg-gray-50 transition-colors"
          aria-expanded={showFilterDropdown}
        >
          <AnimatePresence mode="wait" initial={false}>
            {showFilterDropdown ? (
              <motion.svg
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </motion.svg>
            ) : (
              <motion.svg
                key="categories"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </motion.svg>
            )}
          </AnimatePresence>

          <motion.span
            animate={{ color: showFilterDropdown ? "#e11d48" : "#374151" }}
            transition={{ duration: 0.2 }}
          >
            Categories
          </motion.span>
        </button>
        <FilterSearchAllProducts></FilterSearchAllProducts>
      </header>

      {/* Main Content Area - Flex container */}
      <div className="flex  flex-1 w-full relative overflow-hidden">
        {/* Sidebar - Fixed position */}
        <div
          className={`bottom-0  bg-white shadow-xl transform transition-all duration-300 ease-in-out ${
            showFilterDropdown
              ? `w-full lg:w-[25%] md:w-[30%] sm:w-[50%]  opacity-100 ${
                  headerVisible ? "top-44" : "top-10"
                }`
              : "w-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className=" p-6">
            <FilterSidebar
              onClose={() => setShowFilterDropdown(false)}
            ></FilterSidebar>
          </div>
        </div>

        {/* Product Layout - Scrollable area */}
        <div
          className={`h-[700px]  right-0 overflow-y-auto transition-all duration-300 ease-in-out ${
            showFilterDropdown ? "lg:w-[75%] md:w-[60%] sm:w-[50%]" : "w-full"
          } `}
        >
          {/* Your product content goes here */}
          <div className="p-6">
            {showFilterDropdown ? (
              <div>
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
            ) : (
              <div>
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
