const EventPageLoading = () => {
  return (
    <div className="mx-auto max-w-screen-3xl pb-10">
      <div className="grid lg:grid-cols-3 md:grid-cols-1 gap-5">
        <div
          role="status"
          className="flex items-center h-[400px] w-full justify-center bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700"
        >
          <div
            role="status"
            className="flex flex-col justify-center items-center gap-5 animate-pulse w-full mx-auto"
          >
            {/* Text Skeleton */}
            <div className="h-8 bg-gray-50 rounded-full dark:bg-gray-700 w-[80%]  animate-pulse"></div>

            {/* Button Skeleton */}
            <div className="h-12 bg-gray-200 rounded-full dark:bg-gray-600 w-[20%]  animate-pulse"></div>
          </div>
        </div>
        <div
          role="status"
          className="flex items-center h-[400px] w-full justify-center bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700"
        >
          <div
            role="status"
            className="flex flex-col justify-center items-center gap-5 animate-pulse w-full mx-auto"
          >
            {/* Text Skeleton */}
            <div className="h-8 bg-gray-50 rounded-full dark:bg-gray-700 w-[80%]  animate-pulse"></div>

            {/* Button Skeleton */}
            <div className="h-12 bg-gray-200 rounded-full dark:bg-gray-600 w-[20%]  animate-pulse"></div>
          </div>
        </div>
        <div
          role="status"
          className="flex items-center h-[400px] w-full justify-center bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700"
        >
          <div
            role="status"
            className="flex flex-col justify-center items-center gap-5 animate-pulse w-full mx-auto"
          >
            {/* Text Skeleton */}
            <div className="h-8 bg-gray-50 rounded-full dark:bg-gray-700 w-[80%]  animate-pulse"></div>

            {/* Button Skeleton */}
            <div className="h-12 bg-gray-200 rounded-full dark:bg-gray-600 w-[20%]  animate-pulse"></div>
          </div>
        </div>
        <div
          role="status"
          className="flex items-center h-[400px] w-full justify-center bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700"
        >
          <div
            role="status"
            className="flex flex-col justify-center items-center gap-5 animate-pulse w-full mx-auto"
          >
            {/* Text Skeleton */}
            <div className="h-8 bg-gray-50 rounded-full dark:bg-gray-700 w-[80%]  animate-pulse"></div>

            {/* Button Skeleton */}
            <div className="h-12 bg-gray-200 rounded-full dark:bg-gray-600 w-[20%]  animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPageLoading;
