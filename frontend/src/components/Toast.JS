// src/components/Toast.jsx
import React from 'react';
import { X } from 'lucide-react';

/**
 * Props:
 * - toasts: [{ id: string|number, message: string, type?: 'success'|'error'|'info' }]
 * - removeToast: fn(id)
 *
 * This is a presentational component only. Auto-dismiss is managed by the caller.
 */
export const Toasts = ({ toasts = [], removeToast = () => {} }) => {
  return (
    <div aria-live="polite" className="fixed right-4 bottom-6 z-50 flex flex-col gap-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`min-w-[220px] max-w-sm rounded-lg shadow-lg overflow-hidden border ${
            t.type === 'error' ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'
          }`}
        >
          <div className="flex items-start gap-3 p-3">
            <div className="flex-1">
              <p className={`text-sm font-medium ${t.type === 'error' ? 'text-red-700' : 'text-gray-900'}`}>
                {t.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="p-1 rounded hover:bg-gray-100"
              aria-label="dismiss toast"
            >
              <X size={16} className="text-gray-500" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Toasts;
