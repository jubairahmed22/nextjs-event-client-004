"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProductSearch from "./ProductSearch";
import { FilterCategorySidebar } from "../AllProductCopmonent/FilterCategorySidebar";

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
    href: "/gallery",
    title: "Gallery",
    icon: (
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14 10l-3.5 3.5L8 10"
        />
      </svg>
    ),
  },
  {
    href: "/expo",
    title: "Expo Form",
    icon: (
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
  },
  {
    href: "/about",
    title: "About",
    icon: (
      <svg
        className="w-5 h-5 mr-2"
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
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    href: "/cart",
    title: "Wishlist",
    icon: (
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    ),
  },
];

const NavbarDynamicSidebarAllProduct: React.FC = () => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cart, setCart] = useState<Array<any>>([]);
  const isActive = (href: string) => pathname.startsWith(href);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  const MenuIcon = () => (
    <svg
      className="h-6 w-6"
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
      className="h-6 w-6"
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

  const ChevronDownIcon = ({ className = "" }) => (
    <svg
      className={`w-5 h-5 ${className}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06 0L10 10.91l3.71-3.7a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 010-1.06z"
        clipRule="evenodd"
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

  return (
    <>
      {/* HEADER */}
      <header className="sticky font-montserrat top-0 z-50 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-lg shadow-sm border-b border-gray-100 dark:border-neutral-800 transition-colors duration-300">
        <div className="max-w-screen-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

            {/* Product Search */}
            <div className="hidden md:flex flex-1 md:mx-6 min-w-[200px] max-w-xl">
              <ProductSearch />
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex gap-2 items-center">
              {staticLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-base px-3 py-2 rounded-md transition-all duration-200 group flex items-center ${
                    isActive(item.href)
                      ? "text-rose-700 font-semibold dark:text-rose-400"
                      : "text-gray-800 dark:text-gray-200 hover:text-rose-600 dark:hover:text-rose-400"
                  }`}
                >
                  <span className="relative z-10 flex items-center">
                    {item.icon}
                    <span className="ml-2">
                      {item.title}
                      {item.href === "/cart" && cart.length > 0 && (
                        <span className="ml-1.5 text-xs font-bold text-white bg-rose-600 px-1.5 py-0.5 rounded-full transform translate-y-[-1px] inline-block">
                          {cart.length}
                        </span>
                      )}
                    </span>
                  </span>
                  <span
                    className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 h-[2px] rounded-full transition-all duration-300 ${
                      isActive(item.href)
                        ? "bg-rose-700 dark:bg-rose-400 w-4/5"
                        : "bg-rose-700 w-0 group-hover:w-4/5"
                    }`}
                  />
                  <span className="absolute inset-0 bg-rose-50 dark:bg-rose-900/30 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </Link>
              ))}
            </nav>

            {/* Categories Button */}
            <button
              onClick={toggleSidebar}
              className="flex items-center gap-2 bg-gradient-to-r from-rose-700 to-pink-600 hover:from-rose-600 hover:to-pink-500 text-white px-4 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/30 active:scale-[0.98] group relative overflow-hidden"
              aria-label="Toggle categories"
            >
              <span className="relative z-10 font-medium hidden sm:inline">
                Categories
              </span>
              <span className="relative z-10 h-5 w-5">
                {isSidebarOpen ? <XIcon /> : <MenuIcon />}
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        </div>
      </header>

      {/* SIDEBAR */}
      <aside
        className={`fixed font-montserrat top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-neutral-950 shadow-xl z-40 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b dark:border-neutral-800 bg-gradient-to-r from-rose-50/50 to-pink-50/50 dark:from-neutral-900 dark:to-neutral-900 relative">
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-pink-500"></div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-700 to-pink-600 bg-clip-text text-transparent">
              Browse Categories
            </h2>
            <button
              onClick={closeSidebar}
              className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 p-2 rounded-full transition-all duration-200 hover:rotate-90"
              aria-label="Close sidebar"
            >
              <XIcon />
            </button>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden px-6 py-4 border-b dark:border-neutral-800">
            <ProductSearch />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden px-6 pt-4 pb-3 border-b dark:border-neutral-800 grid grid-cols-3 gap-2">
            {staticLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={`flex items-center text-xs px-2 py-2 rounded-lg transition duration-200 ${
                  isActive(item.href)
                    ? "text-rose-700 font-semibold dark:text-rose-400 bg-rose-50 dark:bg-neutral-800"
                    : "text-gray-800 dark:text-gray-200 hover:text-rose-600 hover:bg-gray-100 dark:hover:bg-neutral-800"
                }`}
              >
                <span className="mr-1">{item.icon}</span>
                <span>{item.title}</span>
                {item.href === "/cart" && cart.length > 0 && (
                  <span className="ml-auto text-xs font-bold text-white bg-rose-600 px-2 py-1 rounded-full">
                    {cart.length}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Filter Category Sidebar */}
          <div onClick={(e) => e.stopPropagation()}>
            <FilterCategorySidebar closeSidebar={closeSidebar} />
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 backdrop-blur-sm transition-opacity duration-500 ease-in-out opacity-0 animate-fadeIn"
          onClick={closeSidebar}
        />
      )}
    </>
  );
};

export default NavbarDynamicSidebarAllProduct;