"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import VantaRingsHero from "@/components/VantaRingsHero";
import PlacifyVantaLogo from "@/components/PlacifyVantaLogo";
import {
  ArrowRight,
  Sparkles,
  Bot,
  Video,
  Mic,
  BrainCircuit,
  CheckCircle2,
  Zap,
  BarChart3,
  ShieldCheck,
  Award,
  ChevronRight,
  Menu,
  X,
  Star,
  PlayCircle,
  FileCheck2,
  Terminal,
  Cpu,
  FileText,
  Wand2,
  GraduationCap
} from "lucide-react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How does the AI Mock Interview system work?",
      answer:
        "Simply enter your desired job position, job description or tech stack, and years of experience. Our Gemini-powered neural engine generates customized technical and behavioral interview questions. You answer via audio/video, and the AI evaluates your response with real-time scoring and constructive feedback."
    },
    {
      question: "Will I get instant feedback on my spoken answers?",
      answer:
        "Yes! As soon as you record and submit your answer, our AI analyzes your speech transcript, key arguments, and technical correctness to provide a rating out of 10, sample ideal answers, and actionable suggestions for improvement."
    },
    {
      question: "Can I practice for any tech stack or industry role?",
      answer:
        "Absolutely. Whether you are a Full Stack Developer, ML Engineer, Product Manager, or Cloud Architect, you can tailor the interview settings to any role, technology stack, or seniority level."
    },
    {
      question: "Do I need a webcam and microphone?",
      answer:
        "Yes, to get the full interactive experience with speech-to-text recording, you'll need a working microphone and optional webcam to simulate a realistic video interview environment."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-black dark:text-white font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-200 relative">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/95 dark:bg-black/95 border-b border-zinc-200 dark:border-zinc-800 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlacifyVantaLogo href="/" size="md" showBadge={true} animated={true} />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold">
            <a href="#features" className="px-3.5 py-1.5 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors">
              Features
            </a>
            <Link href="/dashboard/resume-analyzer" className="px-3 py-1.5 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1 font-bold">
              <FileText className="w-3 h-3 text-zinc-500" /> Resume Analyzer
            </Link>
            <Link href="/dashboard/resume-builder" className="px-3 py-1.5 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1 font-bold">
              <Wand2 className="w-3 h-3 text-zinc-500" /> Resume Builder
            </Link>
            <Link href="/dashboard/assistant" className="px-3 py-1.5 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1 font-bold">
              <Sparkles className="w-3 h-3 text-zinc-500" /> AI Assistant
            </Link>
            <a href="#faq" className="px-3.5 py-1.5 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Desktop Controls: Theme Toggle & Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            <Link href="/dashboard">
              <Button variant="ghost" className="font-semibold text-xs text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="default" className="font-bold text-xs rounded-full px-5 shadow-sm">
                Get Started <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu & Theme Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800 px-4 pt-2 pb-6 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors"
            >
              How it works
            </a>
            <Link
              href="/dashboard/resume-analyzer"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-zinc-500" /> Resume Analyzer
            </Link>
            <Link
              href="/dashboard/resume-builder"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2"
            >
              <Wand2 className="w-4 h-4 text-zinc-500" /> Resume Builder
            </Link>
            <Link
              href="/dashboard/assistant"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-zinc-500" /> AI Assistant
            </Link>
            <a
              href="#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors"
            >
              Testimonials
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors"
            >
              FAQ
            </a>
            <div className="pt-2 flex flex-col gap-2.5">
              <Link href="/dashboard" className="w-full">
                <Button variant="outline" className="w-full justify-center">
                  Sign In
                </Button>
              </Link>
              <Link href="/dashboard" className="w-full">
                <Button variant="default" className="w-full justify-center font-bold rounded-full">
                  Get Started <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section with Live Interactive 3D Vanta Rings */}
      {/* Hero Section with Live 3D Vanta Rings in the Middle */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden border-b border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center">
        {/* 3D Vanta Rings Animation in the Middle (100% Transparent, No Box) */}
        <VantaRingsHero className="absolute inset-0 w-full h-full pointer-events-auto" />

        {/* Ambient background glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[34rem] h-96 bg-zinc-500/10 dark:bg-white/5 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          {/* Telemetry Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white/90 dark:bg-zinc-900/90 text-black dark:text-white text-xs sm:text-sm font-mono font-bold shadow-xs backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-500"></span>
            </span>
            <span>NEURAL INTERVIEW ENGINE v3.0 • READY</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight text-black dark:text-white">
            Master Every Tech Interview with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-zinc-700 to-zinc-900 dark:from-white dark:via-zinc-200 dark:to-zinc-400 font-black">
              Precision AI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Generate role-tailored technical challenges, practice live voice answers with webcam simulation, and unlock multi-dimensional scoring powered by Gemini AI.
          </p>

          {/* CTA Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                variant="default"
                size="lg"
                className="w-full sm:w-auto px-8 py-6 text-base font-bold rounded-full shadow-lg transform-gpu touch-manipulation active:scale-95 active:duration-75 cursor-pointer"
              >
                Launch Simulator Free <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 py-6 text-base font-semibold rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-md"
              >
                <PlayCircle className="w-5 h-5 mr-2 text-zinc-700 dark:text-zinc-300" /> See How It Works
              </Button>
            </a>
          </div>

          {/* Value Highlights */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 font-semibold bg-white/80 dark:bg-black/80 backdrop-blur-md py-3 px-6 rounded-full max-w-fit mx-auto border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-black dark:text-white" />
              <span>Instant AI feedback & ideal answers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-black dark:text-white" />
              <span>Tailored to your exact tech stack</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-black dark:text-white" />
              <span>Audio transcription & video preview</span>
            </div>
          </div>
        </div>

        {/* Hero Visual Card / Interactive Preview */}
        <div className="mt-14 max-w-4xl mx-auto px-4 w-full relative z-10">
          <div className="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-black dark:bg-white shadow-xs" />
                <div className="w-3.5 h-3.5 rounded-full bg-zinc-500 shadow-xs" />
                <div className="w-3.5 h-3.5 rounded-full bg-zinc-300 dark:bg-zinc-700 shadow-xs" />
                <span className="ml-2 text-xs font-mono text-zinc-500 dark:text-zinc-400 font-medium">Session: Senior Full Stack Engineer</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white border border-zinc-300 dark:border-zinc-700 text-xs font-mono px-3 py-1 rounded-full font-semibold">
                <span className="w-2 h-2 rounded-full bg-zinc-400 animate-ping" /> AI TELEMETRY
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Question & AI Prompt Column */}
              <div className="md:col-span-2 space-y-4">
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-black dark:text-white mb-1.5 uppercase tracking-wider">
                    <Bot className="w-4 h-4 text-black dark:text-white" /> AI Interviewer Question
                  </div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-relaxed">
                    &quot;Can you explain the key architectural tradeoffs between Server-Side Rendering (SSR) and Client-Side Rendering (CSR) in modern web applications?&quot;
                  </p>
                </div>

                {/* User Response Preview */}
                <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-100">
                      <Mic className="w-3.5 h-3.5 text-black dark:text-white" /> Recorded Speech Audio
                    </span>
                    <span className="font-mono text-xs text-zinc-800 dark:text-zinc-200 font-semibold bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">01:45 / 03:00</span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 italic leading-relaxed">
                    &quot;SSR pre-renders HTML on the server for each request, drastically enhancing initial page load speed and SEO crawlability. In contrast, CSR delegates rendering to client JavaScript...&quot;
                  </p>
                </div>
              </div>

              {/* AI Feedback & Score Column */}
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                    <span className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">AI EVALUATION</span>
                    <span className="text-xl font-extrabold text-black dark:text-white">9.4 / 10</span>
                  </div>
                  <div className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                      <span>Accurate breakdown of SSR vs CSR data fetching.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                      <span>Clear articulation of TTFB and hydration costs.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                      <span className="text-zinc-700 dark:text-zinc-300 font-medium">Tip: Highlight React Server Components streaming architecture.</span>
                    </div>
                  </div>
                </div>

                <Link href="/dashboard" className="mt-5">
                  <Button variant="default" size="sm" className="w-full text-xs font-bold rounded-xl shadow-xs">
                    Try Your Own Session
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono font-extrabold text-black dark:text-white uppercase tracking-widest mb-3 bg-zinc-100 dark:bg-zinc-900 inline-block px-3.5 py-1 rounded-full border border-zinc-300 dark:border-zinc-700">
              CORE CAPABILITIES
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black dark:text-white">
              Engineered for complete interview dominance
            </p>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 text-base sm:text-lg">
              Our platform pairs Gemini generative AI with speech processing and real-time metric analysis for optimal interview preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-7 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 backdrop-blur-md hover:border-black dark:hover:border-white hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group">
              <div className="w-13 h-13 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center mb-5 group-hover:scale-110 shadow-md transition-transform">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-black dark:text-white">Role-Tailored Questions</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                Provide your target position and tech stack. The AI synthesizes deep technical, architectural, and behavioral challenges.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-7 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 backdrop-blur-md hover:border-black dark:hover:border-white hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group">
              <div className="w-13 h-13 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center mb-5 group-hover:scale-110 shadow-md transition-transform">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-black dark:text-white">Voice & Video Capture</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                Answer live questions aloud with integrated webcam and real-time speech transcription to mirror actual video screenings.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-7 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 backdrop-blur-md hover:border-black dark:hover:border-white hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group">
              <div className="w-13 h-13 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center mb-5 group-hover:scale-110 shadow-md transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-black dark:text-white">Instant AI Critique</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                Receive instant ratings out of 10, identified strengths, missing technical nuances, and sample ideal answers for every query.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-7 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 backdrop-blur-md hover:border-black dark:hover:border-white hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group">
              <div className="w-13 h-13 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center mb-5 group-hover:scale-110 shadow-md transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-black dark:text-white">Scoring & Progression</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                Track your rating benchmarks across mock runs to eradicate recurring gaps and master concise technical delivery.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-7 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 backdrop-blur-md hover:border-black dark:hover:border-white hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group">
              <div className="w-13 h-13 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center mb-5 group-hover:scale-110 shadow-md transition-transform">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-black dark:text-white">Persistent Session Vault</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                Review past sessions on your dashboard to revisit suggested frameworks and reinforce technical answers on demand.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-7 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 backdrop-blur-md hover:border-black dark:hover:border-white hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group">
              <div className="w-13 h-13 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center mb-5 group-hover:scale-110 shadow-md transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-black dark:text-white">Zero Judgment Sandbox</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                Build poise without real-world stakes. Fail fast, iterate instantly, and walk into high-stakes interviews completely prepared.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono font-extrabold text-black dark:text-white uppercase tracking-widest mb-3 bg-zinc-100 dark:bg-zinc-900 inline-block px-3.5 py-1 rounded-full border border-zinc-300 dark:border-zinc-700">
              OPERATING PROTOCOL
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black dark:text-white">
              Get interview ready in 3 steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-white dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-black dark:hover:border-white hover:shadow-xl transition-all duration-200">
              <div className="w-14 h-14 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-extrabold text-xl flex items-center justify-center mb-5 shadow-md">
                1
              </div>
              <h3 className="text-lg font-bold mb-2 text-black dark:text-white">Specify Role & Stack</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Input your target job title, tech stack keywords, and experience level to calibrate the neural generator.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-white dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-black dark:hover:border-white hover:shadow-xl transition-all duration-200">
              <div className="w-14 h-14 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-extrabold text-xl flex items-center justify-center mb-5 shadow-md">
                2
              </div>
              <h3 className="text-lg font-bold mb-2 text-black dark:text-white">Dictate Live Answers</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Speak answers into your microphone and utilize webcam preview for realistic practice conditions.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-white dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-black dark:hover:border-white hover:shadow-xl transition-all duration-200">
              <div className="w-14 h-14 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-extrabold text-xl flex items-center justify-center mb-5 shadow-md">
                3
              </div>
              <h3 className="text-lg font-bold mb-2 text-black dark:text-white">Review Neural Breakdown</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Inspect scores out of 10, pinpoint omissions, and benchmark your answers against gold-standard solutions.
              </p>
            </div>
          </div>

          {/* CTA Link */}
          <div className="mt-12 text-center">
            <Link href="/dashboard">
              <Button size="lg" variant="default" className="rounded-full px-8 font-bold shadow-md">
                Initialize Practice Session <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono font-extrabold text-black dark:text-white uppercase tracking-widest mb-3 bg-zinc-100 dark:bg-zinc-900 inline-block px-3.5 py-1 rounded-full border border-zinc-300 dark:border-zinc-700">
              CANDIDATE LOGS
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black dark:text-white">
              Verified outcomes from practicing engineers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-7 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 backdrop-blur-md space-y-4 hover:border-black dark:hover:border-white hover:shadow-xl transition-all duration-200">
              <div className="flex items-center gap-1 text-black dark:text-white">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-black dark:fill-white text-black dark:text-white" />
                ))}
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 italic leading-relaxed">
                "The AI feedback was surgically precise. It detected technical omissions in my explanation of caching strategies that I had overlooked."
              </p>
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-black dark:text-white">Alex Rivera</h4>
                  <p className="text-xs text-zinc-500 font-semibold">Staff Frontend Engineer</p>
                </div>
              </div>
            </div>

            <div className="p-7 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 backdrop-blur-md space-y-4 hover:border-black dark:hover:border-white hover:shadow-xl transition-all duration-200">
              <div className="flex items-center gap-1 text-black dark:text-white">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-black dark:fill-white text-black dark:text-white" />
                ))}
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 italic leading-relaxed">
                "Live interviews used to trigger extreme nerves. Practicing 5 simulated sessions removed the anxiety completely."
              </p>
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-black dark:text-white">Priya Sharma</h4>
                  <p className="text-xs text-zinc-500 font-semibold">Full Stack Developer</p>
                </div>
              </div>
            </div>

            <div className="p-7 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 backdrop-blur-md space-y-4 hover:border-black dark:hover:border-white hover:shadow-xl transition-all duration-200">
              <div className="flex items-center gap-1 text-black dark:text-white">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-black dark:fill-white text-black dark:text-white" />
                ))}
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 italic leading-relaxed">
                "The ideal answers gave me concrete frameworks to structure my answers concisely within the 2-minute mark."
              </p>
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-black dark:text-white">David Chen</h4>
                  <p className="text-xs text-zinc-500 font-semibold">Backend Systems Architect</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs font-mono font-extrabold text-black dark:text-white uppercase tracking-widest mb-3 bg-zinc-100 dark:bg-zinc-900 inline-block px-3.5 py-1 rounded-full border border-zinc-300 dark:border-zinc-700">
              KNOWLEDGE BASE
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black dark:text-white">
              Frequently Asked Questions
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 backdrop-blur-md overflow-hidden transition-all duration-200 hover:border-black dark:hover:border-white"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 text-left font-semibold text-black dark:text-white flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                >
                  <span className={activeFaq === index ? "text-black dark:text-white font-bold" : ""}>{faq.question}</span>
                  <ChevronRight
                    className={`w-5 h-5 text-zinc-400 transition-transform duration-200 shrink-0 ${
                      activeFaq === index ? "rotate-90 text-black dark:text-white" : ""
                    }`}
                  />
                </button>
                {activeFaq === index && (
                  <div className="px-5 pb-5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-3 animate-in fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-black text-white dark:bg-zinc-950 dark:border dark:border-zinc-800 p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl border border-zinc-800">
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                Ready to Ace Your Next Job Interview?
              </h2>
              <p className="text-zinc-300 text-base sm:text-lg leading-relaxed font-medium">
                Start practicing with Gemini AI today. Generate customized questions, record your answers, and receive instant multi-metric feedback.
              </p>
              <div className="pt-3">
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="px-9 py-6 text-base font-extrabold rounded-full bg-white text-black hover:bg-zinc-200 shadow-xl transform-gpu touch-manipulation hover:scale-105 active:scale-95 active:duration-75 transition-transform duration-100 cursor-pointer"
                  >
                    Launch Interview Now <ArrowRight className="w-5 h-5 ml-2 text-black" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-black/95 py-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3" suppressHydrationWarning>
            <Image src="/logo.svg" width={130} height={32} alt="Logo" suppressHydrationWarning className="h-7 w-auto" />
            <span className="text-xs text-zinc-400 font-mono" suppressHydrationWarning>© {new Date().getFullYear()} PLACIFY AI • MONOCHROME v3.0</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
            <Link href="/dashboard" className="hover:text-black dark:hover:text-white transition-colors">
              Dashboard
            </Link>
            <a href="#features" className="hover:text-black dark:hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-black dark:hover:text-white transition-colors">
              How it Works
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
