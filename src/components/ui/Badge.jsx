// src/components/ui/Badge.jsx
import React from 'react'

export function Badge({ status }) {
  const norm = (status || "").toLowerCase().trim();
  
  let classes = "px-2.5 py-1 text-xs font-semibold rounded-full border inline-block whitespace-nowrap ";

  switch(norm) {
    case 'applied':
      classes += "bg-blue-500/20 text-blue-400 border-blue-500/30";
      break;
    case 'eligible':
      classes += "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
      break;
    case 'test':
      classes += "bg-purple-500/20 text-purple-400 border-purple-500/30";
      break;
    case 'interview':
      classes += "bg-amber-500/20 text-amber-400 border-amber-500/30";
      break;
    case 'selected':
      classes += "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      break;
    case 'rejected':
      classes += "bg-red-500/20 text-red-400 border-red-500/30";
      break;
    case 'active':
      classes += "bg-green-500/20 text-green-400 border-green-500/30";
      break;
    case 'closed':
      classes += "bg-gray-500/20 text-gray-400 border-gray-500/30";
      break;
    default:
      classes += "bg-slate-500/20 text-slate-400 border-slate-500/30";
  }

  return (
    <span className={classes}>
      {status}
    </span>
  );
}
