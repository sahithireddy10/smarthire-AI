// src/components/ui/Toast.jsx
import React from 'react'
import { useToast } from '../../hooks/useToast'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bgClass = "bg-[#1a2236] border-[#1e2d45]";
        let icon = <Info className="text-blue-400" size={18} />;
        
        switch (toast.type) {
          case 'success':
            bgClass = "bg-emerald-950/90 border-emerald-500/30 text-emerald-100";
            icon = <CheckCircle className="text-emerald-400" size={18} />;
            break;
          case 'error':
            bgClass = "bg-red-950/90 border-red-500/30 text-red-100";
            icon = <AlertCircle className="text-red-400" size={18} />;
            break;
          case 'warning':
            bgClass = "bg-amber-950/90 border-amber-500/30 text-amber-100";
            icon = <AlertTriangle className="text-amber-400" size={18} />;
            break;
          case 'info':
          default:
            bgClass = "bg-[#111827]/95 border-indigo-500/30 text-slate-100";
            icon = <Info className="text-indigo-400" size={18} />;
        }

        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-md pointer-events-auto transform transition-all duration-300 ease-out translate-y-0 opacity-100 ${bgClass}`}
          >
            <div className="flex-shrink-0 mt-0.5">{icon}</div>
            <div className="flex-1 text-sm font-medium leading-relaxed">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-slate-400 hover:text-slate-200 transition-colors mt-0.5"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
