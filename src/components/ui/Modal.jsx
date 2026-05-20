// src/components/ui/Modal.jsx
import React, { useEffect } from 'react'
import { X } from 'lucide-react'

export function Modal({ isOpen, onClose, title, children, size = "max-w-2xl" }) {
  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Dialog */}
      <div className={`bg-[#111827] border border-[#1e2d45] rounded-2xl shadow-2xl w-full ${size} overflow-hidden transform transition-all duration-300 relative z-10 max-h-[90vh] flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1e2d45] bg-[#1a2236]/40">
          <h3 className="text-lg font-bold font-sora text-[#f1f5f9]">{title}</h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-[#1a2236] transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-grow text-slate-300">
          {children}
        </div>
      </div>
    </div>
  );
}
