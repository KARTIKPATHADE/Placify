"use client"

import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { Sparkles, Terminal, Crown } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'
import { getUserPlan } from '@/utils/userPlan'

function Header() {
  const path = usePathname();
  const [userPlan, setUserPlan] = useState({ isPro: false });

  useEffect(() => {
    setUserPlan(getUserPlan());

    const handlePlanUpdate = () => {
      setUserPlan(getUserPlan());
    };

    window.addEventListener('placify_plan_updated', handlePlanUpdate);
    return () => window.removeEventListener('placify_plan_updated', handlePlanUpdate);
  }, []);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Resume Analyzer', href: '/dashboard/resume-analyzer', badge: 'ATS' },
    { name: 'Resume Builder', href: '/dashboard/resume-builder', badge: 'NEW' },
    { name: 'AI Assistant', href: '/dashboard/assistant', badge: 'AI' },
    { name: 'Questions', href: '/dashboard/questions' },
    { name: 'Upgrade', href: '/dashboard/upgrade', badge: userPlan.isPro ? 'ACTIVE' : 'PRO' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo: Placify logo & name unchanged */}
        <Link href="/dashboard" className="flex items-center gap-2 group transition-transform hover:scale-105 active:scale-95 duration-200">
          <div className="relative" suppressHydrationWarning>
            <Image
              src="/logo.svg"
              width={160}
              height={40}
              alt="Placify Logo"
              priority
              suppressHydrationWarning
              className="relative h-9 w-auto"
            />
          </div>
        </Link>

        {/* Black & White Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          {navItems.map((item) => {
            const isActive = path === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-md scale-102'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
                }`}
              >
                {item.name}
                {item.badge && (
                  <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-md ${
                    isActive
                      ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black'
                      : 'bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-200'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right HUD Controls: Theme Toggle, Telemetry Badge & User */}
        <div className="flex items-center gap-3">
          {/* Black & White Telemetry Chip or Pro Crown Badge */}
          {userPlan.isPro ? (
            <Link
              href="/dashboard/upgrade"
              className="hidden sm:flex items-center gap-1.5 bg-black text-white dark:bg-white dark:text-black border border-zinc-700 dark:border-zinc-300 text-xs font-mono font-bold px-3.5 py-1 rounded-full shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Placify Pro Active"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>PRO ACTIVE</span>
            </Link>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-mono font-bold px-3 py-1 rounded-full shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-ping" />
              <span>AI HUD • ACTIVE</span>
            </div>
          )}

          {/* Futuristic Theme Toggle Button */}
          <ThemeToggle />

          {/* Clerk Profile Button (Accurate Concentric Circle Shape) */}
          <div className="w-9 h-9 rounded-full aspect-square shrink-0 flex items-center justify-center ring-2 ring-zinc-300 dark:ring-zinc-700 hover:ring-black dark:hover:ring-white transition-all overflow-hidden p-0 bg-transparent">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  rootBox: "w-full h-full flex items-center justify-center aspect-square m-0 p-0",
                  userButtonBox: "w-full h-full flex items-center justify-center aspect-square m-0 p-0",
                  userButtonTrigger: "w-full h-full rounded-full flex items-center justify-center p-0 m-0 aspect-square focus:outline-none focus:ring-0 focus:shadow-none border-0",
                  userButtonAvatarBox: "w-full h-full rounded-full aspect-square overflow-hidden m-0 p-0",
                  avatarBox: "w-full h-full rounded-full aspect-square overflow-hidden m-0 p-0",
                  userButtonAvatarImage: "w-full h-full rounded-full aspect-square object-cover m-0 p-0 block",
                  avatarImage: "w-full h-full rounded-full aspect-square object-cover m-0 p-0 block",
                },
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header
