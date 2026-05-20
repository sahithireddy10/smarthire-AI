// src/pages/register/CompanyRegister.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCompanies, addItem } from '../../utils/storage'
import { useToast } from '../../hooks/useToast'
import { ArrowLeft, Building2, Mail, Lock, Phone, Globe, MapPin, Briefcase } from 'lucide-react'

export default function CompanyRegister() {
  const [formData, setFormData] = useState({
    name: '', email: '', pwd: '', phone: '',
    location: '', industry: 'Technology', website: '', about: ''
  });

  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const companies = getCompanies();

    // Check if email already registered
    const exists = companies.some(c => c.email.toLowerCase().trim() === formData.email.toLowerCase().trim());
    if (exists) {
      error("Email already registered!");
      return;
    }

    const newCompany = {
      ...formData,
      id: "com_" + Date.now(),
      created: new Date().toISOString()
    };

    addItem("smarthire_companies", newCompany);
    success("Company registered! You can now log in.");
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

      <div className="w-full max-w-xl bg-[#111827] border border-[#1e2d45] rounded-2xl shadow-2xl p-8 relative z-10 animate-slide-in">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold font-sora text-white">Company Partnerships</h2>
          <p className="text-xs text-slate-400 mt-2">Partner with our campus recruitment engine to hire vetted talent.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Company Name *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><Building2 size={15} /></span>
                <input
                  type="text" required name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Google India"
                  className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">HR / Campus Contact Email *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><Mail size={15} /></span>
                <input
                  type="email" required name="email" value={formData.email} onChange={handleChange} placeholder="e.g. campus@google.com"
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
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Official Contact Phone *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><Phone size={15} /></span>
                <input
                  type="text" required name="phone" value={formData.phone} onChange={handleChange} placeholder="Landline or Mobile"
                  className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Headquarters Location *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><MapPin size={15} /></span>
                <input
                  type="text" required name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Bangalore, India"
                  className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Industry Segment *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><Briefcase size={15} /></span>
                <select
                  name="industry" value={formData.industry} onChange={handleChange}
                  className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500"
                >
                  <option value="Technology">Technology</option>
                  <option value="IT Services">IT Services</option>
                  <option value="Finance & Fintech">Finance & Fintech</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Healthcare">Healthcare</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Company Website URL</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><Globe size={15} /></span>
                <input
                  type="url" name="website" value={formData.website} onChange={handleChange} placeholder="e.g. https://google.com"
                  className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">About Corporate / Core Mission *</label>
              <textarea
                required name="about" rows="3" value={formData.about} onChange={handleChange} placeholder="Write brief description of company history, products, and culture..."
                className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-indigo-500 resize-none"
              />
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
