"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  Zap,
  Sparkles,
  Shield,
  Cpu,
  ArrowRight,
  Crown,
  Check,
  RefreshCw,
  Phone,
  Printer,
  FileText,
  Bot
} from 'lucide-react';
import { toast } from 'sonner';
import { getUserPlan, setUserPlan } from '@/utils/userPlan';
import Link from 'next/link';

export default function UpgradePage() {
  const [currentPlan, setCurrentPlan] = useState({ plan: 'free', isPro: false, name: 'Starter Simulator' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCurrentPlan(getUserPlan());

    const handlePlanUpdate = () => {
      setCurrentPlan(getUserPlan());
    };

    window.addEventListener('placify_plan_updated', handlePlanUpdate);
    return () => window.removeEventListener('placify_plan_updated', handlePlanUpdate);
  }, []);

  const handleSelectPlan = (planKey) => {
    setIsLoading(true);
    setTimeout(() => {
      const updated = setUserPlan(planKey);
      setCurrentPlan(updated || getUserPlan());
      setIsLoading(false);

      if (planKey === 'pro' || planKey === 'enterprise') {
        toast.success(`🎉 Welcome to ${planKey === 'enterprise' ? 'Enterprise Fleet' : 'Placify Pro'}! All premium features are unlocked.`);
      } else {
        toast.info("Switched to Starter Simulator Free Tier.");
      }
    }, 400);
  };

  const plans = [
    {
      id: "free",
      name: "Starter Simulator",
      badge: "FREE TIER",
      description: "Essential AI mock interviews for early-career developers.",
      price: "$0",
      period: "forever",
      features: [
        "5 AI mock interviews per month",
        "Speech-to-text live transcription",
        "Standard Gemini 2.0 evaluation",
        "Core behavioral & technical questions",
        "Community Discord support"
      ],
      buttonText: currentPlan.plan === 'free' ? "Current Plan" : "Downgrade to Starter",
      buttonVariant: "outline",
      featured: false
    },
    {
      id: "pro",
      name: "Placify Pro",
      badge: "MOST POPULAR",
      description: "Unlimited high-fidelity interview simulations with real-time Gemini Live audio calls.",
      price: "$19",
      period: "per month",
      features: [
        "Unlimited custom mock sessions",
        "Live Audio Voice Call with AI (Gemini Live)",
        "Instant low-latency evaluation & grading",
        "System architecture & coding challenge synthesis",
        "Turn-by-turn speech & posture analytics",
        "Benchmark gold-standard solutions",
        "Exportable candidate performance PDF portfolios",
        "Priority 24/7 neural compute queue"
      ],
      buttonText: currentPlan.isPro && currentPlan.plan !== 'enterprise' ? "✓ Active Plan" : "Upgrade to Placify Pro",
      buttonVariant: "default",
      featured: true
    },
    {
      id: "enterprise",
      name: "Enterprise Fleet",
      badge: "TEAMS & BOOTCAMPS",
      description: "Designed for universities, bootcamps, and hiring academies.",
      price: "$99",
      period: "per seat / mo",
      features: [
        "Everything in Placify Pro",
        "Custom company question rubrics (FAANG/Tier 1)",
        "Cohort analytics & progress tracking dashboard",
        "Live technical whiteboard integration",
        "Dedicated API throughput & custom LLM fine-tuning",
        "SLA & dedicated account architect"
      ],
      buttonText: currentPlan.plan === 'enterprise' ? "✓ Active Plan" : "Activate Enterprise Pass",
      buttonVariant: "outline",
      featured: false
    }
  ];

  return (
    <div className="space-y-10 max-w-6xl mx-auto py-4">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
          <span>PLACIFY AI PRO MEMBERSHIP</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Level Up Your Prep with <span className="underline decoration-zinc-400 underline-offset-8">Unlimited Power</span>
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg">
          Unlock unlimited role-specific interviews, real-time live audio voice dialogue, deep multi-dimensional scoring, and downloadable PDF dossiers.
        </p>

        {/* Current Active Plan Pill */}
        {currentPlan.isPro && (
          <div className="pt-2">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold shadow-xs">
              <Crown className="w-4 h-4 text-emerald-500" />
              <span>CURRENT STATUS: {currentPlan.name.toUpperCase()} ACTIVE • UNLIMITED SESSIONS UNLOCKED</span>
            </div>
          </div>
        )}
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => {
          const isCurrent = currentPlan.plan === plan.id || (plan.id === 'pro' && currentPlan.isPro && currentPlan.plan !== 'enterprise');

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 ${
                plan.featured
                  ? 'bg-black text-white dark:bg-white dark:text-black border-2 border-black dark:border-white shadow-2xl relative scale-105 z-10'
                  : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-600 backdrop-blur-md'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-black dark:bg-black dark:text-white text-[11px] font-mono font-black px-4 py-1 rounded-full border border-zinc-300 dark:border-zinc-700 shadow-md">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  {!plan.featured && (
                    <span className="text-[11px] font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">
                      {plan.badge}
                    </span>
                  )}
                  <h3 className={`text-xl font-bold flex items-center justify-between ${plan.featured ? 'text-white dark:text-black' : 'text-zinc-900 dark:text-white'}`}>
                    <span>{plan.name}</span>
                    {isCurrent && (
                      <span className={`text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full border ${
                        plan.featured
                          ? 'bg-white text-black dark:bg-black dark:text-white border-zinc-300'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                      }`}>
                        ACTIVE
                      </span>
                    )}
                  </h3>
                  <p className={`text-xs mt-1 leading-relaxed ${plan.featured ? 'text-zinc-300 dark:text-zinc-700' : 'text-zinc-500 dark:text-zinc-400'}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="pt-2">
                  <span className={`text-4xl font-black ${plan.featured ? 'text-white dark:text-black' : 'text-zinc-900 dark:text-white'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-xs font-semibold ml-1.5 ${plan.featured ? 'text-zinc-300 dark:text-zinc-700' : 'text-zinc-500 dark:text-zinc-400'}`}>
                    / {plan.period}
                  </span>
                </div>

                <div className={`pt-4 border-t space-y-3 ${plan.featured ? 'border-zinc-800 dark:border-zinc-200' : 'border-zinc-100 dark:border-zinc-800'}`}>
                  <span className={`text-xs font-mono font-bold uppercase tracking-wider block ${plan.featured ? 'text-zinc-400 dark:text-zinc-600' : 'text-zinc-400'}`}>
                    INCLUDED CAPABILITIES
                  </span>
                  <ul className={`space-y-2.5 text-xs ${plan.featured ? 'text-zinc-200 dark:text-zinc-800' : 'text-zinc-700 dark:text-zinc-300'}`}>
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2.5">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${plan.featured ? 'text-white dark:text-black' : 'text-zinc-900 dark:text-white'}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <Button
                  disabled={isLoading}
                  onClick={() => handleSelectPlan(plan.id)}
                  variant={plan.featured ? "outline" : plan.buttonVariant}
                  size="lg"
                  className={`w-full rounded-2xl font-bold cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black opacity-90'
                      : plan.featured
                        ? 'bg-white text-black hover:bg-zinc-200 dark:bg-black dark:text-white dark:hover:bg-zinc-800 border-0 shadow-lg'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 border-zinc-200 dark:border-zinc-700'
                  }`}
                >
                  {isCurrent ? (
                    <span className="flex items-center gap-1.5 justify-center">
                      <Check className="w-4 h-4" /> Current Active Plan
                    </span>
                  ) : (
                    plan.buttonText
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pro Features Showcase Matrix */}
      <div className="p-8 sm:p-10 rounded-3xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <span>What Placify Pro Members Get</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Engineered for candidates targeting top-tier tech roles, FAANG bars, and high-impact engineering leadership.
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="default" className="rounded-2xl font-bold bg-black text-white dark:bg-white dark:text-black">
              Go to Dashboard <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Live AI Voice Call</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Real-time conversational speech audio with Gemini Live. Simulates real phone screens with live AI reactions.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white">PDF Portfolios</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              1-click exportable candidate evaluation reports with detailed demeanor and technical rubrics.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white">ATS Scorer & Enhancer</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Unlimited resume bullet enhancements, Placify XYZ impact rewrites, and instant red flag audits.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white">AI Assistant Studio</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Unlimited multi-perspective reasoning queries across any technical stack with infinite architectural depth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
