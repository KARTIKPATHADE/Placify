"use client"

import React, { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from '@/components/ui/textarea'
import {
  LoaderCircle,
  Plus,
  Sparkles,
  Briefcase,
  FileText,
  Clock,
  Upload,
  CheckCircle2,
  FileCheck,
  X,
  Layers,
  ArrowRight,
  Crown
} from 'lucide-react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs'
import moment from 'moment';
import { useRouter } from 'next/navigation'
import { extractTextFromFile } from '@/utils/pdfExtractor'
import { toast } from 'sonner'
import { getUserPlan } from '@/utils/userPlan'

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false)
  const [jobPosition, setJobposition] = useState('')
  const [jobDesc, setJobDesc] = useState('')
  const [jobExperience, setJobExperience] = useState('')
  const [sessionRigor, setSessionRigor] = useState('standard')
  const [loading, setLoading] = useState(false)

  // Resume Ingestion States
  const [resumeText, setResumeText] = useState('')
  const [resumeFileName, setResumeFileName] = useState('')
  const [isParsingResume, setIsParsingResume] = useState(false)
  const [savedResumeFound, setSavedResumeFound] = useState(null)
  const fileInputRef = useRef(null)

  const router = useRouter()
  const { user } = useUser()

  // Check for saved Placify resumes on mount
  useEffect(() => {
    try {
      const builderData = localStorage.getItem('placify_resume_builder_data');
      if (builderData) {
        const parsed = JSON.parse(builderData);
        if (parsed?.personalInfo?.fullName) {
          setSavedResumeFound({
            name: parsed.personalInfo.fullName,
            role: parsed.personalInfo.jobTitle || 'Software Engineer',
            type: 'Resume Builder Profile',
            data: parsed
          });
        }
      }
    } catch (_) {}
  }, [openDialog]);

  // Handle file upload (.pdf, .txt, .md)
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingResume(true);
    setResumeFileName(file.name);

    try {
      const extracted = await extractTextFromFile(file);
      if (!extracted || extracted.trim().length < 30) {
        throw new Error('Could not extract readable text from this file.');
      }

      setResumeText(extracted);
      toast.success(`Resume "${file.name}" uploaded successfully!`);

      // Auto-suggest role or stack if currently empty
      if (!jobPosition) {
        const firstLine = extracted.split('\n').filter(Boolean)[1] || '';
        if (firstLine.length < 50 && !firstLine.includes('@')) {
          setJobposition(firstLine.trim());
        }
      }

      // Extract skills from resume
      const techWords = [
        'React', 'Next.js', 'Node.js', 'TypeScript', 'JavaScript', 'Python',
        'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'Redis', 'Tailwind',
        'Java', 'C++', 'SQL', 'Git', 'CI/CD', 'Kubernetes'
      ];
      const matched = techWords.filter(kw =>
        new RegExp(`\\b${kw}\\b`, 'i').test(extracted)
      );
      if (matched.length > 0 && !jobDesc) {
        setJobDesc(matched.join(', '));
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to parse resume document.');
      setResumeFileName('');
      setResumeText('');
    } finally {
      setIsParsingResume(false);
    }
  };

  // 1-Click Load from Placify Resume Builder
  const handleLoadSavedResume = () => {
    if (!savedResumeFound?.data) return;
    const data = savedResumeFound.data;
    const textRepresentation = `
CANDIDATE: ${data.personalInfo?.fullName || ''}
ROLE: ${data.personalInfo?.jobTitle || ''}
SUMMARY: ${data.summary || ''}
EXPERIENCE:
${(data.experience || []).map(e => `${e.role} at ${e.company}: ${(e.bullets || []).join(' ')}`).join('\n')}
PROJECTS:
${(data.projects || []).map(p => `${p.title} (${p.techStack}): ${(p.bullets || []).join(' ')}`).join('\n')}
SKILLS:
Languages: ${data.skills?.languages || ''}
Frameworks: ${data.skills?.frameworks || ''}
Tools: ${data.skills?.tools || ''}
`;
    setResumeText(textRepresentation);
    setResumeFileName(`Placify Resume (${savedResumeFound.name})`);
    if (data.personalInfo?.jobTitle && !jobPosition) {
      setJobposition(data.personalInfo.jobTitle);
    }
    const detectedSkills = [
      data.skills?.languages,
      data.skills?.frameworks,
      data.skills?.tools
    ].filter(Boolean).join(', ');
    if (detectedSkills && !jobDesc) {
      setJobDesc(detectedSkills);
    }
    toast.success('Loaded your Placify Resume Builder profile!');
  };

  const clearResume = () => {
    setResumeText('');
    setResumeFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const questionCount = sessionRigor === 'pro' ? 8 : (process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT || 5);

    try {
      const res = await fetch('/api/interview/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobPosition,
          jobDesc,
          jobExperience,
          resumeText,
          questionCount
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.questions) {
        throw new Error(data.error || 'Failed to generate interview questions.');
      }

      const mockJsonString = JSON.stringify(data.questions);

      const resp = await db.insert(MockInterview).values({
        mockId: uuidv4(),
        jsonMockResp: mockJsonString,
        jobPosition: jobPosition,
        jobDesc: jobDesc,
        jobExperience: jobExperience,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-yyyy')
      }).returning({ mockId: MockInterview.mockId });

      if (resp && resp[0]?.mockId) {
        setOpenDialog(false);
        toast.success(
          data.hasResume
            ? 'Generated resume-tailored & core technical interview questions!'
            : 'Generated full technical mock interview!'
        );
        router.push('/dashboard/interview/' + resp[0]?.mockId);
      }
    } catch (err) {
      console.error("Error creating interview:", err);
      toast.error(err?.message || 'Failed to configure mock interview.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Futuristic Trigger Card */}
      <div
        className="group relative h-48 rounded-3xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-black dark:hover:border-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        onClick={() => setOpenDialog(true)}
      >
        <div className="w-12 h-12 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-md group-hover:scale-110 transition-all duration-200 mb-3">
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </div>
        <h3 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors">
          + Add New Interview
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-[200px]">
          Resume-powered & core technical interview simulation
        </p>
      </div>

      {/* Futuristic Setup Modal */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white">
                <Sparkles className="w-5 h-5 text-black dark:text-white" />
              </span>
              <DialogTitle className="text-2xl font-extrabold text-zinc-900 dark:text-white">
                Configure Mock Interview
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Attach your resume to practice exact project deep-dives, or configure your target role for balanced core technical questions.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="space-y-5 mt-4">
            {/* OPTIONAL RESUME ATTACHMENT CARD */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-black dark:text-white" /> Upload Resume for Project Questions (Optional)
                </label>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
                  RECOMMENDED
                </span>
              </div>

              {resumeFileName ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700">
                  <div className="flex items-center gap-2.5">
                    <FileCheck className="w-5 h-5 text-black dark:text-white" />
                    <div>
                      <p className="text-xs font-bold text-zinc-900 dark:text-white line-clamp-1">
                        {resumeFileName}
                      </p>
                      <p className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">
                        Ready • Asking project & technical questions
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={clearResume}
                    className="p-1 rounded-lg text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.txt,.md,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="interview-resume-upload"
                    />
                    <label
                      htmlFor="interview-resume-upload"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-bold text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {isParsingResume ? 'Parsing PDF...' : 'Upload Resume (.pdf, .txt)'}
                    </label>

                    {savedResumeFound && (
                      <button
                        type="button"
                        onClick={handleLoadSavedResume}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white transition-colors cursor-pointer shadow-2xs"
                      >
                        <Layers className="w-3.5 h-3.5 text-black dark:text-white" />
                        Use Placify Resume ({savedResumeFound.name})
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    When attached, questions will deep-dive into your real resume projects, metrics, and technical stack.
                  </p>
                </div>
              )}
            </div>

            {/* Target Position */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-black dark:text-white" /> Job Role / Position
              </label>
              <Input
                placeholder="Ex. Full Stack Engineer, ML Engineer, Backend Lead"
                required
                value={jobPosition}
                onChange={(e) => setJobposition(e.target.value)}
                className="h-11 rounded-xl border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950/50 text-zinc-900 dark:text-white focus-visible:border-black dark:focus-visible:border-white focus-visible:ring-black/10 dark:focus-visible:ring-white/10"
              />
            </div>

            {/* Required Tech Stack / Skills */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-black dark:text-white" /> Tech Stack & Key Technical Skills
              </label>
              <Textarea
                placeholder="Ex. Next.js, TypeScript, PostgreSQL, System Design, Concurrency, Docker..."
                required
                rows={3}
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950/50 text-zinc-900 dark:text-white focus-visible:border-black dark:focus-visible:border-white focus-visible:ring-black/10 dark:focus-visible:ring-white/10"
              />
            </div>

            {/* Experience */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-black dark:text-white" /> Years of Experience
              </label>
              <Input
                placeholder="Ex. 3"
                type="number"
                min="0"
                max="50"
                required
                value={jobExperience}
                onChange={(e) => setJobExperience(e.target.value)}
                className="h-11 rounded-xl border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950/50 text-zinc-900 dark:text-white focus-visible:border-black dark:focus-visible:border-white focus-visible:ring-black/10 dark:focus-visible:ring-white/10"
              />
            </div>

            {/* Simulation Rigor & Pro Question Depth */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-black dark:text-white" /> Simulation Rigor
                </span>
                <span className="text-[10px] font-mono text-zinc-500 font-semibold">
                  {sessionRigor === 'pro' ? '8 Questions • FAANG Deep-Dive' : '5 Standard Questions'}
                </span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSessionRigor('standard')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    sessionRigor === 'standard'
                      ? 'border-black dark:border-white bg-zinc-100 dark:bg-zinc-800'
                      : 'border-zinc-200 dark:border-zinc-800 bg-transparent hover:border-zinc-400'
                  }`}
                >
                  <span className="text-xs font-bold block text-zinc-900 dark:text-white">Standard Round</span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">5 Questions • Balanced</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const plan = getUserPlan();
                    if (!plan.isPro) {
                      toast.info("Pro Deep-Dive selected! Generates 8-10 advanced FAANG architectural questions.");
                    }
                    setSessionRigor('pro');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                    sessionRigor === 'pro'
                      ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black shadow-md'
                      : 'border-zinc-200 dark:border-zinc-800 bg-transparent hover:border-zinc-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold block">Pro Deep-Dive</span>
                    <span className="text-[9px] font-mono font-black px-1.5 py-0.2 rounded-full bg-amber-400 text-black">
                      PRO
                    </span>
                  </div>
                  <span className={`text-[10px] font-mono block ${sessionRigor === 'pro' ? 'text-zinc-300 dark:text-zinc-700' : 'text-zinc-500 dark:text-zinc-400'}`}>
                    8 Questions • Architectural
                  </span>
                </button>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-3 border-t border-zinc-100 dark:border-white/10">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpenDialog(false)}
                className="rounded-xl font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                disabled={loading || isParsingResume}
                className="rounded-xl font-bold px-6 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <LoaderCircle className="w-4 h-4 animate-spin text-white dark:text-black" />
                    Generating Questions...
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    Generate & Start <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddNewInterview
