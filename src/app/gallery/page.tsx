"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import EventPageLoading from "@/components/Loading/EventPageLoading";
import InstaPost from "@/components/shared/InstaPost";

// Define the type for the user data
interface User {
  singleImage: string;
  images: string[]; // Add images property
}

// Define the type for the gallery data
interface GalleryData {
  users: User[];
  page: number;
  totalPages: number;
  totalDocuments: number;
}

// Define the type for the gallery object
interface Gallery {
  singleImage: string;
  images: string[];
}

const Page = () => {
  const [galleryData, setGalleryData] = useState<GalleryData>({
    users: [],
    page: 1,
    totalPages: 1,
    totalDocuments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // Add currentPage state

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://server-gs.vercel.app/all-gallery?page=${currentPage}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: GalleryData = await response.json();
        setGalleryData(data);
        setLoading(false);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]); // Add currentPage to dependency array

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= galleryData.totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Gallery | null>(null); // Use Gallery type
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const modalRef = useRef(null); // Ref for the modal container

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

  return (
    <div>
      <div className="pb-10 max-w-screen-2xl mx-auto">
        <div className="py-10 mx-auto w-full max-w-screen-2xl p-4 ">
          <h1 className="font-bold tracking-wider text-4xl text-center font-playfairDisplay  text-rose-900">
            Gallery 
          </h1> 
          <p className="font-semibold tracking-wider text-lg mt-5 text-center font-playfairDisplay  text-rose-900">
            Relive the unforgettable moments from our past events through our
            exclusive gallery! From vibrant celebrations and inspiring speakers
            to breathtaking performances and heartwarming connections, our
            photos capture the energy and excitement of every occasion.
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
          <EventPageLoading></EventPageLoading>
        ) : (
          <>
          <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-5">
            {galleryData.users.map((gallery) => (
              <div
                key={gallery.singleImage}
                onClick={() => openModal(gallery)}
                className="relative h-[400px] rounded-xl "
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

          {/* Add Pagination Controls */}
          {galleryData.totalPages > 1 && (
            <div className="flex justify-end mt-8 font-montserrat">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                
                {Array.from({ length: galleryData.totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-md border text-sm font-medium ${
                      currentPage === page
                        ? "bg-rose-900 text-white border-rose-900"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === galleryData.totalPages}
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
              {[
                selectedImage.singleImage,
                ...selectedImage.images,
              ].map((_, index) => (
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
              ))}
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