// src/pages/company/CompanyDashboard.jsx
import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useSession } from '../../hooks/useSession'
import { getById } from '../../utils/storage'
import { Sidebar } from '../../components/layout/Sidebar'
import { TopBar } from '../../components/layout/TopBar'
import CompanyOverview from './CompanyOverview'
import MyDrives from './MyDrives'
import PostDrive from './PostDrive'
import CompanyApplicants from './CompanyApplicants'

export default function CompanyDashboard() {
  const { session, logout } = useSession();
  const [company, setCompany] = useState(null);
  const navigate = useNavigate();

  const loadCompanyData = () => {
    if (session && session.uid) {
      const data = getById("smarthire_companies", session.uid);
      if (data) {
        setCompany(data);
      }
    }
  };

  useEffect(() => {
    loadCompanyData();
  }, [session]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!company) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center text-slate-400 font-sora">
        Loading recruiter profile...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0a0e1a] overflow-hidden text-slate-100 font-dm">
      {/* Sidebar Nav */}
      <Sidebar role="company" />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar Header */}
        <TopBar user={session} onLogout={handleLogout} />

        {/* Scrollable Dashboard Section */}
        <main className="flex-grow overflow-y-auto p-6 md:p-8 bg-[#0a0e1a] relative">
          <Routes>
            <Route path="/" element={<CompanyOverview company={company} />} />
            <Route path="drives" element={<MyDrives company={company} />} />
            <Route path="post" element={<PostDrive company={company} />} />
            <Route path="applicants" element={<CompanyApplicants company={company} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
