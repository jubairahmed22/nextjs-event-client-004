"use client"; // Ensure it's a client component

import { useEffect, useState } from "react";
import { initFlowbite } from "flowbite";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname
import axios from "axios";

const Navbar = () => {
  const pathname = usePathname(); // Get the current path
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Set initial cart state from localStorage
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);

    // Listen for changes across tabs/windows
    const handleStorageChange = (event) => {
      if (event.key === "cart") {
        const updatedCart = JSON.parse(event.newValue) || [];
        setCart(updatedCart);
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // Timer to update cart every second
    const intervalId = setInterval(() => {
      const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(updatedCart);
    }, 1000);

    // Cleanup both interval and event listener on unmount
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    initFlowbite(); // Initialize Flowbite components
  }, []);

  const [eventData, setEventData] = useState([]);

  useEffect(() => {
    const fetcheventData = async () => {
      try {
        const response = await axios.get(
          "https://server-gs.vercel.app/eventCollection"
        );
        setEventData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    // Fetch data immediately and then set interval
    fetcheventData();
    const intervalId = setInterval(fetcheventData, 1000); // Fetch every 2 seconds

    // Clear the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://server-gs.vercel.app/category");
        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    // Fetch data immediately and then set interval
    fetchCategories();
    const intervalId = setInterval(fetchCategories, 1000); // Fetch every 2 seconds

    // Clear the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <nav className="bg-white border-rose-500 dark:bg-gray-900 dark:border-gray-700 lg:py-4  border-b  font-montserrat">
      <div className="max-w-screen-3xl mx-auto flex flex-wrap items-center justify-between  p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center text-4xl text-rose-700 font-semibold font-pacifico whitespace-nowrap dark:text-white">
            My Color Events
          </span>
        </Link>
        <button
          data-collapse-toggle="navbar-dropdown"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-dropdown"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-dropdown">
          <ul className="flex flex-col lg:text-xl md:text-xl sm:text-lg font-playfairDisplay font-semibold p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link
                href="/"
                className={`block py-2 px-3 duration-300 ease-in-out ${
                  pathname === "/"
                    ? "text-rose-700"
                    : "text-gray-900 hover:text-rose-700"
                } rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 dark:text-white md:dark:hover:text-rose-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent`}
              >
                Home
              </Link>
            </li>
           
            <li>
              <Link
                href="/events"
                className={`block py-2 px-3 duration-300 ease-in-out ${
                  pathname === "/events"
                    ? "text-rose-700"
                    : "text-gray-900 hover:text-rose-700"
                } rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 dark:text-white md:dark:hover:text-rose-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent`}
              >
                Events
              </Link>
            </li>

            <li>
              <Link
                href="/rental"
                className={`block py-2 px-3 duration-300 ease-in-out ${
                  pathname === "/rental"
                    ? "text-rose-700"
                    : "text-gray-900 hover:text-rose-700"
                } rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 dark:text-white md:dark:hover:text-rose-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent`}
              >
                Rentals
              </Link>
            </li>
            <li>
              <Link
                href="/cart"
                className={`block py-2 px-3 duration-300 ease-in-out ${
                  pathname === "/cart"
                    ? "text-rose-700"
                    : "text-gray-900 hover:text-rose-700"
                } rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 dark:text-white md:dark:hover:text-rose-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent`}
              >
                Cart ( {cart.length > 0 ? cart.length : ""} )
              </Link>
            </li>
            <li>
              <Link
                href="/gallery"
                className={`block py-2 px-3 duration-300 ease-in-out ${
                  pathname === "/gallery"
                    ? "text-rose-700"
                    : "text-gray-900 hover:text-rose-700"
                } rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 dark:text-white md:dark:hover:text-rose-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent`}
              >
                Gallery
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={`block py-2 px-3 duration-300 ease-in-out ${
                  pathname === "/about"
                    ? "text-rose-700"
                    : "text-gray-900 hover:text-rose-700"
                } rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 dark:text-white md:dark:hover:text-rose-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent`}
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={`block py-2 px-3 duration-300 ease-in-out ${
                  pathname === "/contact"
                    ? "text-rose-700"
                    : "text-gray-900 hover:text-rose-700"
                } rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 dark:text-white md:dark:hover:text-rose-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent`}
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
