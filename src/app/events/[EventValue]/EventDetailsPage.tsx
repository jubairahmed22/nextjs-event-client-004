"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import ModalProductDetails from "@/components/AllModal/ModalProductDetails";
import toast from "react-hot-toast";
import ProductLoading from "@/components/Loading/ProductLoading";
import { Event, EventProduct } from "@/types"; // Adjust the import path as needed

interface EventDetailsPageProps {
  params: {
    EventValue: string;
  };
  searchParams?: {
    page?: string;
  };
}

const EventDetailsPage: React.FC<EventDetailsPageProps> = ({ params }) => {
  const { EventValue } = params;
  const searchParams = useSearchParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [eventProducts, setEventProducts] = useState<EventProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isDropdown, setIsDropdown] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [wishlistedProducts, setWishlistedProducts] = useState<Set<string>>(new Set());

  const page = parseInt(searchParams.get("page") || "1", 10);

  // Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get<Event>(
          `https://server-gs.vercel.app/eventCollection/${EventValue}`
        );
        setEvent(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [EventValue]);

  // Fetch event products
  useEffect(() => {
    const fetchEventProducts = async () => {
      try {
        const response = await axios.get<EventProductsResponse>(
          `https://server-gs.vercel.app/web/event-products/${EventValue}?page=${page}`
        );
        setEventProducts(response.data.products);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEventProducts();
  }, [EventValue, page]);

  // Load wishlisted products from localStorage on mount
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const wishlistedIds = new Set<string>(cart.map((item: EventProduct) => item._id));
    setWishlistedProducts(wishlistedIds);
  }, []);

  // Add or remove product from wishlist
  const toggleWishlist = (product: EventProduct) => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const productIndex = existingCart.findIndex((item: EventProduct) => item._id === product._id);

    let updatedCart: EventProduct[];
    if (productIndex > -1) {
      // Remove product from cart
      updatedCart = existingCart.filter((item: EventProduct) => item._id !== product._id);
      toast.success(`${product.title} removed from wishlist!`, {
        position: "bottom-center",
      });
    } else {
      // Add product to cart
      updatedCart = [...existingCart, { ...product, quantity: 1 }];
      toast.success(`${product.title} added to wishlist!`, {
        position: "bottom-center",
      });
    }

    // Update localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Update wishlistedProducts state instantly
    const updatedWishlist = new Set(wishlistedProducts);
    if (productIndex > -1) {
      updatedWishlist.delete(product._id); // Remove product ID
    } else {
      updatedWishlist.add(product._id); // Add product ID
    }
    setWishlistedProducts(updatedWishlist);
  };

  // Handle pagination navigation
  const handlePageChange = (newPage: number) => {
    router.push(`/events/${EventValue}?page=${newPage}`);
  };

  const openModalProductDetails = (productId: string) => {
    setSelectedProductId(productId);
    setIsDropdown(true);
  };

  const closeModalProductDetails = () => {
    setIsDropdown(false);
    setSelectedProductId(null);
  };

  if (loading) {
    return <ProductLoading></ProductLoading>;
  }

  if (!event) {
    return <h1>Event not found</h1>;
  }

  return (
    <div className="bg-rose-50 pb-10">
      {/* Event Details Section */}
      <div className="relative h-[500px]">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src={event.singleImage}
          alt={event.EventTitle}
        />
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <section className="relative z-10 h-full">
          <div className="flex justify-center flex-col gap-6 items-center h-full">
            <h1 className="max-w-4xl mb-4 tracking-wider text-4xl font-playfairDisplay text-white font-extrabold leading-none md:text-5xl xl:text-6xl dark:text-white [text-shadow:_0_0_8px_rgba(255,255,255,0.6),_0_0_16px_rgba(255,255,255,0.4)]">
              {event.EventTitle}
            </h1>
            <p className="text-white text-xl">{event.description}</p>
          </div>
        </section>
      </div>

      {/* Event Products Section */}
      <div className="mt-10 max-w-screen-4xl px-4 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 ">
          {eventProducts.map((product) => (
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
                  <p className="text-gray-600 text-3xl ">
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

        {/* Pagination Controls */}
        <div className="flex justify-center font-playfairDisplay mt-10">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded-md mr-2 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 rounded-md ml-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Modal for Product Details */}
        <ModalProductDetails
          isVisible={isDropdown}
          onClose={closeModalProductDetails}
          productId={selectedProductId || undefined} // Convert null to undefined
        />
      </div>
    </div>
  );
};

export default EventDetailsPage;