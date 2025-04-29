"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface ProductCategory {
  _id: string;
  categoryId: string;
  title: string;
  showWebsite: boolean;
  singleImage: string;
  order: number;
}

interface ApiResponse {
  success: boolean;
  products: ProductCategory[];
}

const CategoryHome = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/admin/main-category"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        if (!data.success) {
          throw new Error("API request was not successful");
        }

        setCategories(data.products);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">Error: {error}</div>
    );
  }

  // Skeleton loader component
  const SkeletonLoader = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-6 grid-flow-dense gap-4 bg-rose-900 p-4">
        {[...Array(18)].map((_, index) => {
          // Match the same dynamic card sizing as the actual content
          let cardLayout = "";
          const mod = index % 8;

          if (mod === 0) {
            cardLayout = "sm:col-span-4 sm:row-span-3"; // Large horizontal
          } else if (mod === 1 || mod === 2) {
            cardLayout = "sm:col-span-2 sm:row-span-2"; // Medium square
          } else if (mod === 2 || mod === 2) {
            cardLayout = "sm:col-span-3 sm:row-span-2"; // Wide
          } else if (mod === 3) {
            cardLayout = "sm:col-span-2 sm:row-span-3"; // Tall
          } else {
            cardLayout = "sm:col-span-2 sm:row-span-1"; // Small
          }

          return (
            <div
              key={index}
              className={`${cardLayout} aspect-[4/3] bg-rose-800/50 rounded-lg overflow-hidden relative animate-pulse`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-900/30 via-rose-800/30 to-rose-700/30"></div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-rose-900">
      {loading ? (
        <SkeletonLoader />
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-6 grid-flow-dense ">
          {categories
            .sort((a, b) => a.order - b.order)
            .slice(0, 18)
            .map((category, index) => {
              // Dynamic card sizing - creates organic collage effect
              let cardLayout = "";
              const mod = index % 8;

              if (mod === 0) {
                cardLayout = "sm:col-span-4 sm:row-span-3"; // Large horizontal
              } else if (mod === 1 || mod === 2) {
                cardLayout = "sm:col-span-2 sm:row-span-2"; // Medium square
              } else if (mod === 2 || mod === 2) {
                cardLayout = "sm:col-span-3 sm:row-span-2"; // Wide
              } else if (mod === 3) {
                cardLayout = "sm:col-span-2 sm:row-span-3"; // Tall
              } else {
                cardLayout = "sm:col-span-2 sm:row-span-1"; // Small
              }

              return (
                <Link
                  href={`/category/${category._id}`}
                  key={category._id}
                  className={`group font-raleway block focus-visible:outline-none transition-all duration-500 hover:scale-[1.02] ${cardLayout}`}
                >
                  <div className="relative h-full w-full overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 aspect-[4/3]">
                    {/* Glowing border effect */}
                    <div className="absolute inset-0  z-20 pointer-events-none overflow-hidden">
                      <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/50 transition-all duration-500  group-hover:scale-[0.92]"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    {/* Image with optimized loading */}
                    <img
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      src={category.singleImage || "/default-category.jpg"}
                      alt={category.title}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/default-category.jpg";
                      }}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40 transition-all duration-500 group-hover:from-black/70 group-hover:via-black/50 group-hover:to-black/30"></div>

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-center items-center p-4 text-center z-10">
                      <div className="transform transition-all duration-700 group-hover:-translate-y-4">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 [text-shadow:0_2px_10px_rgba(0,0,0,0.8)] transition-all duration-500 group-hover:text-shadow-lg group-hover:mb-3">
                          {category.title}
                        </h2>
                        <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                          <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-white/20 backdrop-blur-md rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300">
                            Explore
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 overflow-hidden z-10 pointer-events-none">
                      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-shine transition-opacity duration-500"></div>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      ) : (
        <div>No categories found</div>
      )}
    </div>
  );
};

export default CategoryHome;