"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Sparkles,
  Download,
  Printer,
  Plus,
  Trash2,
  Wand2,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Globe,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Eye,
  Sliders,
  Award,
  BookOpen,
  Briefcase,
  FolderGit2,
  Cpu,
  Layers,
  Save,
  UploadCloud,
  FileSearch,
  Check,
  SpellCheck,
  CheckCheck,
  GraduationCap,
  Columns,
  Code
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ResumeTemplateRenderer, { formatCGPA } from "./ResumeTemplates";

// Default starter data
const DEFAULT_RESUME = {
  personalInfo: {
    fullName: "Alex Rivera",
    jobTitle: "Full Stack Software Engineer",
    email: "alex.rivera@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    portfolioUrl: "https://alexrivera.dev",
    linkedinUrl: "https://linkedin.com/in/alexrivera",
    githubUrl: "https://github.com/alexrivera",
  },
  summary:
    "Performance-driven Full Stack Engineer with 3+ years of experience engineering distributed web architectures in Next.js, Node.js, and PostgreSQL. Demonstrated record of optimizing p95 API latency by 42% and building intuitive, accessible UIs for 100k+ monthly active users.",
  experience: [
    {
      id: "exp-1",
      role: "Software Engineer",
      company: "CloudScale Technologies",
      location: "San Francisco, CA",
      startDate: "2023",
      endDate: "Present",
      bullets: [
        "Architected and deployed 8+ microservices in Next.js and Node.js/TypeScript, scaling platform throughput to 15,000+ daily active users.",
        "Refactored relational PostgreSQL queries and introduced Redis caching layers, slashing median response latency from 320ms to 65ms.",
        "Collaborated in a 6-person Agile squad, establishing automated CI/CD pipelines via GitHub Actions and Docker containerization."
      ]
    },
    {
      id: "exp-2",
      role: "Associate Frontend Developer",
      company: "Apex Digital Labs",
      location: "Austin, TX",
      startDate: "2021",
      endDate: "2023",
      bullets: [
        "Spearheaded development of responsive user dashboards in React and Tailwind CSS, increasing user retention metrics by 24%.",
        "Implemented end-to-end testing suites with Cypress and Jest, improving production code test coverage from 58% to 91%."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.Tech in Computer Science and Engineering",
      institution: "State University of Technology",
      location: "Austin, TX",
      graduationYear: "2021",
      gpa: "8.65 / 10 CGPA",
      details: "Relevant Coursework: Data Structures & Algorithms, Distributed Systems, Database Management Systems, Cloud Computing."
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "Placify Neural Simulator",
      techStack: "Next.js, Tailwind CSS, Gemini AI, PostgreSQL",
      liveUrl: "https://placify.ai",
      githubUrl: "https://github.com/alexrivera/placify",
      bullets: [
        "Engineered real-time AI speech-to-text interview simulator evaluated against Placify XYZ scoring metrics.",
        "Integrated client-side WebGL orbital graphics and dynamic multi-spectrum theme transitions."
      ]
    },
    {
      id: "proj-2",
      title: "DevStream Realtime Analytics",
      techStack: "React, TypeScript, WebSocket, Docker",
      liveUrl: "https://devstream-demo.com",
      githubUrl: "https://github.com/alexrivera/devstream",
      bullets: [
        "Constructed high-frequency WebSocket data ingestion pipeline processing 2,500 events/second with sub-50ms render overhead."
      ]
    }
  ],
  skills: {
    languages: "JavaScript (ES6+), TypeScript, Python, SQL, HTML5, CSS3",
    frameworks: "React, Next.js, Node.js, Express, Tailwind CSS, Redux Toolkit",
    tools: "PostgreSQL, MongoDB, Redis, Docker, Git, GitHub Actions, AWS, Jest",
    softSkills: "System Architecture, Agile/Scrum, Problem Solving, Code Review, Mentorship"
  },
  certifications: [
    {
      id: "cert-1",
      title: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      year: "2023"
    }
  ]
};

// Starter Presets
const PRESET_TEMPLATES = {
  tech_senior: { label: "Senior Full Stack", data: DEFAULT_RESUME },
  fresher_cs: {
    label: "CS Fresher / Graduate",
    data: {
      ...DEFAULT_RESUME,
      personalInfo: {
        ...DEFAULT_RESUME.personalInfo,
        fullName: "Kavya Patel",
        jobTitle: "Associate Software Engineer / Fresher",
        location: "Bengaluru, India"
      },
      summary:
        "Computer Science graduate with hands-on proficiency in React, TypeScript, and modern backend architectures. Creator of 4+ production-deployed open-source projects with strong foundations in Data Structures, Algorithms, and Cloud deployments.",
      experience: [
        {
          id: "exp-1",
          role: "Software Engineering Intern",
          company: "Nexus Cloud Systems",
          location: "Bengaluru",
          startDate: "Jan 2024",
          endDate: "Jun 2024",
          bullets: [
            "Contributed to core REST API development in Node.js, reducing server response times by 22% across 3 internal portals.",
            "Wrote comprehensive unit tests in Jest, identifying and resolving 18+ high-priority production regression bugs."
          ]
        }
      ],
      education: [
        {
          id: "edu-fresher",
          degree: "B.Tech in Computer Science & Engineering",
          institution: "National Institute of Technology",
          location: "Bengaluru, India",
          graduationYear: "2024",
          gpa: "8.75 / 10 CGPA",
          details: "Specialization in Software Architecture, Distributed Databases, and Artificial Intelligence."
        }
      ]
    }
  },
  career_switcher: {
    label: "Career Switcher / Non-Tech",
    data: {
      ...DEFAULT_RESUME,
      personalInfo: {
        ...DEFAULT_RESUME.personalInfo,
        fullName: "Marcus Chen",
        jobTitle: "Junior Full Stack Developer",
        location: "New York, NY"
      },
      summary:
        "Strategic problem-solver with a background in Business Operations transitioned into Full Stack Software Engineering. Combines analytical decision-making with full-stack execution in Next.js, PostgreSQL, and modern API design.",
      education: [
        {
          id: "edu-1",
          degree: "Full Stack Software Engineering Immersive & B.Com",
          institution: "University of New York",
          location: "New York, NY",
          graduationYear: "2023",
          gpa: "8.5 CGPA",
          details: "Specialization in enterprise web development, algorithms, and database design."
        }
      ]
    }
  }
};

// Professional Resume Template Styles
export const TEMPLATE_OPTIONS = [
  { id: "tech", label: "Tech Modern", icon: Code, desc: "ATS Standard single-column layout for software engineers" },
  { id: "ivy", label: "Ivy Classic (Harvard)", icon: GraduationCap, desc: "Traditional academic serif design with top education & clean divider bars" },
  { id: "two-column", label: "Two-Column Split", icon: Columns, desc: "Modern split layout with contact & skills sidebar" },
  { id: "monochrome", label: "Minimalist Obsidian", icon: FileText, desc: "High-contrast Swiss design with numbered sections and monospace accents" },
  { id: "student", label: "Campus / Fresher (CGPA)", icon: Award, desc: "Optimized for students & freshers with prominent CGPA and projects" },
  { id: "executive", label: "Executive Lead", icon: Briefcase, desc: "Sophisticated corporate leadership design with competencies matrix" }
];

export default function ResumeBuilderPage() {
  const router = useRouter();
  const printRef = useRef(null);

  // Resume State
  const [resumeData, setResumeData] = useState(DEFAULT_RESUME);
  const [template, setTemplate] = useState("tech"); // "tech" | "ivy" | "two-column" | "monochrome" | "student" | "executive"
  const [accentColor, setAccentColor] = useState("#18181b"); // Monochrome obsidian default
  const [activeTab, setActiveTab] = useState("personal"); // "personal" | "experience" | "education" | "projects" | "skills"
  const [previewMode, setPreviewMode] = useState("split"); // "split" | "preview" | "editor"

  // Enhancing status
  const [enhancingKey, setEnhancingKey] = useState(null);

  // Restore saved resume from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("placify_resume_builder_data");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.personalInfo) {
          setResumeData(parsed);
        }
      }
    } catch (_) {}
  }, []);

  // Save changes to localStorage
  const handleSaveToStorage = () => {
    try {
      localStorage.setItem("placify_resume_builder_data", JSON.stringify(resumeData));
      toast.success("Resume saved locally!");
    } catch (_) {
      toast.error("Could not save to local storage.");
    }
  };

  // Calculate real-time ATS Health Score
  const calculateATSScore = () => {
    let score = 50;
    const info = resumeData.personalInfo;
    if (info.fullName && info.email && info.phone) score += 10;
    if (info.githubUrl || info.linkedinUrl) score += 5;
    if (resumeData.summary && resumeData.summary.length > 80) score += 10;
    if (resumeData.experience.length >= 1) score += 10;
    if (resumeData.projects.length >= 1) score += 5;
    if (resumeData.skills.languages && resumeData.skills.frameworks) score += 5;

    // Check for metrics in bullets
    const allBullets = [
      ...resumeData.experience.flatMap((e) => e.bullets),
      ...resumeData.projects.flatMap((p) => p.bullets)
    ].join(" ");
    const hasNumbers = (allBullets.match(/\b\d+(%|k|m|x|\+)?\b/gi) || []).length;
    score += Math.min(10, hasNumbers * 2);

    return Math.min(98, score);
  };

  const atsScore = calculateATSScore();

  // AI Enhancement API Call
  const handleEnhance = async (type, content, callback, keyIdentifier) => {
    setEnhancingKey(keyIdentifier);
    try {
      const res = await fetch("/api/resume/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          content,
          role: resumeData.personalInfo.jobTitle,
          education: resumeData.education[0]?.degree || "Degree"
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Enhancement failed.");
      }

      callback(data.enhanced);
      toast.success("AI enhanced successfully!");
    } catch (err) {
      toast.error(err?.message || "Failed to enhance content.");
    } finally {
      setEnhancingKey(null);
    }
  };

  // AI Spellcheck & Grammar Fix for single field
  const handleSpellCheck = async (content, callback, keyIdentifier) => {
    if (!content || !content.trim()) {
      toast.info("Field is currently empty.");
      return;
    }
    setEnhancingKey(keyIdentifier);
    try {
      const res = await fetch("/api/resume/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "spellcheck",
          content,
          role: resumeData.personalInfo.jobTitle,
          education: resumeData.education[0]?.degree || "Degree"
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Spellcheck failed.");
      }

      callback(data.enhanced);
      toast.success("Spelling and grammar corrected!");
    } catch (err) {
      toast.error(err?.message || "Failed to correct spelling.");
    } finally {
      setEnhancingKey(null);
    }
  };

  // AI Fix All Spelling Mistakes across entire resume
  const [isFixingAllSpelling, setIsFixingAllSpelling] = useState(false);
  const handleFixAllSpelling = async () => {
    setIsFixingAllSpelling(true);
    try {
      const res = await fetch("/api/resume/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "fix_all_spelling",
          resumeData
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.enhanced) {
        throw new Error(data.error || "Failed to fix spelling mistakes.");
      }

      setResumeData(data.enhanced);
      toast.success("All spelling and grammatical mistakes corrected!");
    } catch (err) {
      toast.error(err?.message || "Spellcheck scan failed.");
    } finally {
      setIsFixingAllSpelling(false);
    }
  };

  // Add / Delete Experience helpers
  const handleAddExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      role: "Software Engineer",
      company: "Company Name",
      location: "City, Country",
      startDate: "2023",
      endDate: "Present",
      bullets: ["Engineered scalable features using modern web technologies, improving application performance."]
    };
    setResumeData({ ...resumeData, experience: [...resumeData.experience, newExp] });
  };

  const handleDeleteExperience = (id) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter((e) => e.id !== id)
    });
  };

  const handleUpdateExperience = (id, field, value) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    });
  };

  const handleUpdateExpBullet = (expId, bulletIdx, value) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map((e) => {
        if (e.id !== expId) return e;
        const newBullets = [...e.bullets];
        newBullets[bulletIdx] = value;
        return { ...e, bullets: newBullets };
      })
    });
  };

  const handleAddExpBullet = (expId) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map((e) => {
        if (e.id !== expId) return e;
        return { ...e, bullets: [...e.bullets, "New measurable impact bullet point."] };
      })
    });
  };

  const handleDeleteExpBullet = (expId, bulletIdx) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map((e) => {
        if (e.id !== expId) return e;
        return { ...e, bullets: e.bullets.filter((_, i) => i !== bulletIdx) };
      })
    });
  };

  // Projects helpers
  const handleAddProject = () => {
    const newProj = {
      id: `proj-${Date.now()}`,
      title: "Project Name",
      techStack: "React, Node.js, PostgreSQL",
      liveUrl: "",
      githubUrl: "",
      bullets: ["Architected full-stack web application with secure authentication and modern UI components."]
    };
    setResumeData({ ...resumeData, projects: [...resumeData.projects, newProj] });
  };

  const handleDeleteProject = (id) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.filter((p) => p.id !== id)
    });
  };

  const handleUpdateProject = (id, field, value) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    });
  };

  const handleUpdateProjBullet = (projId, bulletIdx, value) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.map((p) => {
        if (p.id !== projId) return p;
        const newBullets = [...p.bullets];
        newBullets[bulletIdx] = value;
        return { ...p, bullets: newBullets };
      })
    });
  };

  const handleAddProjBullet = (projId) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.map((p) => {
        if (p.id !== projId) return p;
        return { ...p, bullets: [...p.bullets, "Quantifiable project milestone or architecture outcome."] };
      })
    });
  };

  const handleDeleteProjBullet = (projId, bulletIdx) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.map((p) => {
        if (p.id !== projId) return p;
        return { ...p, bullets: p.bullets.filter((_, i) => i !== bulletIdx) };
      })
    });
  };

  // Education Helpers
  const handleAddEducation = () => {
    const newEdu = {
      id: `edu-${Date.now()}`,
      degree: "Bachelor of Science",
      institution: "University Name",
      location: "City",
      graduationYear: "2024",
      gpa: "",
      details: ""
    };
    setResumeData({ ...resumeData, education: [...resumeData.education, newEdu] });
  };

  const handleDeleteEducation = (id) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter((ed) => ed.id !== id)
    });
  };

  const handleUpdateEducation = (id, field, value) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.map((ed) => (ed.id === id ? { ...ed, [field]: value } : ed))
    });
  };

  // Print / PDF Export
  const handlePrint = () => {
    window.print();
  };

  // Download JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resumeData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${resumeData.personalInfo.fullName.replace(/\s+/g, "_")}_Resume.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Downloaded Resume JSON backup!");
  };

  // Bridge to Resume Analyzer
  const handleSendToAnalyzer = () => {
    const plainText = `
${resumeData.personalInfo.fullName}
${resumeData.personalInfo.jobTitle}
${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone} | ${resumeData.personalInfo.location}
${resumeData.personalInfo.githubUrl} | ${resumeData.personalInfo.linkedinUrl}

SUMMARY:
${resumeData.summary}

EXPERIENCE:
${resumeData.experience
  .map(
    (e) => `
${e.role} at ${e.company} (${e.startDate} - ${e.endDate}) - ${e.location}
${e.bullets.map((b) => `- ${b}`).join("\n")}
`
  )
  .join("\n")}

EDUCATION:
${resumeData.education
  .map(
    (ed) => `
${ed.degree} - ${ed.institution} (${ed.graduationYear})
${ed.details || ""}
`
  )
  .join("\n")}

PROJECTS:
${resumeData.projects
  .map(
    (p) => `
${p.title} (${p.techStack})
${p.bullets.map((b) => `- ${b}`).join("\n")}
`
  )
  .join("\n")}

SKILLS:
Languages: ${resumeData.skills.languages}
Frameworks: ${resumeData.skills.frameworks}
Tools: ${resumeData.skills.tools}
`;

    try {
      localStorage.setItem("placify_last_analyzed_resume", plainText);
    } catch (_) {}

    router.push("/dashboard/resume-analyzer");
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Command Header */}
      <div className="rounded-3xl bg-black dark:bg-zinc-950 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-zinc-800 print:hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-0.5 rounded-full text-xs font-mono font-bold text-zinc-200 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>ATS-OPTIMIZED RESUME BUILDER v4.0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Interactive Resume Builder & AI Enhancer
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
              Build an executive, recruiter-approved resume with live previews, 1-click Placify XYZ AI bullet enhancers, and instant PDF print export.
            </p>
          </div>

          {/* Quick HUD Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Live ATS Health Badge */}
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/20 flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-zinc-300">ATS HEALTH:</span>
              <span className="text-sm font-black text-white">{atsScore}/100</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  atsScore >= 80 ? "bg-white" : "bg-zinc-400"
                } animate-pulse`}
              />
            </div>

            <Button
              onClick={handleFixAllSpelling}
              disabled={isFixingAllSpelling}
              variant="outline"
              size="sm"
              title="Automatically scan and fix all spelling and grammatical errors across your resume"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              {isFixingAllSpelling ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" />
              ) : (
                <SpellCheck className="w-3.5 h-3.5 mr-1.5 text-white" />
              )}
              Fix Spelling Mistakes
            </Button>

            <Button
              onClick={handleSaveToStorage}
              variant="outline"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl text-xs font-bold"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" /> Save
            </Button>

            <Button
              onClick={handlePrint}
              variant="outline"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl text-xs font-bold"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" /> Print / PDF
            </Button>

            <Button
              onClick={handleSendToAnalyzer}
              variant="outline"
              size="sm"
              className="bg-white text-black hover:bg-zinc-200 rounded-xl text-xs font-bold border-none shadow-xs"
            >
              <FileSearch className="w-3.5 h-3.5 mr-1.5" /> Audit Score
            </Button>
          </div>
        </div>
      </div>

      {/* Editor & Preview Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs print:hidden">
        {/* Preset Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Load Preset:</span>
          <div className="flex items-center gap-1.5">
            {Object.entries(PRESET_TEMPLATES).map(([key, item]) => (
              <button
                key={key}
                onClick={() => {
                  setResumeData(item.data);
                  toast.info(`Loaded ${item.label} preset`);
                }}
                className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Template Style Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Template:</span>
          <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs font-bold overflow-x-auto max-w-full">
            {TEMPLATE_OPTIONS.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTemplate(t.id);
                  toast.success(`Switched to ${t.label} layout`);
                }}
                title={t.desc}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                  template === t.id
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-xs font-bold"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                }`}
              >
                <t.icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* View Mode (Desktop/Mobile Toggle) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPreviewMode("split")}
            className={`hidden md:block px-3 py-1 rounded-xl text-xs font-bold cursor-pointer ${
              previewMode === "split" ? "bg-black text-white dark:bg-white dark:text-black" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            Split View
          </button>
          <button
            onClick={() => setPreviewMode("editor")}
            className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer ${
              previewMode === "editor" ? "bg-black text-white dark:bg-white dark:text-black" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            Form Editor
          </button>
          <button
            onClick={() => setPreviewMode("preview")}
            className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer ${
              previewMode === "preview" ? "bg-black text-white dark:bg-white dark:text-black" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            Live Canvas
          </button>
        </div>
      </div>

      {/* Main Split-Screen Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT PANE: Resume Form Editor */}
        <div
          className={`${
            previewMode === "preview" ? "hidden" : previewMode === "split" ? "lg:col-span-6" : "lg:col-span-12"
          } space-y-6 print:hidden`}
        >
          {/* Section Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl text-xs font-bold">
            {[
              { id: "personal", label: "Contact Info" },
              { id: "summary", label: "Summary" },
              { id: "experience", label: `Experience (${resumeData.experience.length})` },
              { id: "education", label: `Education (${resumeData.education.length})` },
              { id: "projects", label: `Projects (${resumeData.projects.length})` },
              { id: "skills", label: "Skills & Tech" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Content Area */}
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-white/10 shadow-xs space-y-5">
            {/* 1. PERSONAL INFO FORM */}
            {activeTab === "personal" && (
              <div className="space-y-4">
                <h3 className="font-bold text-stone-900 dark:text-white border-b border-stone-100 dark:border-white/10 pb-2">
                  Personal & Contact Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300">Full Name</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.fullName}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, fullName: e.target.value }
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold focus:ring-2 focus:ring-black dark:focus:ring-white text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Professional Headline</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.jobTitle}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, jobTitle: e.target.value }
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold focus:ring-2 focus:ring-black dark:focus:ring-white text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Email Address</label>
                    <input
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, email: e.target.value }
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold focus:ring-2 focus:ring-black dark:focus:ring-white text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Phone Number</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, phone: e.target.value }
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold focus:ring-2 focus:ring-black dark:focus:ring-white text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Location (City, Country)</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.location}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, location: e.target.value }
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold focus:ring-2 focus:ring-black dark:focus:ring-white text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Portfolio / Website Link</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.portfolioUrl}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, portfolioUrl: e.target.value }
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold focus:ring-2 focus:ring-black dark:focus:ring-white text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">GitHub Profile URL</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.githubUrl}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, githubUrl: e.target.value }
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold focus:ring-2 focus:ring-black dark:focus:ring-white text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">LinkedIn Profile URL</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.linkedinUrl}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, linkedinUrl: e.target.value }
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold focus:ring-2 focus:ring-black dark:focus:ring-white text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. SUMMARY FORM */}
            {activeTab === "summary" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-white/10 pb-2">
                  <h3 className="font-bold text-stone-900 dark:text-white">Professional Summary</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() =>
                        handleSpellCheck(
                          resumeData.summary,
                          (corrected) => setResumeData({ ...resumeData, summary: corrected }),
                          "summary-spell"
                        )
                      }
                      disabled={enhancingKey === "summary-spell"}
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-xs font-bold text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      {enhancingKey === "summary-spell" ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1" />
                      ) : (
                        <SpellCheck className="w-3.5 h-3.5 mr-1" />
                      )}
                      Fix Spelling
                    </Button>
                    <Button
                      onClick={() =>
                        handleEnhance(
                          "summary",
                          resumeData.summary,
                          (enhanced) => setResumeData({ ...resumeData, summary: enhanced }),
                          "summary"
                        )
                      }
                      disabled={enhancingKey === "summary"}
                      variant="default"
                      size="sm"
                      className="rounded-xl text-xs font-bold bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                    >
                      {enhancingKey === "summary" ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1" />
                      ) : (
                        <Wand2 className="w-3.5 h-3.5 mr-1" />
                      )}
                      AI Polish Summary
                    </Button>
                  </div>
                </div>

                <textarea
                  rows={6}
                  value={resumeData.summary}
                  onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                  placeholder="Craft a 2-3 sentence overview highlighting your engineering focus, key metric wins, and career trajectory..."
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs leading-relaxed focus:ring-2 focus:ring-black dark:focus:ring-white text-zinc-900 dark:text-zinc-100"
                />
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Tip: Avoid subjective self-praise ("detail-oriented hard worker"). Replace with quantifiable achievements and specific frameworks.
                </p>
              </div>
            )}

            {/* 3. EXPERIENCE FORM */}
            {activeTab === "experience" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-white/10 pb-2">
                  <h3 className="font-bold text-stone-900 dark:text-white">Work Experience</h3>
                  <Button onClick={handleAddExperience} size="sm" variant="outline" className="rounded-xl text-xs font-bold">
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Role
                  </Button>
                </div>

                <div className="space-y-6">
                  {resumeData.experience.map((exp, expIdx) => (
                    <div
                      key={exp.id}
                      className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">
                          Role #{expIdx + 1}
                        </span>
                        <button
                          onClick={() => handleDeleteExperience(exp.id)}
                          className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => handleUpdateExperience(exp.id, "role", e.target.value)}
                          placeholder="Job Title"
                          className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold focus:ring-2 focus:ring-black dark:focus:ring-white text-zinc-900 dark:text-zinc-100"
                        />
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => handleUpdateExperience(exp.id, "company", e.target.value)}
                          placeholder="Company Name"
                          className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold focus:ring-2 focus:ring-black dark:focus:ring-white text-zinc-900 dark:text-zinc-100"
                        />
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => handleUpdateExperience(exp.id, "location", e.target.value)}
                          placeholder="Location (e.g. San Francisco, CA)"
                          className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold focus:ring-2 focus:ring-black dark:focus:ring-white text-zinc-900 dark:text-zinc-100"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={exp.startDate}
                            onChange={(e) => handleUpdateExperience(exp.id, "startDate", e.target.value)}
                            placeholder="Start (2022)"
                            className="w-1/2 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold focus:ring-2 focus:ring-black dark:focus:ring-white text-zinc-900 dark:text-zinc-100"
                          />
                          <input
                            type="text"
                            value={exp.endDate}
                            onChange={(e) => handleUpdateExperience(exp.id, "endDate", e.target.value)}
                            placeholder="End (Present)"
                            className="w-1/2 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold focus:ring-2 focus:ring-black dark:focus:ring-white text-zinc-900 dark:text-zinc-100"
                          />
                        </div>
                      </div>

                      {/* Bullet points */}
                      <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300">
                            Bullet Points (Placify XYZ Format)
                          </span>
                          <button
                            onClick={() => handleAddExpBullet(exp.id)}
                            className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Add Bullet
                          </button>
                        </div>

                        {exp.bullets.map((bullet, bIdx) => {
                          const keyId = `${exp.id}-b-${bIdx}`;
                          return (
                            <div key={bIdx} className="flex items-start gap-2">
                              <textarea
                                rows={2}
                                value={bullet}
                                onChange={(e) => handleUpdateExpBullet(exp.id, bIdx, e.target.value)}
                                className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-sans leading-relaxed focus:ring-2 focus:ring-black dark:focus:ring-white text-zinc-900 dark:text-zinc-100"
                              />
                              <Button
                                onClick={() =>
                                  handleSpellCheck(
                                    bullet,
                                    (corrected) => handleUpdateExpBullet(exp.id, bIdx, corrected),
                                    `${keyId}-spell`
                                  )
                                }
                                disabled={enhancingKey === `${keyId}-spell`}
                                size="sm"
                                variant="outline"
                                title="Fix spelling & grammar mistakes with AI"
                                className="shrink-0 rounded-xl px-2.5 py-1.5 h-auto text-[11px] font-bold text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                              >
                                {enhancingKey === `${keyId}-spell` ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <SpellCheck className="w-3.5 h-3.5" />
                                )}
                              </Button>
                              <Button
                                onClick={() =>
                                  handleEnhance(
                                    "bullet",
                                    bullet,
                                    (enhanced) => handleUpdateExpBullet(exp.id, bIdx, enhanced),
                                    keyId
                                  )
                                }
                                disabled={enhancingKey === keyId}
                                size="sm"
                                variant="outline"
                                title="Enhance into Placify XYZ format with AI"
                                className="shrink-0 rounded-xl px-2.5 py-1.5 h-auto text-[11px] font-bold text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                              >
                                {enhancingKey === keyId ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Wand2 className="w-3.5 h-3.5" />
                                )}
                              </Button>
                              <button
                                onClick={() => handleDeleteExpBullet(exp.id, bIdx)}
                                className="p-1 text-stone-400 hover:text-rose-500 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. EDUCATION FORM */}
            {activeTab === "education" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-white/10 pb-2">
                  <h3 className="font-bold text-stone-900 dark:text-white">Education & Degrees</h3>
                  <Button onClick={handleAddEducation} size="sm" variant="outline" className="rounded-xl text-xs font-bold">
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Education
                  </Button>
                </div>

                <div className="space-y-4">
                  {resumeData.education.map((edu, eduIdx) => (
                    <div
                      key={edu.id}
                      className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">
                          Degree #{eduIdx + 1}
                        </span>
                        <button
                          onClick={() => handleDeleteEducation(edu.id)}
                          className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => handleUpdateEducation(edu.id, "degree", e.target.value)}
                          placeholder="Degree (e.g. B.Tech CS / BCA / B.Com)"
                          className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold focus:ring-2 focus:ring-black dark:focus:ring-white text-zinc-900 dark:text-zinc-100"
                        />
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => handleUpdateEducation(edu.id, "institution", e.target.value)}
                          placeholder="College / University Name"
                          className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold focus:ring-2 focus:ring-black dark:focus:ring-white text-zinc-900 dark:text-zinc-100"
                        />
                        <input
                          type="text"
                          value={edu.location}
                          onChange={(e) => handleUpdateEducation(edu.id, "location", e.target.value)}
                          placeholder="Location"
                          className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold focus:ring-2 focus:ring-black dark:focus:ring-white text-zinc-900 dark:text-zinc-100"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">Graduation Year</label>
                            <input
                              type="text"
                              value={edu.graduationYear}
                              onChange={(e) => handleUpdateEducation(edu.id, "graduationYear", e.target.value)}
                              placeholder="e.g. 2024"
                              className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold focus:ring-2 focus:ring-black dark:focus:ring-white text-zinc-900 dark:text-zinc-100"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">CGPA / Percentage</label>
                            <input
                              type="text"
                              value={edu.gpa}
                              onChange={(e) => handleUpdateEducation(edu.id, "gpa", e.target.value)}
                              placeholder="e.g. 7.38 or 8.5 / 10"
                              className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold focus:ring-2 focus:ring-black dark:focus:ring-white text-zinc-900 dark:text-zinc-100"
                            />
                          </div>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={edu.details}
                        onChange={(e) => handleUpdateEducation(edu.id, "details", e.target.value)}
                        placeholder="Relevant Coursework or Honors (e.g. Data Structures, Cloud Computing, High Honors)"
                        className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold focus:ring-2 focus:ring-black dark:focus:ring-white text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. PROJECTS FORM */}
            {activeTab === "projects" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                  <h3 className="font-bold text-zinc-900 dark:text-white">Key Projects</h3>
                  <Button onClick={handleAddProject} size="sm" variant="outline" className="rounded-xl text-xs font-bold border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Project
                  </Button>
                </div>

                <div className="space-y-6">
                  {resumeData.projects.map((proj, pIdx) => (
                    <div
                      key={proj.id}
                      className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">
                          Project #{pIdx + 1}
                        </span>
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => handleUpdateProject(proj.id, "title", e.target.value)}
                          placeholder="Project Title"
                          className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold focus:ring-2 focus:ring-black dark:focus:ring-white text-zinc-900 dark:text-zinc-100"
                        />
                        <input
                          type="text"
                          value={proj.techStack}
                          onChange={(e) => handleUpdateProject(proj.id, "techStack", e.target.value)}
                          placeholder="Tech Stack (e.g. Next.js, TypeScript, PostgreSQL)"
                          className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold focus:ring-2 focus:ring-black dark:focus:ring-white text-zinc-900 dark:text-zinc-100"
                        />
                        <input
                          type="text"
                          value={proj.liveUrl}
                          onChange={(e) => handleUpdateProject(proj.id, "liveUrl", e.target.value)}
                          placeholder="Live Demo URL (optional)"
                          className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold focus:ring-2 focus:ring-black dark:focus:ring-white text-zinc-900 dark:text-zinc-100"
                        />
                        <input
                          type="text"
                          value={proj.githubUrl}
                          onChange={(e) => handleUpdateProject(proj.id, "githubUrl", e.target.value)}
                          placeholder="GitHub Repository URL (optional)"
                          className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold focus:ring-2 focus:ring-black dark:focus:ring-white text-zinc-900 dark:text-zinc-100"
                        />
                      </div>

                      {/* Bullets */}
                      <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300">
                            Project Description & Highlights
                          </span>
                          <button
                            onClick={() => handleAddProjBullet(proj.id)}
                            className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Add Highlight
                          </button>
                        </div>

                        {proj.bullets.map((bText, bIdx) => {
                          const keyId = `${proj.id}-b-${bIdx}`;
                          return (
                            <div key={bIdx} className="flex items-start gap-2">
                              <textarea
                                rows={2}
                                value={bText}
                                onChange={(e) => handleUpdateProjBullet(proj.id, bIdx, e.target.value)}
                                className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-sans leading-relaxed focus:ring-2 focus:ring-black dark:focus:ring-white text-zinc-900 dark:text-zinc-100"
                              />
                              <Button
                                onClick={() =>
                                  handleSpellCheck(
                                    bText,
                                    (corrected) => handleUpdateProjBullet(proj.id, bIdx, corrected),
                                    `${keyId}-spell`
                                  )
                                }
                                disabled={enhancingKey === `${keyId}-spell`}
                                size="sm"
                                variant="outline"
                                title="Fix spelling & grammar mistakes with AI"
                                className="shrink-0 rounded-xl px-2.5 py-1.5 h-auto text-[11px] font-bold text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                              >
                                {enhancingKey === `${keyId}-spell` ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <SpellCheck className="w-3.5 h-3.5" />
                                )}
                              </Button>
                              <Button
                                onClick={() =>
                                  handleEnhance(
                                    "bullet",
                                    bText,
                                    (enhanced) => handleUpdateProjBullet(proj.id, bIdx, enhanced),
                                    keyId
                                  )
                                }
                                disabled={enhancingKey === keyId}
                                size="sm"
                                variant="outline"
                                title="Enhance into Placify XYZ format with AI"
                                className="shrink-0 rounded-xl px-2.5 py-1.5 h-auto text-[11px] font-bold text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                              >
                                {enhancingKey === keyId ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Wand2 className="w-3.5 h-3.5" />
                                )}
                              </Button>
                              <button
                                onClick={() => handleDeleteProjBullet(proj.id, bIdx)}
                                className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. SKILLS FORM */}
            {activeTab === "skills" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                  <h3 className="font-bold text-zinc-900 dark:text-white">Technical Skills & Categories</h3>
                  <Button
                    onClick={() =>
                      handleEnhance(
                        "skills",
                        "",
                        (enhanced) =>
                          setResumeData({
                            ...resumeData,
                            skills: { ...resumeData.skills, frameworks: enhanced }
                          }),
                        "skills"
                      )
                    }
                    disabled={enhancingKey === "skills"}
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-xs font-bold text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1" /> Suggest ATS Keywords
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Programming Languages
                    </label>
                    <input
                      type="text"
                      value={resumeData.skills.languages}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          skills: { ...resumeData.skills, languages: e.target.value }
                        })
                      }
                      placeholder="e.g. JavaScript (ES6+), TypeScript, Python, Java, SQL"
                      className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold focus:ring-2 focus:ring-black dark:focus:ring-white text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Frameworks & Libraries
                    </label>
                    <input
                      type="text"
                      value={resumeData.skills.frameworks}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          skills: { ...resumeData.skills, frameworks: e.target.value }
                        })
                      }
                      placeholder="e.g. React, Next.js, Node.js, Express, Tailwind CSS"
                      className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold focus:ring-2 focus:ring-black dark:focus:ring-white text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Cloud, Databases & Tools
                    </label>
                    <input
                      type="text"
                      value={resumeData.skills.tools}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          skills: { ...resumeData.skills, tools: e.target.value }
                        })
                      }
                      placeholder="e.g. PostgreSQL, MongoDB, Redis, Docker, AWS, Git, CI/CD"
                      className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold focus:ring-2 focus:ring-black dark:focus:ring-white text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Architecture & Methodologies
                    </label>
                    <input
                      type="text"
                      value={resumeData.skills.softSkills}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          skills: { ...resumeData.skills, softSkills: e.target.value }
                        })
                      }
                      placeholder="e.g. System Design, REST APIs, Microservices, Agile/Scrum"
                      className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold focus:ring-2 focus:ring-black dark:focus:ring-white text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: Live Resume Canvas Preview */}
        <div
          className={`${
            previewMode === "editor" ? "hidden" : previewMode === "split" ? "lg:col-span-6" : "lg:col-span-12"
          } space-y-4`}
        >
          {/* Print instructions overlay banner */}
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 print:hidden px-1">
            <span className="font-mono flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" /> Live ATS Canvas (8.5&quot; x 11&quot; Standard)
            </span>
            <span className="text-[11px]">
              Ready for one-click print or save to PDF
            </span>
          </div>

          {/* THE RESUME DOCUMENT SHEET (A4 / Letter Standard) */}
          <div
            ref={printRef}
            id="printable-resume"
            className="w-full bg-white text-zinc-900 rounded-2xl shadow-xl border border-zinc-200 p-8 sm:p-10 transition-all font-sans min-h-[900px] select-text"
          >
            <ResumeTemplateRenderer template={template} resumeData={resumeData} />
          </div>
        </div>
      </div>
    </div>
  );
}
