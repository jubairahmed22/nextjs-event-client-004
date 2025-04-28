import { FC } from 'react';

interface LoadingSkeletonProps {
  itemCount?: number;
  variant?: 'grid' | 'list';
  hasTitle?: boolean;
}

const LoadingSkeleton: FC<LoadingSkeletonProps> = ({
  itemCount = 8,
  variant = 'grid',
  hasTitle = true,
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        {hasTitle && (
          <div className="h-8 w-1/3 bg-gray-200 rounded mb-6 dark:bg-gray-700"></div>
        )}
        
        {variant === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(itemCount)].map((_, i) => (
              <div 
                key={i} 
                className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
              >
                <div className="h-64 bg-gray-200 rounded-md dark:bg-gray-700"></div>
                <div className="mt-4 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-3/4 dark:bg-gray-700"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 dark:bg-gray-700"></div>
                </div>
                <div className="h-9 bg-gray-200 rounded mt-4 dark:bg-gray-700"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {[...Array(itemCount)].map((_, i) => (
              <div 
                key={i} 
                className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
              >
                <div className="flex space-x-4">
                  <div className="h-24 w-24 bg-gray-200 rounded-md dark:bg-gray-700"></div>
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 dark:bg-gray-700"></div>
                    <div className="h-4 bg-gray-200 rounded w-full dark:bg-gray-700"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 dark:bg-gray-700"></div>
                    <div className="h-8 bg-gray-200 rounded w-24 mt-2 dark:bg-gray-700"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingSkeleton;