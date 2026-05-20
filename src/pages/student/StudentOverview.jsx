// src/pages/student/StudentOverview.jsx
import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getDrives, getApplications, addItem } from '../../utils/storage'
import { aiMatchScore } from '../../utils/aiScore'
import { useToast } from '../../hooks/useToast'
import { StatCard } from '../../components/ui/StatCard'
import { ScoreBar } from '../../components/ui/ScoreBar'
import { Badge } from '../../components/ui/Badge'
import { 
  FileText, 
  Briefcase, 
  Clock, 
  TrendingUp, 
  ArrowRight, 
  Sparkles,
  Search
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

export default function StudentOverview({ student }) {
  const { success, error } = useToast();

  const dataMetrics = useMemo(() => {
    const drives = getDrives();
    const apps = getApplications().filter(a => a.student_id === student.id);
    
    // Total Applications
    const totalApps = apps.length;
    
    // Active Interviews
    const interviewsCount = apps.filter(a => a.status === "interview").length;

    // Eligible Drives count
    const eligibleCount = drives.filter(d => {
      if (d.status !== "active") return false;
      const meetsCgpa = student.cgpa >= (d.req_cgpa || 0);
      const meetsYear = !d.req_year || d.req_year === 0 || student.year >= d.req_year;
      return meetsCgpa && meetsYear;
    }).length;

    // Match Quality (Average match score across applied)
    let totalScore = 0;
    apps.forEach(app => {
      totalScore += app.ai_score || 0;
    });
    const avgScore = totalApps > 0 ? Math.round(totalScore / totalApps) : 0;

    return {
      totalApps,
      interviewsCount,
      eligibleCount,
      avgScore,
      apps
    };
  }, [student]);

  // AI recommendations (Top 3 unapplied drives based on match score)
  const recommendations = useMemo(() => {
    const drives = getDrives().filter(d => d.status === 'active');
    const apps = getApplications().filter(a => a.student_id === student.id);
    const appliedDriveIds = new Set(apps.map(a => a.drive_id));

    // Get unapplied active drives
    const unapplied = drives.filter(d => !appliedDriveIds.has(d.id));

    // Calculate match scores
    const scored = unapplied.map(drive => {
      const match = aiMatchScore(student, drive);
      return { drive, score: match.score };
    });

    // Sort by score descending and take top 3
    return scored.sort((a, b) => b.score - a.score).slice(0, 3);
  }, [student]);

  // Chart Data preparation
  const chartData = useMemo(() => {
    const statusCounts = {};
    dataMetrics.apps.forEach(app => {
      statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
    });

    const data = Object.entries(statusCounts).map(([status, val]) => ({
      name: status.toUpperCase(),
      value: val
    }));

    return data.length > 0 ? data : [{ name: 'NO APPLICATIONS', value: 1 }];
  }, [dataMetrics.apps]);

  const COLORS = {
    applied: '#3b82f6',
    eligible: '#06b6d4',
    test: '#a855f7',
    interview: '#f59e0b',
    selected: '#10b981',
    rejected: '#ef4444',
    'no applications': '#475569'
  };

  const handleApply = (driveId) => {
    const apps = getApplications();
    const alreadyApplied = apps.some(a => a.student_id === student.id && a.drive_id === driveId);
    if (alreadyApplied) {
      error("You have already applied to this drive!");
      return;
    }

    const drive = getDrives().find(d => d.id === driveId);
    if (!drive) return;

    // Calculate score
    const result = aiMatchScore(student, drive);

    const newApp = {
      id: "app_" + Date.now(),
      student_id: student.id,
      drive_id: driveId,
      status: "applied",
      ai_score: result.score,
      applied_on: new Date().toISOString()
    };

    addItem("smarthire_applications", newApp);
    success(`Applied to ${drive.title} successfully!`);
    
    // Force overview reload
    window.location.reload();
  };

  return (
    <div className="space-y-8 animate-slide-in">
      {/* Introduction Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-sora">Candidate dashboard</h1>
        <p className="text-xs text-slate-400 mt-1">Review your matches, application statuses, and recommendations.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Applications" 
          value={dataMetrics.totalApps} 
          subtext="Submissions sent" 
          icon={FileText} 
          colorClass="text-blue-400 border-blue-500/20" 
        />
        <StatCard 
          title="Eligible Drives" 
          value={dataMetrics.eligibleCount} 
          subtext="Active job drives" 
          icon={Briefcase} 
          colorClass="text-cyan-400 border-cyan-500/20" 
        />
        <StatCard 
          title="Active Interviews" 
          value={dataMetrics.interviewsCount} 
          subtext="Interviews in progress" 
          icon={Clock} 
          colorClass="text-amber-400 border-amber-500/20" 
        />
        <StatCard 
          title="Average Match Quality" 
          value={`${dataMetrics.avgScore}%`} 
          subtext="Across applied drives" 
          icon={TrendingUp} 
          colorClass="text-emerald-400 border-emerald-500/20" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recommendations Column */}
        <div className="lg:col-span-7 bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/25">
                <Sparkles size={16} />
              </div>
              <h3 className="text-sm font-bold font-sora text-white uppercase tracking-wider">AI Recommended Positions</h3>
            </div>
            <p className="text-xs text-slate-400 mb-6">Positions matching your CGPA, branch, and technical skill sets.</p>

            <div className="space-y-4">
              {recommendations.length === 0 ? (
                <div className="text-center py-10 border border-[#1e2d45]/50 border-dashed rounded-xl bg-[#0a0e1a]/40">
                  <Briefcase size={36} className="text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">All caught up! No recommendations.</p>
                </div>
              ) : (
                recommendations.map(({ drive, score }) => (
                  <div 
                    key={drive.id}
                    className="p-4 bg-[#1a2236]/60 border border-[#1e2d45]/70 rounded-xl hover:border-indigo-500/40 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white font-sora">{drive.title}</h4>
                      <p className="text-xs text-slate-400">{drive.role} &bull; {drive.location}</p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Match:</span>
                        <div className="w-24">
                          <ScoreBar score={score} showNumber={false} />
                        </div>
                        <span className="text-xs font-bold font-sora text-indigo-400">{score}%</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleApply(drive.id)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-center"
                    >
                      Apply Now
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1e2d45]/50 flex justify-end">
            <Link 
              to="/student/explore" 
              className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
            >
              Browse all positions <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Recharts Pie Chart Column */}
        <div className="lg:col-span-5 bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold font-sora text-white uppercase tracking-wider mb-2">Application Funnel</h3>
            <p className="text-xs text-slate-400 mb-6">Distribution of your submissions in the pipeline.</p>
          </div>

          <div className="h-64 flex items-center justify-center relative">
            {dataMetrics.totalApps === 0 ? (
              <div className="text-center py-10">
                <Search size={36} className="text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Apply to job drives to visualize your pipeline.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => {
                      const color = COLORS[entry.name.toLowerCase()] || '#475569';
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a2236', border: '1px solid #1e2d45', borderRadius: '10px' }}
                    itemStyle={{ color: '#f1f5f9', fontSize: '12px' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '10px', color: '#94a3b8', textTransform: 'capitalize' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
