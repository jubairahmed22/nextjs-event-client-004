import Link from "next/link";
import React from "react";

const HomeWishlist = () => {
  return (
    <div className="lg:py-28 md:py-10 sm:py-10">
      <div className="max-w-screen-2xl mx-auto flex justify-center items-center flex-col">
        <h1 className="font-playfairDisplay lg:text-5xl md:text-2xl sm:text-xl text-rose-900  text-center">
          Know What You Need For Your Event?
        </h1>

        <button className="mt-12  font-raleway hover:bg-rose-900 hover:text-white duration-300 ease-in-out text-lg px-6 py-4 border-4 font-semibold border-rose-900">
          BUILD YOUR WISHLIST
        </button>
      </div>
    </div>
  );
};

export default HomeWishlist;
