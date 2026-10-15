import React from 'react'
import Link from 'next/link'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'
import { Sparkles, Bot, Zap, Award, Activity, Cpu, ShieldCheck, ArrowRight, FileText, Wand2, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Command Header - Sleek Obsidian / Black and White */}
      <div className="rounded-3xl bg-black text-white dark:bg-zinc-950 dark:border dark:border-zinc-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-zinc-200">
        {/* Glow overlay */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-700 px-3.5 py-1 rounded-full text-xs font-mono font-bold text-zinc-200">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-300"></span>
            </span>
            <span>NEURAL COMMAND CENTER v3.0</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            AI Interview Command Center
          </h1>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            Generate role-tailored questions using Gemini AI, practice spoken responses with webcam analysis, and get instant multi-metric feedback across the full skill spectrum.
          </p>

          <div className="pt-2 flex flex-wrap gap-3 text-xs font-mono font-semibold">
            <div className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800 text-zinc-200">
              <Bot className="w-3.5 h-3.5 text-zinc-300" />
              <span>Gemini Engine</span>
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800 text-zinc-200">
              <Activity className="w-3.5 h-3.5 text-zinc-300" />
              <span>Speech-to-Text V3</span>
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800 text-zinc-200">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-300" />
              <span>Private & Encrypted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
              <span>Start Session</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white border border-zinc-300 dark:border-zinc-700">
                ACTIVE
              </span>
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Configure your target role and technical parameters</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AddNewInterview />

          {/* AI Resume Analyzer Quick Card */}
          <Link href="/dashboard/resume-analyzer" className="group">
            <div className="p-7 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 backdrop-blur-xl hover:border-black dark:hover:border-white hover:shadow-xl transition-all duration-200 cursor-pointer h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white border border-zinc-300 dark:border-zinc-700">
                    ATS SCORER
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-black dark:text-white group-hover:underline transition-colors">
                  AI Resume Analyzer
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Upload PDF or paste text. Evaluates scores for any degree & category with red flag detection and Placify XYZ rewrites.
                </p>
              </div>

              <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-black dark:text-white group-hover:translate-x-1 transition-transform">
                <span>Audit & Score Resume</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>

          {/* AI Resume Builder Quick Card */}
          <Link href="/dashboard/resume-builder" className="group">
            <div className="p-7 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 backdrop-blur-xl hover:border-black dark:hover:border-white hover:shadow-xl transition-all duration-200 cursor-pointer h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <Wand2 className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white border border-zinc-300 dark:border-zinc-700">
                    INTERACTIVE
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-black dark:text-white group-hover:underline transition-colors">
                  AI Resume Builder
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Interactive live editor with AI bullet enhancers, real-time ATS health meter, and 1-click clean PDF print export.
                </p>
              </div>

              <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-black dark:text-white group-hover:translate-x-1 transition-transform">
                <span>Build New Resume</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>

          {/* AI Assistant Studio Quick Card */}
          <Link href="/dashboard/assistant" className="group">
            <div className="p-7 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 backdrop-blur-xl hover:border-black dark:hover:border-white hover:shadow-xl transition-all duration-200 cursor-pointer h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <Bot className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white border border-zinc-300 dark:border-zinc-700">
                    ANTI-REPETITION
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-black dark:text-white group-hover:underline transition-colors">
                  AI Interview Assistant
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Ask any technical or behavioral question for any job category with infinite tech depth and multi-perspective reasoning.
                </p>
              </div>

              <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-black dark:text-white group-hover:translate-x-1 transition-transform">
                <span>Open Assistant Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Placify Pro Membership Spotlight Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-zinc-950 via-zinc-900 to-black text-white border border-zinc-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-mono font-bold">
            <Crown className="w-3.5 h-3.5 fill-amber-400" />
            <span>PLACIFY PRO MEMBERSHIP SUITE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Unlock Real-Time Live AI Audio Calls & Executive PDF Portfolios
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Practice live voice dialogue with Gemini Live, download official candidate diagnostic dossiers, and run unlimited mock interview simulations.
          </p>
        </div>

        <div className="z-10 shrink-0">
          <Link href="/dashboard/upgrade">
            <Button
              variant="default"
              size="lg"
              className="rounded-full px-7 font-bold bg-white text-black hover:bg-zinc-200 shadow-lg cursor-pointer flex items-center gap-2 text-sm"
            >
              <span>Explore Pro Features</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Previous Interviews List */}
      <div className="pt-4 border-t border-stone-200/80 dark:border-white/10">
        <InterviewList />
      </div>
    </div>
  )
}

export default Dashboard
