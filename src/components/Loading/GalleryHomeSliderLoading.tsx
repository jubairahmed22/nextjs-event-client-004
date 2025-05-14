const GalleryHomeSliderLoading = () => {
  return (
    <div className="relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] xl:h-[550px]">
      {/* Navigation arrows skeleton */}
      <div className="absolute left-0 z-30 p-1 sm:p-2 bg-gray-200 rounded-full ml-1 sm:ml-2 md:ml-4 top-1/2 -translate-y-1/2">
        <div className="h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8 text-transparent">
          <svg
            className="h-full w-full"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </div>
      </div>

      <div className="absolute right-0 z-30 p-1 sm:p-2 bg-gray-200 rounded-full mr-1 sm:mr-2 md:mr-4 top-1/2 -translate-y-1/2">
        <div className="h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8 text-transparent">
          <svg
            className="h-full w-full"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>

      {/* Carousel items skeleton */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 w-full h-full px-2 sm:px-4">
        {/* Left item */}
        <div className="relative rounded-lg sm:rounded-xl h-[180px] w-[220px] sm:h-[220px] sm:w-[280px] md:h-[280px] md:w-[350px] lg:h-[320px] lg:w-[400px] xl:h-[400px] xl:w-[500px] bg-gray-200 animate-pulse"></div>
        
        {/* Center item (main) */}
        <div className="relative rounded-lg sm:rounded-xl h-[250px] w-[300px] sm:h-[300px] sm:w-[400px] md:h-[350px] md:w-[500px] lg:h-[400px] lg:w-[600px] xl:h-[500px] xl:w-[700px] bg-gray-300 animate-pulse shadow-lg sm:shadow-xl"></div>
        
        {/* Right item */}
        <div className="relative rounded-lg sm:rounded-xl h-[180px] w-[220px] sm:h-[220px] sm:w-[280px] md:h-[280px] md:w-[350px] lg:h-[320px] lg:w-[400px] xl:h-[400px] xl:w-[500px] bg-gray-200 animate-pulse"></div>
      </div>

      {/* Indicator dots skeleton */}
      <div className="flex justify-center space-x-1 sm:space-x-2 mt-4 sm:mt-6 md:mt-8 lg:mt-12 xl:mt-20 px-4">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full transition-all duration-300 ${
              index === 0 ? "bg-gray-400 w-4 sm:w-6" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default GalleryHomeSliderLoading;