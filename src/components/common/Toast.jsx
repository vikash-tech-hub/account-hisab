import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';
  const isInfo = toast.type === 'info';

  return (
    <div className="fixed top-20 right-6 z-50 max-w-md animate-bounce-short">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md border ${
          isSuccess
            ? 'bg-emerald-950/95 border-emerald-500/50 text-emerald-100 shadow-emerald-500/20'
            : isError
            ? 'bg-rose-950/95 border-rose-500/50 text-rose-100 shadow-rose-500/20'
            : 'bg-indigo-950/95 border-indigo-500/50 text-indigo-100 shadow-indigo-500/20'
        }`}
      >
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
        {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
        {isInfo && <Info className="w-5 h-5 text-indigo-400 shrink-0" />}

        <p className="text-sm font-medium">{toast.message}</p>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
