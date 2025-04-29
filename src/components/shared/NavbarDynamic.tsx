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

const NavbarDynamic: React.FC = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<
    Record<string, SubCategory[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const staticLinks = [
    { href: "/gallery", title: "Gallery" },
    { href: "/expo", title: "Expo Form" },
    { href: "/about", title: "About" },
    { href: "/contact", title: "Contact" },
    { href: "/cart", title: "Cart" },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/web/main-category"
        );
        const data = await response.json();
        const initialCategories = (data.products || []).map(
          (cat: Category) => ({
            ...cat,
            hasSubcategories: undefined,
          })
        );
        setCategories(initialCategories);
        initialCategories.forEach((cat) => fetchSubCategories(cat._id));
      } catch (err) {
        console.error("Failed to load categories:", err);
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
        `http://localhost:8000/admin/web/sub-category/${categoryId}`
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

  const handleHover = (id: string) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    const hasSubs = categories.find((c) => c._id === id)?.hasSubcategories;
    if (hasSubs) setActiveCategory(id);
  };

  const handleLeave = () => {
    const timeout = setTimeout(() => setActiveCategory(null), 200);
    setHoverTimeout(timeout);
  };

  const toggleMobileSubmenu = (id: string) => {
    setActiveCategory((prev) => (prev === id ? null : id));
  };

  const LoadingSkeleton = () => {
    return (
      <div className="hidden md:flex items-center gap-6 pb-4 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-6 w-20 bg-gray-200 dark:bg-neutral-700 rounded"></div>
        ))}
      </div>
    );
  };

  const capitalizeEachWord = (str: string) => {
    if (!str) return str;
    return str.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };
  


  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm dark:bg-neutral-900 font-poppins">
      <div className="max-w-screen-4xl mx-auto px-4 sm:px-6 ">
        {/* Row 1: Logo, Search, Static Links */}
        <div className="flex flex-col md:flex-row justify-between items-center py-4 md:py-6 gap-4 md:gap-0">
          {/* Logo */}
          <Link
            href="/"
            className="text-3xl w-[850px] font-pacifico text-rose-700 hover:text-rose-600 transition"
          >
            MY COLOR EVENTS
          </Link>

          {/* Search Bar */}
          <div className="w-full ">
            <ProductSearch  />
          </div>

          {/* Static Links */}
          <div className="hidden md:flex gap-4 w-[1250px]">
            {staticLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-lg px-3 py-2 rounded-md transition-colors ${
                  isActive(item.href)
                    ? "text-rose-700 font-semibold underline underline-offset-4"
                    : "text-gray-800 dark:text-gray-200 hover:text-rose-600"
                }`}
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden absolute top-5 right-4 text-gray-700 dark:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
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
            ) : (
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
            )}
          </button>
        </div>

        {/* Row 2: Category Navigation */}
        {/* Row 2: Category Navigation */}
{loading ? (
  <LoadingSkeleton />
) : (
  <nav className="hidden md:flex items-center gap-6 pb-4">
    {categories.map((item) => {
      const link = `/category/${item._id}`;
      const isActiveLink = isActive(link);
      const hasDropdown = item.hasSubcategories;

      return (
        <div
          key={link}
          onMouseEnter={() => handleHover(item._id)}
          onMouseLeave={handleLeave}
          className="relative"
        >
          <Link
            href={link}
            className={`text-base py-2 rounded-md transition-colors ${
              isActiveLink
                ? "text-rose-700 font-semibold underline underline-offset-4"
                : "text-gray-800 dark:text-gray-200 hover:text-rose-600"
            }`}
          >
            {capitalizeEachWord(item.title)}
          </Link>

          {/* Dropdown */}
          {hasDropdown && (
            <div
              className={`absolute left-0 top-full mt-1 w-56 bg-white dark:bg-neutral-800 rounded shadow-lg z-50 transition-all duration-300 ${
                activeCategory === item._id
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 pointer-events-none translate-y-2"
              }`}
            >
              {subCategories[item._id]?.map((sub) => (
                <Link
                  key={sub._id}
                  href={`/subcategory/${sub._id}`}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700"
                >
                 {capitalizeEachWord(sub.title)} 
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    })}
  </nav>
)}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            {[...staticLinks, ...categories].map((item) => {
              const isStatic = "href" in item;
              const link = isStatic ? item.href : `/category/${item._id}`;
              const title = isStatic ? item.title : item.title;
              const isActiveLink = isActive(link);
              const hasDropdown = !isStatic && item.hasSubcategories;

              return (
                <div key={link}>
                  <div className="flex justify-between items-center">
                    <Link
                      href={link}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block text-base px-4 py-2 rounded-md ${
                        isActiveLink
                          ? "text-rose-700 font-semibold underline underline-offset-4"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700"
                      }`}
                    >
                      {title}
                    </Link>
                    {hasDropdown && (
                      <button
                        onClick={() => toggleMobileSubmenu(item._id)}
                        className="px-2"
                        aria-label="Toggle subcategories"
                      >
                        <svg
                          className={`w-5 h-5 transition-transform ${
                            activeCategory === item._id ? "rotate-180" : ""
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  {!isStatic &&
                    activeCategory === item._id &&
                    subCategories[item._id]?.map((sub) => (
                      <Link
                        key={sub._id}
                        href={`/subcategory/${sub._id}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block ml-6 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700"
                      >
                        {sub.title}
                      </Link>
                    ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};

export default NavbarDynamic;
