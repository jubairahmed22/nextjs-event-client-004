"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import ProductCard from "@/components/Card/ProductCard";
import ModalProductDetails from "@/components/AllModal/ModalProductDetails";
import LoadingSkeleton from "@/components/LoadingSkeleton";

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

const API_BASE_URL = "https://server-gs.vercel.app";
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Discounted Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productsData.products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            isWishlisted={wishlistedProducts.has(product._id)}
            onToggleWishlist={toggleWishlist}
            onOpenDetails={openModalProductDetails}
            discountedPrice={calculateDiscountedPrice(product)}
          />
        ))}
      </div>

      {productsData.totalPages > 1 && (
        <div className="mt-12">
          <Pagination
            totalPages={productsData.totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}

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

const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
}: {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) => {
  const getVisiblePages = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2)
      return Array.from({ length: 5 }, (_, i) => totalPages - 4 + i);
    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  };

  const visiblePages = getVisiblePages();

  return (
    <nav aria-label="Page navigation" className="flex justify-center">
      <ul className="flex items-center -space-x-px h-10 text-base">
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Previous page"
          >
            <span className="sr-only">Previous</span>
            <svg
              className="w-3 h-3 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
          </button>
        </li>

        {visiblePages.map((pageNum) => (
          <li key={pageNum}>
            <button
              onClick={() => onPageChange(pageNum)}
              className={`flex items-center justify-center px-4 h-10 leading-tight ${
                pageNum === currentPage
                  ? "z-10 text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
                  : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
              }`}
              aria-label={`Page ${pageNum}`}
              aria-current={pageNum === currentPage ? "page" : undefined}
            >
              {pageNum}
            </button>
          </li>
        ))}

        {totalPages > 5 && currentPage < totalPages - 2 && (
          <li>
            <span className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300">
              ...
            </span>
          </li>
        )}

        {totalPages > 5 && currentPage < totalPages - 2 && (
          <li>
            <button
              onClick={() => onPageChange(totalPages)}
              className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
              aria-label={`Page ${totalPages}`}
            >
              {totalPages}
            </button>
          </li>
        )}

        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Next page"
          >
            <span className="sr-only">Next</span>
            <svg
              className="w-3 h-3 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default HomeDiscountProduct;
