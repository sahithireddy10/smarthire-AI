// src/pages/admin/AdminStudents.jsx
import React, { useState, useMemo } from 'react'
import { getStudents, deleteItem, getApplications } from '../../utils/storage'
import { useToast } from '../../hooks/useToast'
import { Modal } from '../../components/ui/Modal'
import { Search, Eye, Trash2, GraduationCap, Mail, Phone, Calendar } from 'lucide-react'

export default function AdminStudents() {
  const { success, error } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  
  // Modal details state
  const [selectedStudent, setSelectedStudent] = useState(null);

  const studentsList = useMemo(() => getStudents(), []);

  // Filter list
  const filteredStudents = useMemo(() => {
    let result = [...studentsList];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.skills && s.skills.toLowerCase().includes(q))
      );
    }

    if (selectedBranch !== 'all') {
      result = result.filter(s => s.branch === selectedBranch);
    }

    return result;
  }, [studentsList, searchQuery, selectedBranch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this student account? This will remove all their placement submissions.")) {
      const ok = deleteItem("smarthire_students", id);
      if (ok) {
        // Clean up applications
        const apps = getApplications();
        const remainingApps = apps.filter(a => a.student_id !== id);
        localStorage.setItem("smarthire_applications", JSON.stringify(remainingApps));

        success("Student profile and application history deleted!");
        window.location.reload();
      } else {
        error("Failed to delete student account.");
      }
    }
  };

  return (
    <div className="space-y-8 animate-slide-in">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white font-sora">Student Directory</h1>
        <p className="text-xs text-slate-400 mt-1">Review campus candidates profiles, credentials, and portfolios.</p>
      </div>

      {/* Filters */}
      <div className="p-6 bg-[#111827] border border-[#1e2d45] rounded-2xl flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1.5">Search Students</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500"><Search size={14} /></span>
            <input
              type="text"
              placeholder="Search name, email, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="w-full sm:w-48">
          <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1.5">Branch</label>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="all">All Branches</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="IT">IT</option>
            <option value="ME">ME</option>
            <option value="CE">CE</option>
            <option value="EEE">EEE</option>
          </select>
        </div>
      </div>

      {/* Student Registry Table */}
      <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1a2236]/40 border-b border-[#1e2d45] text-[#94a3b8] font-semibold uppercase tracking-wider">
                <th className="p-4 pl-6">Student details</th>
                <th className="p-4">Academics</th>
                <th className="p-4">Skill Stack Inventory</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2d45]/50 text-slate-300">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-12 text-center text-slate-500">
                    No registered student records found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-[#1a2236]/25 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-bold text-white text-sm">{s.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{s.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-200">{s.degree} &bull; {s.branch}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">CGPA: {s.cgpa} &bull; Year {s.year}</div>
                    </td>
                    <td className="p-4 max-w-xs truncate" title={s.skills}>
                      <span className="text-slate-300 font-medium">{s.skills || 'No skills declared'}</span>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button
                        onClick={() => setSelectedStudent(s)}
                        className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:text-white transition-colors"
                      >
                        <Eye size={14} />
                      </button>

                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/15 text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* STUDENT PROFILE DETAILS MODAL */}
      <Modal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title="Student Profile Details"
      >
        {selectedStudent && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b border-[#1e2d45]/60 pb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center font-bold text-indigo-400 text-lg">
                {selectedStudent.name[0]}
              </div>
              <div>
                <h3 className="text-base font-bold font-sora text-white">{selectedStudent.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedStudent.degree} &bull; {selectedStudent.branch} (Year {selectedStudent.year})</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center p-4 bg-[#0a0e1a]/40 border border-[#1e2d45]/50 rounded-xl">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Cumulative CGPA</span>
                <span className="text-sm font-bold text-white font-sora">{selectedStudent.cgpa} / 10</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">12th Grade %</span>
                <span className="text-sm font-bold text-white font-sora">{selectedStudent.p12 || "85.0"}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">10th Grade %</span>
                <span className="text-sm font-bold text-white font-sora">{selectedStudent.p10 || "90.0"}%</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Profile Contacts</span>
              <div className="grid grid-cols-2 gap-4 text-slate-300">
                <span className="flex items-center gap-1.5"><Mail size={13} className="text-slate-400" /> {selectedStudent.email}</span>
                <span className="flex items-center gap-1.5"><Phone size={13} className="text-slate-400" /> {selectedStudent.phone || 'N/A'}</span>
                <span className="flex items-center gap-1.5"><Calendar size={13} className="text-slate-400" /> Born: {selectedStudent.dob || 'N/A'}</span>
              </div>
            </div>

            {selectedStudent.bio && (
              <div className="space-y-2 text-xs">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Bio Description</span>
                <p className="text-slate-400 leading-relaxed text-justify">{selectedStudent.bio}</p>
              </div>
            )}

            <div className="space-y-2 text-xs">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Declared Tech Skills</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedStudent.skills?.split(',').map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-[#1a2236] border border-[#1e2d45] text-slate-300 rounded font-semibold text-[11px]"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#1e2d45]/60">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
              >
                Close Profile
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
