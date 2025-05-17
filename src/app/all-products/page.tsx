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

   useEffect(() => {
    const pageParam = searchParams.get("page");
    const categoryParam = searchParams.get("category");
    
    if (pageParam) {
      try {
        const parsedPage = JSON.parse(pageParam);
        setCurrentPage(parsedPage.searchPage || 1);
      } catch (e) {
        console.error("Error parsing page parameter:", e);
      }
    }
    
    // You might want to initialize other filters from URL here if needed
  }, [searchParams]);

  // Fetch products with debouncing
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const endpoint = filters.promotionFilter === "true"
          ? "/web/products/discount"
          : "/web/main/all-products";

        const apiParams: Record<string, string> = {
          page: currentPage.toString(),
        };

        if (filters.promotionFilter === "true") {
          apiParams.Promotion = "true";
          apiParams.showWebsite = "true";
        }

        if (filters.title) apiParams.title = filters.title;
        if (filters.category) apiParams.category = filters.category;
        if (filters.subCategory) apiParams.subCategory = filters.subCategory;
        if (filters.minPrice) apiParams.minPrice = filters.minPrice;
        if (filters.maxPrice) apiParams.maxPrice = filters.maxPrice;
        if (filters.SelectedType) apiParams.SelectedType = filters.SelectedType;
        if (filters.productCode) apiParams.productCode = filters.productCode;

        // Add a small delay to prevent rapid successive requests
        const timer = setTimeout(async () => {
          const response = await fetch(
            `https://server-gs.vercel.app${endpoint}?${new URLSearchParams(
              apiParams
            ).toString()}`
          );
          const data = await response.json();

          setProducts(data.products || []);
          setTotalPages(data.totalPages || 1);
          setTotalProducts(data.totalProducts || 0);
          setLoading(false);
        }, 100); // 100ms debounce delay

        return () => clearTimeout(timer);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    currentPage,
    filters.category,
    filters.subCategory,
    filters.promotionFilter,
    filters.title,
    filters.minPrice,
    filters.maxPrice,
    filters.SelectedType,
    filters.productCode
  ]);

  // Reset to page 1 when filters change (except for page changes)
  useEffect(() => {
    // Only reset if we have actual filter values (not initial empty state)
    if (Object.values(filters).some(val => val !== '' && val !== undefined)) {
      setCurrentPage(1);
    }
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
    <div className="flex flex-col max-w-screen-3xl mx-auto min-h-screen">
 
 <header className={`sticky ${
    headerVisible ? 'top-24 ' : 'top-0'
  }  z-30 h-20 px-4 w-full bg-white border-b border-gray-100 flex items-center`}>
  <div className="flex items-center w-full gap-2 sm:gap-5">
    {/* Categories Button - Always shows text */}
    <button
      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
      className="flex text-lg sm:text-xl font-semibold font-montserrat items-center gap-2 lg:px-4 py-2 bg-transparent text-gray-700 hover:text-rose-600 rounded-md hover:bg-gray-50 transition-colors"
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
        className="whitespace-nowrap" // Ensures text stays in one line
      >
        Categories
      </motion.span>
    </button>

    {/* Search Component - Takes remaining space */}
    <div className="flex-1 min-w-0">
      <FilterSearchAllProducts />
    </div>
  </div>
</header>
  {/* Main Content Area */}
  <div className="flex flex-1 w-full relative">
    {/* Mobile Overlay Sidebar */}
    <div className="md:hidden">
      {showFilterDropdown && (
        <div 
          className="fixed inset-0 z-20  transition-opacity"
          onClick={() => setShowFilterDropdown(false)}
        />
      )}
      <aside
        className={`fixed 
          ${
    headerVisible ? 'top-44 h-[calc(100vh-5rem)]' : 'top-20 h-[calc(100vh-2.75rem)]'
  } 
          left-0 bottom-0 w-3/4  max-w-sm z-20 overflow-y-auto bg-white border-r border-gray-200 transition-all duration-300 ease-in-out transform ${
          showFilterDropdown ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          <FilterSidebar onClose={() => setShowFilterDropdown(false)} />
        </div>
      </aside>
    </div>

    {/* Desktop Sidebar */}
<aside
  className={`hidden md:block sticky ${
    headerVisible ? 'top-20 h-[calc(100vh-5rem)]' : 'top-20 h-[calc(100vh-2.75rem)]'
  } overflow-y-auto bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
    showFilterDropdown
      ? "w-[25%] opacity-100"
      : "w-0 opacity-0 overflow-hidden"
  }`}
>
  <div className="p-6">
    <FilterSidebar onClose={() => setShowFilterDropdown(false)} />
  </div>
</aside>

    {/* Product Grid - Scrollable area */}
    <main
      className={`flex-1 overflow-y-auto transition-all duration-300 ${
        showFilterDropdown ? "md:w-[75%]" : "w-full"
      }`}
    >
      <div className="lg:p-6 p-4">
        {loading ? (
          <ProductGridSkeleton count={12} />
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6 sm:gap-2">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isWishlisted={wishlistedProducts.has(product._id)}
                  onToggleWishlist={toggleWishlist}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8">
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
    </main>
  </div>
</div>
  );
};

export default ProductsPage;
