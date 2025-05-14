"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { FilterParentsDetails } from "@/components/AllProductCopmonent/FilterParentsDetails";

interface ProductDetails {
  _id: string;
  title: string;
  perDayPricing: number;
  singleImage?: string;
  images?: string[];
  productDescription?: string;
  height?: string;
  length?: string;
  width?: string;
  shape?: string;
  isFeatured?: boolean;
  Promotion?: string;
  promotionValue: number;
  promotionType: string;
}

interface CartItem extends ProductDetails {
  quantity: number;
  selectedDate: Date;
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("12");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [selectedPeriod, setSelectedPeriod] = useState("AM");
  const [activeTab, setActiveTab] = useState(0);
  const [isInCart, setIsInCart] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const allImages =
    product && product.singleImage
      ? [product.singleImage, ...(product.images || [])]
      : [];

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const toggleCart = async () => {
    if (!product || isProcessing) return;

    setIsProcessing(true);

    try {
      let cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingIndex = cart.findIndex((item) => item._id === product._id);

      if (existingIndex > -1) {
        // Remove from cart
        cart = cart.filter((item) => item._id !== product._id);
        localStorage.setItem("cart", JSON.stringify(cart));
        setIsInCart(false);
        toast.success("Removed from Quote Request", {
          position: "bottom-center",
        });
      } else {
        // Add to cart
        const [year, month, day] = selectedDate.split("-");
        let hour = parseInt(selectedHour, 10);
        const minute = parseInt(selectedMinute, 10);

        if (selectedPeriod === "PM" && hour < 12) hour += 12;
        if (selectedPeriod === "AM" && hour === 12) hour = 0;

        const combinedDate = new Date(
          Date.UTC(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            hour,
            minute
          )
        );

        const cartItem: CartItem = {
          ...product,
          quantity,
          selectedDate: combinedDate,
        };

        cart.push(cartItem);
        localStorage.setItem("cart", JSON.stringify(cart));
        setIsInCart(true);
        toast.success("Added to Quote Request!", { position: "bottom-center" });
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update Quote Request");
    } finally {
      setIsProcessing(false);
    }
  };

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => setQuantity(Math.max(1, quantity - 1));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://server-gs.vercel.app/web/event-products-details/${id}`
        );
        const data: ProductDetails = await response.json();
        setProduct(data);

