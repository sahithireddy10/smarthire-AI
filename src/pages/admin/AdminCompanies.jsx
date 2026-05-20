// src/pages/admin/AdminCompanies.jsx
import React, { useMemo } from 'react'
import { getCompanies, getDrives, deleteItem, getApplications } from '../../utils/storage'
import { useToast } from '../../hooks/useToast'
import { Building2, Globe, Mail, Briefcase, Trash2 } from 'lucide-react'

export default function AdminCompanies() {
  const { success, error } = useToast();

  const companiesList = useMemo(() => {
    const list = getCompanies();
    const drives = getDrives();

    return list.map(comp => {
      const drivesPosted = drives.filter(d => d.company_id === comp.id).length;
      return {
        ...comp,
        drivesPosted
      };
    });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this company account? All their posted job drives and student applications will be wiped.")) {
      const ok = deleteItem("smarthire_companies", id);
      if (ok) {
        // Clean up drives
        const drives = getDrives();
        const drivesToDelete = drives.filter(d => d.company_id === id);
        const driveIdsToDelete = new Set(drivesToDelete.map(d => d.id));
        
        const remainingDrives = drives.filter(d => d.company_id !== id);
        localStorage.setItem("smarthire_drives", JSON.stringify(remainingDrives));

        // Clean up applications
        const apps = getApplications();
        const remainingApps = apps.filter(a => !driveIdsToDelete.has(a.drive_id));
        localStorage.setItem("smarthire_applications", JSON.stringify(remainingApps));

        success("Company account and all related records deleted!");
        window.location.reload();
      } else {
        error("Failed to delete company account.");
      }
    }
  };

  return (
    <div className="space-y-8 animate-slide-in">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white font-sora">Employer Partners</h1>
        <p className="text-xs text-slate-400 mt-1">Manage corporate engagement, listings, and recruitment portals status.</p>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companiesList.length === 0 ? (
          <div className="col-span-full text-center py-12 border border-[#1e2d45]/50 bg-[#111827] rounded-2xl">
            <p className="text-xs text-slate-500">No partner companies registered yet.</p>
          </div>
        ) : (
          companiesList.map((comp) => (
            <div 
              key={comp.id}
              className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
                    <Building2 size={20} />
                  </div>
                  
                  <button
                    onClick={() => handleDelete(comp.id)}
                    className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-bold font-sora text-white">{comp.name}</h3>
                  <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider mt-0.5">{comp.industry || "General Industry"}</p>
                </div>

                <div className="space-y-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5"><Globe size={13} className="text-slate-500" /> <a href={comp.website} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">{comp.website}</a></span>
                  <span className="flex items-center gap-1.5"><Mail size={13} className="text-slate-500" /> {comp.email}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#1e2d45]/60 flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400"><Briefcase size={14} className="text-cyan-400" /> Job Postings:</span>
                <span className="font-bold text-white font-sora">{comp.drivesPosted} campaigns</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
