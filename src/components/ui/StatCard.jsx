// src/components/ui/StatCard.jsx
import React from 'react'

export function StatCard({ title, value, subtext, icon: Icon, colorClass = "text-indigo-400 border-indigo-500/20" }) {
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300">
      {/* Subtle hover gradient background glow */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all duration-300" />
      
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold font-sora mt-2 text-[#f1f5f9]">{value}</h3>
          {subtext && <p className="text-xs text-[#475569] mt-1">{subtext}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg bg-bg-elevated border ${colorClass}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
}
