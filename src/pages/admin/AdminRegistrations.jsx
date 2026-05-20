// src/pages/admin/AdminRegistrations.jsx
import React, { useState } from 'react'
import { addItem, getStudents, getCompanies } from '../../utils/storage'
import { useToast } from '../../hooks/useToast'
import { GraduationCap, Building2, UserPlus, ShieldAlert } from 'lucide-react'

export default function AdminRegistrations() {
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState('student'); // student | company

  // Student Form State
  const [studentForm, setStudentForm] = useState({
    name: '', email: '', pwd: '', branch: 'CSE', degree: 'B.Tech', cgpa: '', skills: '', year: 4, dob: '', phone: ''
  });

  // Company Form State
  const [companyForm, setCompanyForm] = useState({
    name: '', email: '', pwd: '', website: '', industry: 'Software'
  });

  // Handle Student registration
  const handleStudentSubmit = (e) => {
    e.preventDefault();

    const students = getStudents();
    const emailExists = students.some(s => s.email.toLowerCase() === studentForm.email.toLowerCase());
    
    if (emailExists) {
      error("A student with this email address already exists!");
      return;
    }

    const cgpaVal = parseFloat(studentForm.cgpa);
    if (isNaN(cgpaVal) || cgpaVal < 0 || cgpaVal > 10) {
      error("CGPA must be a valid number between 0.0 and 10.0!");
      return;
    }

    const newStudent = {
      ...studentForm,
      id: "std_" + Date.now(),
      role: "student",
      cgpa: cgpaVal,
      p12: 85.0,
      p10: 90.0,
      bio: `Pre-registered B.Tech ${studentForm.branch} candidate.`
    };

    addItem("smarthire_students", newStudent);
    success(`Student ${studentForm.name} registered successfully!`);
    
    // reset form
    setStudentForm({
      name: '', email: '', pwd: '', branch: 'CSE', degree: 'B.Tech', cgpa: '', skills: '', year: 4, dob: '', phone: ''
    });
  };

  // Handle Company registration
  const handleCompanySubmit = (e) => {
    e.preventDefault();

    const companies = getCompanies();
    const emailExists = companies.some(c => c.email.toLowerCase() === companyForm.email.toLowerCase());

    if (emailExists) {
      error("An employer with this HR email already exists!");
      return;
    }

    const newCompany = {
      ...companyForm,
      id: "com_" + Date.now(),
      role: "company",
      logo: ""
    };

    addItem("smarthire_companies", newCompany);
    success(`Employer ${companyForm.name} registered successfully!`);

    // reset form
    setCompanyForm({
      name: '', email: '', pwd: '', website: '', industry: 'Software'
    });
  };

  return (
    <div className="space-y-8 animate-slide-in max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white font-sora">Pre-Register Accounts</h1>
        <p className="text-xs text-slate-400 mt-1">Pre-provision candidate profiles or employer partner accounts in bulk.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-[#1e2d45] pb-4">
        <button
          onClick={() => setActiveTab('student')}
          className={`flex items-center gap-2 pb-2 text-xs font-bold font-sora border-b-2 transition-all ${
            activeTab === 'student'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <GraduationCap size={16} /> Pre-Register Student
        </button>
        <button
          onClick={() => setActiveTab('company')}
          className={`flex items-center gap-2 pb-2 text-xs font-bold font-sora border-b-2 transition-all ${
            activeTab === 'company'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <Building2 size={16} /> Pre-Register Employer
        </button>
      </div>

      {/* Forms Panels */}
      <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 md:p-8 shadow-xl">
        {activeTab === 'student' ? (
          <form onSubmit={handleStudentSubmit} className="space-y-6">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-4 border-b border-[#1e2d45] pb-2">Student Account Credentials</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Full Name *</label>
                <input
                  type="text" required value={studentForm.name} onChange={(e) => setStudentForm({...studentForm, name: e.target.value})} placeholder="John Doe"
                  className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Email Address (Login ID) *</label>
                <input
                  type="email" required value={studentForm.email} onChange={(e) => setStudentForm({...studentForm, email: e.target.value})} placeholder="student@university.edu"
                  className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Password *</label>
                <input
                  type="password" required value={studentForm.pwd} onChange={(e) => setStudentForm({...studentForm, pwd: e.target.value})} placeholder="••••••••"
                  className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Phone Number</label>
                <input
                  type="text" value={studentForm.phone} onChange={(e) => setStudentForm({...studentForm, phone: e.target.value})} placeholder="+91 XXXXX XXXXX"
                  className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Branch *</label>
                <select
                  value={studentForm.branch} onChange={(e) => setStudentForm({...studentForm, branch: e.target.value})}
                  className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none"
                >
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="IT">IT</option>
                  <option value="ME">ME</option>
                  <option value="CE">CE</option>
                  <option value="EEE">EEE</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Degree *</label>
                <select
                  value={studentForm.degree} onChange={(e) => setStudentForm({...studentForm, degree: e.target.value})}
                  className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none"
                >
                  <option value="B.Tech">B.Tech</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="MBA">MBA</option>
                  <option value="BCA">BCA</option>
                  <option value="MCA">MCA</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Current CGPA Cutoff *</label>
                <input
                  type="number" step="0.01" required value={studentForm.cgpa} onChange={(e) => setStudentForm({...studentForm, cgpa: e.target.value})} placeholder="e.g. 8.5"
                  className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Academic Year *</label>
                <select
                  value={studentForm.year} onChange={(e) => setStudentForm({...studentForm, year: parseInt(e.target.value, 10)})}
                  className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none"
                >
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Technical Skills (Comma separated) *</label>
                <input
                  type="text" required value={studentForm.skills} onChange={(e) => setStudentForm({...studentForm, skills: e.target.value})} placeholder="React, Node.js, Python, SQL"
                  className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#1e2d45]/50">
              <button
                type="submit"
                className="px-6 py-3 bg-[#6366f1] hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <UserPlus size={15} /> Pre-Register Student
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCompanySubmit} className="space-y-6">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-4 border-b border-[#1e2d45] pb-2">Employer Corporate Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Company Name *</label>
                <input
                  type="text" required value={companyForm.name} onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})} placeholder="e.g. Google India"
                  className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Corporate HR Email Address *</label>
                <input
                  type="email" required value={companyForm.email} onChange={(e) => setCompanyForm({...companyForm, email: e.target.value})} placeholder="hr@company.com"
                  className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">HR Portal Password *</label>
                <input
                  type="password" required value={companyForm.pwd} onChange={(e) => setCompanyForm({...companyForm, pwd: e.target.value})} placeholder="••••••••"
                  className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Industry Segment *</label>
                <select
                  value={companyForm.industry} onChange={(e) => setCompanyForm({...companyForm, industry: e.target.value})}
                  className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none"
                >
                  <option value="Software">Software Development</option>
                  <option value="Hardware">Hardware & VLSI</option>
                  <option value="Consulting">Consulting & Finance</option>
                  <option value="Analytics">Data Analytics & AI</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Corporate Website URL *</label>
                <input
                  type="url" required value={companyForm.website} onChange={(e) => setCompanyForm({...companyForm, website: e.target.value})} placeholder="https://careers.google.com"
                  className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#1e2d45]/50">
              <button
                type="submit"
                className="px-6 py-3 bg-[#6366f1] hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <UserPlus size={15} /> Pre-Register Company
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
