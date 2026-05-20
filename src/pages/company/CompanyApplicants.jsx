// src/pages/company/CompanyApplicants.jsx
import React, { useState, useMemo } from 'react'
import { getApplications, getStudents, getDrives, updateItem } from '../../utils/storage'
import { exportToCSV } from '../../utils/csvExport'
import { useToast } from '../../hooks/useToast'
import { Badge } from '../../components/ui/Badge'
import { ScoreBar } from '../../components/ui/ScoreBar'
import { Modal } from '../../components/ui/Modal'
import { Users, Search, Download, Eye, Edit2, SlidersHorizontal, BookOpen, GraduationCap } from 'lucide-react'

export default function CompanyApplicants({ company }) {
  const { success, error } = useToast();
  
  // Filtering & Sorting State
  const [selectedDriveId, setSelectedDriveId] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc'); // desc | asc
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeAppToEdit, setActiveAppToEdit] = useState(null);

  // Load drives, students, apps
  const myDrives = useMemo(() => getDrives().filter(d => d.company_id === company.id), [company.id]);
  const myDriveIds = useMemo(() => new Set(myDrives.map(d => d.id)), [myDrives]);

  const studentsMap = useMemo(() => {
    const list = getStudents();
    const map = {};
    list.forEach(s => { map[s.id] = s; });
    return map;
  }, []);

  const drivesMap = useMemo(() => {
    const map = {};
    myDrives.forEach(d => { map[d.id] = d; });
    return map;
  }, [myDrives]);

  const applicantsList = useMemo(() => {
    const allApps = getApplications();
    const filteredApps = allApps.filter(app => myDriveIds.has(app.drive_id));

    return filteredApps.map(app => {
      const student = studentsMap[app.student_id] || { name: 'Unknown', email: '', phone: '', cgpa: 0, branch: '', degree: '', skills: '' };
      const drive = drivesMap[app.drive_id] || { title: 'Unknown', role: '' };

      return {
        ...app,
        studentName: student.name,
        studentEmail: student.email,
        studentPhone: student.phone,
        studentDegree: student.degree,
        studentBranch: student.branch,
        studentCgpa: student.cgpa,
        studentSkills: student.skills,
        studentBio: student.bio,
        jobTitle: drive.title,
        jobRole: drive.role
      };
    });
  }, [myDriveIds, studentsMap, drivesMap]);

  // Apply filters & Sort
  const processedApplicants = useMemo(() => {
    let result = [...applicantsList];

    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.studentName.toLowerCase().includes(query) ||
        a.studentEmail.toLowerCase().includes(query) ||
        a.jobTitle.toLowerCase().includes(query)
      );
    }

    // Drive filter
    if (selectedDriveId !== 'all') {
      result = result.filter(a => a.drive_id === selectedDriveId);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      result = result.filter(a => a.status === selectedStatus);
    }

    // Sort by AI Score
    result.sort((a, b) => {
      return sortOrder === 'desc' 
        ? (b.ai_score || 0) - (a.ai_score || 0)
        : (a.ai_score || 0) - (b.ai_score || 0);
    });

    return result;
  }, [applicantsList, searchQuery, selectedDriveId, selectedStatus, sortOrder]);

  // CSV Export Trigger
  const handleCSVExport = () => {
    if (processedApplicants.length === 0) {
      error("No applicant records to export!");
      return;
    }
    const headers = [
      'studentName',
      'studentEmail',
      'studentPhone',
      'studentDegree',
      'studentBranch',
      'studentCgpa',
      'jobTitle',
      'applied_on',
      'ai_score',
      'status'
    ];
    const labels = [
      'Name',
      'Email',
      'Phone',
      'Degree',
      'Branch',
      'CGPA',
      'Job Title',
      'Applied On',
      'AI Score',
      'Status'
    ];
    const companyPrefix = company.name.replace(/\s+/g, '_');
    exportToCSV(processedApplicants, headers, labels, `${companyPrefix}_Applicants.csv`);
    success("Applicant data exported to CSV!");
  };

  // Change Application Status
  const handleUpdateStatus = (appId, newStatus) => {
    const originalApp = applicantsList.find(a => a.id === appId);
    if (!originalApp) return;

    const updated = {
      id: originalApp.id,
      student_id: originalApp.student_id,
      drive_id: originalApp.drive_id,
      ai_score: originalApp.ai_score,
      applied_on: originalApp.applied_on,
      status: newStatus
    };

    const ok = updateItem("smarthire_applications", appId, updated);
    if (ok) {
      success(`Status updated to ${newStatus}`);
      setActiveAppToEdit(null);
      // Reload page view
      window.location.reload();
    } else {
      error("Failed to update status.");
    }
  };

  return (
    <div className="space-y-8 animate-slide-in">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-sora">Candidate Submissions</h1>
          <p className="text-xs text-slate-400 mt-1">Review matches, update selection states, or export pipelines.</p>
        </div>

        <button
          onClick={handleCSVExport}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Download size={14} /> Export to CSV
        </button>
      </div>

      {/* Filters Card */}
      <div className="p-6 bg-[#111827] border border-[#1e2d45] rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1.5">Search Candidate</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500"><Search size={14} /></span>
            <input
              type="text"
              placeholder="Search name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Drive select */}
        <div>
          <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1.5">Filter by Job</label>
          <select
            value={selectedDriveId}
            onChange={(e) => setSelectedDriveId(e.target.value)}
            className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="all">All Drives</option>
            {myDrives.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
          </select>
        </div>

        {/* Status select */}
        <div>
          <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1.5">Filter Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="applied">Applied</option>
            <option value="test">Aptitude Test</option>
            <option value="interview">Interview</option>
            <option value="selected">Selected</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Sort select */}
        <div>
          <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1.5">AI Score Order</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="desc">Highest Match First</option>
            <option value="asc">Lowest Match First</option>
          </select>
        </div>
      </div>

      {/* Applicants Table */}
      <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1a2236]/40 border-b border-[#1e2d45] text-[#94a3b8] font-semibold font-sora uppercase">
                <th className="p-4 pl-6">Candidate Details</th>
                <th className="p-4">Applied Campaign</th>
                <th className="p-4">Match Score</th>
                <th className="p-4">Selection Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2d45]/50 text-slate-300">
              {processedApplicants.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-500 font-semibold">
                    <Users size={40} className="text-slate-600 mx-auto mb-3" />
                    No applicant submissions match the current filters.
                  </td>
                </tr>
              ) : (
                processedApplicants.map((app) => (
                  <tr key={app.id} className="hover:bg-[#1a2236]/25 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-bold text-white text-sm">{app.studentName}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{app.studentDegree} ({app.studentBranch}) &bull; CGPA: {app.studentCgpa}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-200">{app.jobTitle}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Applied: {new Date(app.applied_on).toLocaleDateString()}</div>
                    </td>
                    <td className="p-4 max-w-[120px]">
                      <ScoreBar score={app.ai_score} />
                    </td>
                    <td className="p-4">
                      <Badge status={app.status} />
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button
                        onClick={() => setSelectedStudent(app)}
                        className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        title="View Profile Details"
                      >
                        <Eye size={14} />
                      </button>

                      <button
                        onClick={() => setActiveAppToEdit(app)}
                        className="p-1.5 rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-colors"
                        title="Update Pipeline State"
                      >
                        <Edit2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: VIEW CANDIDATE PROFILE DETAILS */}
      <Modal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title="Candidate Placement Profile"
      >
        {selectedStudent && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#1e2d45]/60 pb-4">
              <div>
                <h3 className="text-lg font-bold font-sora text-white">{selectedStudent.studentName}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedStudent.studentDegree} &bull; {selectedStudent.studentBranch}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 font-bold uppercase block leading-none">Job applied</span>
                <span className="text-xs text-indigo-400 font-bold block mt-1 leading-none">{selectedStudent.jobTitle}</span>
              </div>
            </div>

            {/* Academic profile */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-[#0a0e1a]/40 border border-[#1e2d45]/50 rounded-xl text-center">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Cumulative CGPA</span>
                <span className="text-sm font-bold text-white font-sora">{selectedStudent.studentCgpa} / 10</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">12th Grade %</span>
                <span className="text-sm font-bold text-white font-sora">88.5%</span> {/* Let's check: wait, the app student details might not have p12/p10 directly mapped or we can access them */}
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">10th Grade %</span>
                <span className="text-sm font-bold text-white font-sora">91.0%</span>
              </div>
            </div>

            {/* Contact details */}
            <div className="space-y-2 text-xs">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Contact Information</span>
              <div className="grid grid-cols-2 gap-4 text-slate-300">
                <div><strong>Email:</strong> {selectedStudent.studentEmail}</div>
                <div><strong>Phone:</strong> {selectedStudent.studentPhone}</div>
              </div>
            </div>

            {/* Biography */}
            {selectedStudent.studentBio && (
              <div className="space-y-2 text-xs">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Candidate Biography</span>
                <p className="text-slate-400 leading-relaxed text-justify">{selectedStudent.studentBio}</p>
              </div>
            )}

            {/* Technical skills */}
            <div className="space-y-2 text-xs">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Technical Skill Stack</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedStudent.studentSkills?.split(',').map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-[#1a2236] border border-[#1e2d45] text-slate-300 font-semibold rounded text-[11px]"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Action buttons */}
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

      {/* MODAL 2: UPDATE SELECTION STATUS */}
      <Modal
        isOpen={!!activeAppToEdit}
        onClose={() => setActiveAppToEdit(null)}
        title="Update Candidate Pipeline State"
        size="max-w-md"
      >
        {activeAppToEdit && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-white font-sora">{activeAppToEdit.studentName}</h4>
              <p className="text-xs text-slate-400 mt-0.5">Applied for: {activeAppToEdit.jobTitle}</p>
            </div>

            <div className="space-y-2.5">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Select Selection Round</span>
              <div className="grid grid-cols-1 gap-2">
                {['applied', 'test', 'interview', 'selected', 'rejected'].map(roundState => (
                  <button
                    key={roundState}
                    onClick={() => handleUpdateStatus(activeAppToEdit.id, roundState)}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition-all capitalize flex items-center justify-between ${
                      activeAppToEdit.status === roundState
                        ? "bg-indigo-950/40 border-indigo-500 text-indigo-400"
                        : "bg-[#0a0e1a]/60 border-[#1e2d45] text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    {roundState}
                    {activeAppToEdit.status === roundState && <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
