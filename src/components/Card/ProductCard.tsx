import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

// Define types for the product data
interface Product {
  _id: string;
  title: string;
  singleImage?: string;
  perDayPricing: number;
  isFeatured?: boolean;
  Promotion?: string;
  promotionValue: number;
  promotionType: string;
  // Add other product properties as needed
}

interface EventProduct extends Product {
  quantity: number;
}

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (product: EventProduct) => void;
  // onOpenDetails: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  // onOpenDetails,
}) => {
  const handleToggleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onToggleWishlist({ ...product, quantity: 1 });
  };

  function getDiscountedPrice(product: any) {
    const perDayPricing = Number(product.perDayPricing);
    const promotionValue = Number(product.promotionValue);
    const promotionType = product.promotionType;

    if (promotionType === "$") {
      return perDayPricing - promotionValue;
    } else if (promotionType === "%") {
      return perDayPricing - (perDayPricing * promotionValue) / 100;
    } else {
      return perDayPricing; // No promotion or unknown type
    }
  }

  const router = useRouter();
  const handleCardClick = () => {
    router.push(`/all-products/${product._id}`);
  };

  return (
    <Link href={`/all-products/${product._id}`} passHref>
      <div className="group relative bg-white p-4 font-lora rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-rose-100 flex flex-col h-full">
  {/* Ribbon/Badge for Featured */}
  {product.isFeatured && (
    <div className="absolute top-2 left-2 bg-rose-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm z-10">
      Featured
    </div>
  )}

  {/* Promotional Ribbon - More prominent and animated */}
  {product?.Promotion === "true" && (
    <div className="absolute top-2 right-2 z-10 animate-bounce hover:animate-none">
      <div className="relative bg-gradient-to-r from-rose-600 to-pink-500 text-white text-md font-bold px-3 py-3 rounded-md shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
        <span className="block transform -rotate-3 hover:rotate-0 transition-transform duration-300">
        Discount {product.promotionType === "%" 
            ? `-${product.promotionValue}%` 
            : `-$${product.promotionValue}`}
        </span>
        
      </div>
    </div>
  )}

  {/* Image Container with Hover Effects */}
  <div
    
    className="relative overflow-hidden rounded-lg aspect-square mb-4 flex-grow cursor-pointer"
    role="button"
    tabIndex={0}
    aria-label={`View details for ${product.title}`}
  >
    {product.singleImage ? (
      <>
        <Image
          src={product.singleImage}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-white/90 text-rose-700 px-4 py-2 rounded-full font-medium text-sm shadow-md hover:shadow-lg transition-shadow">
            View Details
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
          aria-hidden="true"
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

  {/* Product Info */}
  <div className="flex flex-col flex-grow">
    <h3
      
      className="text-lg font-semibold text-gray-800 hover:text-rose-600 transition-colors cursor-pointer line-clamp-2 mb-2"
      role="button"
      tabIndex={0}
      aria-label={`View details for ${product.title}`}
    >
      {product.title}
    </h3>

    {/* Price Section - More Visual Impact */}
    <div className="mb-4">
      {product?.Promotion === "true" ? (
        <div className="space-y-1">
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-rose-700">
              ${getDiscountedPrice(product)}
            </span>
            <span className="text-sm font-medium text-gray-500 mb-1">/day</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-medium text-gray-700 line-through">
              ${product.perDayPricing}
            </span>
            <span className="text-xs font-medium bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded">
              Save ${(product.perDayPricing - getDiscountedPrice(product)).toFixed(2)}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-end gap-2">
          <span className="text-2xl font-bold text-rose-700">
            ${product.perDayPricing}
          </span>
          <span className="text-sm font-medium text-gray-500 mb-1">/day</span>
        </div>
      )}
    </div>

    {/* Wishlist Button with Enhanced Animation */}
    <button
      onClick={handleToggleWishlist}
      className={`mt-auto w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
        isWishlisted
          ? "bg-rose-700 text-white shadow-md hover:shadow-lg"
          : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 hover:border-rose-300"
      } transform hover:scale-[1.02] active:scale-95`}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={isWishlisted ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        className={`w-5 h-5 transition-all duration-300 ${
          isWishlisted ? "text-white" : "text-rose-600 group-hover:scale-110"
        }`}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
      <span className="transition-all duration-300">
        {isWishlisted ? (
          <span className="flex items-center">
            <span className="mr-1">Saved</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        ) : (
          "Save to Wishlist"
        )}
      </span>
    </button>
  </div>
    </div>
    </Link>
  );
};

export default ProductCard;
