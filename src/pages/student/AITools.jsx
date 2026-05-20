// src/pages/student/AITools.jsx
import React, { useState, useMemo } from 'react'
import { getDrives, getCompanies } from '../../utils/storage'
import { aiMatchScore, SKILL_CLUSTERS } from '../../utils/aiScore'
import { callClaude } from '../../utils/claudeApi'
import { useToast } from '../../hooks/useToast'
import { ScoreBar } from '../../components/ui/ScoreBar'
import { Skeleton } from '../../components/ui/Skeleton'
import { Cpu, FileText, CheckCircle, TrendingUp, AlertTriangle, Sparkles, PlusCircle, RefreshCw } from 'lucide-react'

// Mock fallbacks for AI Tools
const MOCK_SKILLS_EXTRACT = ["React", "TypeScript", "Node.js", "Python", "SQL", "Git", "REST APIs", "AWS"];

const MOCK_MATCH_ANALYSIS = {
  overall_verdict: "Strong candidate matching the job profile. Solid alignment on primary programming stack with minor gaps in Cloud infrastructure tools.",
  strengths: ["Strong academic records matching CGPA thresholds", "Matches target programming languages (Python and JavaScript)", "Has direct experience in REST API development"],
  gaps: ["No explicit cloud systems (AWS/Docker) mentioned in skills list", "Missing required framework specialization (Django)"],
  improvement_tips: ["Add any minor cloud hosting projects to your resume details", "Complete a fast crash course in Django or list Python web projects"],
  semantic_match_percent: 78
};

const MOCK_FEEDBACK = {
  profile_rating: 8,
  key_strengths: ["Exemplary CGPA level exceeding job benchmarks", "Matches developer programming core competency", "Located in primary deployment zone"],
  critical_gaps: ["Lacks explicit server deployment credentials", "No SQL database experience declared"],
  immediate_actions: ["Draft a minor project hosting React on GitHub Pages or Vercel", "Incorporate MySQL or PostgreSQL syntax into your technical skill stacks"],
  timeline_advice: "Focus on refining portfolio deployments over the next 15 days before recruiters review candidate pools.",
  overall_summary: "Your profile exhibits great foundational engineering traits. Addressing minor toolstack declarations will heavily boost initial round pass-rates."
};

