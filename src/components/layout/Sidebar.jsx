// src/components/layout/Sidebar.jsx
import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Search, 
  FileText, 
  GraduationCap, 
  Cpu, 
  User, 
  Briefcase, 
  PlusCircle, 
  Users, 
  Building2, 
  BarChart3, 
  UserPlus 
} from 'lucide-react'

export function Sidebar({ role }) {
  const getNavItems = () => {
    switch (role) {
      case 'student':
        return [
          { name: 'Overview', path: '/student', icon: LayoutDashboard, end: true },
          { name: 'Explore Drives', path: '/student/explore', icon: Search },
          { name: 'My Applications', path: '/student/applications', icon: FileText },
          { name: 'Interview Prep', path: '/student/prep', icon: GraduationCap },
          { name: 'AI Tools', path: '/student/tools', icon: Cpu },
          { name: 'Resume Builder', path: '/student/resume', icon: FileText },
          { name: 'Profile', path: '/student/profile', icon: User },
        ];
      case 'company':
        return [
          { name: 'Overview', path: '/company', icon: LayoutDashboard, end: true },
          { name: 'My Drives', path: '/company/drives', icon: Briefcase },
          { name: 'Post Drive', path: '/company/post', icon: PlusCircle },
          { name: 'Applicants', path: '/company/applicants', icon: Users },
        ];
      case 'admin':
        return [
          { name: 'Overview', path: '/admin', icon: LayoutDashboard, end: true },
          { name: 'Students', path: '/admin/students', icon: Users },
          { name: 'Companies', path: '/admin/companies', icon: Building2 },
          { name: 'Drives', path: '/admin/drives', icon: Briefcase },
          { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
          { name: 'Registrations', path: '/admin/registrations', icon: UserPlus },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-[#111827] border-r border-[#1e2d45] flex flex-col h-full shrink-0">
      {/* Branding Header */}
      <div className="p-6 border-b border-[#1e2d45] flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20 font-sora">
          S
        </div>
        <div>
          <span className="font-bold text-[#f1f5f9] tracking-tight block font-sora text-sm">SmartHire AI</span>
          <span className="text-[10px] text-[#8b5cf6] font-semibold uppercase tracking-wider block">
            {role} Portal
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `
                flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group
                ${isActive 
                  ? 'bg-gradient-to-r from-indigo-600/20 to-violet-600/20 text-[#818cf8] border border-indigo-500/30' 
                  : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#1a2236]/60 border border-transparent'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon 
                    size={18} 
                    className={`transition-colors duration-200 ${isActive ? 'text-[#818cf8]' : 'text-slate-400 group-hover:text-slate-200'}`} 
                  />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-[#1e2d45] bg-[#0a0e1a]/40 text-center">
        <span className="text-[10px] text-[#475569] font-medium tracking-wide">
          &copy; 2026 SmartHire AI v1.0
        </span>
      </div>
    </aside>
  );
}
