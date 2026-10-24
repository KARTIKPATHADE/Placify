"use client"

import { Lightbulb, Volume2, VolumeX, Sparkles, Terminal, Phone } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { speakPlacifyVoice, stopPlacifyVoice } from '@/utils/placifyVoice'

function QuestionsSection({
  mockInterviewQuestion = [],
  activeQuestionIndex = 0,
  setActiveQuestionIndex,
  onOpenLiveCall
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Stop previous question audio when switching questions or unmounting
  useEffect(() => {
    stopPlacifyVoice();
    setIsPlaying(false);
    return () => {
      stopPlacifyVoice();
    };
  }, [activeQuestionIndex]);

  // Safely extract questions array whether passed as an Array or wrapped in an Object
  const questionsList = Array.isArray(mockInterviewQuestion)
    ? mockInterviewQuestion
    : mockInterviewQuestion?.interview_questions ||
      mockInterviewQuestion?.interviewQuestions ||
      mockInterviewQuestion?.questions ||
      mockInterviewQuestion?.mockInterviewQuestions ||
      mockInterviewQuestion?.data ||
      [];

  const textToSpeech = (text) => {
    if (!text) return;
    if (isPlaying) {
      stopPlacifyVoice();
      setIsPlaying(false);
      return;
    }

    speakPlacifyVoice(text, {
      onStart: () => setIsPlaying(true),
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });
  };

  if (!questionsList || questionsList.length === 0) {
    return (
      <div className="bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs text-center text-xs font-mono text-zinc-500">
        Loading interview questions...
      </div>
    );
  }

  const currentQ = questionsList[activeQuestionIndex] || questionsList[0] || {};

  return (
    <div className="bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs space-y-6">
      {/* Question Selector Pills */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
            INTERVIEW MATRIX
          </span>
          <span className="text-[10px] font-mono text-zinc-800 dark:text-zinc-200 font-bold bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full border border-zinc-300 dark:border-zinc-700">
            AUDIO SYNTHESIS ON
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {questionsList.map((question, index) => {
            const isActive = activeQuestionIndex === index;
            return (
              <button
                key={index}
                onClick={() => setActiveQuestionIndex(index)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-black dark:bg-white text-white dark:text-black shadow-md scale-105'
                    : 'bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                Q#{index + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Question Statement */}
      <div className="bg-zinc-50/70 dark:bg-zinc-950/60 rounded-2xl p-5 border-l-4 border-l-black dark:border-l-white border border-zinc-100 dark:border-zinc-800 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono font-extrabold text-black dark:text-white uppercase tracking-wider">
              QUESTION {activeQuestionIndex + 1}
            </span>
            {currentQ?.category && (
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700">
                {currentQ?.category}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onOpenLiveCall && (
              <button
                onClick={onOpenLiveCall}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer shadow-2xs"
                title="Call AI Interviewer for live audio conversation"
              >
                <Phone className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
                <span>Call AI</span>
              </button>
            )}

            <button
              onClick={() => textToSpeech(currentQ?.question)}
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                isPlaying
                  ? 'border-rose-400 bg-rose-500/10 text-rose-600 dark:text-rose-400 animate-pulse shadow-md'
                  : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow-2xs'
              }`}
              title={isPlaying ? "Stop Question Audio" : "Read Question Aloud with Unified AI Voice"}
            >
              {isPlaying ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                  <span>Stop Audio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-black dark:text-white" />
                  <span>Play Audio</span>
                </>
              )}
            </button>
          </div>
        </div>

        <p className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white leading-snug">
          {currentQ?.question || "Loading question statement..."}
        </p>

        {currentQ?.skillsTested && (
          <div className="pt-2 border-t border-zinc-200/50 dark:border-zinc-800 flex items-center gap-1.5 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
            <span className="font-bold text-black dark:text-white">Target Skills:</span>
            <span>{currentQ?.skillsTested}</span>
          </div>
        )}
      </div>

      {/* Important Note Callout */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 bg-zinc-50/60 dark:bg-zinc-950/20 text-zinc-800 dark:text-zinc-200 space-y-1.5 shadow-2xs">
        <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-mono font-bold text-xs uppercase tracking-wider">
          <Lightbulb className="w-4 h-4 text-black dark:text-white" />
          <span>EVALUATION PROTOCOL</span>
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
          {process.env.NEXT_PUBLIC_QUESTION_NOTE || 'Click on Record Answer when you want to answer the question. At the end of interview we will give you the feedback along with correct answer for each of question and your answer to compare it.'}
        </p>
      </div>
    </div>
  );
}

export default QuestionsSection;