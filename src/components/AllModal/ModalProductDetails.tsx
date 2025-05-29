import React, { useEffect, useState } from "react";
import "./ModalProduct.css";

interface ProductDetails {
  title: string;
  perDayPricing: number;
  singleImage?: string;
  images?: string[];
  productDescription?: string;
  height?: string;
  length?: string;
  width?: string;
  shape?: string;
}

interface ModalProductDetailsProps {
  isVisible: boolean;
  onClose: () => void;
  productId?: string;
}

const ModalProductDetails: React.FC<ModalProductDetailsProps> = ({
  isVisible,
  onClose,
  productId,
}) => {
  const [show, setShow] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("12");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [selectedPeriod, setSelectedPeriod] = useState("AM");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  const toggleCollapseDetails = () => {
    setIsOpenDetails(!isOpenDetails);
  };

  const allImages = productDetails && productDetails.singleImage
    ? [productDetails.singleImage, ...(productDetails.images || [])]
    : [];

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const handleAddToCart = () => {
    if (productDetails) {
      const [year, month, day] = selectedDate.split("-");
      let hour = parseInt(selectedHour, 10);
      const minute = parseInt(selectedMinute, 10);

      if (selectedPeriod === "PM" && hour < 12) hour += 12;
      if (selectedPeriod === "AM" && hour === 12) hour = 0;

      const combinedDate = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), hour, minute));

      const cartItem = {
        ...productDetails,
        quantity,
        selectedDate: combinedDate,
      };

      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
      cart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(cart));

      alert("Product added to cart with quantity: " + quantity);
    }
  };

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => setQuantity(Math.max(1, quantity - 1));

  useEffect(() => {
    if (isVisible) {
      setIsMounted(true);
      setTimeout(() => setShow(true), 10);

      if (productId) {
        fetch(`http://localhost:8000/web/event-products-details/${productId}`)
          .then((res) => res.json())
          .then((data: ProductDetails) => setProductDetails(data))
          .catch((error) => console.error("Failed to load product details:", error));
      }
    } else {
      setShow(false);
      setTimeout(() => setIsMounted(false), 300);
    }
  }, [isVisible, productId]);

  if (!isMounted) return null;

  return (
    <div
  className={`fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ${
    show ? "opacity-100" : "opacity-0 pointer-events-none"
  }`}
>
  <div className="bg-white rounded-lg shadow-2xl w-[90%] md:w-[70%] lg:w-[60%] h-[85%] max-h-[800px] mx-5 sm:mx-auto overflow-hidden">
    {/* Header */}
    <div className="flex justify-between items-center py-4 px-6 border-b border-gray-200 bg-gray-50">
      <h1 className="text-2xl font-raleway font-semibold text-rose-900">Product Details</h1>
      <button
        onClick={onClose}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-rose-900"
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

    {/* Content */}
    <div className="p-6 h-[calc(100%-64px)] overflow-y-auto">
      {productDetails ? (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image Gallery */}
          <div className="w-full lg:w-[40%]">
            <div className="relative">
              <img
                src={allImages[activeTab]}
                alt={`Product Image ${activeTab + 1}`}
                className="w-full h-[300px] md:h-[400px] object-cover rounded-lg shadow-md"
              />
              <div className="grid grid-cols-3 gap-3 mt-4">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleTabClick(index)}
                    className={`relative rounded-lg overflow-hidden transition-transform duration-200 hover:scale-105 ${
                      index === activeTab ? "ring-2 ring-rose-500" : ""
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="w-full lg:w-[60%]">
            <h1 className="text-3xl font-raleway font-bold text-gray-900 mb-4">
              {productDetails.title}
            </h1>

            {/* Pricing */}
            <div className="mb-6">
              <h2 className="text-2xl font-roboto font-semibold text-rose-900">
                One Day Pricing: ${productDetails.perDayPricing}
              </h2>
            </div>

           <div className="flex flex-row items-center gap-5">
             {/* Quantity Selector */}
             <form className="mb-6">
              <label
                htmlFor="quantity-input"
                className="block font-roboto text-lg text-gray-700 mb-2"
              >
                Choose Quantity:
              </label>
              <div className="flex items-center max-w-[200px]">
                <button
                  onClick={decrementQuantity}
                  type="button"
                  className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-l-lg p-3 h-10 transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4 text-gray-900"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 2"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M1 1h16"
                    />
                  </svg>
                </button>
                <span className="bg-gray-50 border-x border-gray-300 h-10 flex items-center justify-center text-gray-900 text-xl font-roboto w-16">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  type="button"
                  className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-r-lg p-3 h-10 transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4 text-gray-900"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 18"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 1v16M1 9h16"
                    />
                  </svg>
                </button>
              </div>
            </form>

            {/* Total Price */}
            <div className="mt-6">
              <h2 className="text-2xl font-roboto font-semibold text-rose-900">
                Total Price: ${quantity * productDetails.perDayPricing}
              </h2>
            </div>
           </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full py-3 bg-rose-700 hover:bg-rose-800 text-white font-roboto text-xl rounded-lg transition-colors duration-200"
            >
              Add to Quote Request
            </button>

            {/* Product Description */}
            <div className="mt-4">
              <h3 className="text-md font-raleway font-semibold text-gray-900 mb-2">
                Description
              </h3>
              <p className="text-gray-700 font-raleway text-sm">
                {productDetails.productDescription}
              </p>
            </div>

            {/* Product Dimensions */}
            <div className="mt-4">
              <h3 className="text-md font-raleway font-semibold text-gray-900 mb-2">
                Dimensions
              </h3>
              <div className="space-y-1">
                <p className="text-gray-700 font-raleway text-sm">
                  Height: {productDetails.height}
                </p>
                <p className="text-gray-700 font-raleway text-sm">
                  Length: {productDetails.length}
                </p>
                <p className="text-gray-700 font-raleway text-sm">
                  Width: {productDetails.width}
                </p>
                <p className="text-gray-700 font-raleway text-sm">
                  Shape: {productDetails.shape}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-700">Loading...</p>
      )}
    </div>
  </div>
</div>
  );
};

export default ModalProductDetails;