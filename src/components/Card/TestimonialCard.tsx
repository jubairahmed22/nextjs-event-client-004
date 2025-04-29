import React from "react";
import Image from "next/image";

interface Testimonial {
  _id: string;
  title: string;
  description: string;
  rating: number;
  singleImage: string;
}

interface TestimonialCardProps {
  product: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ product }) => {
  if (!product) {
    return <div className="p-4 text-red-500">No testimonial data provided</div>;
  }

  const renderStars = () => {
    const stars = [];
    const rating = product?.rating || 0; // Fallback to 0 if rating is missing
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-5 h-5 ${
            i <= rating ? "text-yellow-400" : "text-rose-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return stars;
  };

  return (
    <section className="py-16 font-montserrat">
      <div className="swiper-slide group bg-white border border-solid h-auto border-rose-300 rounded-2xl p-6 transition-all duration-500 w-full hover:border-indigo-600 slide-active:border-indigo-600">
      <div className="flex items-center mb-9 gap-2 text-amber-500 transition-all duration-500 group-hover:text-indigo-600 swiper-slide-active:text-indigo-600">
  {[1, 2, 3, 4, 5].map((star) => (
    <svg
      key={star}
      className="w-5 h-5"
      viewBox="0 0 18 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.10326 1.31699C8.47008 0.57374 9.52992 0.57374 9.89674 1.31699L11.7063 4.98347C11.8519 5.27862 12.1335 5.48319 12.4592 5.53051L16.5054 6.11846C17.3256 6.23765 17.6531 7.24562 17.0596 7.82416L14.1318 10.6781C13.8961 10.9079 13.7885 11.2389 13.8442 11.5632L14.5353 15.5931C14.6754 16.41 13.818 17.033 13.0844 16.6473L9.46534 14.7446C9.17402 14.5915 8.82598 14.5915 8.53466 14.7446L4.91562 16.6473C4.18199 17.033 3.32456 16.41 3.46467 15.5931L4.15585 11.5632C4.21148 11.2389 4.10393 10.9079 3.86825 10.6781L0.940384 7.82416C0.346867 7.24562 0.674378 6.23765 1.4946 6.11846L5.54081 5.53051C5.86652 5.48319 6.14808 5.27862 6.29374 4.98347L8.10326 1.31699Z"
        fill={star <= product.rating ? "currentColor" : "none"}
        stroke="currentColor"
      />
    </svg>
  ))}
</div>
        <p className="text-lg text-rose-800 leading-8 h-24 transition-all duration-500 mb-9 group-hover:text-rose-800">
          {product.description}
        </p>
        <div className="flex items-center gap-5">
        {product.singleImage ? (
  <img
    className="rounded-full object-cover w-12 h-12"
    src={product.singleImage}
    alt="avatar"
  />
) : (
  <div className="rounded-full bg-gray-200 w-12 h-12 flex items-center justify-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 text-gray-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  </div>
)}
          <div className="grid gap-1">
            <h5 className="text-rose-900 font-medium transition-all duration-500  group-hover:text-indigo-600 swiper-slide-active:text-indigo-600">
              {product.title}
            </h5>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialCard;
