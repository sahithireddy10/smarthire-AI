// src/pages/register/StudentRegister.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getStudents, addItem } from '../../utils/storage'
import { useToast } from '../../hooks/useToast'
import { ArrowLeft, User, Mail, Lock, Phone, Calendar, Briefcase, GraduationCap, Percent, BookOpen } from 'lucide-react'

export default function StudentRegister() {
  const [formData, setFormData] = useState({
    name: '', email: '', pwd: '', phone: '', dob: '',
    branch: 'CSE', degree: 'B.Tech', year: 4, cgpa: '',
    p12: '', p10: '', skills: '', bio: '', gender: 'Male',
    location: '', photo: '', resume: ''
  });

  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value, 10) : value
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const students = getStudents();
    
    // Check if email already registered
    const exists = students.some(s => s.email.toLowerCase().trim() === formData.email.toLowerCase().trim());
    if (exists) {
      error("Email is already registered!");
      return;
    }

    const newStudent = {
      ...formData,
      id: "stu_" + Date.now(),
      cgpa: parseFloat(formData.cgpa) || 0.0,
      p12: parseFloat(formData.p12) || 0.0,
      p10: parseFloat(formData.p10) || 0.0,
      created: new Date().toISOString()
    };

    addItem("smarthire_students", newStudent);
    success("Registration successful! You can now log in.");
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background circles */}
      <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />

      <Link 
        to="/login" 
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} /> Back to Login
      </Link>

      <div className="w-full max-w-2xl bg-[#111827] border border-[#1e2d45] rounded-2xl shadow-2xl p-8 relative z-10 my-10 animate-slide-in">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold font-sora text-white">Student Registration</h2>
          <p className="text-xs text-slate-400 mt-2">Create your academic profile to unlock AI matching and placements.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          {/* Section 1: Account Info */}
          <div>
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-4 border-b border-[#1e2d45] pb-2">1. Personal & Account Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Full Name *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><User size={15} /></span>
                  <input
                    type="text" required name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Rahul Verma"
                    className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Email Address *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><Mail size={15} /></span>
                  <input
                    type="email" required name="email" value={formData.email} onChange={handleChange} placeholder="e.g. rahul@edu.in"
                    className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Password *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><Lock size={15} /></span>
                  <input
                    type="password" required name="pwd" value={formData.pwd} onChange={handleChange} placeholder="••••••••"
                    className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Phone Number *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><Phone size={15} /></span>
                  <input
                    type="text" required name="phone" value={formData.phone} onChange={handleChange} placeholder="10-digit mobile"
                    className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Date of Birth *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><Calendar size={15} /></span>
                  <input
                    type="date" required name="dob" value={formData.dob} onChange={handleChange}
                    className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Location *</label>
                <input
                  type="text" required name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Pune, Maharashtra"
                  className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Gender *</label>
                <select
                  name="gender" value={formData.gender} onChange={handleChange}
                  className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Academics */}
          <div>
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-4 border-b border-[#1e2d45] pb-2">2. Academic Record</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Degree *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><GraduationCap size={15} /></span>
                  <select
                    name="degree" value={formData.degree} onChange={handleChange}
                    className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500"
                  >
                    <option value="B.Tech">B.Tech</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="MBA">MBA</option>
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Branch *</label>
                <select
                  name="branch" value={formData.branch} onChange={handleChange}
                  className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500"
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
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Academic Year *</label>
                <select
                  name="year" value={formData.year} onChange={handleChange}
                  className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500"
                >
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">CGPA *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><BookOpen size={15} /></span>
                  <input
                    type="number" step="0.01" required name="cgpa" value={formData.cgpa} onChange={handleChange} placeholder="e.g. 8.4"
                    className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">12th Grade % *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><Percent size={15} /></span>
                  <input
                    type="number" step="0.1" required name="p12" value={formData.p12} onChange={handleChange} placeholder="e.g. 91.5"
                    className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">10th Grade % *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><Percent size={15} /></span>
                  <input
                    type="number" step="0.1" required name="p10" value={formData.p10} onChange={handleChange} placeholder="e.g. 88.0"
                    className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Profile Summary & Skills */}
          <div>
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-4 border-b border-[#1e2d45] pb-2">3. Skills & Background</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Technical Skills (Comma separated) *</label>
                <input
                  type="text" required name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g. Python, SQL, React, Git"
                  className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Brief Bio / Professional Summary *</label>
                <textarea
                  required name="bio" rows="3" value={formData.bio} onChange={handleChange} placeholder="Write a short summary about yourself..."
                  className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
          >
            Submit Registration
          </button>
        </form>
      </div>
    </div>
  );
}
