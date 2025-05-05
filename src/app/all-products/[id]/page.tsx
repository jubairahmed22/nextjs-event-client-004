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
      const existingIndex = cart.findIndex(item => item._id === product._id);

      if (existingIndex > -1) {
        // Remove from cart
        cart = cart.filter(item => item._id !== product._id);
        localStorage.setItem("cart", JSON.stringify(cart));
        setIsInCart(false);
        toast.success("Removed from Quote Request", { position: "bottom-center" });
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
        const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
        setIsInCart(cart.some(item => item._id === data._id));
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

  const productCategory = product.category
  const productSubCategory = product.subCategory

  return (
    <div className="min-h-screen max-w-screen-3xl mx-auto py-12 px-4 sm:px-6 font-montserrat">
      <FilterParentsDetails productCategory={productCategory} productSubCategory={productSubCategory}></FilterParentsDetails>
      <div className="w-full max-w-screen-xl mx-auto">
        <div className="overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-12 p-8">
            {/* Image Gallery */}
            <div className="w-full lg:w-[60%]">
              <div className="relative h-[600px]  overflow-hidden mb-6 shadow-md">
                <Image
                  src={allImages[activeTab]}
                  alt={`${product.title} - Image ${activeTab + 1}`}
                  fill
                  className="object-contain transition-transform duration-500 hover:scale-105"
                  priority
                />
              </div>
              <div className="grid grid-cols-6 gap-4 rounded">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleTabClick(index)}
                    className={`relative h-24  overflow-hidden rounded group ${
                      index === activeTab
                        ? "ring-4 ring-rose-900 scale-105"
                        : "hover:ring-4 hover:ring-rose-300"
                    } transition-all duration-300`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="w-full lg:w-[40%] space-y-8">
              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                {product.title}
              </h1>
             
            

              {/* Pricing */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  {showOriginalPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      ${(Number(product.perDayPricing) || 0).toFixed(2)}
                    </span>
                  )}
                  <span className="text-3xl font-bold text-rose-700">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  <span className="text-gray-600">/ day</span>
                </div>
                {product.Promotion === "true" && (
                  <div className="inline-block bg-rose-100 text-rose-800 text-sm font-semibold px-3 py-1 rounded-full">
                    {product.promotionType === "$"
                      ? `$${product.promotionValue} OFF`
                      : `${product.promotionValue}% OFF`}
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="space-y-2">
                <label className="block text-gray-700 font-medium">
                  Quantity:
                </label>
                <div className="flex items-center max-w-[200px]">
                  <button
                    onClick={decrementQuantity}
                    className="bg-gray-100 hover:bg-rose-100 border border-gray-300 rounded-l-lg p-3 h-10"
                  >
                    <svg
                      className="w-4 h-4 text-gray-900"
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
                  <span className="bg-gray-50 border-x border-gray-300 h-10 flex items-center justify-center w-16 font-semibold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="bg-gray-100 hover:bg-rose-100 border border-gray-300 rounded-r-lg p-3 h-10"
                  >
                    <svg
                      className="w-4 h-4 text-gray-900"
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
                <p className="text-2xl font-bold text-gray-900">
                  Total: ${(quantity * discountedPrice).toFixed(2)}
                </p>
              </div>

              {/* Add/Remove from Cart Button */}
              <button
  onClick={toggleCart}
  disabled={isProcessing}
  className={`w-full py-4 text-lg font-semibold rounded transition-all duration-300 flex items-center justify-center gap-2
    ${
      isInCart
        ? "bg-black hover:bg-rose-900 text-white"
        : isProcessing
          ? "bg-rose-600 hover:bg-rose-700 text-white cursor-not-allowed"
          : "bg-rose-700 hover:bg-rose-800 text-white"
    }`}
>
  {isProcessing ? (
    <>
      <svg
        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
        className="h-5 w-5 ml-2"
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
        className="h-5 w-5 ml-2"
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
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.productDescription || "No description available."}
                </p>
              </div>

              {/* Specifications */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Specifications
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: "Height", value: product.height },
                    { label: "Length", value: product.length },
                    { label: "Width", value: product.width },
                    { label: "Shape", value: product.shape },
                  ].map((spec, idx) => (
                    <div key={idx}>
                      <p className="text-gray-500">{spec.label}:</p>
                      <p className="text-gray-900 font-semibold">
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