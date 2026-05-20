// src/pages/admin/AdminDrives.jsx
import React, { useMemo, useState } from 'react'
import { getDrives, getCompanies, deleteItem, getApplications } from '../../utils/storage'
import { useToast } from '../../hooks/useToast'
import { Badge } from '../../components/ui/Badge'
import { Briefcase, Building2, Trash2, Calendar, ShieldCheck, ShieldAlert } from 'lucide-react'

export default function AdminDrives() {
  const { success, error } = useToast();
  const [selectedCompanyId, setSelectedCompanyId] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const companies = useMemo(() => getCompanies(), []);
  const companiesMap = useMemo(() => {
    const map = {};
    companies.forEach(c => { map[c.id] = c; });
    return map;
  }, [companies]);

  const drivesList = useMemo(() => {
    const list = getDrives();
    return list.map(d => ({
      ...d,
      companyName: companiesMap[d.company_id]?.name || 'Partner Recruiter'
    }));
  }, [companiesMap]);

  // Apply filters
  const filteredDrives = useMemo(() => {
    let result = [...drivesList];

    if (selectedCompanyId !== 'all') {
      result = result.filter(d => d.company_id === selectedCompanyId);
    }

    if (selectedStatus !== 'all') {
      result = result.filter(d => d.status === selectedStatus);
    }

    return result;
  }, [drivesList, selectedCompanyId, selectedStatus]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this job drive? Student applications linked will be wiped.")) {
      const ok = deleteItem("smarthire_drives", id);
      if (ok) {
        // Clean up applications
        const apps = getApplications();
        const remainingApps = apps.filter(a => a.drive_id !== id);
        localStorage.setItem("smarthire_applications", JSON.stringify(remainingApps));

        success("Placement drive removed!");
        window.location.reload();
      } else {
        error("Failed to delete drive.");
      }
    }
  };

  return (
    <div className="space-y-8 animate-slide-in">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white font-sora">Placement Drives Directory</h1>
        <p className="text-xs text-slate-400 mt-1">Review active and closed recruitment drives across partner employers.</p>
      </div>

      {/* Filters */}
      <div className="p-6 bg-[#111827] border border-[#1e2d45] rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div>
          <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1.5">Company</label>
          <select
            value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value)}
            className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="all">All Recruiters</option>
            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1.5">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="all">All Drives</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Drives List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDrives.length === 0 ? (
          <div className="col-span-full text-center py-12 border border-[#1e2d45]/50 bg-[#111827] rounded-2xl">
            <p className="text-xs text-slate-500">No matching placement campaigns found.</p>
          </div>
        ) : (
          filteredDrives.map((drive) => (
            <div 
              key={drive.id}
              className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold font-sora text-white">{drive.title}</h3>
                    <span className="text-[11px] text-indigo-400 font-semibold block mt-0.5">{drive.companyName}</span>
                  </div>
                  
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase flex items-center gap-1 ${
                    drive.status === 'active' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {drive.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 py-1.5 border-t border-b border-[#1e2d45]/40">
                  <div><strong>LPA Package:</strong> {drive.salary} LPA</div>
                  <div><strong>Location:</strong> {drive.location}</div>
                  <div><strong>Min CGPA:</strong> {drive.req_cgpa}</div>
                  <div><strong>Min Year:</strong> Year {drive.req_year}</div>
                </div>

                <div className="text-xs text-slate-400">
                  <strong>Required Skills:</strong>
                  <p className="mt-1 text-[#e2e8f0] truncate">{drive.req_skills}</p>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="flex items-center gap-1 text-[10px] text-slate-500"><Calendar size={13} /> {new Date(drive.deadline).toLocaleDateString()}</span>
                
                <button
                  onClick={() => handleDelete(drive.id)}
                  className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 hover:bg-red-600 hover:text-white rounded-xl text-[10px] font-bold text-red-400 transition-all flex items-center gap-1"
                >
                  <Trash2 size={12} /> Remove Posting
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
