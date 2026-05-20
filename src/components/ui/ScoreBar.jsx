// src/components/ui/ScoreBar.jsx
import React from 'react'

export function ScoreBar({ score, showNumber = true }) {
  const s = Math.max(0, Math.min(100, Math.round(score || 0)));
  
  let gradient = "";
  let textClass = "";
  
  if (s < 40) {
    gradient = "from-red-600 to-red-400";
    textClass = "text-red-400";
  } else if (s < 70) {
    gradient = "from-amber-600 to-yellow-400";
    textClass = "text-amber-400";
  } else {
    gradient = "from-emerald-600 to-green-400";
    textClass = "text-emerald-400";
  }

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-grow h-2.5 bg-gray-800 rounded-full overflow-hidden border border-gray-700/50">
        <div 
          className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-500`}
          style={{ width: `${s}%` }}
        />
      </div>
      {showNumber && (
        <span className={`text-xs font-bold font-sora min-w-[36px] text-right ${textClass}`}>
          {s}%
        </span>
      )}
    </div>
  );
}
