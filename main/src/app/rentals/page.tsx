"use client";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import RentalPageLoading from "@/components/Loading/RentalPageLoading";

// Define the type for the category data
interface Category {
  catValue: string;
  singleImage: string;
  category: string;
}

const RentalMainPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top of the page when component mounts
  }, []);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loader state

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get<Category[]>(
        "http://localhost:8000/category"
      );
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchCategories(); // Fetch data immediately
    const intervalId = setInterval(fetchCategories, 10000); // Fetch every 10 seconds

    return () => clearInterval(intervalId);
  }, [fetchCategories]);

  return (
    <div className="pb-10 max-w-screen-2xl mx-auto">
      <div className="py-10 mx-auto w-full max-w-screen-2xl p-4 ">
        <h1 className="font-bold tracking-wider text-4xl text-center font-playfairDisplay  text-rose-900">
          Rentals
        </h1>
        <p className="font-semibold tracking-wider text-lg mt-5 text-center font-playfairDisplay  text-rose-900">
          Make your events seamless with our premium rental items! From elegant
          décor essentials, we offer everything you need for a perfect setup. <br></br>
          Browse our collection and book with ease to
          elevate your event today
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
        <RentalPageLoading></RentalPageLoading>
      ) : (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5 mb-10 w-full sm:mx-4">
          {categories.map((event) => (
            <Link key={event.catValue} href={`/rentals/${event.catValue}`}>
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
                   
                    <h1 className="tracking-wider lg:text-3xl text-center font-playfairDisplay text-white font-extrabold leading-none md:text-5xl  dark:text-white [text-shadow:_0_0_8px_rgba(255,255,255,0.6),_0_0_16px_rgba(255,255,255,0.4)]">
                    {event.category}
                </h1>
                  </div>
                </section>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RentalMainPage;
