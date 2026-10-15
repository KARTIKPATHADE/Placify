"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  ArrowRight,
  RefreshCw,
  Printer,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Briefcase,
  Layers,
  Search,
  Eye,
  Wand2,
  Zap,
  ShieldAlert,
  Sliders,
  TrendingUp,
  FileCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { extractTextFromFile } from "@/utils/pdfExtractor";

// Sample pre-filled resumes for rapid testing
const SAMPLE_RESUMES = {
  fresher_cs: {
    label: "B.Tech Fresher (Typical Mistakes)",
    education: "B.Tech Computer Science",
    category: "Software Engineering",
    role: "Junior Full Stack Developer",
    experience: "Fresher (0-1 yrs)",
    text: `KARTIK SHARMA
kartik.sharma@example.com | +91 9876543210 | Bangalore, India | github.com/kartik-dev

OBJECTIVE
Hardworking and passionate Computer Science student looking for an entry-level software engineer job where I can utilize my skills to help the company grow.

EDUCATION
XYZ Institute of Technology, Bangalore
B.Tech in Computer Science and Engineering | 2021 - 2025 | CGPA: 8.2

TECHNICAL SKILLS
Languages: C++, Java, JavaScript, Python
Web: HTML, CSS, React, Node.js, Express
Database: MySQL, MongoDB
Tools: VS Code, Git

PROJECTS
E-Commerce Website
- Built an online store using React and Node.js.
- Implemented login, register, and shopping cart functionality.
- Used MongoDB for storing user and product data.
- Fixed various bugs and improved the website design.

Chat Application
- Created a real-time chat app using Socket.io and Express.
- Allowed users to send messages to each other.
- Styled using basic CSS.

EXPERIENCE
Web Developer Intern | TechStart Solutions (Jun 2024 - Aug 2024)
- Responsible for developing frontend pages in React.
- Worked with backend team to connect APIs.
- Attended daily standup meetings and resolved tickets in Jira.`
  },
  bca_practical: {
    label: "BCA Graduate (Project Focused)",
    education: "BCA (Bachelor of Computer Applications)",
    category: "Software Engineering",
    role: "Frontend React Developer",
    experience: "Junior (1-2 yrs)",
    text: `PRIYA VERMA
priya.verma@example.com | +91 9123456780 | Pune, India | priya-portfolio.vercel.app | github.com/priyav

PROFESSIONAL SUMMARY
Frontend Developer with 1.5 years of experience building responsive, mobile-first web applications using React, Next.js, and TypeScript. Passionate about web performance and UI/UX accessibility.

EDUCATION
Savitribai Phule Pune University
Bachelor of Computer Applications (BCA) | 2020 - 2023 | 78%

EXPERIENCE
Frontend Developer | CodeCraft Studio | Pune (Sep 2023 - Present)
- Developed responsive web interfaces for 4 client SaaS platforms using Next.js and Tailwind CSS.
- Collaborated with UI designers to implement pixel-perfect Figma components.
- Integrated REST APIs and managed application state using Redux Toolkit.
- Helped improve page load speeds by optimizing image assets.

PROJECTS
DevBoard - Kanban Task Manager (devboard-live.vercel.app)
- Architected full-stack task management dashboard with drag-and-drop workflow in React & Tailwind.
- Implemented JWT authentication and real-time task sync with Supabase PostgreSQL.
- Deployed on Vercel with automated GitHub Actions CI/CD pipeline.

SKILLS
JavaScript (ES6+), TypeScript, React, Next.js, Redux, Tailwind CSS, HTML5, CSS3, Git, REST APIs, Vercel`
  },
  non_tech_switch: {
    label: "Non-Tech Career Switcher (B.Com to Tech)",
    education: "Non-Tech Graduate (B.Com / Commerce)",
    category: "Data Science & Analytics",
    role: "Junior Data Analyst",
    experience: "Career Switcher (0-2 yrs)",
    text: `ROHAN MEHTA
rohan.analytics@example.com | +91 9988776655 | Mumbai, India | linkedin.com/in/rohanmehta

PROFESSIONAL PROFILE
Finance graduate transitioned into Data Analytics with strong business acumen and hands-on proficiency in SQL, Python, and Power BI. Completed 500+ hours of applied data modeling and statistical analysis.

EDUCATION
University of Mumbai
Bachelor of Commerce (B.Com) | 2019 - 2022 | 74%
Executive Certification in Data Science & SQL | 2023

PROJECTS
Customer Churn Prediction Dashboard
- Analyzed 10,000+ customer transaction records in PostgreSQL to identify key churn indicators.
- Built interactive Power BI dashboard featuring dynamic KPI cards and cohort retention curves.
- Developed logistic regression model in Python (Pandas, Scikit-Learn) with 81% precision.

Financial Market Sentiment Tracker
- Extracted news headlines using Python BeautifulSoup and performed NLP sentiment scoring.
- Visualized correlation between news sentiment and equity price movements in Tableau.

EXPERIENCE
Junior Financial Operations Analyst | Apex Capital Services (2022 - 2023)
- Conducted variance analysis on monthly portfolio reconciliations in Microsoft Excel.
- Automated ledger reconciliation macros, reducing manual reporting time by 4 hours weekly.`
  }
};

