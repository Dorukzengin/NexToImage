import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Generating your image...' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin border-t-blue-500"></div>
        <div className="w-12 h-12 border-4 border-transparent rounded-full absolute top-2 left-2 animate-pulse border-t-purple-500"></div>
      </div>
      <p className="text-gray-600 text-center max-w-sm">{message}</p>
    </div>
  );
};