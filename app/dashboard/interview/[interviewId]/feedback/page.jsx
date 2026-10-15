"use client"

import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import React, { useEffect, useState } from 'react'
import { eq } from 'drizzle-orm'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  ChevronsUpDown,
  Trophy,
  Star,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Eye,
  Smile,
  ShieldCheck,
  Lightbulb,
  Video,
  Printer,
  Download,
  Crown
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function parseFeedbackContent(raw) {
  if (!raw) return { feedback: '', expressionAnalysis: null };
  try {
    const parsed = JSON.parse(raw);
    if (parsed && (parsed.feedback || parsed.expressionAnalysis)) {
      return {
        feedback: parsed.feedback || '',
        expressionAnalysis: parsed.expressionAnalysis || null
      };
    }
  } catch (_) {}
  return { feedback: raw, expressionAnalysis: null };
}

function Feedback({ params }) {
  const router = useRouter();

  const [feedbackList, setFeedbackList] = useState([]);
  const [overallRating, setOverallRating] = useState(0);
  const [avgPresenceScore, setAvgPresenceScore] = useState(0);
  const [loading, setLoading] = useState(true);

  const { interviewId } = React.use(params);

  useEffect(() => {
    if (interviewId) {
      GetFeedback();
    }
  }, [interviewId])

  const GetFeedback = async () => {
    try {
      setLoading(true);
      const result = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, interviewId))
        .orderBy(UserAnswer.id);

      setFeedbackList(result || []);

      const totalRating = (result || []).reduce(
        (sum, item) => sum + Number(item.rating || 0),
        0
      );

      const averageRating = (result || []).length > 0
        ? totalRating / result.length
        : 0;

      setOverallRating(averageRating);

      // Compute average visual presence score if available
      let presenceSum = 0;
      let presenceCount = 0;
      (result || []).forEach(item => {
        const parsed = parseFeedbackContent(item.feedback);
        if (parsed.expressionAnalysis?.presenceScore) {
          presenceSum += Number(parsed.expressionAnalysis.presenceScore);
          presenceCount++;
        }
      });
      if (presenceCount > 0) {
        setAvgPresenceScore(Math.round(presenceSum / presenceCount));
      }
    } catch (err) {
      console.error("Error fetching feedback:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Navigation */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> [ RETURN TO DASHBOARD ]
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-44 rounded-3xl bg-zinc-100 dark:bg-zinc-800/60 animate-pulse border border-zinc-200/50 dark:border-zinc-800" />
          <div className="h-20 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 animate-pulse border border-zinc-200/50 dark:border-zinc-800" />
          <div className="h-20 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 animate-pulse border border-zinc-200/50 dark:border-zinc-800" />
        </div>
      ) : feedbackList?.length === 0 ? (
        <div className="bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white mx-auto flex items-center justify-center border border-zinc-300 dark:border-zinc-700">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="font-extrabold text-xl text-zinc-900 dark:text-white">No Telemetry Record Found</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            You have not transmitted answers for this interview session. Complete question recording to generate neural metrics.
          </p>
          <div className="pt-2">
            <Link href={'/dashboard/interview/' + interviewId + '/start'}>
              <Button variant="default" className="rounded-full px-6 font-bold bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-md">
                Execute Session Now
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Performance Hero Banner */}
          <div className="rounded-3xl bg-black dark:bg-zinc-950 p-8 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-zinc-800">
            <div className="space-y-2 z-10 max-w-md">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-mono font-bold text-zinc-200 border border-white/20">
                <Trophy className="w-3.5 h-3.5 text-white" />
                <span>SESSION COMPLETED • PLACIFY AUDITED</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">
                Neural Performance Metrics
              </h1>
              <p className="text-zinc-300 text-sm leading-relaxed font-medium">
                Comprehensive evaluation covering technical mastery, answer accuracy, facial expression dynamics, and interview presence suggestions.
              </p>

              {avgPresenceScore > 0 && (
                <div className="pt-1 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-zinc-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                    EXECUTIVE PRESENCE: {avgPresenceScore}/100
                  </span>
                </div>
              )}
            </div>

            {/* Score Pill Card */}
            <div className="z-10 bg-white dark:bg-zinc-900 backdrop-blur-md rounded-2xl p-6 text-center shadow-lg border border-zinc-200 dark:border-zinc-800 min-w-[190px]">
              <span className="text-xs font-mono font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
                OVERALL RATING
              </span>
              <div className="text-4xl sm:text-5xl font-black text-black dark:text-white my-1">
                {overallRating.toFixed(1)}
                <span className="text-base text-zinc-400 dark:text-zinc-500 font-bold"> / 10</span>
              </div>
              <div className="flex items-center justify-center gap-1 text-black dark:text-white">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(overallRating / 2)
                        ? 'fill-current text-black dark:text-white'
                        : 'text-zinc-300 dark:text-zinc-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Question-by-Question Accordions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <span>Detailed Metric Logs & Demeanor Coaching</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 font-bold">
                  {feedbackList.length} LOGS
                </span>
              </h3>
              <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">[ CLICK QUERY TO EXPAND ]</span>
            </div>

            {feedbackList.map((item, index) => {
              const { feedback, expressionAnalysis } = parseFeedbackContent(item.feedback);

              return (
                <Collapsible key={index} className="group">
                  <CollapsibleTrigger className="p-4 sm:p-5 bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-between gap-4 w-full text-left cursor-pointer hover:border-black dark:hover:border-white hover:shadow-xs transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white font-mono font-extrabold text-xs flex items-center justify-center shrink-0 border border-zinc-300 dark:border-zinc-700">
                        {index + 1}
                      </span>
                      <span className="font-bold text-zinc-900 dark:text-white text-sm sm:text-base line-clamp-1">
                        {item.question}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 font-mono font-extrabold text-xs px-2.5 py-1 rounded-full shadow-2xs">
                        RATING: {item.rating}/10
                      </span>
                      <ChevronsUpDown className="h-4 w-4 text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="pt-3">
                    <div className="p-5 rounded-2xl bg-zinc-50/70 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 space-y-4 text-sm animate-in fade-in duration-200">
                      {/* User's Answer */}
                      <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
                        <span className="text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                          USER SPOKEN TRANSCRIPT
                        </span>
                        <p className="text-zinc-800 dark:text-zinc-200 italic leading-relaxed font-medium">
                          "{item.userAns || 'No recorded speech transcript captured.'}"
                        </p>
                      </div>

                      {/* Model Ideal Answer */}
                      <div className="p-4 rounded-xl bg-zinc-100/70 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-700 space-y-1">
                        <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-black dark:text-white" /> BENCHMARK MODEL RESPONSE
                        </span>
                        <p className="text-zinc-900 dark:text-zinc-200 font-medium leading-relaxed">
                          {item.correctAns}
                        </p>
                      </div>

                      {/* AI Technical Feedback */}
                      <div className="p-4 rounded-xl bg-zinc-100/70 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-700 space-y-1">
                        <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-black dark:text-white" /> NEURAL DIAGNOSTIC & ANSWER CRITIQUE
                        </span>
                        <p className="text-zinc-900 dark:text-zinc-200 font-medium leading-relaxed">
                          {feedback}
                        </p>
                      </div>

                      {/* AI FACIAL EXPRESSION & INTERVIEW PRESENCE COACHING */}
                      {expressionAnalysis && (
                        <div className="p-4 rounded-xl bg-zinc-100/70 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-700 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                            <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
                              <Eye className="w-4 h-4 text-black dark:text-white" />
                              FACIAL EXPRESSION & DEMEANOR TELEMETRY
                            </span>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {expressionAnalysis.dominantExpression && (
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
                                  {expressionAnalysis.dominantExpression}
                                </span>
                              )}
                              {expressionAnalysis.eyeContactRating && (
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
                                  {expressionAnalysis.eyeContactRating}
                                </span>
                              )}
                              {expressionAnalysis.presenceScore && (
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
                                  Presence: {expressionAnalysis.presenceScore}/100
                                </span>
                              )}
                            </div>
                          </div>

                          {expressionAnalysis.critique && (
                            <p className="text-zinc-800 dark:text-zinc-200 text-xs leading-relaxed font-medium">
                              {expressionAnalysis.critique}
                            </p>
                          )}

                          {expressionAnalysis.howToLookSuggestions?.length > 0 && (
                            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-1.5">
                              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                                <Lightbulb className="w-3.5 h-3.5 text-black dark:text-white" /> How to Look & Present Yourself in Real Interviews:
                              </span>
                              <ul className="list-disc list-inside space-y-1 text-xs text-zinc-700 dark:text-zinc-300 pl-1">
                                {expressionAnalysis.howToLookSuggestions.map((sug, sIdx) => (
                                  <li key={sIdx} className="leading-relaxed font-medium">{sug}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 print:hidden">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => window.print()}
              className="rounded-full px-6 font-bold border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white flex items-center gap-2 cursor-pointer shadow-xs"
              title="Print or save candidate performance report to PDF"
            >
              <Printer className="w-4 h-4 text-black dark:text-white" />
              <span>Export Performance PDF (Pro Portfolio)</span>
              <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-black text-white dark:bg-white dark:text-black">
                PRO
              </span>
            </Button>

            <Link href="/dashboard">
              <Button variant="default" size="lg" className="rounded-full px-8 font-bold bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-md">
                Back to Dashboard <ArrowLeft className="w-4 h-4 ml-1.5 rotate-180" />
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export default Feedback
