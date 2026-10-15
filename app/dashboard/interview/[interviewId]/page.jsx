"use client"

import { Button } from '@/components/ui/button'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { Lightbulb, WebcamIcon, Sparkles, Briefcase, FileCode, Clock, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react'
import React, { use, useEffect, useState } from 'react'
import Webcam from "react-webcam";
import Link from 'next/link'

function Interview({ params }) {
  const { interviewId } = use(params)

  const [interviewData, setInterviewData] = useState();
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  const GetInterviewDetails = async () => {
    try {
      setLoading(true);
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));

      setInterviewData(result[0]);
    } catch (err) {
      console.error("Error fetching interview details:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (interviewId) {
      GetInterviewDetails();
    }
  }, [interviewId])

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> [ RETURN TO DASHBOARD ]
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2.5">
            Session Configuration <Sparkles className="w-6 h-6 text-black dark:text-white" />
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Review session telemetry and calibrate camera input before entering the live simulation room.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Column: Job Details & Info Note */}
        <div className="space-y-5">
          <div className="bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-mono font-extrabold uppercase tracking-wider text-black dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> TARGET ROLE PARAMETERS
            </h2>

            <div className="space-y-3 divide-y divide-zinc-100 dark:divide-zinc-800 text-sm">
              <div className="pt-2">
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono font-semibold block uppercase tracking-wider">Job Role</span>
                <p className="text-base font-bold text-zinc-900 dark:text-white mt-0.5">
                  {interviewData?.jobPosition || 'Loading...'}
                </p>
              </div>

              <div className="pt-3">
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono font-semibold block uppercase tracking-wider flex items-center gap-1">
                  <FileCode className="w-3.5 h-3.5 text-black dark:text-white" /> Tech Stack / Keywords
                </span>
                <p className="text-zinc-700 dark:text-zinc-300 font-medium mt-1 leading-relaxed">
                  {interviewData?.jobDesc || 'N/A'}
                </p>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono font-semibold block uppercase tracking-wider">Experience Level</span>
                  <p className="text-zinc-900 dark:text-white font-bold mt-0.5 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-black dark:text-white" />
                    {interviewData?.jobExperience || '0'} Years
                  </p>
                </div>
                <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 text-xs font-mono font-bold px-3 py-1 rounded-full shadow-2xs">
                  READY
                </span>
              </div>
            </div>
          </div>

          {/* Information Callout Card */}
          <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-100 shadow-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100">
              <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-black dark:text-white" />
              </div>
              <span className="text-base">Operating Protocol & AI Telemetry</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              {process.env.NEXT_PUBLIC_INFORMATION || 'Enable your video webcam and microphone to start your AI-generated mock interview. Audio is recorded only for answer evaluation and deleted after completion.'}
            </p>
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-zinc-700 dark:text-zinc-300">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white" /> AI Face & Expression Coach
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white" /> Real-time Eye Contact Meter
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white" /> Resume Project Deep-Dives
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white" /> External Tech Skills Prep
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Webcam Setup */}
        <div className="bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-full">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">OPTICAL FEED</span>
              {webCamEnabled ? (
                <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> FEED ACTIVE
                </span>
              ) : (
                <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 font-medium">[ STANDBY ]</span>
              )}
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-zinc-900 dark:bg-black aspect-video flex items-center justify-center border border-zinc-800 shadow-inner">
              {webCamEnabled ? (
                <Webcam
                  onUserMedia={() => setWebCamEnabled(true)}
                  onUserMediaError={() => setWebCamEnabled(false)}
                  mirrored={true}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <div className="p-8 flex flex-col items-center justify-center text-zinc-400 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-zinc-800 dark:bg-zinc-900 flex items-center justify-center text-zinc-300">
                    <WebcamIcon className="w-8 h-8 text-zinc-400" />
                  </div>
                  <p className="text-xs max-w-[220px] text-zinc-400">
                    Enable webcam feed to rehearse posture, pacing, and presence
                  </p>
                </div>
              )}
            </div>
          </div>

          {webCamEnabled ? (
            <Button
              variant="outline"
              onClick={() => setWebCamEnabled(false)}
              className="w-full rounded-2xl font-bold py-6 text-sm border-rose-300 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400"
            >
              Turn Off Camera Preview
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => setWebCamEnabled(true)}
              className="w-full rounded-2xl font-bold py-6 text-sm border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white"
            >
              Enable Camera & Microphone Feed
            </Button>
          )}

          <div className="w-full pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
            <Link href={'/dashboard/interview/' + interviewId + '/start'} className="w-full">
              <Button
                variant="default"
                size="lg"
                className="w-full rounded-2xl font-extrabold bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-lg py-6 text-base"
              >
                Enter Simulation Room <ArrowRight className="w-5 h-5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Interview