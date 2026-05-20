// src/App.jsx
import React from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './hooks/useToast'
import { ToastContainer } from './components/ui/Toast'
import { useSession } from './hooks/useSession'
import Landing from './pages/Landing'
import Login from './pages/Login'
import StudentRegister from './pages/register/StudentRegister'
import CompanyRegister from './pages/register/CompanyRegister'
import StudentDashboard from './pages/student/StudentDashboard'
import CompanyDashboard from './pages/company/CompanyDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'

function RequireAuth({ children, role }) {
  const { session } = useSession();
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  if (session.role !== role) {
    // Redirect to correct dashboard based on role
    return <Navigate to={`/${session.role}`} replace />;
  }
  
  return children;
}

function App() {
  return (
    <ToastProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/student" element={<StudentRegister />} />
          <Route path="/register/company" element={<CompanyRegister />} />
          
          <Route 
            path="/student/*" 
            element={
              <RequireAuth role="student">
                <StudentDashboard />
              </RequireAuth>
            } 
          />
          <Route 
            path="/company/*" 
            element={
              <RequireAuth role="company">
                <CompanyDashboard />
              </RequireAuth>
            } 
          />
          <Route 
            path="/admin/*" 
            element={
              <RequireAuth role="admin">
                <AdminDashboard />
              </RequireAuth>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
      <ToastContainer />
    </ToastProvider>
  )
}

export default App
