"use client";
import { Product } from "./types";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.title}</h3>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div>
            <span className="font-medium">ID:</span> {product.productId}
          </div>
          <div>
            <span className="font-medium">Category:</span> {product.category}
          </div>
          <div>
            <span className="font-medium">Type:</span> {product.type}
          </div>
          <div>
            <span className="font-medium">Code:</span> {product.productCode}
          </div>
          <div>
            <span className="font-medium">Promotion:</span> {product.Promotion || "None"}
          </div>
          <div>
            <span className="font-medium">Price:</span> {product.perDayPricing || "None"}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-xs text-gray-500">Total</div>
            <div className="font-semibold">{product.quantity}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Available</div>
            <div className="font-semibold text-green-600">{product.availableQuantity}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Booked</div>
            <div className="font-semibold text-blue-600">{product.bookedQuantity}</div>
          </div>
        </div>
      </div>
    </div>
  );
};