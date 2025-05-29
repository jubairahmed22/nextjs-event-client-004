"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import ProductCard from "../Card/ProductCard";
import ModalProductDetails from "../AllModal/ModalProductDetails";
import LoadingSkeleton from "../LoadingSkeleton";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FilterPromotionButton } from "../AllProductCopmonent/FilterPromotionButton";

interface Product {
  _id: string;
  title: string;
  description: string;
  perDayPricing: string;
  Promotion: string;
  promotionValue: string;
  promotionType: string;
  images: string[];
  availableQuantity: number;
  category: string;
  subCategory: string;
}

interface ProductsResponse {
  products: Product[];
  totalPages: number;
  currentPage: number;
}

const API_BASE_URL = "http://localhost:8000";
const DEFAULT_PAGE = 1;
const PRODUCTS_PER_PAGE = 8;

const HomeDiscountProduct = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(
    searchParams.get("page") || DEFAULT_PAGE.toString()
  );

  const [productsData, setProductsData] = useState<ProductsResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [wishlistedProducts, setWishlistedProducts] = useState<Set<string>>(
    new Set()
  );
  const [currentSlide, setCurrentSlide] = useState(0);

  const calculateDiscountedPrice = useCallback((product: Product): number => {
    if (product.Promotion === "true") {
      const perDayPricing = parseFloat(product.perDayPricing);
      const promotionValue = parseFloat(product.promotionValue);

      if (product.promotionType === "$") {
        return Math.max(0, perDayPricing - promotionValue);
      } else if (product.promotionType === "%") {
        return perDayPricing * (1 - promotionValue / 100);
      }
    }
    return parseFloat(product.perDayPricing);
  }, []);

  const fetchDiscountProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}/web/products/discount?page=${currentPage}&limit=${PRODUCTS_PER_PAGE}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const data: ProductsResponse = await response.json();
      setProductsData(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  const loadWishlist = useCallback(() => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const wishlistedIds = new Set<string>(
        cart.map((item: Product) => item._id)
      );
      setWishlistedProducts(wishlistedIds);
    } catch (error) {
      console.error("Error loading wishlist:", error);
    }
  }, []);

  useEffect(() => {
    fetchDiscountProducts();
    loadWishlist();
  }, [fetchDiscountProducts, loadWishlist]);

  const toggleWishlist = useCallback(
    (product: Product) => {
      try {
        const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const productIndex = existingCart.findIndex(
          (item: Product) => item._id === product._id
        );

        let updatedCart: Product[];
        if (productIndex > -1) {
          updatedCart = existingCart.filter(
            (item: Product) => item._id !== product._id
          );
          toast.success(`${product.title} removed from wishlist!`, {
            position: "bottom-center",
          });
        } else {
          const finalPrice = calculateDiscountedPrice(product);
          updatedCart = [
            ...existingCart,
            {
              ...product,
              quantity: 1,
              perDayPricing: finalPrice.toString(),
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
    },
    [calculateDiscountedPrice]
  );

  const openModalProductDetails = useCallback((productId: string) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  }, []);

  const closeModalProductDetails = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProductId(null);
  }, []);

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", newPage.toString());
      router.push(`/discount-products?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  const selectedProduct = productsData?.products.find(
    (product) => product._id === selectedProductId
  );

  // Group products into chunks of 4 for each slide
  const groupedProducts = React.useMemo(() => {
    if (!productsData?.products) return [];
    const groups = [];
    for (let i = 0; i < productsData.products.length; i += 4) {
      groups.push(productsData.products.slice(i, i + 4));
    }
    return groups;
  }, [productsData]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) =>
      prev === groupedProducts.length - 1 ? 0 : prev + 1
    );
  }, [groupedProducts.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) =>
      prev === 0 ? groupedProducts.length - 1 : prev - 1
    );
  }, [groupedProducts.length]);

  // Auto-advance slides
  useEffect(() => {
    if (groupedProducts.length <= 1) return;
    
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [groupedProducts.length, nextSlide]);

  if (loading && !productsData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  if (!productsData?.products.length) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500 text-lg">
          No discounted products available
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-3xl px-4 py-16 relative z-10">
      <h1 className="mb-10 text-center text-lg md:text-2xl lg:text-4xl font-playfairDisplay font-bold text-white leading-tight">
        <span className="relative inline-block">
          <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-rose-800 to-rose-900">
            Promotional Product
          </span>
        </span>
      </h1>

      <div className="relative overflow-hidden mt-16">
        {/* Navigation Arrows - Only show if there are multiple slides */}
        {groupedProducts.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all"
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Slider max-w-screen-3xl */}
        <motion.div
          className="flex"
          animate={{
            x: `-${currentSlide * 100}%`,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          {groupedProducts.map((group, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-4 "
            >
              {group.map((product) => (
                <motion.div
                  key={product._id}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <ProductCard
                    product={product}
                    isWishlisted={wishlistedProducts.has(product._id)}
                    onToggleWishlist={toggleWishlist}
                    onOpenDetails={openModalProductDetails}
                    discountedPrice={calculateDiscountedPrice(product)}
                  />
                </motion.div>
              ))}
            </div>
          ))}
        </motion.div>

        {/* Slide Indicators - Only show if there are multiple slides */}
        {groupedProducts.length > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            {groupedProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? "bg-rose-800 w-6" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="w-full flex justify-center items-center my-10">
        <FilterPromotionButton></FilterPromotionButton>
      </div>

      {isModalOpen && selectedProduct && (
        <ModalProductDetails
          product={selectedProduct}
          isWishlisted={wishlistedProducts.has(selectedProduct._id)}
          onToggleWishlist={toggleWishlist}
          onClose={closeModalProductDetails}
          discountedPrice={calculateDiscountedPrice(selectedProduct)}
        />
      )}
    </div>
  );
};

export default HomeDiscountProduct;