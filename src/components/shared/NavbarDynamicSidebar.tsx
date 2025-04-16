"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProductSearch from "./ProductSearch";

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
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-3.5 3.5L8 10" />
      </svg>
    ),
  },
  {
    href: "/expo",
    title: "Expo Form",
    icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    href: "/about",
    title: "About",
    icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: "/contact",
    title: "Contact",
    icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: "/cart",
    title: "Wishlist",
    icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
];


const NavbarDynamicSidebar: React.FC = () => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<
    Record<string, SubCategory[]>
  >({});
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://server-gs.vercel.app/web/main-category");
        const data = await res.json();
        const formatted = (data.products || []).map((cat: Category) => ({
          ...cat,
          hasSubcategories: undefined,
        }));
        setCategories(formatted);
        formatted.forEach((cat) => fetchSubCategories(cat._id));
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const fetchSubCategories = async (categoryId: string) => {
    if (subCategories[categoryId]) return;
    try {
      const res = await fetch(
        `https://server-gs.vercel.app/admin/web/sub-category/${categoryId}`
      );
      const data = await res.json();
      if (data.subCategories?.length > 0) {
        setSubCategories((prev) => ({
          ...prev,
          [categoryId]: data.subCategories,
        }));
        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === categoryId ? { ...cat, hasSubcategories: true } : cat
          )
        );
      } else {
        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === categoryId ? { ...cat, hasSubcategories: false } : cat
          )
        );
      }
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

  const isActive = (href: string) => pathname.startsWith(href);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const toggleCategory = (id: string) =>
    setActiveCategory((prev) => (prev === id ? null : id));

  const capitalizeEachWord = (str: string) =>
    str
      ?.split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

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

  const [cart, setCart] = useState<Array<any>>([]); // Define the type for cart items

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

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md shadow-sm font-poppins border-b border-gray-100 dark:border-neutral-800">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="flex flex-wrap md:flex-nowrap justify-between items-center py-3 md:py-4 gap-3">
            {/* Logo with animation */}
            <Link
              href="/"
              className="text-3xl font-pacifico hover:text-rose-600 transition-all duration-300 hover:scale-105 w-full md:w-auto flex items-center group"
              aria-label="Home"
            >
              <span className="bg-gradient-to-r from-rose-700 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                MY COLOR EVENTS
              </span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 w-full md:mx-6 min-w-[200px]">
              <ProductSearch />
            </div>

            {/* Navigation Links with animated underline */}
            <div className="hidden md:flex gap-4 items-center">
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
    {item.icon}
    <span>
      {item.title}
      {item.href === "/cart" && cart.length > 0 && (
        <span className="ml-1 text-sm font-semibold text-white bg-rose-600 px-2 py-0.5 rounded-full">
          {cart.length}
        </span>
      )}
    </span>
    <span
      className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 rounded-full transition-all duration-300 ${
        isActive(item.href)
          ? "bg-rose-700 dark:bg-rose-400 w-4/5"
          : "bg-rose-700 w-0 group-hover:w-4/5"
      }`}
    />
  </Link>
))}


            </div>

            {/* Animated Categories Button */}
            <button
              onClick={toggleSidebar}
              className="flex items-center gap-2 bg-gradient-to-r from-rose-700 to-pink-600 hover:from-rose-600 hover:to-pink-500 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/20 active:scale-95 group"
              aria-label="Toggle categories"
            >
              <span className="font-medium">Categories</span>
              <span className="relative h-5 w-5">
                {isSidebarOpen ? (
                  <svg
                    className="absolute inset-0 transition-all duration-300 group-hover:scale-110"
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
                ) : (
                  <svg
                    className="absolute inset-0 transition-all duration-300 group-hover:scale-110"
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
                )}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* SIDEBAR with custom scrollbar */}
      <aside
        className={`fixed top-0 right-0 h-full font-raleway w-80 bg-white dark:bg-neutral-900 shadow-2xl z-40 transition-all duration-500 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Gradient Header */}
          <div className="flex justify-between items-center p-6 border-b dark:border-neutral-800 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-neutral-800 dark:to-neutral-800">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-700 to-pink-600 bg-clip-text text-transparent">
              Browse Categories
            </h2>
            <button
              onClick={toggleSidebar}
              className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 p-2 rounded-full transition-colors duration-200"
              aria-label="Close sidebar"
            >
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
            </button>
          </div>

          {/* Category List with Custom Scrollbar */}
          <div className="flex-1 overflow-y-auto">
            <div className="custom-scrollbar h-full">
              {loading ? (
                <div className="animate-pulse p-6 space-y-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-3/4" />
                      <div className="h-4 bg-gray-100 dark:bg-neutral-800 rounded w-1/2 ml-4" />
                      <div className="h-4 bg-gray-100 dark:bg-neutral-800 rounded w-1/2 ml-4" />
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="p-4 space-y-1">
                  {categories.map((cat) => (
                    <li key={cat._id} className="group">
                      <div className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors duration-200">
                        <Link
                          href={`/category/${cat._id}`}
                          onClick={() => setIsSidebarOpen(false)}
                          className={`flex-1 text-lg font-medium transition-colors flex items-center ${
                            isActive(`/category/${cat._id}`)
                              ? "text-rose-700 dark:text-rose-500"
                              : "text-gray-800 dark:text-gray-200 group-hover:text-rose-600"
                          }`}
                        >
                          <span className="mr-2 opacity-70 group-hover:opacity-100 transition-opacity">
                            {cat.icon || "•"}
                          </span>
                          {capitalizeEachWord(cat.title)}
                        </Link>

                        {cat.hasSubcategories && (
                          <button
                            onClick={() => toggleCategory(cat._id)}
                            className="text-gray-400 hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-500 p-1 rounded-full transition-colors duration-200"
                            aria-label={`Toggle ${cat.title} subcategories`}
                          >
                            <svg
                              className={`w-5 h-5 transition-transform duration-300 ${
                                activeCategory === cat._id ? "rotate-180" : ""
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06 0L10 10.91l3.71-3.7a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 010-1.06z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Subcategories with nested animation */}
                      {activeCategory === cat._id &&
                        subCategories[cat._id]?.length > 0 && (
                          <ul className="mt-1 ml-8 space-y-1 pl-2 border-l-2 border-gray-200 dark:border-neutral-700">
                            {subCategories[cat._id].map((sub) => (
                              <li key={sub._id} className="animate-fadeIn">
                                <Link
                                  href={`/subcategory/${sub._id}`}
                                  onClick={() => setIsSidebarOpen(false)}
                                  className={`block px-3 py-2 text-sm rounded-md transition-all duration-200 flex items-center ${
                                    isActive(`/subcategory/${sub._id}`)
                                      ? "text-rose-700 dark:text-rose-500 bg-rose-50 dark:bg-neutral-800"
                                      : "text-gray-600 dark:text-gray-300 hover:text-rose-600 hover:bg-gray-50 dark:hover:bg-neutral-800"
                                  }`}
                                >
                                  <span className="mr-2 opacity-70">›</span>
                                  {capitalizeEachWord(sub.title)}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Footer with gradient border */}
          <div className="border-t border-gray-200 dark:border-neutral-800 bg-gradient-to-r from-transparent via-rose-50 to-transparent dark:via-neutral-800/50">
            <Link
              href="/all-categories"
              className="block text-center text-rose-700 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 font-medium py-3 rounded-lg hover:bg-rose-50 dark:hover:bg-neutral-800 transition-all duration-200 mx-4 my-2"
              onClick={() => setIsSidebarOpen(false)}
            >
              View All Categories →
            </Link>
          </div>
        </div>
      </aside>

      {/* Overlay with fade effect */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 backdrop-blur-sm transition-opacity duration-300 opacity-0 animate-fadeIn"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default NavbarDynamicSidebar;
