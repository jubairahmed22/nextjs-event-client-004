"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";

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
  const [wishlisted, setWishlisted] = useState(false);

  const allImages =
    product && product.singleImage
      ? [product.singleImage, ...(product.images || [])]
      : [];

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const handleAddToCart = () => {
    if (product) {
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

      const cartItem = {
        ...product,
        quantity,
        selectedDate: combinedDate,
      };

      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
      cart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(cart));

      toast.success("Product added to cart!", { position: "bottom-center" });
    }
  };

  const toggleWishlist = () => {
    if (!product) return;

    try {
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const productIndex = existingCart.findIndex(
        (item: ProductDetails) => item._id === product._id
      );

      let updatedCart: ProductDetails[];
      if (productIndex > -1) {
        updatedCart = existingCart.filter(
          (item: ProductDetails) => item._id !== product._id
        );
        toast.success(`${product.title} removed from wishlist!`, {
          position: "bottom-center",
        });
      } else {
        updatedCart = [
          ...existingCart,
          {
            ...product,
            quantity: 1,
          },
        ];
        toast.success(`${product.title} added to wishlist!`, {
          position: "bottom-center",
        });
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setWishlisted(!wishlisted);
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Failed to update wishlist");
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

        // Check if product is in wishlist
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        setWishlisted(
          cart.some((item: ProductDetails) => item._id === data._id)
        );
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

  const calculateDiscountedPrice = () => {
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

  const discountedPrice = calculateDiscountedPrice();
  const showOriginalPrice = product.Promotion === "true";

  return (
    <div className="min-h-screen max-w-screen-4xl mx-auto  py-12 px-4 sm:px-6  font-montserrat">
      <div className="w-full mx-auto">
        <div className="overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-12 p-8">
            {/* Image Gallery */}
            <div className="w-full lg:w-[60%]">
              <div className="relative h-[600px] rounded-2xl overflow-hidden mb-6 shadow-md">
                <Image
                  src={allImages[activeTab]}
                  alt={`${product.title} - Image ${activeTab + 1}`}
                  fill
                  className="object-contain transition-transform duration-500 hover:scale-105"
                  priority
                />
              </div>
              <div className="grid grid-cols-6 gap-4">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleTabClick(index)}
                    className={`relative h-24 rounded-lg overflow-hidden group ${
                      index === activeTab
                        ? "ring-2 ring-rose-600 scale-105"
                        : "hover:ring-2 hover:ring-rose-300"
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
              {/* Title and Wishlist */}
              <div className="flex justify-between items-start">
                <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                  {product.title}
                </h1>
                <button
                  onClick={toggleWishlist}
                  className="p-2 rounded-full hover:bg-rose-100 transition-all"
                  aria-label={
                    wishlisted ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-8 w-8 ${
                      wishlisted
                        ? "text-rose-600 fill-rose-600"
                        : "text-gray-300"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>

              {/* Pricing */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  {showOriginalPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      ${product.perDayPricing}
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

              {/* Add to Cart */}
              <div>
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 bg-rose-700 hover:bg-rose-800 text-white text-lg font-semibold rounded-xl transition-all duration-300"
                >
                  Add to Quote Request
                </button>
              </div>

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
