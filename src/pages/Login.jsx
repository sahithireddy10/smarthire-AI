// src/pages/Login.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSession } from '../hooks/useSession'
import { useToast } from '../hooks/useToast'
import { getStudents, getCompanies } from '../utils/storage'
import { Shield, Users, Building2, Key, Mail, Sparkles, ArrowLeft } from 'lucide-react'

export default function Login() {
  const [activeTab, setActiveTab] = useState('student'); // student | company | admin
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { setSession } = useSession();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      error("Please fill in all fields");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (activeTab === 'admin') {
        if (email.trim() === 'admin@smarthire.ai' && password === 'admin123') {
          const adminSession = {
            uid: 'admin_root',
            role: 'admin',
            name: 'Root Administrator',
            email: 'admin@smarthire.ai'
          };
          setSession(adminSession);
          success("Admin authenticated successfully!");
          navigate('/admin');
        } else {
          error("Invalid administrator credentials");
        }
      } else if (activeTab === 'student') {
        const students = getStudents();
        const found = students.find(s => s.email.toLowerCase().trim() === email.toLowerCase().trim() && s.pwd === password);
        
        if (found) {
          const studentSession = {
            uid: found.id,
            role: 'student',
            name: found.name,
            email: found.email
          };
          setSession(studentSession);
          success(`Welcome back, ${found.name}!`);
          navigate('/student');
        } else {
          error("Invalid student email or password");
        }
      } else if (activeTab === 'company') {
        const companies = getCompanies();
        const found = companies.find(c => c.email.toLowerCase().trim() === email.toLowerCase().trim() && c.pwd === password);
        
        if (found) {
          const companySession = {
            uid: found.id,
            role: 'company',
            name: found.name,
            email: found.email
          };
          setSession(companySession);
          success(`Logged in as ${found.name} recruitment officer.`);
          navigate('/company');
        } else {
          error("Invalid company email or password");
        }
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background circles */}
      <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating back arrow */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Home
      </Link>

      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-100/50 p-8 relative z-10 animate-slide-in">
        {/* Header branding */}
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md mx-auto font-sora text-base mb-4">
            S
          </div>
          <h2 className="text-xl font-bold font-sora text-slate-900">Console Access</h2>
          <p className="text-xs text-slate-500 mt-2">Sign in to manage drives, prepare interviews, or analyze matches.</p>
        </div>

        {/* Role Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/40 mb-6">
          <button
            onClick={() => { setActiveTab('student'); setEmail(''); setPassword(''); }}
            type="button"
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'student'
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Users size={14} /> Student
          </button>

          <button
            onClick={() => { setActiveTab('company'); setEmail(''); setPassword(''); }}
            type="button"
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'company'
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Building2 size={14} /> Company
          </button>

          <button
            onClick={() => { setActiveTab('admin'); setEmail(''); setPassword(''); }}
            type="button"
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'admin'
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Shield size={14} /> Admin
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1.5">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  activeTab === 'admin' 
                    ? 'admin@smarthire.ai' 
                    : activeTab === 'student' 
                    ? 'rahul@gmail.com' 
                    : 'mscampus@microsoft.com'
                }
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Password</label>
              {activeTab === 'admin' && (
                <span className="text-[10px] text-indigo-600 font-bold">Hint: pass is admin123</span>
              )}
              {activeTab === 'student' && (
                <span className="text-[10px] text-indigo-600 font-bold">Hint: pass is pass@123</span>
              )}
              {activeTab === 'company' && (
                <span className="text-[10px] text-indigo-600 font-bold">Hint: pass is msft@123 or tcs@123</span>
              )}
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Key size={16} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Self-registration prompts */}
        {activeTab !== 'admin' && (
          <div className="text-center mt-6 pt-6 border-t border-slate-100">
            <span className="text-xs text-slate-500">Don't have an account? </span>
            <Link
              to={activeTab === 'student' ? '/register/student' : '/register/company'}
              className="text-xs text-indigo-600 font-bold hover:underline"
            >
              Sign up here
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
