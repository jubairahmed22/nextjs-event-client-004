import React from 'react';

const LoadingTestimonial = () => {
    return (
        <div className="relative w-full overflow-hidden mt-5 lg:mt-16">
            {/* Slider Content - Skeleton */}
            <div className="flex">
                <div className="w-full flex-shrink-0 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 gap-4 px-4">
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse mr-3"></div>
                                <div>
                                    <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                                    <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6"></div>
                                <div className="h-3 bg-gray-200 rounded animate-pulse w-4/6"></div>
                            </div>
                            <div className="mt-4 flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-4 h-4 bg-gray-200 rounded-full mr-1 animate-pulse"></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Slide Indicators - Skeleton */}
            <div className="flex justify-center mt-4 gap-2">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
                ))}
            </div>
        </div>
    );
};

export default LoadingTestimonial;