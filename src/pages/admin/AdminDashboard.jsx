// src/pages/admin/AdminDashboard.jsx
import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useSession } from '../../hooks/useSession'
import { Sidebar } from '../../components/layout/Sidebar'
import { TopBar } from '../../components/layout/TopBar'
import AdminOverview from './AdminOverview'
import AdminStudents from './AdminStudents'
import AdminCompanies from './AdminCompanies'
import AdminDrives from './AdminDrives'
import AdminAnalytics from './AdminAnalytics'
import AdminRegistrations from './AdminRegistrations'

export default function AdminDashboard() {
  const { session, logout } = useSession();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!session) return null;

  return (
    <div className="flex h-screen bg-[#0a0e1a] overflow-hidden text-slate-100 font-dm">
      {/* Sidebar Nav */}
      <Sidebar role="admin" />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar Header */}
        <TopBar user={session} onLogout={handleLogout} />

        {/* Scrollable Dashboard Section */}
        <main className="flex-grow overflow-y-auto p-6 md:p-8 bg-[#0a0e1a] relative">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="companies" element={<AdminCompanies />} />
            <Route path="drives" element={<AdminDrives />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="registrations" element={<AdminRegistrations />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
