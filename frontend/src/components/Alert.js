import React from 'react';
import { AlertCircle, CheckCircle, InfoIcon } from 'lucide-react';

export const Alert = ({ type = 'info', message, onClose }) => {
  const typeStyles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  const iconMap = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    warning: <AlertCircle size={20} />,
    info: <InfoIcon size={20} />,
  };

  return (
    <div className={`border rounded-lg p-4 flex items-start gap-3 animate-fade-in ${typeStyles[type]}`}>
      {iconMap[type]}
      <div className="flex-1">
        <p className="font-semibold">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-xl hover:opacity-50">
          ×
        </button>
      )}
    </div>
  );
};