export default function ResumeAnalyzerPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  // Input states
  const [inputMode, setInputMode] = useState("upload"); // "upload" | "paste" | "samples"
  const [resumeText, setResumeText] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isExtractingText, setIsExtractingText] = useState(false);

  // Configuration options
  const [education, setEducation] = useState("B.Tech Computer Science");
  const [customEducation, setCustomEducation] = useState("");
  const [targetCategory, setTargetCategory] = useState("Software Engineering");
  const [targetRole, setTargetRole] = useState("Full Stack Software Engineer");
  const [experienceLevel, setExperienceLevel] = useState("Fresher (0-1 yrs)");
  const [targetJobDesc, setTargetJobDesc] = useState("");

  // Analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedBulletIdx, setCopiedBulletIdx] = useState(null);

  // File upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsExtractingText(true);

    try {
      const text = await extractTextFromFile(file);
      if (!text || text.trim().length < 50) {
        toast.error("Extracted text is too short. Please verify your file or paste your resume text.");
      } else {
        setResumeText(text);
        toast.success(`Extracted text from "${file.name}" (${text.split(/\s+/).length} words)!`);
      }
    } catch (err) {
      toast.error(err?.message || "Failed to parse file. Please paste your resume text directly.");
    } finally {
      setIsExtractingText(false);
    }
  };

  // Drag and drop handler
  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsExtractingText(true);

    try {
      const text = await extractTextFromFile(file);
      setResumeText(text);
      toast.success(`Extracted text from "${file.name}"!`);
    } catch (err) {
      toast.error(err?.message || "Failed to parse dropped file.");
    } finally {
      setIsExtractingText(false);
    }
  };

  // Load sample resume
  const handleLoadSample = (sampleKey) => {
    const sample = SAMPLE_RESUMES[sampleKey];
    if (!sample) return;

    setResumeText(sample.text);
    setEducation(sample.education);
    setTargetCategory(sample.category);
    setTargetRole(sample.role);
    setExperienceLevel(sample.experience);
    setUploadedFileName(`Sample: ${sample.label}`);
    toast.info(`Loaded sample resume: ${sample.label}`);
  };

  // Trigger analysis
  const handleRunAnalysis = async () => {
    if (!resumeText || resumeText.trim().length < 40) {
      toast.error("Please provide your resume content by uploading a file or pasting text.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    const effectiveEducation = education === "Other" ? customEducation || "Higher Education" : education;

    try {
      const res = await fetch("/api/resume/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          education: effectiveEducation,
          targetCategory,
          targetRole,
          experienceLevel,
          targetJobDesc
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to analyze resume.");
      }

      setAnalysisResult(data);
      toast.success("Resume analysis complete!");
      // Save in localStorage for the builder bridge
      try {
        localStorage.setItem("placify_last_analyzed_resume", resumeText);
      } catch (_) {}
    } catch (err) {
      toast.error(err?.message || "Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Copy rewrites
  const handleCopyRewrite = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedBulletIdx(idx);
    toast.success("Copied improved bullet point!");
    setTimeout(() => setCopiedBulletIdx(null), 2000);
  };

  // Color helper based on score
  const getScoreColor = (score) => {
    if (score >= 90) return { text: "text-emerald-500", bg: "bg-emerald-500", border: "border-emerald-500/30", badgeBg: "bg-emerald-500/10" };
    if (score >= 75) return { text: "text-cyan-500", bg: "bg-cyan-500", border: "border-cyan-500/30", badgeBg: "bg-cyan-500/10" };
    if (score >= 55) return { text: "text-amber-500", bg: "bg-amber-500", border: "border-amber-500/30", badgeBg: "bg-amber-500/10" };
    return { text: "text-rose-500", bg: "bg-rose-500", border: "border-rose-500/30", badgeBg: "bg-rose-500/10" };
  };

  const getVerdictBadge = (verdict) => {
    switch (verdict) {
      case "PERFECT":
        return { label: "PERFECT / ELITE RESUME 🏆", color: "bg-emerald-500 text-white" };
      case "STRONG":
        return { label: "STRONG / COMPETITIVE ⚡", color: "bg-cyan-600 text-white" };
      case "AVERAGE":
        return { label: "AVERAGE / AT RISK ⚠️", color: "bg-amber-500 text-white" };
      default:
        return { label: "CRITICAL REVISION NEEDED ❌", color: "bg-rose-600 text-white" };
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner with Monochrome Black & White Theme */}
      <div className="rounded-3xl bg-black dark:bg-zinc-950 p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-zinc-800">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-mono font-bold text-zinc-200 border border-white/20">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span>AI RESUME AUDITOR & ATS BENCHMARK v4.0</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            AI Resume Reader & Comprehensive Scorer
          </h1>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            Upload your resume or paste its text. Our neural engine evaluates whether it is <strong className="text-white">Perfect</strong> or <strong className="text-white">Needs Work</strong> for any education background (B.Tech, BCA, MCA, Non-Tech, Self-Taught) and any job category with ATS parsing scores and Placify XYZ bullet rewrites.
          </p>

          <div className="pt-2 flex flex-wrap gap-3 text-xs font-mono font-semibold">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/15 text-zinc-200">
              <FileCheck className="w-3.5 h-3.5 text-white" />
              <span>Full PDF & Doc Reader</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/15 text-zinc-200">
              <GraduationCap className="w-3.5 h-3.5 text-white" />
              <span>Any Degree / Background</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/15 text-zinc-200">
              <Wand2 className="w-3.5 h-3.5 text-white" />
              <span>Placify XYZ Rewrites</span>
            </div>
            <Link href="/dashboard/resume-builder">
              <div className="flex items-center gap-1.5 bg-white text-black font-bold px-3 py-1.5 rounded-xl hover:bg-zinc-200 transition-colors cursor-pointer">
                <span>Open Resume Builder</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      {!analysisResult ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Resume Input (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-black dark:text-white" />
                  <h2 className="font-bold text-zinc-900 dark:text-white">Provide Resume Content</h2>
                </div>
                {resumeText && (
                  <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                    {resumeText.split(/\s+/).filter(Boolean).length} words
                  </span>
                )}
              </div>

              {/* Mode Selector Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-zinc-100 dark:bg-zinc-800/60 rounded-2xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setInputMode("upload")}
                  className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    inputMode === "upload"
                      ? "bg-black text-white dark:bg-white dark:text-black shadow-xs"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload PDF / File</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode("paste")}
                  className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    inputMode === "paste"
                      ? "bg-black text-white dark:bg-white dark:text-black shadow-xs"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Paste Text</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode("samples")}
                  className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    inputMode === "samples"
                      ? "bg-black text-white dark:bg-white dark:text-black shadow-xs"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Load Sample</span>
                </button>
              </div>

              {/* Upload Mode */}
              {inputMode === "upload" && (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white rounded-2xl p-8 text-center cursor-pointer transition-colors bg-zinc-50/60 dark:bg-zinc-950/40 space-y-3 group"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".pdf,.txt,.md"
                    className="hidden"
                  />
                  <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white flex items-center justify-center mx-auto group-hover:scale-110 transition-transform border border-zinc-200 dark:border-zinc-700">
                    {isExtractingText ? (
                      <RefreshCw className="w-7 h-7 animate-spin" />
                    ) : (
                      <Upload className="w-7 h-7" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">
                      {isExtractingText
                        ? "Reading & Extracting Document Text..."
                        : uploadedFileName || "Click to upload or drag & drop resume"}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      Supports PDF, TXT, Markdown (Parsed locally in your browser with 100% privacy)
                    </p>
                  </div>
                  {uploadedFileName && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                      <Check className="w-3 h-3" /> Ready to analyze
                    </div>
                  )}
                </div>
              )}

              {/* Paste Mode */}
              {inputMode === "paste" && (
                <div className="space-y-2">
                  <textarea
                    rows={12}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste the full text of your resume here (Contact Info, Education, Experience, Projects, Skills)..."
                    className="w-full p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 text-zinc-900 dark:text-zinc-100 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 leading-relaxed"
                  />
                  <p className="text-[11px] text-zinc-400 text-right">
                    Tip: Copy directly from your Google Doc, Word, or PDF file.
                  </p>
                </div>
              )}

              {/* Sample Mode */}
              {inputMode === "samples" && (
                <div className="space-y-3">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Select a realistic benchmark resume to see how the scoring engine evaluates different backgrounds:
                  </p>
                  <div className="grid grid-cols-1 gap-2.5">
                    {Object.entries(SAMPLE_RESUMES).map(([key, item]) => (
                      <div
                        key={key}
                        onClick={() => handleLoadSample(key)}
                        className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-black dark:hover:border-white hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-xs font-bold text-zinc-900 dark:text-white group-hover:text-black dark:group-hover:text-white">
                            {item.label}
                          </p>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                            {item.education} • {item.role}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white">
                          Load <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview snippet of loaded text */}
              {resumeText && inputMode !== "paste" && (
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800">
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 pb-1.5 border-b border-zinc-200/40 dark:border-zinc-800 mb-1.5 font-mono">
                    <span>Extracted Text Preview</span>
                    <button
                      onClick={() => setInputMode("paste")}
                      className="text-black dark:text-white hover:underline cursor-pointer"
                    >
                      Edit Raw Text
                    </button>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-3 font-mono leading-relaxed">
                    {resumeText}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Candidate Parameters (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <Sliders className="w-5 h-5 text-black dark:text-white" />
                <h2 className="font-bold text-zinc-900 dark:text-white">Target Job & Education</h2>
              </div>

              {/* Education Background Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-black dark:text-white" /> Candidate Education Background
                </label>
                <select
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 text-zinc-900 dark:text-white"
                >
                  <option value="B.Tech Computer Science">B.Tech / B.E. (Computer Science & IT)</option>
                  <option value="B.Tech (Non-CS Branch: ECE/Mechanical/Civil)">B.Tech / B.E. (Non-CS Branch)</option>
                  <option value="BCA (Bachelor of Computer Applications)">BCA (Bachelor of Computer Applications)</option>
                  <option value="MCA (Master of Computer Applications)">MCA (Master of Computer Applications)</option>
                  <option value="B.Sc / M.Sc Computer Science">B.Sc / M.Sc (Computer Science / Data)</option>
                  <option value="Non-Tech Graduate (B.Com / Commerce)">Non-Tech Graduate (B.Com / Commerce)</option>
                  <option value="Non-Tech Graduate (BA / Arts / Humanities)">Non-Tech Graduate (BA / Arts / Humanities)</option>
                  <option value="BBA / MBA (Management / Business)">BBA / MBA (Management / Business)</option>
                  <option value="Self-Taught Developer / Bootcamp Graduate">Self-Taught Developer / Bootcamp Graduate</option>
                  <option value="Diploma / Polytechnic">Diploma / Polytechnic</option>
                  <option value="High School / Fresher (No Formal Degree)">High School / Fresher (No Degree)</option>
                  <option value="Other">Other Custom Degree</option>
                </select>
                {education === "Other" && (
                  <input
                    type="text"
                    value={customEducation}
                    onChange={(e) => setCustomEducation(e.target.value)}
                    placeholder="Enter your specific degree / background..."
                    className="w-full mt-2 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 text-zinc-900 dark:text-white"
                  />
                )}
              </div>

              {/* Target Job Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-black dark:text-white" /> Target Industry / Category
                </label>
                <select
                  value={targetCategory}
                  onChange={(e) => setTargetCategory(e.target.value)}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 text-zinc-900 dark:text-white"
                >
                  <option value="Software Engineering">Software Engineering (Web, Mobile, Core)</option>
                  <option value="Data Science & AI">Data Science, ML & AI Engineering</option>
                  <option value="Cloud & DevOps">Cloud Architecture, DevOps & SRE</option>
                  <option value="Product Management">Product Management & Agile</option>
                  <option value="Cyber Security">Cyber Security & Information Assurance</option>
                  <option value="UI/UX & Product Design">UI/UX & Product Design</option>
                  <option value="Finance & FinTech">Finance, Banking & FinTech</option>
                  <option value="Non-Tech & Operations">Non-Tech, HR, Sales & Operations</option>
                  <option value="General Technical">General Technical / Any Industry</option>
                </select>
              </div>

              {/* Target Job Role */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-black dark:text-white" /> Target Job Role
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Full Stack Developer, Data Analyst, Product Manager..."
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 text-zinc-900 dark:text-white"
                />
              </div>

              {/* Experience Level */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Candidate Seniority Level
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 text-zinc-900 dark:text-white"
                >
                  <option value="Fresher (0-1 yrs)">Fresher / Student (0 - 1 years)</option>
                  <option value="Junior (1-3 yrs)">Junior / Associate (1 - 3 years)</option>
                  <option value="Mid-Level (3-6 yrs)">Mid-Level Professional (3 - 6 years)</option>
                  <option value="Senior (6-10 yrs)">Senior Engineer / Manager (6 - 10 years)</option>
                  <option value="Lead / Executive (10+ yrs)">Lead / Principal / Executive (10+ years)</option>
                </select>
              </div>

              {/* Optional Job Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
                  <span>Target Job Description (Optional)</span>
                  <span className="text-[10px] text-zinc-400 font-normal">For exact keyword matching</span>
                </label>
                <textarea
                  rows={3}
                  value={targetJobDesc}
                  onChange={(e) => setTargetJobDesc(e.target.value)}
                  placeholder="Paste the target job requirements or qualifications to check keyword overlap..."
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 text-zinc-900 dark:text-white"
                />
              </div>

              {/* Run Analysis CTA */}
              <Button
                onClick={handleRunAnalysis}
                disabled={isAnalyzing || !resumeText.trim()}
                variant="default"
                className="w-full py-6 text-sm font-bold rounded-2xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Neural Engine Auditing Resume...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>Analyze & Score Resume</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* ================= ANALYSIS RESULTS DASHBOARD ================= */
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Top Score Summary Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-white/10 shadow-lg space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-stone-100 dark:border-white/10">
              {/* Score Meter & Verdict */}
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                {/* Radial Score Gauge */}
                <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="text-stone-100 dark:text-stone-800"
                      strokeWidth="9"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className={`${getScoreColor(analysisResult.overallScore).text} transition-all duration-1000 ease-out`}
                      strokeWidth="9"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={2 * Math.PI * 40 * (1 - analysisResult.overallScore / 100)}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black tracking-tight text-stone-900 dark:text-white">
                      {analysisResult.overallScore}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-stone-400 uppercase">
                      / 100 PTS
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-extrabold ${getVerdictBadge(analysisResult.verdict).color}`}>
                      {getVerdictBadge(analysisResult.verdict).label}
                    </span>
                    <span className="text-xs font-mono text-stone-500 dark:text-stone-400">
                      Evaluated for: {targetRole}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
                    {analysisResult.verdictTitle}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed">
                    {analysisResult.verdictSummary}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
                <Button
                  onClick={() => {
                    setAnalysisResult(null);
                  }}
                  variant="outline"
                  className="rounded-xl text-xs font-bold"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Re-audit
                </Button>
                <Link href="/dashboard/resume-builder" className="w-full sm:w-auto">
                  <Button
                    variant="default"
                    className="w-full sm:w-auto rounded-xl text-xs font-bold bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-md"
                  >
                    <Wand2 className="w-3.5 h-3.5 mr-1.5" /> Fix in Resume Builder
                  </Button>
                </Link>
              </div>
            </div>

            {/* Sub-Score Progress Bars */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(analysisResult.subScores || {}).map(([key, score]) => {
                const labels = {
                  atsCompatibility: "ATS Hygiene",
                  impactAndMetrics: "Quant Impact",
                  educationAlignment: "Edu Alignment",
                  technicalDepth: "Tech Depth",
                  formattingAndReadability: "Readability",
                  actionVerbs: "Action Verbs"
                };
                return (
                  <div key={key} className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-600 dark:text-zinc-400 truncate text-[11px]">
                        {labels[key] || key}
                      </span>
                      <span className={`font-black ${getScoreColor(score).text}`}>
                        {score}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getScoreColor(score).bg} rounded-full transition-all duration-700`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Analysis Tabs */}
          <div className="space-y-6">
            {/* Tab navigation */}
            <div className="flex flex-wrap items-center gap-2 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl max-w-fit">
              {[
                { id: "overview", label: "Overview & Flaws", icon: ShieldAlert },
                { id: "rewrites", label: "AI Bullet Rewrites", icon: Wand2, badge: analysisResult.bulletPointRewrites?.length },
                { id: "keywords", label: "Missing Keywords", icon: Search, badge: analysisResult.missingKeywords?.length },
                { id: "education", label: "Education Strategy", icon: GraduationCap },
                { id: "recruiter", label: "6-Sec Recruiter View", icon: Eye }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? "bg-black text-white dark:bg-white dark:text-black shadow-xs"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-extrabold">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT: Overview & Critical Flaws */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Critical Flaws & Red Flags */}
                <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-rose-100 dark:border-rose-950/40">
                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                    <h3 className="font-extrabold text-zinc-900 dark:text-white">
                      Critical Flaws & ATS Red Flags
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {analysisResult.criticalFlaws?.map((flaw, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-500/20 flex items-start gap-3">
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
                          {flaw}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Action Checklist */}
                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2.5">
                    <h4 className="text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Priority Fix Checklist to Reach 95+ Score:
                    </h4>
                    <div className="space-y-2">
                      {analysisResult.actionChecklist?.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                          <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Key Strengths */}
                <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-emerald-100 dark:border-emerald-950/40">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <h3 className="font-extrabold text-zinc-900 dark:text-white">
                      What Works Well & Key Strengths
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {analysisResult.strengths?.map((str, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-500/20 flex items-start gap-3">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
                          {str}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2 mt-4">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 uppercase">
                      <Zap className="w-3.5 h-3.5" /> Placify Verdict Summary
                    </div>
                    <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      {analysisResult.verdictSummary}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: AI Bullet Point Rewrites (Placify XYZ) */}
            {activeTab === "rewrites" && (
              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <div>
                    <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                      <Wand2 className="w-5 h-5 text-black dark:text-white" />
                      <span>Placify XYZ Formula Rewrites (Accomplished [X] by [Y] doing [Z])</span>
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      We transformed your weak, passive bullet points into executive-level quantifiable achievements.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {analysisResult.bulletPointRewrites?.map((rewrite, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-3"
                    >
                      {/* Original Weak Bullet */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Original Weak Line:
                        </span>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-through italic pl-4 border-l-2 border-rose-300 dark:border-rose-800">
                          &quot;{rewrite.original}&quot;
                        </p>
                      </div>

                      {/* Improved Bullet with Copy Button */}
                      <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-emerald-300/80 dark:border-emerald-500/30 shadow-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> High-Impact Placify XYZ Version:
                          </span>
                          <button
                            onClick={() => handleCopyRewrite(rewrite.improved, idx)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-black dark:text-white hover:underline cursor-pointer"
                          >
                            {copiedBulletIdx === idx ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" /> Copy Bullet
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-relaxed pl-1">
                          {rewrite.improved}
                        </p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 italic pt-1 border-t border-zinc-100 dark:border-zinc-800">
                          💡 <strong>Why it works:</strong> {rewrite.whyItWorks}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: Missing Keywords */}
            {activeTab === "keywords" && (
              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5">
                <div>
                  <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Search className="w-5 h-5 text-black dark:text-white" />
                    <span>Missing High-Priority ATS Keywords</span>
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Automated Applicant Tracking Systems (ATS) scan for these exact terms for {targetRole}. Adding them to your experience or skills list will dramatically boost candidate ranking.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5 pt-2">
                  {analysisResult.missingKeywords?.map((keyword, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 text-xs font-bold font-mono flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>+ {keyword}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300 space-y-1.5 mt-4">
                  <p className="font-bold text-zinc-800 dark:text-zinc-200">
                    Pro-tip for Keyword Placement:
                  </p>
                  <p>
                    Do not just dump keywords in a standalone block. Weave them naturally into your project and experience bullet points (e.g. <em>"Deployed containerized application using <strong>Docker</strong> on AWS with automated <strong>CI/CD</strong> pipelines"</em>).
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Education Strategy */}
            {activeTab === "education" && (
              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <GraduationCap className="w-5 h-5 text-black dark:text-white" />
                  <div>
                    <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">
                      Education & Degree Alignment Strategy
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Evaluated for: {analysisResult.educationAnalysis?.background || education}
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 uppercase">
                    <TrendingUp className="w-4 h-4" /> Degree Market Perception:
                  </div>
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 leading-relaxed">
                    {analysisResult.educationAnalysis?.assessment}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 uppercase">
                    <Zap className="w-4 h-4" /> Strategic Advice to Outcompete Peers:
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
                    {analysisResult.educationAnalysis?.strategicAdvice}
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 6-Second Recruiter View */}
            {activeTab === "recruiter" && (
              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <Eye className="w-5 h-5 text-black dark:text-white" />
                  <div>
                    <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">
                      The 6-Second Recruiter Impression
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Studies show technical recruiters spend an average of 6 to 7.4 seconds on an initial resume scan.
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm leading-relaxed font-semibold italic">
                  &quot;{analysisResult.recruiterImpression6Sec}&quot;
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl border border-stone-200/80 dark:border-white/10 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-stone-400 uppercase">First Element Read</span>
                    <p className="text-xs font-bold text-stone-800 dark:text-stone-200">Current Role & Most Recent Company</p>
                  </div>
                  <div className="p-4 rounded-xl border border-stone-200/80 dark:border-white/10 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-stone-400 uppercase">Eye Path Focus</span>
                    <p className="text-xs font-bold text-stone-800 dark:text-stone-200">F-Shape Scanning (Left-to-Right)</p>
                  </div>
                  <div className="p-4 rounded-xl border border-stone-200/80 dark:border-white/10 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-stone-400 uppercase">Immediate Drop Reason</span>
                    <p className="text-xs font-bold text-rose-500">Unquantified walls of plain text</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
