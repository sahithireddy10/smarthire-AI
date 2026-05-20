// src/pages/student/StudentDashboard.jsx
import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useSession } from '../../hooks/useSession'
import { getById } from '../../utils/storage'
import { Sidebar } from '../../components/layout/Sidebar'
import { TopBar } from '../../components/layout/TopBar'
import { Chatbot } from '../../components/shared/Chatbot'
import StudentOverview from './StudentOverview'
import ExploreDrives from './ExploreDrives'
import MyApplications from './MyApplications'
import InterviewPrep from './InterviewPrep'
import AITools from './AITools'
import ResumeBuilder from './ResumeBuilder'
import StudentProfile from './StudentProfile'

export default function StudentDashboard() {
  const { session, logout } = useSession();
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();

  const loadStudentData = () => {
    if (session && session.uid) {
      const data = getById("smarthire_students", session.uid);
      if (data) {
        setStudent(data);
      }
    }
  };

  useEffect(() => {
    loadStudentData();
  }, [session]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!student) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center text-slate-400 font-sora">
        Loading candidate profile...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0a0e1a] overflow-hidden text-slate-100 font-dm">
      {/* Sidebar Nav */}
      <Sidebar role="student" />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar Header */}
        <TopBar user={session} onLogout={handleLogout} />

        {/* Scrollable Dashboard Section */}
        <main className="flex-grow overflow-y-auto p-6 md:p-8 bg-[#0a0e1a] relative">
          <Routes>
            <Route path="/" element={<StudentOverview student={student} />} />
            <Route path="explore" element={<ExploreDrives student={student} />} />
            <Route path="applications" element={<MyApplications student={student} />} />
            <Route path="prep" element={<InterviewPrep student={student} />} />
            <Route path="tools" element={<AITools student={student} />} />
            <Route path="resume" element={<ResumeBuilder student={student} />} />
            <Route path="profile" element={<StudentProfile student={student} onUpdateProfile={loadStudentData} />} />
          </Routes>
        </main>
      </div>

      {/* Floating Chatbot Widget */}
      <Chatbot student={student} />
    </div>
  );
}
