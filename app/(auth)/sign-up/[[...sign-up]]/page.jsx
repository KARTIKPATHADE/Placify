import { SignUp } from '@clerk/nextjs'
import Image from "next/image";
import Link from "next/link";
import { Sparkles, CheckCircle2, ArrowLeft, Cpu } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Page() {
  return (
    <section className="min-h-screen bg-white dark:bg-black flex flex-col lg:flex-row font-sans selection:bg-zinc-800 selection:text-white dark:selection:bg-zinc-200 dark:selection:text-black transition-colors duration-200">
      {/* Left Futuristic Branding & Highlights Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black text-white p-12 flex-col justify-between overflow-hidden border-r border-zinc-800">
        {/* Decorative background glow accents */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-zinc-800/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-zinc-900/40 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

        {/* Top Header Logo in High-Tech Floating Card */}
        <div className="relative z-10 flex items-center gap-3">
          <Link href="/">
            <div className="bg-white/95 dark:bg-zinc-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-zinc-200/50 dark:border-zinc-800 shadow-lg inline-block hover:scale-105 transition-all duration-200" suppressHydrationWarning>
              <Image
                src="/logo.svg"
                width={150}
                height={36}
                alt="Placify Logo"
                priority
                suppressHydrationWarning
                className="h-8 w-auto"
              />
            </div>
          </Link>
        </div>

        {/* Middle Content Section */}
        <div className="relative z-10 max-w-lg my-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 text-zinc-100 text-xs font-mono font-bold border border-zinc-800 backdrop-blur-md shadow-2xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span>CREATE CANDIDATE ACCOUNT</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight">
            Start Your <span className="underline decoration-zinc-500 underline-offset-8">AI-Powered</span> Interview Preparation
          </h1>

          <p className="text-zinc-400 text-base leading-relaxed">
            Create your account to access unlimited AI mock interviews, practice with realistic speech input, and build unshakeable interview confidence.
          </p>

          <div className="space-y-4 pt-2 text-sm text-zinc-300">
            <div className="flex items-start gap-3">
              <div className="p-1 rounded-full bg-zinc-800 text-white mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>Free personalized mock sessions for any role</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-1 rounded-full bg-zinc-800 text-white mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>Instant AI grading & comprehensive answer critique</span>
            </div>
          </div>
        </div>

        {/* Bottom Footer Note */}
        <div className="relative z-10 pt-6 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-500">
          <span suppressHydrationWarning>© {new Date().getFullYear()} PLACIFY AI • PLATFORM v3.0</span>
          <Link href="/" className="hover:text-white transition-colors flex items-center gap-1 font-semibold">
            <ArrowLeft className="w-3 h-3" /> [ RETURN TO HOME ]
          </Link>
        </div>
      </div>

      {/* Right Clerk Auth Form Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 bg-white dark:bg-black backdrop-blur-xl relative transition-colors duration-200">
        <div className="w-full max-w-md flex items-center justify-between mb-8 lg:hidden">
          <Link href="/">
            <Image
              src="/logo.svg"
              width={140}
              height={34}
              alt="Placify Logo"
              priority
              suppressHydrationWarning
              className="h-8 w-auto"
            />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/" className="text-xs font-semibold text-zinc-500 hover:text-black dark:hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Link>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-3 absolute top-8 right-8">
          <ThemeToggle />
          <Link href="/" className="text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>

        <div className="w-full max-w-md flex justify-center items-center">
          <SignUp />
        </div>
      </div>
    </section>
  );
}