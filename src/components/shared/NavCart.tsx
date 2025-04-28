"use client";
import React, { useEffect, useState } from "react";
import ModalCart from "../AllModal/ModalCart";

const NavCart: React.FC = () => {
  const [cart, setCart] = useState<Array<any>>([]); // Define the type for cart items
  const [isDropdown, setIsDropdown] = useState<boolean>(false);

  useEffect(() => {
    // Set initial cart state from localStorage
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);

    // Listen for changes across tabs/windows
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "cart") {
        const updatedCart = JSON.parse(event.newValue || "[]");
        setCart(updatedCart);
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // Timer to update cart every second
    const intervalId = setInterval(() => {
      const updatedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(updatedCart);
    }, 1000);

    // Cleanup both interval and event listener on unmount
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const openModalPersonal = () => {
    setIsDropdown(true);
  };

  const closeModalPersonal = () => {
    setIsDropdown(false);
  };

  return (
    <div>
      <button
        onClick={openModalPersonal}
        className="hidden lg:block fixed z-50 shadow-lg bg-white border border-gray-400 rounded bottom-4 right-4 dark:bg-gray-700 dark:border-gray-600"
      >
        <div className="relative flex justify-center items-center p-4">
          {/* Badge */}
          <div className="absolute top-0 -mt-4 flex justify-center items-center w-6 h-6 bg-black text-white text-sm font-bold rounded-full">
            {cart.length}
          </div>
          {/* Heart Icon */}
          <div className="text-black dark:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-8 h-8"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        </div>
      </button>
      <ModalCart
        isVisible={isDropdown}
        onClose={closeModalPersonal}
        cart={cart}
      />
    </div>
  );
};

export default NavCart;
