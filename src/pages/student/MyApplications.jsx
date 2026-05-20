// src/pages/student/MyApplications.jsx
import React, { useMemo } from 'react'
import { getApplications, getDrives, getCompanies } from '../../utils/storage'
import { Badge } from '../../components/ui/Badge'
import { ScoreBar } from '../../components/ui/ScoreBar'
import { FileText, Clock, FileCheck, CheckCircle2, XCircle } from 'lucide-react'

export default function MyApplications({ student }) {
  const drivesMap = useMemo(() => {
    const list = getDrives();
    const map = {};
    list.forEach(d => {
      map[d.id] = d;
    });
    return map;
  }, []);

  const companiesMap = useMemo(() => {
    const list = getCompanies();
    const map = {};
    list.forEach(c => {
      map[c.id] = c;
    });
    return map;
  }, []);

  const studentApps = useMemo(() => {
    const allApps = getApplications();
    const filtered = allApps.filter(app => app.student_id === student.id);
    
    return filtered.map(app => {
      const drive = drivesMap[app.drive_id] || {};
      const company = companiesMap[drive.company_id] || { name: "Unknown Corporate" };

      return {
        ...app,
        title: drive.title || "Job Position",
        role: drive.role || "",
        companyName: company.name,
        salary: drive.salary || 0
      };
    }).sort((a, b) => new Date(b.applied_on) - new Date(a.applied_on));
  }, [student.id, drivesMap, companiesMap]);

  // Calculations for pipeline header
  const pipelineStats = useMemo(() => {
    const stats = {
      total: studentApps.length,
      applied: 0,
      test: 0,
      interview: 0,
      selected: 0,
      rejected: 0
    };

    studentApps.forEach(app => {
      if (stats[app.status] !== undefined) {
        stats[app.status]++;
      }
    });

    return stats;
  }, [studentApps]);

  return (
    <div className="space-y-8 animate-slide-in">
      {/* Introduction */}
      <div>
        <h1 className="text-2xl font-bold text-white font-sora">My Applications</h1>
        <p className="text-xs text-slate-400 mt-1">Track your progress through selection rounds.</p>
      </div>

      {/* Pipeline Header Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-[#111827] border border-[#1e2d45] rounded-xl p-4 text-center">
          <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Total applications</span>
          <span className="text-xl font-bold font-sora text-white">{pipelineStats.total}</span>
        </div>
        <div className="bg-[#111827] border border-[#1e2d45] rounded-xl p-4 text-center">
          <span className="text-[10px] text-blue-400 font-bold uppercase block mb-1">Applied</span>
          <span className="text-xl font-bold font-sora text-blue-400">{pipelineStats.applied}</span>
        </div>
        <div className="bg-[#111827] border border-[#1e2d45] rounded-xl p-4 text-center">
          <span className="text-[10px] text-purple-400 font-bold uppercase block mb-1">Aptitude test</span>
          <span className="text-xl font-bold font-sora text-purple-400">{pipelineStats.test}</span>
        </div>
        <div className="bg-[#111827] border border-[#1e2d45] rounded-xl p-4 text-center">
          <span className="text-[10px] text-amber-400 font-bold uppercase block mb-1">Interviewing</span>
          <span className="text-xl font-bold font-sora text-amber-400">{pipelineStats.interview}</span>
        </div>
        <div className="bg-[#111827] border border-[#1e2d45] rounded-xl p-4 text-center">
          <span className="text-[10px] text-emerald-400 font-bold uppercase block mb-1">Selected</span>
          <span className="text-xl font-bold font-sora text-emerald-400">{pipelineStats.selected}</span>
        </div>
        <div className="bg-[#111827] border border-[#1e2d45] rounded-xl p-4 text-center">
          <span className="text-[10px] text-red-400 font-bold uppercase block mb-1">Rejected</span>
          <span className="text-xl font-bold font-sora text-red-400">{pipelineStats.rejected}</span>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1a2236]/40 border-b border-[#1e2d45] text-[#94a3b8] font-semibold font-sora uppercase">
                <th className="p-4 pl-6">Company & Position</th>
                <th className="p-4">Applied On</th>
                <th className="p-4">Salary Package</th>
                <th className="p-4">AI Score</th>
                <th className="p-4 pr-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2d45]/50 text-slate-300">
              {studentApps.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-500 font-semibold">
                    <FileText size={40} className="text-slate-600 mx-auto mb-3" />
                    You haven't applied to any drives yet.
                  </td>
                </tr>
              ) : (
                studentApps.map((app) => (
                  <tr key={app.id} className="hover:bg-[#1a2236]/25 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-bold text-white text-sm">{app.companyName}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{app.title} &bull; {app.role}</div>
                    </td>
                    <td className="p-4 text-slate-400">
                      {new Date(app.applied_on).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-bold text-slate-200">
                      {app.salary} LPA
                    </td>
                    <td className="p-4 max-w-[120px]">
                      <ScoreBar score={app.ai_score} />
                    </td>
                    <td className="p-4 pr-6">
                      <Badge status={app.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
