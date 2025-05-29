"use client"; // Mark this as a Client Component

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import ModalProductDetails from "@/components/AllModal/ModalProductDetails";
import toast from "react-hot-toast";
import ProductLoading from "@/components/Loading/ProductLoading";

interface RentalDetails {
  _id: string;
  productId: string;
  category: string;
  catValue: string;
  singleImage: string;
  createdAt: string;
}

interface CatValueData {
  products: EventProduct[]; // Array of products under this category
  page: number; // Current page
  totalPages: number; // Total number of pages
  totalProducts: number; // Total number of products
}

interface EventProduct {
  _id: string;
  title: string;
  singleImage: string;
  perDayPricing: number;
}

const RentalDetailsPage = () => {
  const params = useParams(); // Get the `id` from the URL
  const { id } = params;

  const searchParams = useSearchParams(); // Get query parameters from the URL
  const router = useRouter(); // Router for navigation

  const [rental, setRental] = useState<RentalDetails | null>(null);
  const [catValueData, setCatValueData] = useState<CatValueData | null>(null); // State for catValue data
  const [loading, setLoading] = useState<boolean>(true);
  const [catValueLoading, setCatValueLoading] = useState<boolean>(false); // Loading state for catValue fetch
  const [isDropdown, setIsDropdown] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [wishlistedProducts, setWishlistedProducts] = useState<Set<string>>(
    new Set()
  );
  const [isPageChanging, setIsPageChanging] = useState<boolean>(false); // Track page change loading

  // Get the current page from the URL query parameters (default to 1 if not present)
  const page = parseInt(searchParams.get("page") || "1", 18);
  const limit = 18; // Number of items per page

  // Fetch rental details
  useEffect(() => {
    if (id) {
      const fetchRentalDetails = async () => {
        try {
          const response = await axios.get<RentalDetails>(
            `http://localhost:8000/web/rental/${id}`
          );
          setRental(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching rental details:", error);
          setLoading(false);
        }
      };

      fetchRentalDetails();
    }
  }, [id]);

  // Fetch catValue data with pagination
  useEffect(() => {
    if (rental?.catValue) {
      const fetchCatValueData = async () => {
        setCatValueLoading(true);
        try {
          const response = await axios.get<CatValueData>(
            `http://localhost:8000/next-web/category-products/${rental.catValue}?page=${page}&limit=${limit}`
          );
          setCatValueData(response.data);
        } catch (error) {
          console.error("Error fetching catValue data:", error);
        } finally {
          setCatValueLoading(false);
          setIsPageChanging(false); // Reset page change loading
        }
      };

      fetchCatValueData();
    }
  }, [rental?.catValue, page, limit]); // Re-fetch when catValue, page, or limit changes

  // Add or remove product from wishlist
  const toggleWishlist = (product: EventProduct) => {
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
      updatedCart = [...existingCart, { ...product, quantity: 1 }];
      toast.success(`${product.title} added to wishlist!`, {
        position: "bottom-center",
      });
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    const updatedWishlist = new Set(wishlistedProducts);
    if (productIndex > -1) {
      updatedWishlist.delete(product._id);
    } else {
      updatedWishlist.add(product._id);
    }
    setWishlistedProducts(updatedWishlist);
  };

  const openModalProductDetails = (productId: string) => {
    setSelectedProductId(productId);
    setIsDropdown(true);
  };

  const closeModalProductDetails = () => {
    setIsDropdown(false);
    setSelectedProductId(null);
  };

  // Handle pagination by updating the URL
  const handleNextPage = () => {
    if (catValueData && page < catValueData.totalPages) {
      const newPage = page + 1;
      setIsPageChanging(true); // Set page change loading
      router.push(`/rental/${id}?page=${newPage}`);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      const newPage = page - 1;
      setIsPageChanging(true); // Set page change loading
      router.push(`/rental/${id}?page=${newPage}`);
    }
  };

  if (loading) {
    return <ProductLoading />;
  }

  if (!rental) {
    return <div>Rental not found.</div>;
  }

  return (
    <div>
      <div>
        <section className="relative bg-white dark:bg-gray-900 lg:h-[400px] md:h-[500px] sm:h-[400px]">
          {/* Background Image */}
          <img
            className="absolute inset-0 w-full h-full object-cover"
            src={rental.singleImage}
            alt={rental.category}
          />

          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black opacity-50"></div>

          {/* Content */}
          <div className="relative max-w-screen-3xl px-4 py-8 mx-auto lg:gap-2 xl:gap-0 lg:py-16">
            <div className="mr-auto place-self-center">
              <h1 className="max-w-4xl mb-4 tracking-wider text-2xl font-playfairDisplay text-white font-extrabold leading-none md:text-5xl xl:text-6xl dark:text-white [text-shadow:_0_0_8px_rgba(255,255,255,0.6),_0_0_16px_rgba(255,255,255,0.4)]">
                {rental.category}
              </h1>
            </div>
          </div>
        </section>
      </div>
      <div className="mt-10 max-w-screen-3xl px-4 mx-auto">
        {/* Show loading spinner when page is changing */}
        {isPageChanging && (
          <ProductLoading />
        )}

        {/* Product Grid */}
        {!isPageChanging && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {catValueData?.products?.map((product) => (
              <div
                key={product._id}
                className="bg-white p-4 font-lora cursor-pointer hover:shadow-xl transition-shadow border border-rose-200"
              >
                <div onClick={() => openModalProductDetails(product._id)}>
                  {product?.singleImage ? (
                    <img
                      src={product.singleImage}
                      alt={product.title}
                      className="w-full h-96 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-12 h-96 text-gray-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="flex justify-center items-center flex-col gap-4">
                    <h3 className="text-xl font-semibold mt-4">
                      {product.title}
                    </h3>
                    <p className="text-gray-600 text-3xl">
                      Price: ${product.perDayPricing}/day
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleWishlist(product)}
                  className="flex mt-5 items-center justify-center w-full px-4 py-3 bg-rose-900 text-white rounded-md hover:bg-rose-800 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={wishlistedProducts.has(product._id) ? "white" : "none"}
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                  {wishlistedProducts.has(product._id)
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-center items-center my-10">
          <button
            onClick={handlePreviousPage}
            disabled={page === 1 || isPageChanging}
            className="px-4 py-2 bg-rose-900 text-white rounded-md hover:bg-rose-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="mx-4 text-gray-700">
            Page {page} of {catValueData?.totalPages || 1}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page === catValueData?.totalPages || isPageChanging}
            className="px-4 py-2 bg-rose-900 text-white rounded-md hover:bg-rose-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>

        {/* Modal for Product Details */}
        <ModalProductDetails
          isVisible={isDropdown}
          onClose={closeModalProductDetails}
          productId={selectedProductId || undefined}
        />
      </div>
    </div>
  );
};

export default RentalDetailsPage;