"use client";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import RentalPageLoading from "@/components/Loading/RentalPageLoading";

interface Category {
  _id: string;
  catValue: string;
  singleImage: string;
  category: string;
}

const RentalMainPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10); // Extract page number from URL
  const limit = 18; // Number of items per page

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, [page]);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://server-gs.vercel.app/web/rental?page=${page}&limit=${limit}`
      );

      // Ensure response structure is valid
      if (response.data && Array.isArray(response.data.data)) {
        setCategories(response.data.data);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setCategories([]); // Fallback in case of incorrect API response
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]); // Avoid undefined issues
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle Next/Previous Page
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      router.push(`/rental/?page=${newPage}`);
    }
  };

  return (
    <div className="pb-10 max-w-screen-4xl mx-auto">
      <div className="py-10 mx-auto w-full max-w-screen-4xl p-4 ">
        <h1 className="font-bold tracking-wider text-4xl text-center font-playfairDisplay text-rose-900">
          Rentals
        </h1>
        <p className="font-semibold tracking-wider text-lg mt-5 text-center font-playfairDisplay text-rose-900">
          Make your events seamless with our premium rental items! From elegant
          décor essentials, we offer everything you need for a perfect setup.
          <br />
          Browse our collection and book with ease to elevate your event today.
        </p>
        <div
          className="h-1 w-full mt-5"
          style={{
            background:
              "linear-gradient(to right, transparent, #6B021A, transparent)",
          }}
        ></div>
      </div>

      {loading ? (
        <RentalPageLoading />
      ) : (
        <>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5 mb-10 w-full sm:mx-4">
            {categories?.map((event) => (
              <Link key={event._id} href={`/rental/${event._id}`}>
                <div className="relative h-[300px] w-full rounded-xl">
                  <img
                    className="absolute inset-0 w-full h-full object-cover rounded-xl"
                    src={event.singleImage}
                    alt=""
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black opacity-50 rounded-xl"></div>
                  <section className="relative z-10 h-full">
                    <div className="flex justify-center flex-col items-center h-full">
                      <h1 className="tracking-wider lg:text-3xl text-center font-playfairDisplay text-white font-extrabold leading-none md:text-5xl dark:text-white">
                        {event.category}
                      </h1>
                    </div>
                  </section>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center font-raleway gap-4">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className={`
      px-6 py-2 text-white rounded-lg font-raleway transition-all duration-300
      ${
        page <= 1
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-rose-900 hover:bg-rose-700 hover:shadow-lg transform hover:scale-105"
      }
    `}
            >
              Previous
            </button>
            <span className="text-lg font-semibold text-gray-700">
              Page <span className="text-rose-900">{page}</span> of{" "}
              <span className="text-rose-900">{totalPages}</span>
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              className={`
      px-6 py-2 text-white rounded-lg font-raleway transition-all duration-300
      ${
        page >= totalPages
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-rose-900 hover:bg-rose-700 hover:shadow-lg transform hover:scale-105"
      }
    `}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RentalMainPage;
