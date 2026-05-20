// src/pages/student/StudentProfile.jsx
import React, { useState } from 'react'
import { getStudents, updateItem } from '../../utils/storage'
import { useToast } from '../../hooks/useToast'
import { User, Mail, Phone, Calendar, GraduationCap, Percent, BookOpen, MapPin } from 'lucide-react'

export default function StudentProfile({ student, onUpdateProfile }) {
  const [formData, setFormData] = useState({
    name: student.name || '',
    email: student.email || '',
    pwd: student.pwd || '',
    phone: student.phone || '',
    dob: student.dob || '',
    branch: student.branch || 'CSE',
    degree: student.degree || 'B.Tech',
    year: student.year || 4,
    cgpa: student.cgpa || '',
    p12: student.p12 || '',
    p10: student.p10 || '',
    skills: student.skills || '',
    bio: student.bio || '',
    gender: student.gender || 'Male',
    location: student.location || ''
  });

  const { success, error } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value, 10) : value
    }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    
    // Validation
    const cgpaVal = parseFloat(formData.cgpa);
    const p12Val = parseFloat(formData.p12);
    const p10Val = parseFloat(formData.p10);

    if (isNaN(cgpaVal) || cgpaVal < 0 || cgpaVal > 10) {
      error("CGPA must be between 0.0 and 10.0!");
      return;
    }

    if (isNaN(p12Val) || p12Val < 0 || p12Val > 100 || isNaN(p10Val) || p10Val < 0 || p10Val > 100) {
      error("Grades percentages must be between 0.0 and 100.0!");
      return;
    }

    const updatedStudent = {
      ...student,
      ...formData,
      cgpa: cgpaVal,
      p12: p12Val,
      p10: p10Val
    };

    const ok = updateItem("smarthire_students", student.id, updatedStudent);
    if (ok) {
      success("Profile updated successfully!");
      if (onUpdateProfile) onUpdateProfile();
    } else {
      error("Failed to update profile details.");
    }
  };

  return (
    <div className="space-y-8 animate-slide-in max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white font-sora">My Profile</h1>
        <p className="text-xs text-slate-400 mt-1">Review and manage your academic parameters and settings.</p>
      </div>

      {/* Profile Form Card */}
      <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 md:p-8 shadow-xl">
        <form onSubmit={handleUpdate} className="space-y-6">
          
          {/* Section 1: Account Info */}
          <div>
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-4 border-b border-[#1e2d45] pb-2">1. Personal & Contact Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Full Name *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><User size={15} /></span>
                  <input
                    type="text" required name="name" value={formData.name} onChange={handleChange}
                    className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Email Address *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><Mail size={15} /></span>
                  <input
                    type="email" required disabled name="email" value={formData.email}
                    className="w-full bg-[#0a0e1a]/50 border border-[#1e2d45] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#94a3b8] cursor-not-allowed focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Phone Number *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><Phone size={15} /></span>
                  <input
                    type="text" required name="phone" value={formData.phone} onChange={handleChange}
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
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><MapPin size={15} /></span>
                  <input
                    type="text" required name="location" value={formData.location} onChange={handleChange}
                    className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500"
                  />
                </div>
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
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-4 border-b border-[#1e2d45] pb-2">2. Academic Performance</h3>
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
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">CGPA (0 - 10.0) *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><BookOpen size={15} /></span>
                  <input
                    type="number" step="0.01" required name="cgpa" value={formData.cgpa} onChange={handleChange}
                    className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">12th Grade % *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><Percent size={15} /></span>
                  <input
                    type="number" step="0.1" required name="p12" value={formData.p12} onChange={handleChange}
                    className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">10th Grade % *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><Percent size={15} /></span>
                  <input
                    type="number" step="0.1" required name="p10" value={formData.p10} onChange={handleChange}
                    className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Biography & Skill stack */}
          <div>
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-4 border-b border-[#1e2d45] pb-2">3. Professional Summary</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Technical Skill inventory (Comma separated) *</label>
                <input
                  type="text" required name="skills" value={formData.skills} onChange={handleChange}
                  className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Biography *</label>
                <textarea
                  required name="bio" rows="4" value={formData.bio} onChange={handleChange}
                  className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
