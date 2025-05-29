"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import EventPageLoading from "@/components/Loading/EventPageLoading";
import InstaPost from "@/components/shared/InstaPost";
import { motion } from "framer-motion";

// Define the type for the product data
interface Product {
  _id: string;
  categoryId: string;
  title: string;
  showWebsite: boolean;
  images: string[];
  singleImage: string;
  video: string | null;
  createdAt: string;
}

// Define the type for the API response
interface ApiResponse {
  products: Product[];
  page: number;
  totalPages: number;
  totalDocuments: number;
}

const Page = () => {
  const [productsData, setProductsData] = useState<ApiResponse>({
    products: [],
    page: 1,
    totalPages: 1,
    totalDocuments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8000/admin/main-gallery?page=${currentPage}&limit=10` // Adjust your API endpoint as needed
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: ApiResponse = await response.json();
        setProductsData(data);
        setLoading(false);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= productsData.totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Gallery | null>(null); // Use Gallery type
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const modalRef = useRef(null); // Ref for the modal max-w-screen-3xl

  const openModal = (gallery: Gallery) => {
    setSelectedImage(gallery);
    setCurrentImageIndex(0); // Start with the first image (singleImage)
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setCurrentImageIndex(0); // Reset index when closing the modal
  };

  const goToNextImage = () => {
    if (selectedImage) {
      const totalImages = selectedImage.images.length + 1; // +1 for singleImage
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalImages);
    }
  };

  const goToPreviousImage = () => {
    if (selectedImage) {
      const totalImages = selectedImage.images.length + 1; // +1 for singleImage
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? totalImages - 1 : prevIndex - 1
      );
    }
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const getCurrentImage = () => {
    if (selectedImage) {
      if (currentImageIndex === 0) {
        return selectedImage.singleImage; // Show singleImage first
      } else {
        return selectedImage.images[currentImageIndex - 1]; // Show images from the array
      }
    }
    return ""; // Fallback if selectedImage is null
  };

  // Handle outside click to close modal
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !(modalRef.current as HTMLElement).contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isModalOpen]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const text = "Gallery";
  const letters = text.split("");

  return (
    <div>
      <div className="relative overflow-hidden font-montserrat">
        <div className="mx-auto max-w-screen-3xl px-0 lg:px-4 pt:5 lg:pt-20 relative z-10">
          <motion.div className="text-start px-4 mb-5 lg:mb-16">
            <h1 className="mb-4 text-lg md:text-2xl lg:text-6xl uppercase font-playfairDisplay font-bold">
              <span className="relative inline-block">
                {letters.map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.05,
                    }}
                    className="relative text-transparent bg-clip-text bg-gradient-to-r from-rose-700 to-rose-900"
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                ))}
              </span>
            </h1>
          </motion.div>
        </div>

        {loading ? (
          <EventPageLoading></EventPageLoading>
        ) : (
          <>
            <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-2 lg:gap-5 gap-2 px-4 lg:px-10">
              {productsData.products.map((gallery) => (
                <div
                  key={gallery.singleImage}
                  onClick={() => openModal(gallery)}
                  className="relative lg:h-[460px] h-[300px] rounded-xl "
                >
                  <img
                    className="absolute inset-0 w-full h-full object-cover rounded-xl"
                    src={gallery.singleImage}
                    alt=""
                  ></img>
                  <div className="absolute inset-0 bg-black opacity-5 rounded-xl"></div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {productsData.totalPages > 1 && (
              <div className="flex justify-center mt-8 font-montserrat">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-md border bg-white text-gray-700 border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>

                  {/* Always show first page */}
                  <button
                    onClick={() => handlePageChange(1)}
                    className={`px-4 py-2 rounded-md border text-sm font-medium ${
                      currentPage === 1
                        ? "bg-rose-900 text-white border-rose-900"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    1
                  </button>

                  {/* Show ellipsis if current window doesn't include page 2 */}
                  {currentPage > 3 && <span className="px-2">...</span>}

                  {/* Calculate the range of pages to show */}
                  {(() => {
                    let startPage = Math.max(2, currentPage - 1);
                    let endPage = Math.min(
                      productsData.totalPages - 1,
                      currentPage + 1
                    );

                    // Adjust if we're near the start
                    if (currentPage <= 3) {
                      endPage = Math.min(4, productsData.totalPages - 1);
                    }
                    // Adjust if we're near the end
                    else if (currentPage >= productsData.totalPages - 2) {
                      startPage = Math.max(productsData.totalPages - 3, 2);
                    }

                    const pages = [];
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => handlePageChange(i)}
                          className={`px-4 py-2 rounded-md border text-sm font-medium ${
                            currentPage === i
                              ? "bg-rose-900 text-white border-rose-900"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {i}
                        </button>
                      );
                    }
                    return pages;
                  })()}

                  {/* Show ellipsis if current window doesn't include last page */}
                  {currentPage < productsData.totalPages - 2 && (
                    <span className="px-2">...</span>
                  )}

                  {/* Always show last page if there's more than 1 page */}
                  {productsData.totalPages > 1 && (
                    <button
                      onClick={() => handlePageChange(productsData.totalPages)}
                      className={`px-4 py-2 rounded-md border text-sm font-medium ${
                        currentPage === productsData.totalPages
                          ? "bg-rose-900 text-white border-rose-900"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {productsData.totalPages}
                    </button>
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === productsData.totalPages}
                    className="px-4 py-2 rounded-md border bg-white text-gray-700 border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {isModalOpen && selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center  shadow-md">
          <div
            ref={modalRef}
            className="relative w-[65%] h-[65%] bg-white rounded-lg overflow-hidden"
          >
            {/* Carousel Wrapper */}
            <div className="relative h-full overflow-hidden">
              {/* Carousel Items */}
              <div className="duration-700 ease-in-out">
                <img
                  src={getCurrentImage()}
                  className="absolute block w-full h-full object-cover"
                  alt=""
                />
              </div>
            </div>

            {/* Slider Indicators */}
            <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
              {[selectedImage.singleImage, ...selectedImage.images].map(
                (_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`w-3 h-3 rounded-full ${
                      currentImageIndex === index
                        ? "bg-white"
                        : "bg-white/50 hover:bg-white/80"
                    }`}
                    aria-current={currentImageIndex === index}
                    aria-label={`Slide ${index + 1}`}
                    onClick={() => goToImage(index)}
                  ></button>
                )
              )}
            </div>

            {/* Slider Controls */}
            <button
              type="button"
              className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
              onClick={goToPreviousImage}
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none">
                <svg
                  className="w-4 h-4 text-white rtl:rotate-180"
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
                <span className="sr-only">Previous</span>
              </span>
            </button>
            <button
              type="button"
              className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
              onClick={goToNextImage}
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none">
                <svg
                  className="w-4 h-4 text-white rtl:rotate-180"
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
                <span className="sr-only">Next</span>
              </span>
            </button>

            {/* Close Button */}
          </div>
        </div>
      )}
      <InstaPost></InstaPost>
    </div>
  );
};

export default Page;
