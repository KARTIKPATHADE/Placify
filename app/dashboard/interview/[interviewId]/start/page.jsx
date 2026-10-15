"use client"

import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { use, useEffect, useState } from 'react';
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import LiveAIVoiceCallModal from './_components/LiveAIVoiceCallModal';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Award, CheckCircle, Radio, Phone, Loader2, AlertCircle } from 'lucide-react';

/**
 * Robust normalizer for interview questions.
 * Handles arrays, nested object keys (interview_questions, questions, data, etc.),
 * and double-stringified JSON.
 */
export function normalizeInterviewQuestions(raw) {
  if (!raw) return [];
  let data = raw;

  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
      if (typeof data === "string") {
        data = JSON.parse(data);
      }
    } catch (e) {
      console.warn("Failed to parse interview questions JSON:", e);
      return [];
    }
  }

  if (Array.isArray(data)) {
    return data;
  }

  if (typeof data === "object" && data !== null) {
    if (Array.isArray(data.interview_questions)) return data.interview_questions;
    if (Array.isArray(data.interviewQuestions)) return data.interviewQuestions;
    if (Array.isArray(data.questions)) return data.questions;
    if (Array.isArray(data.mockInterviewQuestions)) return data.mockInterviewQuestions;
    if (Array.isArray(data.mockInterviewQuestion)) return data.mockInterviewQuestion;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.qaBreakdown)) return data.qaBreakdown;

    const values = Object.values(data);
    const candidateArray = values.find(v => Array.isArray(v));
    if (candidateArray) return candidateArray;

    if (values.length > 0 && values.every(v => typeof v === "object" && v !== null && (v.question || v.q))) {
      return values;
    }

    if (data.question) {
      return [data];
    }
  }

  return [];
}

function StartInterview({ params }) {
  const { interviewId } = use(params);

  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [isLiveCallOpen, setIsLiveCallOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (interviewId) {
      GetInterviewDetails();
    }
  }, [interviewId]);

  const GetInterviewDetails = async () => {
    try {
      setLoading(true);
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));

      if (result.length === 0) {
        console.warn("Interview not found:", interviewId);
        setNotFound(true);
        setLoading(false);
        return;
      }

      const normalized = normalizeInterviewQuestions(result[0].jsonMockResp);
      setMockInterviewQuestion(normalized);
      setInterviewData(result[0]);
    } catch (err) {
      console.error("Error loading interview details:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalQuestions = Array.isArray(mockInterviewQuestion) && mockInterviewQuestion.length > 0 
    ? mockInterviewQuestion.length 
    : 1;
  const progressPercent = Math.round(((activeQuestionIndex + 1) / totalQuestions) * 100);

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-9 h-9 text-black dark:text-white animate-spin" />
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
          Loading Simulation Environment...
        </p>
      </div>
    );
  }

  // Not Found State
  if (notFound || !interviewData) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center space-y-4 shadow-xl">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-extrabold text-zinc-900 dark:text-white">
          Interview Session Not Found
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          We could not locate this interview session. It may have expired or been removed.
        </p>
        <Link href="/dashboard" className="block pt-2">
          <Button className="w-full rounded-2xl bg-black text-white dark:bg-white dark:text-black">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header & Cyber Progress Bar */}
      <div className="bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 animate-pulse text-black dark:text-white" /> SIMULATION IN PROGRESS
          </span>
          <h2 className="text-lg font-extrabold text-zinc-900 dark:text-white mt-0.5">
            {interviewData?.jobPosition || 'Technical Mock Interview'}
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Live Call to AI Trigger Button */}
          <Button
            onClick={() => setIsLiveCallOpen(true)}
            className="rounded-full px-5 py-2.5 font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
            title="Start live interactive voice conversation with AI Interviewer"
          >
            <Phone className="w-4 h-4 text-white animate-bounce" />
            <span>Call AI (Live Audio Conversation)</span>
          </Button>

          <div className="w-full sm:w-52 space-y-1.5">
            <div className="flex justify-between text-xs font-mono font-bold text-zinc-600 dark:text-zinc-300">
              <span>PROGRESS</span>
              <span className="text-black dark:text-white font-extrabold">
                {activeQuestionIndex + 1} / {totalQuestions}
              </span>
            </div>
            <div className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-zinc-200/50 dark:border-zinc-800">
              <div
                className="h-full bg-black dark:bg-white rounded-full transition-all duration-300 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Questions Left, Video/Mic Right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Questions Section */}
        <QuestionsSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          setActiveQuestionIndex={setActiveQuestionIndex}
          onOpenLiveCall={() => setIsLiveCallOpen(true)}
        />

        {/* Video / Audio Recording */}
        <RecordAnswerSection 
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          setActiveQuestionIndex={setActiveQuestionIndex}
          interviewData={interviewData}
          onOpenLiveCall={() => setIsLiveCallOpen(true)}
        />
      </div>

      {/* Navigation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <div>
          {activeQuestionIndex > 0 ? (
            <Button
              variant="outline"
              onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
              className="rounded-2xl font-bold px-5 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Previous Question
            </Button>
          ) : <div />}
        </div>

        <div className="flex items-center gap-3">
          {activeQuestionIndex !== totalQuestions - 1 ? (
            <Button
              variant="default"
              onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
              className="rounded-2xl font-bold px-6 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-md"
            >
              Next Question <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          ) : (
            <Link href={'/dashboard/interview/' + interviewData?.mockId + "/feedback"}>
              <Button
                variant="default"
                className="rounded-2xl font-extrabold px-7 text-sm bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-md"
              >
                Conclude & View Feedback <CheckCircle className="w-4 h-4 ml-1.5 text-white dark:text-black" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Live AI Voice Call Interactive Session Modal */}
      <LiveAIVoiceCallModal
        isOpen={isLiveCallOpen}
        onClose={() => setIsLiveCallOpen(false)}
        mockInterviewQuestion={mockInterviewQuestion}
        activeQuestionIndex={activeQuestionIndex}
        setActiveQuestionIndex={setActiveQuestionIndex}
        interviewData={interviewData}
      />
    </div>
  );
}

export default StartInterview;