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
  const getStyles = (type) => {
    if (type === 'error') {
      return {
        container: 'bg-red-50 border-red-200 text-red-900',
        iconBg: 'bg-red-100 text-red-700',
      };
    }
    if (type === 'success') {
      return {
        container: 'bg-emerald-50 border-emerald-200 text-emerald-900',
        iconBg: 'bg-emerald-100 text-emerald-700',
      };
    }
    return {
      container: 'bg-white border-orange-100 text-[#301b16]',
      iconBg: 'bg-orange-50 text-[#FF6A28]',
    };
  };

  return (
    <div aria-live="polite" className="fixed right-4 left-4 sm:left-auto bottom-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => {
        const styles = getStyles(t.type);
        return (
          <div
            key={t.id}
            className={`pointer-events-auto min-w-[240px] max-w-sm rounded-2xl shadow-[0_14px_40px_rgba(0,0,0,0.12)] overflow-hidden border animate-slide-in`}
          >
            <div className={`flex items-start gap-3 p-4 ${styles.container}`}>
              <div className={`h-9 w-9 rounded-full flex items-center justify-center ${styles.iconBg} font-bold text-sm shrink-0`}>
                {t.type === 'error' ? '!' : t.type === 'success' ? '✓' : 'ℹ'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{t.title || (t.type === 'error' ? 'Error' : t.type === 'success' ? 'Success' : 'Info')}</p>
                <p className="text-sm mt-0.5">{t.message}</p>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="p-1 rounded hover:bg-black/5 transition"
                aria-label="dismiss toast"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Toasts;
