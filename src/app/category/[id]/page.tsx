"use client";

import ModalProductDetails from "@/components/AllModal/ModalProductDetails";
import { notFound } from "next/navigation";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import ProductCard from "@/components/Card/ProductCard";
import Pagination from "@/components/Pagination";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import Link from "next/link";

interface Category {
  _id: string;
  title: string;
  description: string;
  categoryObjectId: string;
  singleImage?: string;
  hasSubcategories?: boolean;
}

interface SubCategory {
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

const API_BASE_URL = "http://localhost:8000";
const DEFAULT_PAGE = 1;
const PRODUCTS_PER_PAGE = 12;

const fetchCategoryDetails = async (id: string): Promise<Category | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/main-category/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching category details:", error);
    return null;
  }
};

const fetchSubCategories = async (categoryId: string): Promise<SubCategory[]> => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/admin/web/sub-category/${categoryId}`
    );
    const data = await res.json();
    return data.subCategories || [];
  } catch (err) {
    console.error("Error fetching subcategories:", err);
    return [];
  }
};

const fetchProducts = async (
  categoryId: string,
  page: number = DEFAULT_PAGE
): Promise<ProductsResponse> => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/web/category-products/${categoryId}?page=${page}&limit=${PRODUCTS_PER_PAGE}`,
      { next: { revalidate: 3600 } }
    );

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

const CategoryPage = ({ params }: { params: { id: string } }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [category, setCategory] = useState<Category | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [productsData, setProductsData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [wishlistedProducts, setWishlistedProducts] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'subcategories' | 'products'>('subcategories');

  const currentPage = parseInt(searchParams.get("page") || DEFAULT_PAGE.toString());

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [fetchedCategory, fetchedSubCategories] = await Promise.all([
        fetchCategoryDetails(params.id),
        fetchSubCategories(params.id)
      ]);

      if (!fetchedCategory) {
        setCategory(null);
        setProductsData(null);
        return;
      }

      setCategory(fetchedCategory);
      setSubCategories(fetchedSubCategories);

      // Only fetch products if there are no subcategories
      if (fetchedSubCategories.length === 0) {
        const fetchedProducts = await fetchProducts(params.id, currentPage);
        setProductsData(fetchedProducts);
        setActiveTab('products');
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [params.id, currentPage]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadProducts = async (subCategoryId: string) => {
    try {
      setLoading(true);
      const fetchedProducts = await fetchProducts(subCategoryId, currentPage);
      setProductsData(fetchedProducts);
      setActiveTab('products');
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Load wishlisted products from localStorage on mount
  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const wishlistedIds = new Set<string>(
        cart.map((item: EventProduct) => item._id)
      );
      setWishlistedProducts(wishlistedIds);
    } catch (error) {
      console.error("Error loading wishlist:", error);
    }
  }, []);

  
  const calculateDiscountedPrice = (product: EventProduct): number => {
    if (product.Promotion === "true") {
      const perDayPricing = parseFloat(product.perDayPricing);
      const promotionValue = parseFloat(product.promotionValue);
      
      if (product.promotionType === "$") {
        return perDayPricing - promotionValue;
      } else if (product.promotionType === "%") {
        return perDayPricing - (perDayPricing * promotionValue) / 100;
      }
    }
    return parseFloat(product.perDayPricing);
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
        // Calculate the final price before adding to cart
        const finalPrice = calculateDiscountedPrice(product);
        
        updatedCart = [...existingCart, { 
          ...product, 
          quantity: 1,
          // Add the calculated price as a new field for easy reference
          perDayPricing : finalPrice
        }];
        
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

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      // Calculate prices for existing items in cart
      const cartWithCalculatedPrices = cart.map((item: EventProduct) => ({
        ...item,
      perDayPricing: calculateDiscountedPrice(item)
      }));
      
      localStorage.setItem("cart", JSON.stringify(cartWithCalculatedPrices));
      const wishlistedIds = new Set<string>(cart.map((item: EventProduct) => item._id));
      setWishlistedProducts(wishlistedIds);
    } catch (error) {
      console.error("Error loading wishlist:", error);
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

  if (!category) {
    return notFound();
  }

  return (
    <div className="min-h-screen font-montserrat">
      {/* Hero Section */}
      <section className="relative isolate bg-white dark:bg-gray-900 min-h-[200px] sm:min-h-[200px] lg:min-h-[200px] flex items-center overflow-hidden">
        {category.singleImage && (
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={category.singleImage}
              alt={category.title || "Category Background"}
              fill
              className="object-cover object-center pointer-events-none select-none"
              priority
              sizes="100vw"
            />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent backdrop-blur-sm"></div>

        <div className="relative z-10 w-full px-4 mx-auto max-w-screen-4xl">
          <div className="flex flex-col justify-center items-start h-full py-10 sm:py-14 lg:py-20">
            <h1 className="text-white font-playfairDisplay font-extrabold tracking-wide leading-tight text-3xl sm:text-xl lg:text-4xl drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
              {category.title?.charAt(0).toUpperCase() +
                category.title?.slice(1)}
            </h1>
            {category.description && (
              <p className="text-white/90 mt-4 max-w-2xl text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
      

        {/* Subcategories or Products */}
        {activeTab === 'subcategories' && subCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {subCategories.map((subCategory) => (
            <Link
            href={`/subcategory/${subCategory._id}`}
            key={subCategory._id}
            className={`group font-raleway block focus-visible:outline-none transition-all duration-500 hover:scale-[1.02]`}
          >
            <div className="relative h-full w-full overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 aspect-[4/3]">
              {/* Glowing border effect */}
              <div className="absolute inset-0  z-20 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/50 transition-all duration-500  group-hover:scale-[0.92]"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Image with optimized loading */}
              <img
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                src={subCategory.singleImage || "/default-subCategory.jpg"}
                alt={subCategory.title}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/default-category.jpg";
                }}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40 transition-all duration-500 group-hover:from-black/70 group-hover:via-black/50 group-hover:to-black/30"></div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-center items-center p-4 text-center z-10">
                <div className="transform transition-all duration-700 group-hover:-translate-y-4">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 [text-shadow:0_2px_10px_rgba(0,0,0,0.8)] transition-all duration-500 group-hover:text-shadow-lg group-hover:mb-3">
                    {subCategory.title}
                  </h2>
                  <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-white/20 backdrop-blur-md rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300">
                      Explore
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

              {/* Shine effect on hover */}
              <div className="absolute inset-0 overflow-hidden z-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-shine transition-opacity duration-500"></div>
              </div>
            </div>
          </Link>
          ))}
        </div>
        ) : (
          <>
            <h2 className="text-xl font-bold mt-6 mb-8 font-raleway">
              Available Products
            </h2>

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
                  categoryId={params.id}
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
                  No products found
                </h3>
                <p className="text-gray-500">
                  There are currently no products available in this category.
                </p>
                <button
                  onClick={() => router.push("/")}
                  className="mt-4 px-6 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors"
                >
                  Browse Other Categories
                </button>
              </div>
            )}
          </>
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

export default CategoryPage;