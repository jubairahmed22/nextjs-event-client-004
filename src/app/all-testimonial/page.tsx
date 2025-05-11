"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import facebook from "../../assets/facebook.png";
import google from "../../assets/google.png";
import instagram from "../../assets/instagram.png";
import linked from "../../assets/linkedin.png";
import twitter from "../../assets/twitter.png";
import yelp from "../../assets/yelp.png"; // Make sure to import Yelp image
import Image from "next/image";

interface Testimonial {
  _id: string;
  title: string;
  description: string;
  rating: number;
  source: string;
  // Add other properties based on your testimonial data structure
}

interface ApiResponse {
  success: boolean;
  products: Testimonial[];
  totalPages: number;
  currentPage: number;
}

const Page = () => {
  const text = "Customer Testimonial";
  const letters = text.split("");
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Function to get the appropriate image based on source
  const getSourceImage = (source: string) => {
    switch (source) {
      case "Facebook":
        return facebook;
      case "Twitter":
        return twitter;
      case "Instagram":
        return instagram;
      case "LinkedIn":
        return linked;
      case "Yelp":
        return yelp;
      default:
        return google; // Default image for other sources
    }
  };

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://server-gs.vercel.app/admin/testimonial?page=${currentPage}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiResponse = await response.json();
        setTestimonials(data.products);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="max-w-screen-3xl mx-auto px-4 font-montserrat sm:px-6 lg:px-8 my-20">
      <motion.div className="text-start mb-16">
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

      {/* Loading state */}
      {loading && (
        <div className="text-center py-8">Loading testimonials...</div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-8 text-red-600">
          Error loading testimonials: {error}
        </div>
      )}

      {/* Testimonials list */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
          {testimonials.map((testimonial) => (
            <div
            key={testimonial._id}
            className="bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-400"
          >
            <div className="flex flex-col items-center md:flex-row gap-5">
              {/* Left side - Image */}
              <div className="flex-shrink-0">
                <Image
                  src={getSourceImage(testimonial.source)} 
                  alt={testimonial.source} 
                  width={80}
                  height={80}
                  className="object-cover transition-transform w-20 h-20 duration-500 group-hover:scale-105"
                  priority={false}
                />
              </div>
          
              {/* Middle - Content */}
              <div className="flex-1">
                
                <p className="text-gray-600 mb-4 w-[85%] italic">
                  {testimonial.description}
                </p>
              </div>
          
              {/* Right side - Rating */}
              <div className="flex flex-col items-start md:items-end">
                <div className="flex items-center gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${
                        star <= testimonial.rating
                          ? "text-amber-400 fill-current"
                          : "text-gray-300 fill-transparent"
                      }`}
                      viewBox="0 0 18 17"
                      stroke="currentColor"
                      strokeWidth="1"
                    >
                      <path
                        d="M8.10326 1.31699C8.47008 0.57374 9.52992 0.57374 9.89674 1.31699L11.7063 4.98347C11.8519 5.27862 12.1335 5.48319 12.4592 5.53051L16.5054 6.11846C17.3256 6.23765 17.6531 7.24562 17.0596 7.82416L14.1318 10.6781C13.8961 10.9079 13.7885 11.2389 13.8442 11.5632L14.5353 15.5931C14.6754 16.41 13.818 17.033 13.0844 16.6473L9.46534 14.7446C9.17402 14.5915 8.82598 14.5915 8.53466 14.7446L4.91562 16.6473C4.18199 17.033 3.32456 16.41 3.46467 15.5931L4.15585 11.5632C4.21148 11.2389 4.10393 10.9079 3.86825 10.6781L0.940384 7.82416C0.346867 7.24562 0.674378 6.23765 1.4946 6.11846L5.54081 5.53051C5.86652 5.48319 6.14808 5.27862 6.29374 4.98347L8.10326 1.31699Z"
                      />
                    </svg>
                  ))}
                </div>
                <div className="text-left">
                 
                  <div className="flex items-center gap-5">
          {testimonial.singleImage ? (
            <img
              className="rounded-full object-cover w-12 h-12"
              src={testimonial.singleImage}
              alt="avatar"
            />
          ) : (
            <div className="rounded-full bg-gray-200 w-12 h-12 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          )}
          <div className="grid gap-1">
            <h5 className="text-rose-900 font-medium transition-all duration-500  group-hover:text-rose-600 swiper-slide-active:text-rose-600">
              {testimonial.title}
            </h5>
          </div>
        </div>
                </div>
              </div>
            </div>
          </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-md border disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-md border disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Page;