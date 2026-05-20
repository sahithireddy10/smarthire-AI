// src/components/layout/TopBar.jsx
import React from 'react'
import { LogOut, User, Bell } from 'lucide-react'

export function TopBar({ user, onLogout }) {
  return (
    <header className="h-16 bg-[#111827] border-b border-[#1e2d45] flex items-center justify-between px-6 shrink-0 relative z-10">
      {/* Left section: Welcome Message */}
      <div>
        <h2 className="text-sm font-semibold text-[#94a3b8] font-sora">
          Welcome back, <span className="text-[#f1f5f9] font-bold">{user?.name || 'User'}</span>
        </h2>
      </div>

      {/* Right section: Profile, Info, Logout */}
      <div className="flex items-center gap-4">
        {/* Mock Notification Bell */}
        <button className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-[#1a2236] transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#8b5cf6] rounded-full ring-2 ring-[#111827]" />
        </button>

        {/* User Profile Badge */}
        <div className="flex items-center gap-3 pl-3 border-l border-[#1e2d45]">
          <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs uppercase font-sora">
            {user?.name ? user.name.charAt(0) : <User size={14} />}
          </div>
          <div className="hidden md:block text-left">
            <span className="text-xs font-semibold text-[#f1f5f9] block leading-none">{user?.name || 'Guest'}</span>
            <span className="text-[10px] text-[#94a3b8] block mt-0.5 leading-none">{user?.email || ''}</span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white transition-all duration-200 text-xs font-bold"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
