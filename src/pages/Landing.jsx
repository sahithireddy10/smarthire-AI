import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStudents, getCompanies, getDrives, getApplications } from '../utils/storage'
import { Briefcase, Users, CheckCircle, ArrowRight, Sparkles, Building2, Terminal, Shield } from 'lucide-react'
import { Modal } from '../components/ui/Modal'

export default function Landing() {
  const [stats, setStats] = useState({
    students: 0,
    companies: 0,
    drives: 0,
    placements: 0
  });
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    const studentsList = getStudents();
    const companiesList = getCompanies();
    const drivesList = getDrives().filter(d => d.status === "active");
    const applicationsList = getApplications().filter(a => a.status === "selected");

    setStats({
      students: studentsList.length,
      companies: companiesList.length,
      drives: drivesList.length,
      placements: applicationsList.length
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background glow meshes */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[50%] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Navbar */}
      <header className="container mx-auto px-6 py-5 flex items-center justify-between border-b border-border-subtle/50 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white shadow-lg font-sora">
            S
          </div>
          <div>
            <span className="font-bold text-white tracking-tight font-sora text-base">SmartHire AI</span>
            <span className="text-[10px] text-indigo-400 font-semibold block uppercase tracking-wider">Campus Placements</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Log In
          </Link>
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-sm font-bold shadow-lg shadow-indigo-600/20 hover:scale-102 transition-all flex items-center gap-1.5"
          >
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-12 flex-1 flex flex-col items-center justify-center text-center relative z-10">

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-sora max-w-4xl leading-tight">
          Next-Gen Campus Placements with <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700">SmartHire AI</span>
        </h1>

        <p className="text-slate-400 text-base md:text-lg max-w-2xl mt-6 leading-relaxed font-dm">
          SmartHire AI bridges the gap between students, recruiters, and placement officers. Experience automated resume mapping, AI mock interviews, and detailed match analyzers.
        </p>


        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl mt-20">
          <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
            <Users className="text-indigo-400 mx-auto mb-3" size={24} />
            <h3 className="text-3xl font-extrabold font-sora text-white">{stats.students}</h3>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-1">Students Active</p>
          </div>

          <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-violet-500" />
            <Building2 className="text-violet-400 mx-auto mb-3" size={24} />
            <h3 className="text-3xl font-extrabold font-sora text-white">{stats.companies}</h3>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-1">Partner Corporates</p>
          </div>

          <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
            <Briefcase className="text-cyan-400 mx-auto mb-3" size={24} />
            <h3 className="text-3xl font-extrabold font-sora text-white">{stats.drives}</h3>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-1">Active Drives</p>
          </div>

          <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
            <CheckCircle className="text-emerald-400 mx-auto mb-3" size={24} />
            <h3 className="text-3xl font-extrabold font-sora text-white">{stats.placements}</h3>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-1">Offers Secured</p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mt-24 text-left">
          <div className="bg-bg-surface border border-border-subtle p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
              <Sparkles size={20} />
            </div>
            <h4 className="text-base font-bold font-sora text-white">Semantic AI Match Scores</h4>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              We look beyond keywords. Our NLP skill matching scores applicants based on related skill clusters, degrees, and requirements.
            </p>
          </div>

          <div className="bg-bg-surface border border-border-subtle p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4">
              <Terminal size={20} />
            </div>
            <h4 className="text-base font-bold font-sora text-white">Smart Interview Coaching</h4>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Generate custom role-specific questions for Technical, HR, and Aptitude rounds, and practice in our full interactive MCQ simulator.
            </p>
          </div>

          <div className="bg-bg-surface border border-border-subtle p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <Shield size={20} />
            </div>
            <h4 className="text-base font-bold font-sora text-white">10 Premium Resume Layouts</h4>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Build high-quality ATS-friendly resumes in real time and download them as printable PDFs with inline vector optimizations.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle/50 py-8 relative z-10 bg-[#0a0e1a]/80">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-xs font-semibold">
          <span>&copy; 2026 SmartHire AI. All rights reserved.</span>
          <div className="flex gap-6">
            <span onClick={() => setShowPrivacy(true)} className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span onClick={() => setShowTerms(true)} className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <Link to="/login" className="hover:text-slate-300">Admin Console</Link>
          </div>
        </div>
      </footer>

      {/* Terms of Service Modal */}
      <Modal isOpen={showTerms} onClose={() => setShowTerms(false)} title="Terms of Service">
        <div className="space-y-4 text-xs text-slate-600 leading-relaxed max-h-96 overflow-y-auto pr-1">
          <p className="font-bold text-slate-900">Effective Date: May 19, 2026</p>
          <p>Welcome to SmartHire AI. By logging in or registering on this platform, you agree to comply with the terms set forth below:</p>
          
          <h4 className="font-bold text-slate-800 uppercase text-[10px]">1. User Account Rules</h4>
          <p>Students must provide accurate academic credentials, including verified Cumulative CGPA. Recruiting companies must provide official registration domains and authentic job descriptions.</p>
          
          <h4 className="font-bold text-slate-800 uppercase text-[10px]">2. Acceptable Conduct</h4>
          <p>Any attempt to submit false resumes, forge CGPA limits, or bypass eligibility gates will result in immediate profile suspension by the platform administrators.</p>
          
          <h4 className="font-bold text-slate-800 uppercase text-[10px]">3. Data Security & Storage</h4>
          <p>This system saves data locally within the browser session via LocalStorage. Users are responsible for clearing browser history if using shared campus terminals.</p>
          
          <h4 className="font-bold text-slate-800 uppercase text-[10px]">4. AI Feature Disclaimers</h4>
          <p>Recruiting match recommendations and automated feedback summaries are generated by LLM analysis templates. SmartHire AI is not liable for hiring decisions based on statistical algorithms.</p>
        </div>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} title="Privacy Policy">
        <div className="space-y-4 text-xs text-slate-600 leading-relaxed max-h-96 overflow-y-auto pr-1">
          <p className="font-bold text-slate-900">Last Updated: May 19, 2026</p>
          <p>SmartHire AI values your privacy. This statement explains our storage rules and algorithmic operations:</p>
          
          <h4 className="font-bold text-slate-800 uppercase text-[10px]">1. Local Browser Storage</h4>
          <p>All student registers, resumes, recruitment drives, and applications are hosted locally on your device's browser Storage (LocalStorage). No database pipelines capture your credentials externally.</p>
          
          <h4 className="font-bold text-slate-800 uppercase text-[10px]">2. AI Score & LLM Analysis</h4>
          <p>To compute skill feedback, resumes, and interview responses, plain text is analyzed via the secure Google Gemini API. This data is handled in accordance with Google API policies and is not utilized for model training.</p>
          
          <h4 className="font-bold text-slate-800 uppercase text-[10px]">3. Information Sharing</h4>
          <p>Your academic profiles, CGPA scores, and resume files are shared only with recruiting officers representing companies you explicitly apply to within the portal.</p>
        </div>
      </Modal>
    </div>
  );
}
