"use client";

import { notFound } from "next/navigation";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import ModalProductDetails from "@/components/AllModal/ModalProductDetails";

interface Category {
  _id: string;
  title: string;
  description: string;
  categoryObjectId: string;
  singleImage?: string;
}

interface Product {
  _id: string;
  title: string;
  productId: string;
  category: string;
  type: string;
  quantity: number;
  buyingPrice: number;
  sellingPrice: number;
  perDayPricing: number;
  singleImage?: string;
  subCategory?: string;
}

interface EventProduct extends Product {
  quantity: number;
}

interface ProductsResponse {
  products: Product[];
  page: number;
  totalPages: number;
  totalProducts: number;
  totalQuantity: number;
  totalBuyingPrice: number;
  totalSellingPrice: number;
}

// Constants
const API_BASE_URL = "https://server-gs.vercel.app";
const DEFAULT_PAGE = 1;
const PRODUCTS_PER_PAGE = 2;

// Fetch sub-category details
const fetchSubCategoryDetails = async (id: string): Promise<Category | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/sub-category/${id}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching sub-category details:", error);
    return null;
  }
};

// Fetch paginated products
const fetchProducts = async (
  subCategoryId: string,
  page: number = DEFAULT_PAGE,
  productId?: string
): Promise<ProductsResponse> => {
  try {
    let url = `${API_BASE_URL}/web/sub-category-products/${subCategoryId}?page=${page}&limit=${PRODUCTS_PER_PAGE}`;
    if (productId) {
      url += `&productId=${productId}`;
    }
    
    const res = await fetch(url, { next: { revalidate: 3600 } });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      products: [],
      page: 1,
      totalPages: 1,
      totalProducts: 0,
      totalQuantity: 0,
      totalBuyingPrice: 0,
      totalSellingPrice: 0,
    };
  }
};

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="animate-pulse">
      <div className="h-8 w-1/3 bg-gray-200 rounded mb-6"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white p-4 border border-rose-200 rounded">
            <div className="h-96 bg-gray-200 rounded-md"></div>
            <div className="mt-4 space-y-2">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded mt-5"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Product Card Component
