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
  <div className="group relative bg-white rounded-2xl p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 border border-rose-100 hover:border-transparent overflow-hidden">
    {/* Glow Effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-rose-50/30 to-rose-100/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
    
    {/* Event Source Badge */}
    <div className="relative z-10">
      <span className="inline-block px-3 py-1 mb-4 text-sm font-semibold text-rose-700 bg-rose-100/50 rounded-full backdrop-blur-sm border border-rose-200/50">
        {product.source}
      </span>
    </div>

    {/* Rating Stars */}
    <div className="flex items-center mb-6 gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-6 h-6 transition-all duration-300 ${star <= product.rating ? 'text-amber-400 drop-shadow-[0_2px_4px_rgba(251,191,36,0.3)]' : 'text-gray-300'}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      ))}
      <span className="ml-2 text-sm font-medium text-gray-500 group-hover:text-rose-600">
        {product.rating}.0 Rating
      </span>
    </div>

    {/* Event Description */}
    <div className="relative mb-8">
      <p className="text-gray-600 leading-relaxed h-28 overflow-hidden transition-all duration-500 group-hover:text-gray-800">
        {product.description.length > 120
          ? `${product.description.slice(0, 120)}...`
          : product.description}
      </p>
      {/* Read More Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent group-hover:from-rose-50/50"></div>
    </div>

    {/* Speaker/Organizer Profile */}
    <div className="flex items-center gap-4 pt-4 border-t border-rose-100/50 group-hover:border-rose-200 transition-colors duration-500">
      <div className="relative">
        {product.singleImage ? (
          <img
            className="rounded-full object-cover w-14 h-14 border-2 border-white shadow-md group-hover:border-rose-200 transition-all duration-300"
            src={product.singleImage}
            alt={product.title}
          />
        ) : (
          <div className="rounded-full bg-gradient-to-br from-rose-100 to-rose-200 w-14 h-14 flex items-center justify-center shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-rose-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        )}
        {/* Online Status Indicator */}
        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></span>
      </div>

      <div className="flex-1 min-w-0">
        <h5 className="text-lg font-semibold text-gray-800 truncate transition-colors duration-500 group-hover:text-rose-600">
          {product.title}
        </h5>
        <p className="text-sm text-gray-500 truncate">Event Organizer</p>
      </div>


    </div>

    {/* Corner Decoration */}
    <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
      <div className="absolute -top-8 -right-8 w-16 h-16 bg-rose-500/10 group-hover:bg-rose-500/20 transition-all duration-500 rotate-45"></div>
    </div>
  </div>
</section>
  );
};

export default TestimonialCard;
