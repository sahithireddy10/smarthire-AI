// src/pages/company/MyDrives.jsx
import React, { useState, useMemo } from 'react'
import { getDrives, updateItem, deleteItem, getApplications } from '../../utils/storage'
import { useToast } from '../../hooks/useToast'
import { Briefcase, Users, Calendar, ShieldCheck, ShieldAlert, Edit, Trash2, Check, X } from 'lucide-react'

export default function MyDrives({ company }) {
  const { success, error } = useToast();
  const [editingId, setEditingId] = useState(null);
  
  // Edit Form state
  const [editForm, setEditForm] = useState({
    title: '', role: '', location: '', salary: '', deadline: '', req_cgpa: '', req_skills: '', req_year: 4, req_degree: 'B.Tech', description: ''
  });

  const drivesWithCounts = useMemo(() => {
    const list = getDrives().filter(d => d.company_id === company.id);
    const apps = getApplications();

    return list.map(drive => {
      const applicantCount = apps.filter(a => a.drive_id === drive.id).length;
      return {
        ...drive,
        applicantCount
      };
    });
  }, [company.id]);

  const handleStatusToggle = (drive) => {
    const nextStatus = drive.status === "active" ? "closed" : "active";
    const ok = updateItem("smarthire_drives", drive.id, {
      ...drive,
      status: nextStatus
    });

    if (ok) {
      success(`Drive status updated to ${nextStatus}!`);
      window.location.reload();
    } else {
      error("Failed to update status.");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this drive? All applications linked will be orphaned.")) {
      const ok = deleteItem("smarthire_drives", id);
      if (ok) {
        success("Drive deleted successfully!");
        window.location.reload();
      } else {
        error("Failed to delete drive.");
      }
    }
  };

  const startEdit = (drive) => {
    setEditingId(drive.id);
    setEditForm({
      title: drive.title || '',
      role: drive.role || '',
      location: drive.location || '',
      salary: drive.salary || '',
      deadline: drive.deadline || '',
      req_cgpa: drive.req_cgpa || '',
      req_skills: drive.req_skills || '',
      req_year: drive.req_year || 4,
      req_degree: drive.req_degree || 'B.Tech',
      description: drive.description || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleEditSubmit = (e, drive) => {
    e.preventDefault();
    const updated = {
      ...drive,
      ...editForm,
      salary: parseFloat(editForm.salary) || 0,
      req_cgpa: parseFloat(editForm.req_cgpa) || 0,
      req_year: parseInt(editForm.req_year, 10) || 0
    };

    const ok = updateItem("smarthire_drives", drive.id, updated);
    if (ok) {
      success("Drive updated successfully!");
      setEditingId(null);
      window.location.reload();
    } else {
      error("Failed to update drive.");
    }
  };

  return (
    <div className="space-y-8 animate-slide-in">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white font-sora">My Recruitment Drives</h1>
        <p className="text-xs text-slate-400 mt-1">Manage active campaigns, updates descriptions, or close postings.</p>
      </div>

      {/* Drives Grid */}
      <div className="grid grid-cols-1 gap-6">
        {drivesWithCounts.length === 0 ? (
          <div className="text-center py-16 border border-[#1e2d45]/50 border-dashed bg-[#111827] rounded-2xl">
            <Briefcase size={40} className="text-slate-500 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-300">No recruitment drives posted yet</p>
            <p className="text-xs text-slate-500 mt-1">Click Post Drive in the sidebar to create your first placement campaign.</p>
          </div>
        ) : (
          drivesWithCounts.map((drive) => {
            const isEditing = editingId === drive.id;
            return (
              <div 
                key={drive.id}
                className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 shadow-xl space-y-4 hover:border-slate-700 transition-all"
              >
                {!isEditing ? (
                  // View mode
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-base font-bold font-sora text-white">{drive.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 ${
                          drive.status === 'active' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {drive.status === 'active' ? <ShieldCheck size={11} /> : <ShieldAlert size={11} />}
                          {drive.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{drive.role} &bull; {drive.location} &bull; {drive.salary} LPA</p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-400 pt-2 font-medium">
                        <span className="flex items-center gap-1"><Users size={14} className="text-indigo-400" /> {drive.applicantCount} Applicants</span>
                        <span className="flex items-center gap-1"><Calendar size={14} className="text-violet-400" /> Deadline: {new Date(drive.deadline).toLocaleDateString()}</span>
                        <span><strong>Min CGPA:</strong> {drive.req_cgpa}</span>
                        <span><strong>Degree:</strong> {drive.req_degree || "Any"}</span>
                      </div>

                      <div className="pt-2">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Description</span>
                        <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line mt-1">{drive.description}</p>
                      </div>

                      <div className="pt-2">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Required Skills</span>
                        <p className="text-xs text-slate-400 mt-1">{drive.req_skills}</p>
                      </div>
                    </div>

                    {/* Right button Actions */}
                    <div className="flex sm:flex-col gap-2 shrink-0 self-start sm:self-auto w-full sm:w-auto">
                      <button
                        onClick={() => handleStatusToggle(drive)}
                        className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                          drive.status === 'active'
                            ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-600 hover:text-white'
                            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-600 hover:text-white'
                        }`}
                      >
                        {drive.status === 'active' ? "Close Campaign" : "Activate Campaign"}
                      </button>

                      <button
                        onClick={() => startEdit(drive)}
                        className="flex-grow sm:flex-none px-4 py-2 text-xs font-bold rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all flex items-center justify-center gap-1.5"
                      >
                        <Edit size={13} /> Edit Details
                      </button>

                      <button
                        onClick={() => handleDelete(drive.id)}
                        className="p-2 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-600 hover:text-white transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  // Edit mode
                  <form onSubmit={(e) => handleEditSubmit(e, drive)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Drive Title *</label>
                        <input type="text" required value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-3 py-2 text-xs text-white" />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Role Title *</label>
                        <input type="text" required value={editForm.role} onChange={(e) => setEditForm({...editForm, role: e.target.value})} className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-3 py-2 text-xs text-white" />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Location *</label>
                        <input type="text" required value={editForm.location} onChange={(e) => setEditForm({...editForm, location: e.target.value})} className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-3 py-2 text-xs text-white" />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Salary Package (LPA) *</label>
                        <input type="number" step="0.1" required value={editForm.salary} onChange={(e) => setEditForm({...editForm, salary: e.target.value})} className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-3 py-2 text-xs text-white" />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Application Deadline *</label>
                        <input type="date" required value={editForm.deadline} onChange={(e) => setEditForm({...editForm, deadline: e.target.value})} className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-3 py-2 text-xs text-white" />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Min CGPA Cutoff *</label>
                        <input type="number" step="0.1" required value={editForm.req_cgpa} onChange={(e) => setEditForm({...editForm, req_cgpa: e.target.value})} className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-3 py-2 text-xs text-white" />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Req Degree *</label>
                        <select value={editForm.req_degree} onChange={(e) => setEditForm({...editForm, req_degree: e.target.value})} className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-3 py-2 text-xs text-white">
                          <option value="B.Tech">B.Tech</option>
                          <option value="M.Tech">M.Tech</option>
                          <option value="MBA">MBA</option>
                          <option value="BCA">BCA</option>
                          <option value="MCA">MCA</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Target Academic Year *</label>
                        <select value={editForm.req_year} onChange={(e) => setEditForm({...editForm, req_year: e.target.value})} className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-3 py-2 text-xs text-white">
                          <option value="0">Any Year</option>
                          <option value="1">1st Year+</option>
                          <option value="2">2nd Year+</option>
                          <option value="3">3rd Year+</option>
                          <option value="4">4th Year+</option>
                        </select>
                      </div>
                      <div className="md:col-span-3">
                        <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Required Skills (Comma separated) *</label>
                        <input type="text" required value={editForm.req_skills} onChange={(e) => setEditForm({...editForm, req_skills: e.target.value})} className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-3 py-2 text-xs text-white" />
                      </div>
                      <div className="md:col-span-3">
                        <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Detailed Description *</label>
                        <textarea rows="4" required value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl p-3 text-xs text-white resize-none" />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="px-4 py-2 border border-slate-700 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl transition-all flex items-center gap-1"
                      >
                        <X size={14} /> Cancel
                      </button>
                      
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1"
                      >
                        <Check size={14} /> Save Changes
                      </button>
                    </div>
                  </form>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
