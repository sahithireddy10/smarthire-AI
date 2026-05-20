// src/pages/student/ExploreDrives.jsx
import React, { useState, useMemo } from 'react'
import { getDrives, getCompanies, getApplications, addItem } from '../../utils/storage'
import { aiMatchScore } from '../../utils/aiScore'
import { useToast } from '../../hooks/useToast'
import { ScoreBar } from '../../components/ui/ScoreBar'
import { Badge } from '../../components/ui/Badge'
import { Search, MapPin, DollarSign, Calendar, ChevronDown, ChevronUp, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function ExploreDrives({ student }) {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  
  const { success, error } = useToast();

  const companiesMap = useMemo(() => {
    const list = getCompanies();
    const map = {};
    list.forEach(c => {
      map[c.id] = c;
    });
    return map;
  }, []);

  const drivesWithStatus = useMemo(() => {
    const drives = getDrives().filter(d => d.status === "active");
    const apps = getApplications().filter(a => a.student_id === student.id);
    const appliedDriveIds = new Set(apps.map(a => a.drive_id));

    return drives.map(drive => {
      const company = companiesMap[drive.company_id] || { name: "Unknown Partner" };
      const hasApplied = appliedDriveIds.value ? appliedDriveIds.has(drive.id) : appliedDriveIds.has(drive.id);
      
      // Calculate eligibility
      const cgpaFail = student.cgpa < (drive.req_cgpa || 0);
      const yearFail = drive.req_year && drive.req_year !== 0 && student.year < drive.req_year;
      const degreeFail = drive.req_degree && drive.req_degree !== "" && student.degree !== drive.req_degree;
      
      const isEligible = !cgpaFail && !yearFail && !degreeFail;
      const matchData = aiMatchScore(student, drive);

      return {
        ...drive,
        companyName: company.name,
        hasApplied,
        isEligible,
        cgpaFail,
        yearFail,
        degreeFail,
        matchScore: matchData.score,
        breakdown: matchData.breakdown
      };
    });
  }, [student, companiesMap]);

  // Search filter
  const filteredDrives = useMemo(() => {
    const term = search.toLowerCase();
    return drivesWithStatus.filter(d => 
      d.title.toLowerCase().includes(term) ||
      d.role.toLowerCase().includes(term) ||
      d.companyName.toLowerCase().includes(term)
    );
  }, [search, drivesWithStatus]);

  const handleApply = (driveId) => {
    const drive = drivesWithStatus.find(d => d.id === driveId);
    if (!drive) return;

    if (drive.hasApplied) {
      error("Already applied to this drive!");
      return;
    }

    if (!drive.isEligible) {
      error("You do not meet the minimum eligibility criteria!");
      return;
    }

    const newApp = {
      id: "app_" + Date.now(),
      student_id: student.id,
      drive_id: driveId,
      status: "applied",
      ai_score: drive.matchScore,
      applied_on: new Date().toISOString()
    };

    addItem("smarthire_applications", newApp);
    success(`Successfully applied to ${drive.companyName} for ${drive.role}!`);
    // Reload state
    window.location.reload();
  };

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-8 animate-slide-in">
      {/* Page Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-sora">Explore Drives</h1>
          <p className="text-xs text-slate-400 mt-1">Browse open job drives, check eligibility, and apply.</p>
        </div>

        {/* Search */}
        <div className="relative max-w-sm w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search title, role or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111827] border border-[#1e2d45] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#f1f5f9] placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Drives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDrives.length === 0 ? (
          <div className="col-span-full text-center py-16 border border-[#1e2d45]/50 border-dashed bg-[#111827] rounded-2xl">
            <AlertCircle size={40} className="text-slate-500 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-300">No active job drives found</p>
            <p className="text-xs text-slate-500 mt-1">Check back later for new placement opportunities.</p>
          </div>
        ) : (
          filteredDrives.map((drive) => {
            const isExpanded = expandedId === drive.id;
            return (
              <div 
                key={drive.id}
                className={`bg-[#111827] border rounded-2xl p-6 shadow-xl transition-all flex flex-col justify-between ${
                  isExpanded ? 'border-indigo-500/40 ring-1 ring-indigo-500/10' : 'border-[#1e2d45] hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Top: Branding + Match Score */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">
                        {drive.companyName}
                      </span>
                      <h3 className="text-base font-bold font-sora text-white mt-1">{drive.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{drive.role}</p>
                    </div>

                    {/* Eligibility Badge */}
                    <div>
                      {drive.isEligible ? (
                        <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 size={11} /> Eligible
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-red-500/15 border border-red-500/30 text-red-400 flex items-center gap-1">
                          <AlertCircle size={11} /> Ineligible
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Metadatas */}
                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#1e2d45]/50 text-xs text-slate-400 mb-4">
                    <span className="flex items-center gap-1.5"><MapPin size={13} className="text-slate-500" /> {drive.location}</span>
                    <span className="flex items-center gap-1.5"><DollarSign size={13} className="text-slate-500" /> {drive.salary} LPA</span>
                    <span className="flex items-center gap-1.5 col-span-2"><Calendar size={13} className="text-slate-500" /> Deadline: {new Date(drive.deadline).toLocaleDateString()}</span>
                  </div>

                  {/* AI Score match bar */}
                  <div className="space-y-1 mb-4 bg-[#0a0e1a]/40 p-3 rounded-xl border border-[#1e2d45]/30">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">AI Match Strength</span>
                    <ScoreBar score={drive.matchScore} />
                  </div>

                  {/* Qualifications summary */}
                  <div className="text-[11px] text-slate-400 space-y-1">
                    <div><strong>Min CGPA:</strong> {drive.req_cgpa} {drive.cgpaFail && <span className="text-red-400 font-bold ml-1">(Requires higher CGPA)</span>}</div>
                    <div><strong>Year:</strong> {drive.req_year === 0 ? "Any Year" : `${drive.req_year}th Year+`} {drive.yearFail && <span className="text-red-400 font-bold ml-1">(Requires higher academic year)</span>}</div>
                    <div><strong>Degree:</strong> {drive.req_degree || "Any degree"} {drive.degreeFail && <span className="text-red-400 font-bold ml-1">(Degree does not match)</span>}</div>
                    <div className="truncate"><strong>Skills:</strong> {drive.req_skills}</div>
                  </div>
                </div>

                {/* Bottom button controls */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <button
                      onClick={() => toggleExpand(drive.id)}
                      className="text-xs font-bold text-slate-400 hover:text-slate-200 flex items-center gap-1"
                    >
                      {isExpanded ? (
                        <>Show Less <ChevronUp size={14} /></>
                      ) : (
                        <>Show More <ChevronDown size={14} /></>
                      )}
                    </button>

                    <button
                      onClick={() => handleApply(drive.id)}
                      disabled={drive.hasApplied || !drive.isEligible}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all ${
                        drive.hasApplied
                          ? "bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed"
                          : !drive.isEligible
                          ? "bg-red-950/20 text-red-500/50 border border-red-500/10 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      }`}
                    >
                      {drive.hasApplied ? "Applied" : "Apply to Job"}
                    </button>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-[#1e2d45] space-y-4 text-xs text-slate-300 animate-slide-in">
                      <div>
                        <h4 className="font-bold text-white mb-1 uppercase tracking-wider text-[10px] text-indigo-400">Job Description</h4>
                        <p className="leading-relaxed whitespace-pre-line text-slate-400">{drive.description}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-white mb-1.5 uppercase tracking-wider text-[10px] text-indigo-400">Match Details Breakdown</h4>
                        <div className="space-y-1">
                          <div className="flex justify-between py-1 border-b border-[#1e2d45]/40">
                            <span>CGPA Alignment</span>
                            <span className="font-bold text-slate-200">{drive.breakdown?.cgpa?.label} ({drive.breakdown?.cgpa?.earned}/30)</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-[#1e2d45]/40">
                            <span>Skill Synergy</span>
                            <span className="font-bold text-slate-200">{drive.breakdown?.skills?.label} ({drive.breakdown?.skills?.earned}/40)</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-[#1e2d45]/40">
                            <span>Degree Verification</span>
                            <span className="font-bold text-slate-200">{drive.breakdown?.degree?.label} ({drive.breakdown?.degree?.earned}/20)</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span>Eligibility Year</span>
                            <span className="font-bold text-slate-200">{drive.breakdown?.year?.label} ({drive.breakdown?.year?.earned}/10)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
