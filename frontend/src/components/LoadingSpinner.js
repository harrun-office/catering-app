import React from 'react';
import { Loader } from 'lucide-react';

export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Loader className={`${sizeClasses[size]} animate-spin text-purple-600`} />
      <p className="text-gray-600 font-semibold">{text}</p>
    </div>
  );
};
