"use client"

import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { useUser } from '@clerk/nextjs'
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import InterviewItemCard from './InterviewItemCard';
import { Sparkles, History, Terminal } from 'lucide-react';

function InterviewList() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      GetInterviewList();
    }
  }, [user])

  const GetInterviewList = async () => {
    try {
      setLoading(true);
      const result = await db.select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(MockInterview.id));

      setInterviewList(result || []);
    } catch (error) {
      console.error("Error loading interviews:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-black dark:text-white" />
          <h2 className="font-bold text-xl text-zinc-900 dark:text-white">Previous Mock Interviews</h2>
        </div>
        {interviewList.length > 0 && (
          <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-mono font-bold px-3 py-1 rounded-full border border-zinc-300 dark:border-zinc-700 shadow-2xs">
            {interviewList.length} SESSIONS
          </span>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 rounded-3xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-800/50 animate-pulse" />
          ))}
        </div>
      ) : interviewList && interviewList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {interviewList.map((interview, index) => (
            <InterviewItemCard interview={interview} key={interview.id || index} />
          ))}
        </div>
      ) : (
        <div className="p-8 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white mx-auto flex items-center justify-center border border-zinc-300 dark:border-zinc-700">
            <Sparkles className="w-6 h-6" />
          </div>
          <p className="font-bold text-zinc-700 dark:text-zinc-200">No mock interview sessions yet</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Initialize your first interview session above to start practicing.</p>
        </div>
      )}
    </div>
  )
}

export default InterviewList