        // Check if product is in cart
        const cart: CartItem[] = JSON.parse(
          localStorage.getItem("cart") || "[]"
        );
        setIsInCart(cart.some((item) => item._id === data._id));
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const calculateDiscountedPrice = () => {
    if (!product) return 0;

    if (product.Promotion === "true") {
      const perDayPricing = parseFloat(product.perDayPricing.toString());
      const promotionValue = parseFloat(product.promotionValue.toString());

      if (product.promotionType === "$") {
        return perDayPricing - promotionValue;
      } else if (product.promotionType === "%") {
        return perDayPricing - (perDayPricing * promotionValue) / 100;
      }
    }
    return parseFloat(product.perDayPricing.toString());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-700"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-700">Product not found</p>
      </div>
    );
  }

  const discountedPrice = calculateDiscountedPrice();
  const showOriginalPrice = product.Promotion === "true";

  const productCategory = product.category;
  const productSubCategory = product.subCategory;

  const copyToClipboard = () => {
    // Get the current URL
    const url = window.location.href;

    // Copy to clipboard
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
  };

  return (
    <div className="min-h-screen max-w-screen-3xl mx-auto py-6 md:py-12 px-6 lg:px-10 font-montserrat">
  <FilterParentsDetails
    productCategory={productCategory}
    productSubCategory={productSubCategory}
  />
  
  <div className="w-full max-w-screen-xl mx-auto mt-5">
    <div className="overflow-hidden">
      {/* Mobile-first layout with column direction, switching to row on larger screens */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-12  md:p-8">
        {/* Image Gallery - Full width on mobile, 60% on desktop */}
        <div className="w-full lg:w-[60%] order-1 lg:order-1">
          {/* Main image with responsive height */}
          <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden mb-4 md:mb-6 shadow-md rounded-lg">
            <Image
              src={allImages[activeTab]}
              alt={`${product.title} - Image ${activeTab + 1}`}
              fill
              className="object-contain transition-transform duration-500 hover:scale-105"
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>
          
          {/* Thumbnail grid - responsive columns */}
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
            {allImages.map((image, index) => (
              <button
                key={index}
                onClick={() => handleTabClick(index)}
                className={`relative h-16 sm:h-20 md:h-24 overflow-hidden rounded group transition-all duration-300 ${
                  index === activeTab
                    ? "ring-2 md:ring-4 ring-rose-900 scale-105"
                    : "hover:ring-2 md:hover:ring-4 hover:ring-rose-300"
                }`}
                aria-label={`View image ${index + 1} of ${product.title}`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 640px) 25vw, (max-width: 768px) 20vw, 16.66vw"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details - Full width on mobile, 40% on desktop */}
        <div className="w-full lg:w-[40%] space-y-4 md:space-y-6 lg:space-y-8 order-2 lg:order-2">
          {/* Title with responsive sizing */}
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
            {product.title}
          </h1>

          {/* Pricing section */}
          <div className="space-y-1 md:space-y-2">
            <div className="flex items-center flex-wrap gap-x-2">
              {showOriginalPrice && (
                <span className="text-base md:text-lg text-gray-400 line-through">
                  ${(Number(product.perDayPricing) || 0).toFixed(2)}
                </span>
              )}
              <span className="text-2xl md:text-3xl font-bold text-rose-700">
                ${discountedPrice.toFixed(2)}
              </span>
              <span className="text-gray-600 text-base md:text-lg">/ day</span>
            </div>
            {product.Promotion === "true" && (
              <div className="inline-block bg-rose-100 text-rose-800 text-xs sm:text-sm font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                {product.promotionType === "$"
                  ? `$${product.promotionValue} OFF`
                  : `${product.promotionValue}% OFF`}
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="space-y-1 md:space-y-2">
            <label className="block text-gray-700 font-medium text-sm md:text-base">
              Quantity:
            </label>
            <div className="flex items-center max-w-[180px] md:max-w-[200px]">
              <button
                onClick={decrementQuantity}
                className="bg-gray-100 hover:bg-rose-100 border border-gray-300 rounded-l-lg p-2 sm:p-3 h-9 sm:h-10 flex items-center justify-center"
                aria-label="Decrease quantity"
              >
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 text-gray-900"
                  fill="none"
                  viewBox="0 0 18 2"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth={2}
                    d="M1 1h16"
                  />
                </svg>
              </button>
              <span className="bg-gray-50 border-x border-gray-300 h-9 sm:h-10 flex items-center justify-center w-12 sm:w-16 font-semibold text-gray-900 text-sm sm:text-base">
                {quantity}
              </span>
              <button
                onClick={incrementQuantity}
                className="bg-gray-100 hover:bg-rose-100 border border-gray-300 rounded-r-lg p-2 sm:p-3 h-9 sm:h-10 flex items-center justify-center"
                aria-label="Increase quantity"
              >
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 text-gray-900"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth={2}
                    d="M9 1v16M1 9h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Total Price */}
          <div>
            <p className="text-xl md:text-2xl font-bold text-gray-900">
              Total: ${(quantity * discountedPrice).toFixed(2)}
            </p>
          </div>

          {/* Add/Remove from Cart Button - responsive sizing */}
          <button
            onClick={toggleCart}
            disabled={isProcessing}
            className={`w-full py-3 sm:py-4 text-base sm:text-lg font-semibold rounded transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2
              ${
                isInCart
                  ? "bg-black hover:bg-rose-900 text-white"
                  : isProcessing
                  ? "bg-rose-600 hover:bg-rose-700 text-white cursor-not-allowed"
                  : "bg-rose-700 hover:bg-rose-800 text-white"
              }`}
            aria-live="polite"
          >
            {isProcessing ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white mr-1 sm:mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {isInCart ? "Removing..." : "Adding..."}
              </>
            ) : isInCart ? (
              <>
                In Quote Request
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </>
            ) : (
              <>
                Add to Quote Request
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </>
            )}
          </button>

          {/* Description */}
          <div className="pt-2 md:pt-4">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              {product.productDescription || "No description available."}
            </p>
          </div>

          {/* Specifications */}
          <div className="pt-2 md:pt-4">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">
              Specifications
            </h3>
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {[
                { label: "Height", value: product.height },
                { label: "Length", value: product.length },
                { label: "Width", value: product.width },
                { label: "Shape", value: product.shape },
              ].map((spec, idx) => (
                <div key={idx}>
                  <p className="text-gray-500 text-sm md:text-base">{spec.label}:</p>
                  <p className="text-gray-900 font-semibold text-sm md:text-base">
                    {spec.value || "-"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}
