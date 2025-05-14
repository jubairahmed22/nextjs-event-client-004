"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProductSearch from "./ProductSearch";
import { FilterCategorySidebar } from "../AllProductCopmonent/FilterCategorySidebar";
import {
  ChevronRightIcon,
  SearchIcon,
  SparkleIcon,
  StarIcon,
} from "lucide-react";

interface Category {
  _id: string;
  title: string;
  hasSubcategories?: boolean;
}

interface SubCategory {
  _id: string;
  title: string;
  categoryObjectId: string;
  singleImage?: string;
}

const staticLinks = [
  {
    href: "/",
    title: "Home",
    icon: (
      <svg
        className="w-6 h-6 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    href: "/gallery",
    title: "Gallery",
    icon: (
      <svg
        className="w-6 h-6 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  // {
  //   href: "/expo",
  //   title: "Expo Form",
  //   icon: (
  //     <svg
  //       className="w-6 h-6 mr-2"
  //       fill="none"
  //       stroke="currentColor"
  //       viewBox="0 0 24 24"
  //     >
  //       <path
  //         strokeLinecap="round"
  //         strokeLinejoin="round"
  //         strokeWidth={2}
  //         d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
  //       />
  //     </svg>
  //   ),
  // },
  {
    href: "/about",
    title: "About",
    icon: (
      <svg
        className="w-6 h-6 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    href: "/contact",
    title: "Contact",
    icon: (
      <svg
        className="w-6 h-6 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
  },
  {
    href: "/Decor-Rental",
    title: "Décor Rental",
    icon: (
      <svg
        className="w-6 h-6 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
  },
  {
    href: "/event-planing",
    title: "Event Planing",
    icon: (
      <svg
        className="w-6 h-6 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    href: "/cart",
    title: "Wishlist",
    icon: (
      <svg
        className="w-6 h-6 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
  },
];

const NavbarMenu: React.FC = () => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cart, setCart] = useState<Array<any>>([]);
  const isActive = (href: string) => {
    // Special case for home path - needs exact match
    if (href === "/") {
      return pathname === "/";
    }

    return (
      pathname.startsWith(href) &&
      (pathname === href || pathname[href.length] === "/")
    );
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  const MenuIcon = () => (
    <svg
      className="h-8 w-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );

  const XIcon = () => (
    <svg
      className="h-8 w-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "cart") {
        const updatedCart = JSON.parse(event.newValue || "[]");
        setCart(updatedCart);
      }
    };
    window.addEventListener("storage", handleStorageChange);

    const intervalId = setInterval(() => {
      const updatedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(updatedCart);
    }, 1000);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeSidebar();
  };

  const [lastScrollY, setLastScrollY] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setHeaderVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const [isAnimating, setIsAnimating] = React.useState(false);

  // Trigger animation when count changes
  React.useEffect(() => {
    if (cart.length > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [cart.length]);

  return (
    <>
      {/* HEADER */}
      <header
        className={`sticky font-montserrat py-4 top-0 z-40 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-lg  transition-all duration-300 transform ${
          headerVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 md:py-4 gap-3">
            {/* Logo */}
            <Link
              href="/"
              className="lg:text-3xl md:text-2xl font-pacifico hover:text-rose-600 transition-all duration-300 hover:scale-[1.02] w-full md:w-auto flex items-center group"
              aria-label="Home"
            >
              <span className="bg-gradient-to-r from-rose-700 via-pink-600 to-purple-600 bg-clip-text text-transparent bg-size-200 hover:bg-pos-100 transition-all duration-500">
                MY COLOR EVENTS
              </span>
            </Link>

            {/* <div className="flex items-center space-x-4">
        <h1 className="text-white text-xl font-bold">My App</h1>
      </div> */}

            <div className="flex flex-row items-center gap-6">
              <div
                className="relative group outline-none"
                aria-label={`${cart.length} items in cart`}
              >
                <div className="relative">
                  {/* Heart button with pulse animation */}
                  <Link href="/cart" passHref>
                    <button
                      className={`
          w-12 h-12 bg-gray-900 rounded-full flex justify-center items-center
          transition-all duration-300
          hover:bg-black hover:scale-110
          focus:ring-2 focus:ring-red-400 focus:ring-opacity-75
          shadow-lg hover:shadow-xl
          ${isAnimating ? "animate-pulse" : ""}
        `}
                      // Remove the onClick handler that was preventing navigation
                    >
                      {/* Heart with subtle beat animation */}
                      <span
                        className={`
            text-white text-2xl
            transition-transform duration-300
            group-hover:scale-125
            ${isAnimating ? "animate-beat" : ""}
          `}
                      >
                        ♥
                      </span>

                      {/* Gradient background for extra depth */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-black opacity-30" />
                    </button>
                  </Link>

                  {/* Premium badge with count */}
                  <span
                    className={`
        absolute -top-2 -right-2 
        bg-gradient-to-br from-red-500 to-pink-500 
        text-white rounded-full w-7 h-7 
        flex items-center justify-center text-xs font-bold
        shadow-md
        transition-all duration-300
        ${isAnimating ? "scale-150" : ""}
        ${cart.length === 0 ? "opacity-0 scale-0" : "opacity-100 scale-100"}
      `}
                  >
                    {cart.length > 9 ? "9+" : cart.length}
                  </span>
                </div>

                {/* Tooltip on hover */}
                <div
                  className="
      absolute top-full right-0 mt-2 px-3 py-1 
      bg-black text-white text-sm rounded
      opacity-0 group-hover:opacity-100
      transition-opacity duration-200
      pointer-events-none
      whitespace-nowrap
    "
                >
                  View your cart
                  <div className="absolute -top-1 right-3 w-3 h-3 bg-black transform rotate-45" />
                </div>
              </div>

              <button
                onClick={toggleSidebar}
                aria-label="Toggle categories"
                className="flex flex-row justify-between font-montserrat items-center gap-2 hover:text-rose-800 duration-200"
              >
                <span className="z-10 font-semibold text-2xl  hidden sm:inline">
                  MENU
                </span>
                <span className="relative z-10">
                  {isSidebarOpen ? <MenuIcon /> : <MenuIcon />}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <aside
        className={`fixed z-50 font-montserrat top-0 right-0 h-full w-full sm:w-96 bg-black shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full overflow-hidden border-l border-gray-800">
          {/* Premium Header */}
          <div className="flex justify-between items-center p-6 bg-gradient-to-b from-black to-gray-900 relative border-b border-gray-800">
            <h2 className="text-white text-xl font-montserrat font-bold flex items-center">
              <SparkleIcon className="mr-2 text-yellow-400" />
              MENU
            </h2>
            <button
              onClick={closeSidebar}
              className="p-2 rounded-full hover:bg-gray-800 transition-all duration-200 group"
              aria-label="Close sidebar"
            >
              <div className="text-gray-400 group-hover:text-white rotate-0 group-hover:rotate-90 transition-transform duration-300">
                <XIcon size={24} />
              </div>
            </button>
          </div>

          {/* Mobile Search with glow effect */}
          <div className="px-6 py-5 bg-black">
            <div className="relative">
              <ProductSearch className="bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              <SearchIcon className="absolute right-3 top-3 text-gray-500" />
            </div>
          </div>

          {/* Animated Navigation with subtle hover effects */}
          <div className="px-4 pt-2 pb-8 overflow-y-auto flex-1">
            <nav className="space-y-1">
              {staticLinks.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex items-center px-4 py-5 rounded-xl text-2xl transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-gradient-to-r from-purple-900/50 to-pink-900/50 text-white "
                      : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                  } transform ${
                    isSidebarOpen
                      ? "translate-x-0 opacity-100"
                      : "translate-x-10 opacity-0"
                  }`}
                  style={{
                    transitionDelay: isSidebarOpen
                      ? `${index * 20 + 170}ms`
                      : "0ms",
                  }}
                >
                  <span className="mr-3 text-xl text-white/80 group-hover:text-white">
                    {item.icon}
                  </span>
                  <span className="text-base font-medium">{item.title}</span>
                  {item.href === "/cart" && cart.length > 0 && (
                    <span className="ml-auto px-2.5 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white">
                      {cart.length}
                    </span>
                  )}
                  <ChevronRightIcon className="ml-auto text-gray-500 text-opacity-50" />
                </Link>
              ))}
            </nav>

            {/* Premium Footer Section */}
            {/* <div className="mt-12 px-4">
        <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
          <div className="flex items-center mb-2">
            <StarIcon className="text-yellow-400 mr-2" />
            <h3 className="text-white font-medium">Premium Features</h3>
          </div>
          <p className="text-gray-400 text-sm mb-3">
            Unlock exclusive content and special offers.
          </p>
          <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
            Upgrade Now
          </button>
        </div>
      </div> */}
          </div>
        </div>
      </aside>

      {/* Enhanced Overlay with gradient */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 transition-opacity duration-500 ease-in-out opacity-0 animate-fadeIn"
          onClick={closeSidebar}
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%)",
            backdropFilter: "blur(8px)",
          }}
        />
      )}
    </>
  );
};

export default NavbarMenu;
