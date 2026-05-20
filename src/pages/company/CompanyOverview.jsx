// src/pages/company/CompanyOverview.jsx
import React, { useMemo } from 'react'
import { getDrives, getApplications } from '../../utils/storage'
import { StatCard } from '../../components/ui/StatCard'
import { Briefcase, Users, CheckCircle, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function CompanyOverview({ company }) {
  const metrics = useMemo(() => {
    const drives = getDrives().filter(d => d.company_id === company.id);
    const driveIds = new Set(drives.map(d => d.id));
    
    const apps = getApplications().filter(a => driveIds.has(a.drive_id));
    
    const totalDrives = drives.length;
    const totalApps = apps.length;
    const hired = apps.filter(a => a.status === "selected").length;
    
    // Average Match Quality
    let totalScore = 0;
    apps.forEach(a => { totalScore += a.ai_score || 0; });
    const avgScore = totalApps > 0 ? Math.round(totalScore / totalApps) : 0;

    // Chart Data mapping: Applicants per Drive
    const chartData = drives.map(drive => {
      const count = apps.filter(a => a.drive_id === drive.id).length;
      return {
        name: drive.title.length > 15 ? drive.title.substring(0, 15) + '...' : drive.title,
        Applicants: count
      };
    });

    return {
      totalDrives,
      totalApps,
      hired,
      avgScore,
      chartData,
      drives
    };
  }, [company.id]);

  return (
    <div className="space-y-8 animate-slide-in">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white font-sora">Recruiter Console</h1>
        <p className="text-xs text-slate-400 mt-1">Review active drives, applicants statistics, and placement statuses.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Jobs Posted" 
          value={metrics.totalDrives} 
          subtext="Total active recruitment drives" 
          icon={Briefcase} 
          colorClass="text-indigo-400 border-indigo-500/20" 
        />
        <StatCard 
          title="Total Applicants" 
          value={metrics.totalApps} 
          subtext="Submissions received" 
          icon={Users} 
          colorClass="text-cyan-400 border-cyan-500/20" 
        />
        <StatCard 
          title="Selected Candidates" 
          value={metrics.hired} 
          subtext="Offer letters secured" 
          icon={CheckCircle} 
          colorClass="text-emerald-400 border-emerald-500/20" 
        />
        <StatCard 
          title="Avg Match Strength" 
          value={`${metrics.avgScore}%`} 
          subtext="Applicant average AI score" 
          icon={TrendingUp} 
          colorClass="text-amber-400 border-amber-500/20" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Chart Column */}
        <div className="lg:col-span-8 bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold font-sora text-white uppercase tracking-wider mb-2">Applicants Distribution</h3>
            <p className="text-xs text-slate-400 mb-6">Total number of student applicants per posted drive.</p>
          </div>

          <div className="h-64 flex items-center justify-center">
            {metrics.totalDrives === 0 ? (
              <p className="text-xs text-slate-500">Post a recruitment drive to visualize statistics.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                  <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '10px' }} />
                  <YAxis stroke="#94a3b8" style={{ fontSize: '10px' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a2236', border: '1px solid #1e2d45', borderRadius: '10px' }}
                    itemStyle={{ color: '#f1f5f9', fontSize: '12px' }}
                  />
                  <Bar dataKey="Applicants" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Quick Open Drives List Column */}
        <div className="lg:col-span-4 bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold font-sora text-white uppercase tracking-wider mb-2">My Open Drives</h3>
            <p className="text-xs text-slate-400 mb-6">Overview of recently posted active drives.</p>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-64 flex-grow">
            {metrics.drives.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-xs text-slate-500">No active job drives posted yet.</p>
              </div>
            ) : (
              metrics.drives.map(drive => (
                <div 
                  key={drive.id}
                  className="p-3 bg-[#1a2236]/60 border border-[#1e2d45]/50 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white font-sora">{drive.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{drive.role} &bull; {drive.salary} LPA</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    drive.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {drive.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
