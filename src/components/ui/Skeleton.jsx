// src/components/ui/Skeleton.jsx
import React from 'react'

export function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse bg-[#1e2d45] rounded ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-[#111827] border border-[#1e2d45] rounded-xl p-5 shadow-lg space-y-4">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="border border-[#1e2d45] rounded-xl overflow-hidden bg-[#111827] p-4 space-y-4">
      <div className="flex justify-between pb-3 border-b border-[#1e2d45]">
        {Array.from({ length: cols }).map((_, idx) => (
          <Skeleton key={idx} className="h-4 w-1/5" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="flex justify-between py-3 border-b border-[#1e2d45]/50 last:border-b-0">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <Skeleton key={cIdx} className="h-3.5 w-1/6" />
          ))}
        </div>
      ))}
    </div>
  );
}
