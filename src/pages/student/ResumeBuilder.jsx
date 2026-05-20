// src/pages/student/ResumeBuilder.jsx
import React, { useState, useEffect, useMemo } from 'react'
import { TEMPLATES } from '../../utils/resumeTemplates'
import { useToast } from '../../hooks/useToast'
import { 
  FileText, 
  Download, 
  Plus, 
  Trash, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code 
} from 'lucide-react'

// Dynamic import for html2pdf.js to avoid SSR or bundle-time failures
let html2pdfInstance = null;
if (typeof window !== 'undefined') {
  import('html2pdf.js').then((module) => {
    html2pdfInstance = module.default;
  });
}

export default function ResumeBuilder({ student }) {
  const { success, error } = useToast();
  const [selectedTemplateId, setSelectedTemplateId] = useState(1);
  
  // Resume Form State
  const [resumeData, setResumeData] = useState({
    name: student.name || '',
    email: student.email || '',
    phone: student.phone || '',
    location: student.location || '',
    linkedin: '',
    github: '',
    summary: student.bio || '',
    skills: {
      technical: student.skills ? student.skills.split(',').map(s => s.trim()) : [],
      soft: ['Teamwork', 'Communication', 'Problem Solving']
    },
    education: [
      { degree: student.degree || 'B.Tech', institution: 'State University', year: '2026', score: student.cgpa?.toString() || '8.5' }
    ],
    experience: [
      { title: 'Software Engineer Intern', company: 'Tech Solutions Inc', duration: 'Jun 2025 - Aug 2025', bullets: ['Built scalable React components.', 'Optimized database fetch responses by 20%.'] }
    ],
    projects: [
      { name: 'Smart Placement Portal', tech: 'React, Node.js, SQL', bullets: ['Designed a full student application tracking system.', 'Integrated NLP matching algorithms.'] }
    ],
    certifications: [
      { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', year: '2025' }
    ]
  });

  const handleInputChange = (field, val) => {
    setResumeData(prev => ({
      ...prev,
      [field]: val
    }));
  };

  // Add/Remove Helpers
  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', institution: '', year: '', score: '' }]
    }));
  };

  const removeEducation = (index) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, idx) => idx !== index)
    }));
  };

  const handleEducationChange = (index, field, val) => {
    const updated = [...resumeData.education];
    updated[index][field] = val;
    handleInputChange('education', updated);
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { title: '', company: '', duration: '', bullets: [''] }]
    }));
  };

  const removeExperience = (index) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, idx) => idx !== index)
    }));
  };

  const handleExperienceChange = (index, field, val) => {
    const updated = [...resumeData.experience];
    updated[index][field] = val;
    handleInputChange('experience', updated);
  };

  const handleExperienceBulletChange = (expIndex, bulletIndex, val) => {
    const updated = [...resumeData.experience];
    updated[expIndex].bullets[bulletIndex] = val;
    handleInputChange('experience', updated);
  };

  const addExperienceBullet = (expIndex) => {
    const updated = [...resumeData.experience];
    updated[expIndex].bullets.push('');
    handleInputChange('experience', updated);
  };

  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, { name: '', tech: '', bullets: [''] }]
    }));
  };

  const removeProject = (index) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, idx) => idx !== index)
    }));
  };

  const handleProjectChange = (index, field, val) => {
    const updated = [...resumeData.projects];
    updated[index][field] = val;
    handleInputChange('projects', updated);
  };

  const handleProjectBulletChange = (projIndex, bulletIndex, val) => {
    const updated = [...resumeData.projects];
    updated[projIndex].bullets[bulletIndex] = val;
    handleInputChange('projects', updated);
  };

  const addProjectBullet = (projIndex) => {
    const updated = [...resumeData.projects];
    updated[projIndex].bullets.push('');
    handleInputChange('projects', updated);
  };

  const addCert = () => {
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { name: '', issuer: '', year: '' }]
    }));
  };

  const removeCert = (index) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, idx) => idx !== index)
    }));
  };

  const handleCertChange = (index, field, val) => {
    const updated = [...resumeData.certifications];
    updated[index][field] = val;
    handleInputChange('certifications', updated);
  };

  // Compile PDF via html2pdf.js
  const handleDownloadPDF = async () => {
    if (!html2pdfInstance) {
      error("PDF compile engine still loading. Please try in 1-2 seconds.");
      return;
    }

    const opt = {
      margin:       0,
      filename:     `${resumeData.name.replace(/\s+/g, '_')}_Resume.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2.5, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Create wrapper node, mount to DOM hidden, render, download, clear
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.innerHTML = TEMPLATES[selectedTemplateId](resumeData);
    document.body.appendChild(tempDiv);

    try {
      await html2pdfInstance().from(tempDiv).set(opt).save();
      success("Resume PDF downloaded successfully!");
    } catch (err) {
      console.error(err);
      error("Failed to generate PDF document");
    } finally {
      document.body.removeChild(tempDiv);
    }
  };

  // Generate html string for the iframe preview
  const iframeSrcDoc = useMemo(() => {
    const htmlContent = TEMPLATES[selectedTemplateId](resumeData);
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { margin: 0; padding: 0; background: #f8fafc; }
            /* Hide scrollbars inside preview */
            ::-webkit-scrollbar { display: none; }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `;
  }, [selectedTemplateId, resumeData]);

  return (
    <div className="space-y-8 animate-slide-in h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-sora">ATS Resume Builder</h1>
          <p className="text-xs text-slate-400 mt-1">Design, edit, and compile ATS-friendly resumes in real time.</p>
        </div>

        <button
          onClick={handleDownloadPDF}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <Download size={14} /> Download PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 items-start">
        
        {/* LEFT COLUMN: EDITOR FORM */}
        <div className="lg:col-span-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar pr-2">
          {/* Card: Personal info */}
          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 border-b border-[#1e2d45] pb-2 flex items-center gap-1.5"><User size={14} /> 1. Contact Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Name</label>
                <input type="text" value={resumeData.name} onChange={(e) => handleInputChange('name', e.target.value)} className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-3 py-2 text-xs text-white focus:outline-none" />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Email</label>
                <input type="email" value={resumeData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-3 py-2 text-xs text-white focus:outline-none" />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Phone</label>
                <input type="text" value={resumeData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-3 py-2 text-xs text-white focus:outline-none" />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Location</label>
                <input type="text" value={resumeData.location} onChange={(e) => handleInputChange('location', e.target.value)} className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-3 py-2 text-xs text-white focus:outline-none" />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">LinkedIn URL</label>
                <input type="text" value={resumeData.linkedin} onChange={(e) => handleInputChange('linkedin', e.target.value)} placeholder="linkedin.com/in/username" className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-3 py-2 text-xs text-white focus:outline-none" />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">GitHub URL</label>
                <input type="text" value={resumeData.github} onChange={(e) => handleInputChange('github', e.target.value)} placeholder="github.com/username" className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-3 py-2 text-xs text-white focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Card: Summary */}
          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-4 border-b border-[#1e2d45] pb-2 flex items-center gap-1.5"><FileText size={14} /> 2. Profile Summary</h3>
            <textarea
              rows="3"
              value={resumeData.summary}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-xl p-3 text-xs text-white focus:outline-none resize-none"
            />
          </div>

          {/* Card: Education */}
          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e2d45] pb-2">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5"><GraduationCap size={14} /> 3. Education</h3>
              <button onClick={addEducation} className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"><Plus size={14} /> Add</button>
            </div>
            {resumeData.education.map((edu, idx) => (
              <div key={idx} className="p-4 bg-[#0a0e1a]/40 border border-[#1e2d45]/50 rounded-xl space-y-3 relative">
                <button onClick={() => removeEducation(idx)} className="absolute top-2 right-2 text-slate-500 hover:text-red-400 transition-colors"><Trash size={14} /></button>
                <div className="grid grid-cols-2 gap-3 pr-6">
                  <div>
                    <label className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Degree</label>
                    <input type="text" value={edu.degree} onChange={(e) => handleEducationChange(idx, 'degree', e.target.value)} className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Institution</label>
                    <input type="text" value={edu.institution} onChange={(e) => handleEducationChange(idx, 'institution', e.target.value)} className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Graduation Year</label>
                    <input type="text" value={edu.year} onChange={(e) => handleEducationChange(idx, 'year', e.target.value)} className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Score / CGPA</label>
                    <input type="text" value={edu.score} onChange={(e) => handleEducationChange(idx, 'score', e.target.value)} className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Card: Experience */}
          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e2d45] pb-2">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5"><Briefcase size={14} /> 4. Work Experience</h3>
              <button onClick={addExperience} className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"><Plus size={14} /> Add</button>
            </div>
            {resumeData.experience.map((exp, idx) => (
              <div key={idx} className="p-4 bg-[#0a0e1a]/40 border border-[#1e2d45]/50 rounded-xl space-y-3 relative">
                <button onClick={() => removeExperience(idx)} className="absolute top-2 right-2 text-slate-500 hover:text-red-400 transition-colors"><Trash size={14} /></button>
                <div className="grid grid-cols-3 gap-3 pr-6">
                  <div className="col-span-2">
                    <label className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Title</label>
                    <input type="text" value={exp.title} onChange={(e) => handleExperienceChange(idx, 'title', e.target.value)} className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Duration</label>
                    <input type="text" value={exp.duration} onChange={(e) => handleExperienceChange(idx, 'duration', e.target.value)} className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none" />
                  </div>
                  <div className="col-span-3">
                    <label className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Company</label>
                    <input type="text" value={exp.company} onChange={(e) => handleExperienceChange(idx, 'company', e.target.value)} className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none" />
                  </div>
                  <div className="col-span-3 space-y-2">
                    <label className="text-[9px] text-slate-500 font-bold uppercase block mb-1 flex items-center justify-between">Bullets <span><button type="button" onClick={() => addExperienceBullet(idx)} className="text-[9px] text-indigo-400 font-bold">+ Add Bullet</button></span></label>
                    {exp.bullets.map((bullet, bIdx) => (
                      <input
                        key={bIdx}
                        type="text"
                        value={bullet}
                        onChange={(e) => handleExperienceBulletChange(idx, bIdx, e.target.value)}
                        className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Card: Projects */}
          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e2d45] pb-2">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5"><Code size={14} /> 5. Key Projects</h3>
              <button onClick={addProject} className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"><Plus size={14} /> Add</button>
            </div>
            {resumeData.projects.map((proj, idx) => (
              <div key={idx} className="p-4 bg-[#0a0e1a]/40 border border-[#1e2d45]/50 rounded-xl space-y-3 relative">
                <button onClick={() => removeProject(idx)} className="absolute top-2 right-2 text-slate-500 hover:text-red-400 transition-colors"><Trash size={14} /></button>
                <div className="grid grid-cols-2 gap-3 pr-6">
                  <div>
                    <label className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Project Name</label>
                    <input type="text" value={proj.name} onChange={(e) => handleProjectChange(idx, 'name', e.target.value)} className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Tech Stack Used</label>
                    <input type="text" value={proj.tech} onChange={(e) => handleProjectChange(idx, 'tech', e.target.value)} className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-[9px] text-slate-500 font-bold uppercase block mb-1 flex items-center justify-between">Bullets <span><button type="button" onClick={() => addProjectBullet(idx)} className="text-[9px] text-indigo-400 font-bold">+ Add Bullet</button></span></label>
                    {proj.bullets.map((bullet, bIdx) => (
                      <input
                        key={bIdx}
                        type="text"
                        value={bullet}
                        onChange={(e) => handleProjectBulletChange(idx, bIdx, e.target.value)}
                        className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Card: Certifications */}
          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e2d45] pb-2">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5"><Award size={14} /> 6. Certifications</h3>
              <button onClick={addCert} className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"><Plus size={14} /> Add</button>
            </div>
            {resumeData.certifications.map((cert, idx) => (
              <div key={idx} className="p-4 bg-[#0a0e1a]/40 border border-[#1e2d45]/50 rounded-xl space-y-3 relative">
                <button onClick={() => removeCert(idx)} className="absolute top-2 right-2 text-slate-500 hover:text-red-400 transition-colors"><Trash size={14} /></button>
                <div className="grid grid-cols-3 gap-3 pr-6">
                  <div className="col-span-2">
                    <label className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Cert Name</label>
                    <input type="text" value={cert.name} onChange={(e) => handleCertChange(idx, 'name', e.target.value)} className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Year</label>
                    <input type="text" value={cert.year} onChange={(e) => handleCertChange(idx, 'year', e.target.value)} className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none" />
                  </div>
                  <div className="col-span-3">
                    <label className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Issuer</label>
                    <input type="text" value={cert.issuer} onChange={(e) => handleCertChange(idx, 'issuer', e.target.value)} className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN: TEMPLATE SELECTOR & LIVE PREVIEW */}
        <div className="lg:col-span-6 space-y-6 flex flex-col h-[75vh]">
          {/* Template Selectors */}
          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5 shadow-lg">
            <label className="text-[10px] text-slate-500 font-bold uppercase block mb-2.5">Select ATS Layout Template</label>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedTemplateId(i + 1)}
                  className={`py-2 rounded-lg font-bold text-[10px] border transition-all ${
                    selectedTemplateId === i + 1
                      ? 'bg-indigo-600 border-indigo-400 text-white'
                      : 'bg-[#0a0e1a] border-[#1e2d45] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  T-{i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Document Preview Frame */}
          <div className="flex-1 bg-[#1a2236] border border-[#1e2d45] rounded-2xl overflow-hidden shadow-2xl relative flex items-center justify-center p-2.5 min-h-[350px]">
            <iframe
              title="Resume Preview"
              srcDoc={iframeSrcDoc}
              className="w-full h-full border-0 bg-white rounded-xl shadow-inner transform origin-top"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