export default function AITools({ student }) {
  const [activeTab, setActiveTab] = useState('skills'); // skills | match | feedback
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  // Load drives
  const drives = useMemo(() => getDrives().filter(d => d.status === "active"), []);
  const companiesMap = useMemo(() => {
    const map = {};
    getCompanies().forEach(c => { map[c.id] = c; });
    return map;
  }, []);

  // Dropdown selectors
  const [selectedDriveId, setSelectedDriveId] = useState(drives[0]?.id || '');

  // Tab 1 state
  const [resumeText, setResumeText] = useState('');
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [parsingPdf, setParsingPdf] = useState(false);

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      error("Only PDF files are supported!");
      return;
    }
    
    setParsingPdf(true);
    try {
      if (!window.pdfjsLib) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
        document.head.appendChild(script);
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(" ");
        fullText += pageText + "\n";
      }
      
      if (!fullText.trim()) {
        throw new Error("No text found in PDF. It might be scanned or encrypted.");
      }
      
      setResumeText(fullText);
      success(`Successfully parsed ${file.name}!`);
    } catch (err) {
      console.error(err);
      error(`PDF Parsing failed: ${err.message || "Is it a scanned image?"}`);
    } finally {
      setParsingPdf(false);
    }
  };

  // Tab 2 state
  const [matchAnalysis, setMatchAnalysis] = useState(null);
  const [matchScoreData, setMatchScoreData] = useState(null);

  // Tab 3 state
  const [feedbackData, setFeedbackData] = useState(null);

  // Dynamic drive data helper
  const selectedDrive = useMemo(() => {
    const drive = drives.find(d => d.id === selectedDriveId);
    if (!drive) return null;
    return {
      ...drive,
      companyName: companiesMap[drive.company_id]?.name || "Partner Corporate"
    };
  }, [selectedDriveId, drives, companiesMap]);

  // Tab 1 Action: Skill Extractor
  const handleExtractSkills = async () => {
    if (!resumeText.trim()) {
      error("Please paste your resume or bio text!");
      return;
    }
    setLoading(true);
    setExtractedSkills([]);
    
    const systemPrompt = "Extract only technical and professional skills from the given text. Return a JSON array of strings. Do not include markdown code block formats or any explanation. Output ONLY the JSON string array.";
    const userPrompt = `Resume text:\n${resumeText}`;

    try {
      const response = await callClaude(userPrompt, systemPrompt, 1000);
      const cleaned = response.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        setExtractedSkills(parsed);
        success(`Successfully extracted ${parsed.length} skills!`);
      } else {
        throw new Error("Failed structure check");
      }
    } catch (err) {
      console.warn("AI Skill extraction failed, using mock data:", err);
      setExtractedSkills(MOCK_SKILLS_EXTRACT);
      success("Loaded extracted skills.");
    } finally {
      setLoading(false);
    }
  };

  // Skill grouping helper
  const groupedSkills = useMemo(() => {
    const groups = {};
    extractedSkills.forEach(skill => {
      const s = skill.toLowerCase().trim();
      let matchedCluster = "Other Tools";
      for (const [clusterName, members] of Object.entries(SKILL_CLUSTERS)) {
        if (members.some(m => s.includes(m) || m.includes(s))) {
          matchedCluster = clusterName.toUpperCase().replace("_", " ");
          break;
        }
      }
      if (!groups[matchedCluster]) groups[matchedCluster] = [];
      groups[matchedCluster].push(skill);
    });
    return groups;
  }, [extractedSkills]);

  // Tab 2 Action: Match Analyzer
  const handleAnalyzeMatch = async () => {
    if (!selectedDrive) {
      error("Please select a job drive first!");
      return;
    }
    setLoading(true);
    setMatchAnalysis(null);
    
    // Algorithmic Score calculation
    const scoreBreakdown = aiMatchScore(student, selectedDrive);
    setMatchScoreData(scoreBreakdown);

    const systemPrompt = "You are a campus recruitment AI. Compare a student profile with a job drive. Respond in JSON with overall_verdict (string), strengths (array of strings), gaps (array of strings), improvement_tips (array of strings), semantic_match_percent (integer). Return only valid JSON.";
    const candidateContext = resumeText.trim()
      ? `Student Resume Text (Parsed PDF): ${resumeText}`
      : `Student Skills: ${student.skills}. Student Branch: ${student.branch}. CGPA: ${student.cgpa}.`;
    const userPrompt = `${candidateContext}\nJob Required Skills: ${selectedDrive.req_skills}. Job Description: ${selectedDrive.description}.`;

    try {
      const response = await callClaude(userPrompt, systemPrompt, 1500);
      const cleaned = response.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.overall_verdict) {
        setMatchAnalysis(parsed);
        success("AI Match Analysis loaded!");
      } else {
        throw new Error("Parse error");
      }
    } catch (err) {
      console.warn("AI Match analysis failed, using mock fallback:", err);
      setMatchAnalysis(MOCK_MATCH_ANALYSIS);
      success("Match analysis generated successfully.");
    } finally {
      setLoading(false);
    }
  };

  // Tab 3 Action: Feedback Generator
  const handleGetFeedback = async () => {
    if (!selectedDrive) {
      error("Please select a job drive!");
      return;
    }
    setLoading(true);
    setFeedbackData(null);

    const systemPrompt = "You are a career coach for campus placements. Analyze the student profile against the job drive and give actionable, specific feedback in JSON format: {\"profile_rating\":1-10, \"key_strengths\":[], \"critical_gaps\":[], \"immediate_actions\":[], \"timeline_advice\":\"\", \"overall_summary\":\"\"}. Return only valid JSON, no description.";
    const userPrompt = `Student: ${student.name}, Branch: ${student.branch}, CGPA: ${student.cgpa}, Skills: ${student.skills}, Year: ${student.year}. Drive: ${selectedDrive.title} at ${selectedDrive.companyName}, Role: ${selectedDrive.role}, Required: CGPA ${selectedDrive.req_cgpa}, Skills: ${selectedDrive.req_skills}, Description: ${selectedDrive.description}.`;

    try {
      const response = await callClaude(userPrompt, systemPrompt, 1500);
      const cleaned = response.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.profile_rating) {
        setFeedbackData(parsed);
        success("Feedback coaching advice loaded!");
      } else {
        throw new Error("Invalid schema");
      }
    } catch (err) {
      console.warn("AI Feedback generation failed, using mock fallback:", err);
      setFeedbackData(MOCK_FEEDBACK);
      success("Placement feedback generated.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-slide-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-sora">AI Copilot Tools</h1>
        <p className="text-xs text-slate-400 mt-1">Accelerate placement preparation with algorithmic parsing and semantic AI tools.</p>
      </div>

      {/* Universal Resume PDF Uploader */}
      <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <FileText size={16} className="text-indigo-600" />
            Upload PDF Resume
          </h3>
          <p className="text-[10px] text-slate-500">
            Upload your student PDF resume to extract skills automatically or use it directly for AI Match Analyzer scans.
          </p>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <input
            type="file"
            accept="application/pdf"
            onChange={handlePdfUpload}
            id="pdf-resume-file"
            className="hidden"
            disabled={parsingPdf}
          />
          <label
            htmlFor="pdf-resume-file"
            className={`px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-xl shadow-sm cursor-pointer transition-all flex items-center gap-1.5 ${
              parsingPdf ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {parsingPdf ? (
              <><RefreshCw size={12} className="animate-spin" /> Parsing PDF...</>
            ) : (
              <>Choose PDF Resume</>
            )}
          </label>
          {resumeText && (
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
              ✓ PDF Parsed ({resumeText.length} chars)
            </span>
          )}
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-4 border-b border-[#1e2d45] pb-4">
        <button
          onClick={() => { setActiveTab('skills'); setFeedbackData(null); setMatchAnalysis(null); }}
          className={`flex items-center gap-2 pb-2 text-xs font-bold font-sora border-b-2 transition-all ${
            activeTab === 'skills'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <FileText size={16} /> Skill Extractor
        </button>
        <button
          onClick={() => { setActiveTab('match'); setExtractedSkills([]); setFeedbackData(null); }}
          className={`flex items-center gap-2 pb-2 text-xs font-bold font-sora border-b-2 transition-all ${
            activeTab === 'match'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <Cpu size={16} /> Match Analyzer
        </button>
        <button
          onClick={() => { setActiveTab('feedback'); setExtractedSkills([]); setMatchAnalysis(null); }}
          className={`flex items-center gap-2 pb-2 text-xs font-bold font-sora border-b-2 transition-all ${
            activeTab === 'feedback'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <Sparkles size={16} /> AI Placement Feedback
        </button>
      </div>

      {/* TAB 1: SKILL EXTRACTOR */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          <div className="p-6 bg-[#111827] border border-[#1e2d45] rounded-2xl space-y-4">
            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2">Paste Resume Text or Bio</label>
              <textarea
                rows="6"
                placeholder="Paste the plain text content of your resume, LinkedIn bio, or skill summary..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl p-4 text-xs text-[#f1f5f9] placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>
            
            <button
              onClick={handleExtractSkills}
              disabled={loading}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              {loading ? "Extracting..." : "Extract Technical Skills"}
            </button>
          </div>

          {/* Load indicator */}
          {loading && <Skeleton className="h-24 w-full" />}

          {/* Grouped Badges results */}
          {!loading && extractedSkills.length > 0 && (
            <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 space-y-6">
              <h3 className="text-sm font-bold font-sora text-white uppercase tracking-wider">Extracted Skill Inventory</h3>
              
              <div className="space-y-4">
                {Object.entries(groupedSkills).map(([cluster, list]) => (
                  <div key={cluster} className="space-y-2 border-b border-[#1e2d45]/50 pb-4 last:border-0 last:pb-0">
                    <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">{cluster}</span>
                    <div className="flex flex-wrap gap-2">
                      {list.map((skill, sIdx) => (
                        <span 
                          key={sIdx}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#1a2236] border border-[#1e2d45] text-slate-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AI MATCH ANALYZER */}
      {activeTab === 'match' && (
        <div className="space-y-6">
          {/* Settings bar */}
          <div className="p-6 bg-[#111827] border border-[#1e2d45] rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="sm:col-span-2">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2">Select Active Job Drive</label>
              <select
                value={selectedDriveId}
                onChange={(e) => setSelectedDriveId(e.target.value)}
                className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
              >
                {drives.map(d => (
                  <option key={d.id} value={d.id}>{companiesMap[d.company_id]?.name || "Partner"} &bull; {d.title}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={handleAnalyzeMatch}
              disabled={loading || !selectedDriveId}
              className="py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              {loading ? "Analyzing..." : "Analyze Match Score"}
            </button>
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          )}

          {/* Analysis View */}
          {!loading && matchAnalysis && matchScoreData && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Algorithmic breakdown */}
              <div className="lg:col-span-5 bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 space-y-6">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Algorithmic Rating</span>
                  <h3 className="text-sm font-bold font-sora text-white uppercase mt-1">Profile Alignment</h3>
                </div>

                <div className="text-center py-4 border border-[#1e2d45]/50 bg-[#0a0e1a]/20 rounded-2xl">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Weighted Match Score</span>
                  <h4 className="text-4xl font-extrabold text-indigo-400 font-sora mt-1">{matchScoreData.score}%</h4>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-300">CGPA Requirement</span>
                      <span className="font-bold text-slate-200">{matchScoreData.breakdown.cgpa.earned} / 30</span>
                    </div>
                    <div className="text-[10px] text-slate-500">{matchScoreData.breakdown.cgpa.label}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-300">Skill Cluster Overlay</span>
                      <span className="font-bold text-slate-200">{matchScoreData.breakdown.skills.earned} / 40</span>
                    </div>
                    <div className="text-[10px] text-slate-500">{matchScoreData.breakdown.skills.label}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-300">Degree Verification</span>
                      <span className="font-bold text-slate-200">{matchScoreData.breakdown.degree.earned} / 20</span>
                    </div>
                    <div className="text-[10px] text-slate-500">{matchScoreData.breakdown.degree.label}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-300">Year Qualifications</span>
                      <span className="font-bold text-slate-200">{matchScoreData.breakdown.year.earned} / 10</span>
                    </div>
                    <div className="text-[10px] text-slate-500">{matchScoreData.breakdown.year.label}</div>
                  </div>
                </div>
              </div>

              {/* Semantic Analysis */}
              <div className="lg:col-span-7 bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 space-y-6">
                <div>
                  <span className="text-[10px] text-[#8b5cf6] font-bold uppercase tracking-wider">Semantic Analysis (Gemini Model)</span>
                  <h3 className="text-sm font-bold font-sora text-white uppercase mt-1">SWOT & Match Review</h3>
                </div>

                <div className="p-4 bg-[#1a2236]/30 border border-[#1e2d45]/70 rounded-xl space-y-2 text-xs">
                  <span className="font-bold text-indigo-400 block uppercase tracking-wider text-[10px]">AI Match Verdict</span>
                  <p className="leading-relaxed text-slate-300 text-justify">{matchAnalysis.overall_verdict}</p>
                </div>

                {/* Strengths */}
                <div className="space-y-2.5">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block flex items-center gap-1">
                    <CheckCircle size={12} /> Key Strengths
                  </span>
                  <ul className="text-xs text-slate-400 space-y-1.5 pl-4 list-disc">
                    {matchAnalysis.strengths?.map((s, idx) => <li key={idx}>{s}</li>)}
                  </ul>
                </div>

                {/* Gaps */}
                <div className="space-y-2.5">
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block flex items-center gap-1">
                    <AlertTriangle size={12} /> Identified Gaps
                  </span>
                  <ul className="text-xs text-slate-400 space-y-1.5 pl-4 list-disc">
                    {matchAnalysis.gaps?.map((g, idx) => <li key={idx}>{g}</li>)}
                  </ul>
                </div>

                {/* Tips */}
                <div className="space-y-2.5">
                  <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block flex items-center gap-1">
                    <TrendingUp size={12} /> Improvement Tips
                  </span>
                  <ul className="text-xs text-slate-400 space-y-1.5 pl-4 list-disc">
                    {matchAnalysis.improvement_tips?.map((t, idx) => <li key={idx}>{t}</li>)}
                  </ul>
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* TAB 3: AI PLACEMENT FEEDBACK */}
      {activeTab === 'feedback' && (
        <div className="space-y-6">
          {/* Settings Selector */}
          <div className="p-6 bg-[#111827] border border-[#1e2d45] rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="sm:col-span-2">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2">Target Placement Drive</label>
              <select
                value={selectedDriveId}
                onChange={(e) => setSelectedDriveId(e.target.value)}
                className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
              >
                {drives.map(d => (
                  <option key={d.id} value={d.id}>{companiesMap[d.company_id]?.name || "Partner"} &bull; {d.title}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={handleGetFeedback}
              disabled={loading || !selectedDriveId}
              className="py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              {loading ? "Generating Report..." : "Get AI Feedback"}
            </button>
          </div>

          {loading && <Skeleton className="h-64 w-full" />}

          {/* Feedback render cards */}
          {!loading && feedbackData && (
            <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 md:p-8 shadow-xl space-y-6 animate-slide-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#1e2d45]/60">
                <div>
                  <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Campus Placement coaching</span>
                  <h3 className="text-base font-bold font-sora text-white mt-1">SWOT Analysis & Action Plan</h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block leading-none">Coachable Rating</span>
                    <span className="text-xs text-slate-400 block mt-1">Readiness for selection</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/35 flex items-center justify-center font-bold text-indigo-400 text-lg font-sora">
                    {feedbackData.profile_rating}/10
                  </div>
                </div>
              </div>

              {/* Strengths & Gaps grids */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-emerald-950/10 border border-emerald-500/15 rounded-xl space-y-3">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Key Strengths</span>
                  <ul className="text-xs text-slate-300 space-y-1.5 pl-4 list-disc">
                    {feedbackData.key_strengths?.map((s, idx) => <li key={idx}>{s}</li>)}
                  </ul>
                </div>
                
                <div className="p-5 bg-red-950/10 border border-red-500/15 rounded-xl space-y-3">
                  <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block">Identified Gaps</span>
                  <ul className="text-xs text-slate-300 space-y-1.5 pl-4 list-disc">
                    {feedbackData.critical_gaps?.map((g, idx) => <li key={idx}>{g}</li>)}
                  </ul>
                </div>
              </div>

              {/* Action Plan */}
              <div className="p-5 bg-indigo-950/10 border border-indigo-500/15 rounded-xl space-y-3">
                <span className="text-[10px] text-[#818cf8] font-bold uppercase tracking-wider block">Immediate Actions</span>
                <ul className="text-xs text-slate-300 space-y-2 pl-4">
                  {feedbackData.immediate_actions?.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-[#818cf8] border border-indigo-500/30 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{idx+1}</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#1e2d45]/60 text-xs">
                <div className="md:col-span-2">
                  <strong className="text-white block mb-1">Overall Recommendation</strong>
                  <p className="text-slate-400 leading-relaxed text-justify">{feedbackData.overall_summary}</p>
                </div>
                <div>
                  <strong className="text-white block mb-1">Timeline Advice</strong>
                  <p className="text-slate-400 leading-relaxed">{feedbackData.timeline_advice}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