const ProductCard = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onOpenDetails,
}: {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (product: EventProduct) => void;
  onOpenDetails: (productId: string) => void;
}) => (
  <div className="group bg-white p-4 font-lora rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-rose-100 flex flex-col h-full">
    <div 
      onClick={() => onOpenDetails(product._id)} 
      className="relative overflow-hidden rounded-lg aspect-square mb-4 flex-grow cursor-pointer"
    >
      {product.singleImage ? (
        <>
          <Image
            src={product.singleImage}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="bg-white/90 text-rose-700 px-4 py-2 rounded-full font-medium text-sm shadow-md">
              Quick View
            </span>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-16 h-16 text-gray-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
        </div>
      )}
    </div>

    <div className="flex flex-col flex-grow">
      <h3 
        onClick={() => onOpenDetails(product._id)}
        className="text-lg font-semibold text-gray-800 hover:text-rose-600 transition-colors cursor-pointer line-clamp-2 mb-2"
      >
        {product.title}
      </h3>
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-2xl font-bold text-rose-700">
            ${product.perDayPricing}
            <span className="text-sm font-normal text-gray-500 ml-1">/day</span>
          </p>
          <p className="text-sm text-gray-500">ID: {product.productId}</p>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist({ ...product, quantity: 1 });
        }}
        className={`mt-auto w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
          isWishlisted
            ? "bg-rose-700 text-white shadow-inner"
            : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 hover:border-rose-300"
        }`}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={isWishlisted ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className={`w-5 h-5 ${isWishlisted ? "text-white" : "text-rose-600"}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
        <span>{isWishlisted ? "Saved" : "Save to Wishlist"}</span>
      </button>
    </div>
  </div>
);

// Pagination Component
const Pagination = ({
  totalPages,
  currentPage,
  subCategoryId,
}: {
  totalPages: number;
  currentPage: number;
  subCategoryId: string;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", newPage.toString());
      router.push(`/subcategory/${subCategoryId}?${params.toString()}`, {
        scroll: false,
      });
    },
    [searchParams, router, subCategoryId]
  );

  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2) return Array.from({ length: 5 }, (_, i) => totalPages - 4 + i);
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  const visiblePages = getVisiblePages();

  return (
    <nav aria-label="Page navigation" className="flex justify-center mt-8">
      <ul className="flex items-center -space-x-px h-10 text-base">
        <li>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Previous page"
          >
            <span className="sr-only">Previous</span>
            <svg
              className="w-3 h-3 rtl:rotate-180"
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
          </button>
        </li>

        {visiblePages.map((pageNum) => (
          <li key={pageNum}>
            <button
              onClick={() => handlePageChange(pageNum)}
              className={`flex items-center justify-center px-4 h-10 leading-tight ${
                pageNum === currentPage
                  ? "z-10 text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
                  : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
              }`}
              aria-label={`Page ${pageNum}`}
              aria-current={pageNum === currentPage ? "page" : undefined}
            >
              {pageNum}
            </button>
          </li>
        ))}

        {totalPages > 5 && currentPage < totalPages - 2 && (
          <li>
            <span className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300">
              ...
            </span>
          </li>
        )}

        {totalPages > 5 && currentPage < totalPages - 2 && (
          <li>
            <button
              onClick={() => handlePageChange(totalPages)}
              className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
              aria-label={`Page ${totalPages}`}
            >
              {totalPages}
            </button>
          </li>
        )}

        <li>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Next page"
          >
            <span className="sr-only">Next</span>
            <svg
              className="w-3 h-3 rtl:rotate-180"
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
          </button>
        </li>
      </ul>
    </nav>
  );
};

// Search Component
const SearchBar = ({ 
  onSearch,
  initialValue = ""
}: { 
  onSearch: (productId: string) => void;
  initialValue?: string;
}) => {
  const [searchInput, setSearchInput] = useState(initialValue);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const handleClear = () => {
    setSearchInput("");
    onSearch("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("productId");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 max-w-md mx-auto">
      <div className="relative">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by product ID..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        />
        {searchInput && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
        >
          Search
        </button>
      </div>
    </form>
  );
};

// SubCategory Page Component
const SubCategoryPage = ({ params }: { params: { id: string } }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [subCategory, setSubCategory] = useState<Category | null>(null);
  const [productsData, setProductsData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [wishlistedProducts, setWishlistedProducts] = useState<Set<string>>(new Set());

  const currentPage = parseInt(searchParams.get("page") || DEFAULT_PAGE.toString());
  const productIdParam = searchParams.get("productId") || "";

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [fetchedSubCategory, fetchedProducts] = await Promise.all([
        fetchSubCategoryDetails(params.id),
        fetchProducts(params.id, currentPage, productIdParam || undefined),
      ]);

      if (!fetchedSubCategory) {
        setSubCategory(null);
        setProductsData(null);
        return;
      }

      setSubCategory(fetchedSubCategory);
      setProductsData(fetchedProducts);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [params.id, currentPage, productIdParam]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const wishlistedIds = new Set<string>(cart.map((item: EventProduct) => item._id));
      setWishlistedProducts(wishlistedIds);
    } catch (error) {
      console.error("Error loading wishlist:", error);
    }
  }, []);

  const handleSearch = (productId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (productId) {
      params.set("productId", productId);
      params.set("page", "1"); // Reset to first page when searching
    } else {
      params.delete("productId");
    }
    router.replace(`/subcategory/${params.id}?${params.toString()}`, { scroll: false });
  };

  const toggleWishlist = useCallback((product: EventProduct) => {
    try {
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const productIndex = existingCart.findIndex((item: EventProduct) => item._id === product._id);

      let updatedCart: EventProduct[];
      if (productIndex > -1) {
        updatedCart = existingCart.filter((item: EventProduct) => item._id !== product._id);
        toast.success(`${product.title} removed from wishlist!`, {
          position: "bottom-center",
        });
      } else {
        updatedCart = [...existingCart, { ...product, quantity: 1 }];
        toast.success(`${product.title} added to wishlist!`, {
          position: "bottom-center",
        });
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setWishlistedProducts(prev => {
        const updated = new Set(prev);
        productIndex > -1 ? updated.delete(product._id) : updated.add(product._id);
        return updated;
      });
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Failed to update wishlist");
    }
  }, []);

  const openModalProductDetails = useCallback((productId: string) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  }, []);

  const closeModalProductDetails = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProductId(null);
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!subCategory) {
    return notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative isolate bg-white dark:bg-gray-900 min-h-[200px] sm:min-h-[200px] lg:min-h-[200px] flex items-center overflow-hidden">
        {subCategory.singleImage && (
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={subCategory.singleImage}
              alt={subCategory.title || "Sub-Category Background"}
              fill
              className="object-cover object-center pointer-events-none select-none"
              priority
              sizes="100vw"
            />
          </div>
        )}

        {/* Gradient + Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent backdrop-blur-sm"></div>

        {/* Content Wrapper */}
        <div className="relative z-10 w-full px-4 mx-auto max-w-screen-2xl">
          <div className="flex flex-col justify-center items-start h-full py-10 sm:py-14 lg:py-20">
            <h1 className="text-white font-playfairDisplay font-extrabold tracking-wide leading-tight text-3xl sm:text-xl lg:text-4xl drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
              {subCategory.title?.charAt(0).toUpperCase() +
                subCategory.title?.slice(1)}
            </h1>
            {subCategory.description && (
              <p className="text-white/90 mt-4 max-w-2xl text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                {subCategory.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mt-6 mb-8 font-raleway">
          Available Products
        </h2>
        
        {/* Search Bar */}
        {/* <SearchBar 
          onSearch={handleSearch} 
          initialValue={productIdParam}
        /> */}
        
        {productsData?.products.length ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productsData.products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isWishlisted={wishlistedProducts.has(product._id)}
                  onToggleWishlist={toggleWishlist}
                  onOpenDetails={openModalProductDetails}
                />
              ))}
            </div>

            <Pagination
              totalPages={productsData.totalPages}
              currentPage={currentPage}
              subCategoryId={params.id}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
              />
            </svg>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              {productIdParam ? "No matching products found" : "No products found"}
            </h3>
            <p className="text-gray-500">
              {productIdParam 
                ? "No products match the product ID you searched for."
                : "There are currently no products available in this sub-category."}
            </p>
            {productIdParam && (
              <button
                onClick={() => handleSearch("")}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Clear Search
              </button>
            )}
            <button
              onClick={() => router.push("/")}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ml-4"
            >
              Browse Other Categories
            </button>
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      <ModalProductDetails
        isVisible={isModalOpen}
        onClose={closeModalProductDetails}
        productId={selectedProductId || undefined}
      />
    </div>
  );
};

export default SubCategoryPage;