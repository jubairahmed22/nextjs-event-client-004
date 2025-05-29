"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import EventPageLoading from "@/components/Loading/EventPageLoading";
import GalleryHomeSliderLoading from "../Loading/GalleryHomeSliderLoading";

interface User {
  singleImage: string;
  images: string[];
}

interface GalleryData {
  products: User[];
  page: number;
  totalPages: number;
  totalDocuments: number;
}

const HomeGalleryCompo = () => {
  const [galleryData, setGalleryData] = useState<GalleryData>({
    products: [],
    page: 1,
    totalPages: 1,
    totalDocuments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const intervalRef = useRef<NodeJS.Timeout>();

  // Auto-rotation effect
  useEffect(() => {
    const startAutoRotation = () => {
      intervalRef.current = setInterval(() => {
        setDirection("right");
        setCurrentIndex((prev) =>
          prev === galleryData.products.length - 1 ? 0 : prev + 1
        );
      }, 3000);
    };

    if (!isHovered && galleryData.products.length > 1) {
      startAutoRotation();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [galleryData.products.length, isHovered]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://server-gs.vercel.app/admin/main-gallery`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data: GalleryData = await response.json();
        setGalleryData(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const nextSlide = () => {
    setDirection("right");
    setCurrentIndex((prev) =>
      prev === galleryData.products.length - 1 ? 0 : prev + 1
    );
    resetAutoRotation();
  };

  const prevSlide = () => {
    setDirection("left");
    setCurrentIndex((prev) =>
      prev === 0 ? galleryData.products.length - 1 : prev - 1
    );
    resetAutoRotation();
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? "right" : "left");
    setCurrentIndex(index);
    resetAutoRotation();
  };

  const resetAutoRotation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const getVisibleItems = () => {
    if (galleryData.products.length === 0) return [];

    const prevIndex =
      currentIndex === 0 ? galleryData.products.length - 1 : currentIndex - 1;
    const nextIndex =
      currentIndex === galleryData.products.length - 1 ? 0 : currentIndex + 1;

    return [
      { ...galleryData.products[prevIndex], position: "left" },
      { ...galleryData.products[currentIndex], position: "center" },
      { ...galleryData.products[nextIndex], position: "right" },
    ];
  };

  // Animation variants
  const itemVariants = {
    center: {
      scale: 1,
      y: 0,
      zIndex: 20,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    left: {
      scale: 0.9,
      y: 20,
      zIndex: 10,
      opacity: 0.8,
      x: "-20%",
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    right: {
      scale: 0.9,
      y: 20,
      zIndex: 10,
      opacity: 0.8,
      x: "20%",
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    exitLeft: {
      x: "-100%",
      opacity: 0,
      transition: { duration: 0.3 },
    },
    exitRight: {
      x: "100%",
      opacity: 0,
      transition: { duration: 0.3 },
    },
    enterLeft: {
      x: "100%",
      opacity: 0,
      transition: { duration: 0 },
    },
    enterRight: {
      x: "-100%",
      opacity: 0,
      transition: { duration: 0 },
    },
  };

  const liftAnimation = {
    initial: { y: 0 },
    animate: {
      y: [-20, 0], // Lift up then settle back down
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="pb-10 max-w-screen-3xl mx-auto px-4 font-montserrat">
      <div className="lg:py-10 md:py-2 mx-auto w-full max-w-screen-3xl p-4">
        <div className="text-center lg:mb-10 md:mb-2">
          <h1 className="mb-4 text-lg md:text-2xl lg:text-4xl font-playfairDisplay font-bold text-rose-900">
            <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-rose-700 to-rose-900">
              PORTFOLIO HIGHLIGHTS
            </span>
          </h1>
          <p className="max-w-screen-3xl mx-auto lg:w-[60%] md:w-[90%] text-md text-rose-800/90 font-light leading-relaxed">
            Step into a world of unforgettable moments crafted with precision
            and passion.
          </p>
        </div>
      </div>

      {loading ? (
        <GalleryHomeSliderLoading />
      ) : galleryData.products.length > 0 ? (
        <div
          className="relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] xl:h-[550px]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Navigation arrows - responsive sizing and positioning */}
          <button
            onClick={prevSlide}
            className="absolute left-0 z-30 p-1 sm:p-2 bg-white/30 rounded-full hover:bg-white/50 transition-all duration-300 ml-1 sm:ml-2 md:ml-4 top-1/2 -translate-y-1/2"
          >
            <svg
              className="h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8 text-rose-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 z-30 p-1 sm:p-2 bg-white/30 rounded-full hover:bg-white/50 transition-all duration-300 mr-1 sm:mr-2 md:mr-4 top-1/2 -translate-y-1/2"
          >
            <svg
              className="h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8 text-rose-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Carousel items with responsive sizing */}
          <div className="flex items-center justify-center gap-1 sm:gap-2 w-full h-full px-2 sm:px-4">
            <AnimatePresence custom={direction} mode="popLayout">
              {getVisibleItems().map((gallery, index) => (
                <motion.div
                  key={`${gallery.singleImage}-${gallery.position}`}
                  className={`relative rounded-lg sm:rounded-xl ${
                    gallery.position === "center"
                      ? "h-[250px] w-[300px] sm:h-[300px] sm:w-[400px] md:h-[350px] md:w-[500px] lg:h-[400px] lg:w-[600px] xl:h-[500px] xl:w-[700px] shadow-lg sm:shadow-xl"
                      : "h-[180px] w-[220px] sm:h-[220px] sm:w-[280px] md:h-[280px] md:w-[350px] lg:h-[320px] lg:w-[400px] xl:h-[400px] xl:w-[500px] shadow sm:shadow-lg"
                  }`}
                  custom={direction}
                  variants={itemVariants}
                  initial={
                    gallery.position === "left"
                      ? "enterLeft"
                      : gallery.position === "right"
                      ? "enterRight"
                      : "center"
                  }
                  animate={gallery.position}
                  exit={direction === "left" ? "exitLeft" : "exitRight"}
                  layout
                >
                  <motion.div
                    className="absolute inset-0 w-full h-full"
                    variants={liftAnimation}
                    animate="animate"
                    initial="initial"
                  >
                    <img
                      className="w-full h-full object-cover rounded-lg sm:rounded-xl"
                      src={gallery.singleImage}
                      alt="Gallery"
                      loading="lazy" // Added lazy loading for better performance
                    />
                    <div className="absolute inset-0 bg-black opacity-10 hover:opacity-20 rounded-lg sm:rounded-xl transition-opacity duration-300" />
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Indicator dots - responsive spacing and sizing */}
          <div className="flex justify-center space-x-1 sm:space-x-2 mt-4 sm:mt-6 md:mt-8 lg:mt-12 xl:mt-20 px-4">
            {galleryData.products.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-rose-700 w-4 sm:w-6"
                    : "bg-rose-300"
                }`}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-10 text-rose-800">
          No gallery items found.
        </div>
      )}

      <div className="flex justify-center items-center mt-12 lg:mt-36">
        <Link href="/gallery">
          <button className="px-8 py-3 bg-gradient-to-r from-rose-700 to-rose-900 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:shadow-rose-400/20 transition-all duration-300 hover:scale-105">
            View Full Portfolio
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomeGalleryCompo;
