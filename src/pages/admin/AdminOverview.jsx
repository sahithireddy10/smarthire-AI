// src/pages/admin/AdminOverview.jsx
import React, { useMemo } from 'react'
import { getStudents, getCompanies, getDrives, getApplications } from '../../utils/storage'
import { StatCard } from '../../components/ui/StatCard'
import { Users, Building2, Briefcase, GraduationCap, ArrowRight } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { ScoreBar } from '../../components/ui/ScoreBar'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function AdminOverview() {
  const metrics = useMemo(() => {
    const students = getStudents();
    const companies = getCompanies();
    const drives = getDrives();
    const apps = getApplications();

    const totalStudents = students.length;
    const totalCompanies = companies.length;
    const totalDrives = drives.length;
    const totalApps = apps.length;

    // Selection rate
    const hired = apps.filter(a => a.status === 'selected').length;
    const selectionRate = totalApps > 0 ? Math.round((hired / totalApps) * 100) : 0;

    // Chart Data: pipeline funnel counts
    const counts = { applied: 0, test: 0, interview: 0, selected: 0, rejected: 0 };
    apps.forEach(a => {
      if (counts[a.status] !== undefined) counts[a.status]++;
    });

    const chartData = Object.entries(counts).map(([name, count]) => ({
      name: name.toUpperCase(),
      Candidates: count
    }));

    // Recent 5 applications
    const studentsMap = {};
    students.forEach(s => { studentsMap[s.id] = s; });

    const drivesMap = {};
    drives.forEach(d => { drivesMap[d.id] = d; });

    const companiesMap = {};
    companies.forEach(c => { companiesMap[c.id] = c; });

    const recentApps = [...apps]
      .sort((a, b) => new Date(b.applied_on) - new Date(a.applied_on))
      .slice(0, 5)
      .map(app => {
        const student = studentsMap[app.student_id] || { name: 'Unknown' };
        const drive = drivesMap[app.drive_id] || { title: 'Position', company_id: '' };
        const comp = companiesMap[drive.company_id] || { name: 'Corporate' };

        return {
          ...app,
          studentName: student.name,
          driveTitle: drive.title,
          companyName: comp.name
        };
      });

    return {
      totalStudents,
      totalCompanies,
      totalDrives,
      selectionRate,
      chartData,
      recentApps
    };
  }, []);

  return (
    <div className="space-y-8 animate-slide-in">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white font-sora">Campus Overview</h1>
        <p className="text-xs text-slate-400 mt-1">Monitor enrollment metrics, employer engagement, and recruitment milestones.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Students Registered" 
          value={metrics.totalStudents} 
          subtext="Enrolled candidates" 
          icon={GraduationCap} 
          colorClass="text-indigo-400 border-indigo-500/20" 
        />
        <StatCard 
          title="Partner Companies" 
          value={metrics.totalCompanies} 
          subtext="Recruitment partners" 
          icon={Building2} 
          colorClass="text-cyan-400 border-cyan-500/20" 
        />
        <StatCard 
          title="Placement Campaigns" 
          value={metrics.totalDrives} 
          subtext="Job opportunities posted" 
          icon={Briefcase} 
          colorClass="text-violet-400 border-violet-500/20" 
        />
        <StatCard 
          title="Placement Success" 
          value={`${metrics.selectionRate}%`} 
          subtext="Application success rate" 
          icon={Users} 
          colorClass="text-emerald-400 border-emerald-500/20" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Pipeline funnel chart */}
        <div className="lg:col-span-7 bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold font-sora text-white uppercase tracking-wider mb-2">Campus Placement Funnel</h3>
            <p className="text-xs text-slate-400 mb-6">Pipeline distribution of all candidate submissions.</p>
          </div>

          <div className="h-64 flex items-center justify-center">
            {metrics.chartData.length === 0 ? (
              <p className="text-xs text-slate-500">No applications posted yet.</p>
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
                  <Bar dataKey="Candidates" fill="#818cf8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Applications table */}
        <div className="lg:col-span-5 bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold font-sora text-white uppercase tracking-wider mb-2">Recent Applications</h3>
            <p className="text-xs text-slate-400 mb-6">Latest recruitment status updates.</p>
          </div>

          <div className="space-y-4 flex-grow overflow-y-auto max-h-64 pr-1">
            {metrics.recentApps.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-10">No applications registered yet.</p>
            ) : (
              metrics.recentApps.map(app => (
                <div 
                  key={app.id}
                  className="p-3 bg-[#1a2236]/50 border border-[#1e2d45]/50 rounded-xl flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate font-sora">{app.studentName}</h4>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{app.driveTitle} &bull; {app.companyName}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-12">
                      <ScoreBar score={app.ai_score} showNumber={false} />
                    </div>
                    <Badge status={app.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
