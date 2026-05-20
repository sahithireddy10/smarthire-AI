// src/pages/admin/AdminAnalytics.jsx
import React, { useMemo } from 'react'
import { getStudents, getCompanies, getDrives, getApplications } from '../../utils/storage'
import { 
  ResponsiveContainer, 
  AreaChart, Area, 
  XAxis, YAxis, 
  CartesianGrid, Tooltip, 
  BarChart, Bar, Legend, 
  PieChart, Pie, Cell 
} from 'recharts'

const COLORS = ['#6366f1', '#06b6d4', '#8b5cf6', '#10b981', '#ef4444'];

export default function AdminAnalytics() {
  const analyticsData = useMemo(() => {
    const students = getStudents();
    const companies = getCompanies();
    const drives = getDrives();
    const apps = getApplications();

    const studentsMap = {};
    students.forEach(s => { studentsMap[s.id] = s; });

    const drivesMap = {};
    drives.forEach(d => { drivesMap[d.id] = d; });

    const companiesMap = {};
    companies.forEach(c => { companiesMap[c.id] = c; });

    // 1. Applications Trend (group by applied_on date)
    const trendMap = {};
    apps.forEach(a => {
      const date = a.applied_on ? new Date(a.applied_on).toLocaleDateString() : 'N/A';
      trendMap[date] = (trendMap[date] || 0) + 1;
    });

    const applicationsTrend = Object.entries(trendMap)
      .map(([date, count]) => ({ date, Submissions: count }))
      .slice(-10); // last 10 entries

    // 2. Placements by Branch (status === 'selected' group by student branch)
    const branchMap = { CSE: 0, ECE: 0, IT: 0, ME: 0, CE: 0, EEE: 0 };
    apps.filter(a => a.status === 'selected').forEach(a => {
      const student = studentsMap[a.student_id];
      if (student && branchMap[student.branch] !== undefined) {
        branchMap[student.branch]++;
      }
    });

    const placementsByBranch = Object.entries(branchMap).map(([branch, count]) => ({
      name: branch,
      Hires: count
    }));

    // 3. Top Companies Comparison (drives count vs applicants count)
    const topCompanies = companies.map(c => {
      const compDrives = drives.filter(d => d.company_id === c.id);
      const compDriveIds = new Set(compDrives.map(d => d.id));
      const compApplicants = apps.filter(a => compDriveIds.has(a.drive_id)).length;

      return {
        name: c.name.length > 12 ? c.name.substring(0, 12) + '...' : c.name,
        Drives: compDrives.length,
        Applicants: compApplicants
      };
    }).slice(0, 6);

    // 4. Status Donut Chart
    const statusCounts = { applied: 0, test: 0, interview: 0, selected: 0, rejected: 0 };
    apps.forEach(a => {
      if (statusCounts[a.status] !== undefined) {
        statusCounts[a.status]++;
      }
    });

    const statusDonut = Object.entries(statusCounts).map(([name, value]) => ({
      name: name.toUpperCase(),
      value
    }));

    return {
      applicationsTrend,
      placementsByBranch,
      topCompanies,
      statusDonut
    };
  }, []);

  return (
    <div className="space-y-8 animate-slide-in">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white font-sora">Placement Analytics</h1>
        <p className="text-xs text-slate-400 mt-1">Deep visual statistics monitoring enrollment trends and recruiters conversion rates.</p>
      </div>

      {/* Grid containing 4 charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Applications Trend */}
        <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 shadow-xl flex flex-col justify-between h-80">
          <div>
            <h3 className="text-sm font-bold font-sora text-white uppercase tracking-wider mb-1">Submissions Timeline</h3>
            <p className="text-[10px] text-slate-500 mb-4">Total student applications received over time.</p>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.applicationsTrend}>
                <defs>
                  <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '9px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '9px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1a2236', border: '1px solid #1e2d45' }} />
                <Area type="monotone" dataKey="Submissions" stroke="#6366f1" fillOpacity={1} fill="url(#colorSub)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Placements by Branch */}
        <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 shadow-xl flex flex-col justify-between h-80">
          <div>
            <h3 className="text-sm font-bold font-sora text-white uppercase tracking-wider mb-1">Hires by Department</h3>
            <p className="text-[10px] text-slate-500 mb-4">Total students successfully placed grouped by academic branch.</p>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.placementsByBranch}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '9px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '9px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1a2236', border: '1px solid #1e2d45' }} />
                <Bar dataKey="Hires" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Top Companies */}
        <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 shadow-xl flex flex-col justify-between h-80">
          <div>
            <h3 className="text-sm font-bold font-sora text-white uppercase tracking-wider mb-1">Corporate Engagements</h3>
            <p className="text-[10px] text-slate-500 mb-4">Comparison of posted placement drives vs applicant volumes per company.</p>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.topCompanies}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '9px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '9px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1a2236', border: '1px solid #1e2d45' }} />
                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Bar dataKey="Drives" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Applicants" fill="#10b981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Status Donut */}
        <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 shadow-xl flex flex-col justify-between h-80">
          <div>
            <h3 className="text-sm font-bold font-sora text-white uppercase tracking-wider mb-1">Pipeline Stages Tally</h3>
            <p className="text-[10px] text-slate-500 mb-4">Aggregated selection round status distribution.</p>
          </div>
          <div className="flex-grow flex items-center justify-between gap-6 min-h-0">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.statusDonut}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {analyticsData.statusDonut.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1a2236', border: '1px solid #1e2d45' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-1/2 space-y-2 text-xs">
              {analyticsData.statusDonut.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }} 
                    />
                    <span className="text-slate-400 capitalize">{item.name.toLowerCase()}</span>
                  </div>
                  <span className="font-bold text-white font-sora">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
