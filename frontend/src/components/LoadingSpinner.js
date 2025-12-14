import React from 'react';

export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255, 106, 40, 0.4), 0 0 40px rgba(255, 106, 40, 0.2);
          }
          50% {
            box-shadow: 0 0 30px rgba(255, 106, 40, 0.6), 0 0 60px rgba(255, 106, 40, 0.3);
          }
        }
        .spinner-rotate {
          animation: spin 1s linear infinite;
          filter: brightness(0) saturate(100%) invert(52%) sepia(89%) saturate(2476%) hue-rotate(346deg) brightness(101%) contrast(101%);
        }
        .spinner-glow {
          animation: glow 2s ease-in-out infinite;
          border-radius: 50%;
          padding: 8px;
          background: radial-gradient(circle, rgba(255, 106, 40, 0.1) 0%, transparent 70%);
        }
      `}</style>
      <div className="spinner-glow">
        <img
          src="/images/folk-spinner.png"
          alt="Loading"
          className={`${sizeClasses[size]} spinner-rotate`}
        />
      </div>
      <p className="text-gray-600 font-semibold">{text}</p>
    </div>
  );
};
