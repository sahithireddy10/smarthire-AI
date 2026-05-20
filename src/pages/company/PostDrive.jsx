// src/pages/company/PostDrive.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addItem } from '../../utils/storage'
import { useToast } from '../../hooks/useToast'
import { PlusCircle, Briefcase, MapPin, DollarSign, Calendar, BookOpen, GraduationCap } from 'lucide-react'

export default function PostDrive({ company }) {
  const [formData, setFormData] = useState({
    title: '',
    role: '',
    location: '',
    salary: '',
    deadline: '',
    req_cgpa: '',
    req_year: 4,
    req_degree: 'B.Tech',
    req_skills: '',
    description: ''
  });

  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'req_year' ? parseInt(value, 10) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const salaryVal = parseFloat(formData.salary);
    const cgpaVal = parseFloat(formData.req_cgpa);

    if (isNaN(salaryVal) || salaryVal <= 0) {
      error("Please enter a valid salary package!");
      return;
    }

    if (isNaN(cgpaVal) || cgpaVal < 0 || cgpaVal > 10) {
      error("CGPA threshold must be between 0.0 and 10.0!");
      return;
    }

    const newDrive = {
      ...formData,
      id: "drv_" + Date.now(),
      company_id: company.id,
      status: "active",
      salary: salaryVal,
      req_cgpa: cgpaVal,
      created: new Date().toISOString()
    };

    addItem("smarthire_drives", newDrive);
    success("Recruitment drive posted successfully!");
    navigate('/company/drives');
  };

  return (
    <div className="space-y-8 animate-slide-in max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white font-sora">Post Recruitment Campaign</h1>
        <p className="text-xs text-slate-400 mt-1">Publish a new placement opportunity with eligibility thresholds for campus selection.</p>
      </div>

      {/* Form Container */}
      <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 md:p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Drive Title *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><Briefcase size={15} /></span>
                <input
                  type="text" required name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Associate Software Developer"
                  className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Role Designation *</label>
              <input
                type="text" required name="role" value={formData.role} onChange={handleChange} placeholder="e.g. Frontend Engineer"
                className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Work Location *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><MapPin size={15} /></span>
                <input
                  type="text" required name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Noida / Remote"
                  className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Salary Package (LPA) *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><DollarSign size={15} /></span>
                <input
                  type="number" step="0.1" required name="salary" value={formData.salary} onChange={handleChange} placeholder="e.g. 12.0"
                  className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Application Deadline *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><Calendar size={15} /></span>
                <input
                  type="date" required name="deadline" value={formData.deadline} onChange={handleChange}
                  className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Min CGPA Cutoff (0-10.0) *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><BookOpen size={15} /></span>
                <input
                  type="number" step="0.01" required name="req_cgpa" value={formData.req_cgpa} onChange={handleChange} placeholder="e.g. 7.5"
                  className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Required Degree *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><GraduationCap size={15} /></span>
                <select
                  name="req_degree" value={formData.req_degree} onChange={handleChange}
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
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Target Academic Year *</label>
              <select
                name="req_year" value={formData.req_year} onChange={handleChange}
                className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500"
              >
                <option value="0">Any Year</option>
                <option value="1">1st Year+</option>
                <option value="2">2nd Year+</option>
                <option value="3">3rd Year+</option>
                <option value="4">4th Year+</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Required Skills (Comma separated) *</label>
              <input
                type="text" required name="req_skills" value={formData.req_skills} onChange={handleChange} placeholder="e.g. React, Node.js, SQL, Docker"
                className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="md:col-span-3">
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Detailed Job Description *</label>
              <textarea
                required name="description" rows="5" value={formData.description} onChange={handleChange} placeholder="Describe daily duties, requirements, tech stacks, and interview workflow details..."
                className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#1e2d45]/50">
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <PlusCircle size={15} /> Publish Campaign Drive
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
