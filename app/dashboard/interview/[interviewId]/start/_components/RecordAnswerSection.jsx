"use client"

import Webcam from 'react-webcam'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  Mic,
  Square,
  LoaderCircle,
  Sparkles,
  Activity,
  Radio,
  Eye,
  Smile,
  ShieldCheck,
  CheckCircle2,
  Lightbulb,
  Video,
  VideoOff,
  Phone
} from 'lucide-react'
import { toast } from 'sonner'
import { UserAnswer } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { db } from '@/utils/db'
import moment from 'moment'

const HOW_TO_LOOK_SUGGESTIONS = [
  "Look directly into the camera lens — this projects natural, direct eye contact with your interviewer.",
  "Smile gently when beginning your answer to build immediate rapport and convey warmth.",
  "Sit upright with relaxed shoulders to project confident executive poise.",
  "Keep your chin level and avoid glancing down at the keyboard while speaking.",
  "Use subtle, natural hand gestures within the frame to express passion and clarity.",
  "Maintain steady, calm breathing to keep your facial muscles relaxed and confident."
];

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData, onOpenLiveCall }) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const questionsList = Array.isArray(mockInterviewQuestion)
    ? mockInterviewQuestion
    : mockInterviewQuestion?.interview_questions ||
      mockInterviewQuestion?.interviewQuestions ||
      mockInterviewQuestion?.questions ||
      mockInterviewQuestion?.mockInterviewQuestions ||
      mockInterviewQuestion?.data ||
      [];

  // Camera feed toggle state (Camera ON / OFF)
  const [isCameraOn, setIsCameraOn] = useState(true);

  const toggleCamera = () => {
    setIsCameraOn((prev) => {
      const next = !prev;
      if (!next) {
        try {
          if (webcamRef.current?.video?.srcObject) {
            const tracks = webcamRef.current.video.srcObject.getTracks();
            tracks.forEach((t) => t.stop());
          }
        } catch (_) {}
        setExpression('Camera Off');
        setPostureStatus('Disabled');
        toast.info('Camera turned off (Privacy Mode). Microphone is still recording your answer.');
      } else {
        toast.success('Camera feed turned on.');
      }
      return next;
    });
  };

  // Optical Face Expression & Demeanor States
  const [showVisionHUD, setShowVisionHUD] = useState(true);
  const [expression, setExpression] = useState('Confident & Focused');
  const [eyeContactScore, setEyeContactScore] = useState(92);
  const [presenceScore, setPresenceScore] = useState(88);
  const [postureStatus, setPostureStatus] = useState('Upright & Centered');
  const [currentLookSuggestion, setCurrentLookSuggestion] = useState(HOW_TO_LOOK_SUGGESTIONS[0]);

  // Session telemetry accumulation during answer recording
  const telemetryHistoryRef = useRef([]);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const prevFrameDataRef = useRef(null);
  const recognitionRef = useRef(null);

  // 1. REAL-TIME OPTICAL FACE EXPRESSION & DEMEANOR TRACKER
  useEffect(() => {
    let suggestionIndex = 0;
    const interval = setInterval(() => {
      // Rotate coaching suggestion periodically
      suggestionIndex = (suggestionIndex + 1) % HOW_TO_LOOK_SUGGESTIONS.length;
      setCurrentLookSuggestion(HOW_TO_LOOK_SUGGESTIONS[suggestionIndex]);

      if (!isCameraOn) {
        setExpression('Camera Off');
        return;
      }

      // Sample webcam video frame for optical cues
      if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.readyState === 4) {
        try {
          const video = webcamRef.current.video;
          const canvas = canvasRef.current || document.createElement('canvas');
          if (!canvasRef.current) canvasRef.current = canvas;
          canvas.width = 160;
          canvas.height = 120;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (!ctx) return;

          ctx.drawImage(video, 0, 0, 160, 120);
          const frame = ctx.getImageData(0, 0, 160, 120);
          const data = frame.data;

          // Analyze skin tone, luminance distribution & motion
          let skinPixels = 0;
          let sumX = 0;
          let sumY = 0;
          let upperLuminance = 0;
          let lowerLuminance = 0;
          let diffSum = 0;

          const prevData = prevFrameDataRef.current;

          for (let i = 0; i < data.length; i += 16) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const pixelIdx = i / 4;
            const x = pixelIdx % 160;
            const y = Math.floor(pixelIdx / 160);

            // Simple robust skin-tone threshold in normalized RGB
            if (r > 60 && g > 40 && b > 20 && r > b && (r - g) > 8) {
              skinPixels++;
              sumX += x;
              sumY += y;
            }

            // Luminance
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            if (y < 60) upperLuminance += lum;
            else lowerLuminance += lum;

            // Motion jitter detection
            if (prevData) {
              diffSum += Math.abs(r - prevData[i]) + Math.abs(g - prevData[i + 1]);
            }
          }

          prevFrameDataRef.current = data;

          if (skinPixels > 100) {
            const centerX = sumX / skinPixels;
            const centerY = sumY / skinPixels;

            // Distance from center of frame
            const dx = Math.abs(centerX - 80);
            const dy = Math.abs(centerY - 50);

            // Eye Contact & Alignment (closer to center means looking forward at camera)
            const eyeAlignment = Math.max(70, Math.min(98, Math.round(100 - dx * 0.4 - dy * 0.3)));
            setEyeContactScore(eyeAlignment);

            // Posture
            if (dx < 20 && dy < 25) {
              setPostureStatus('Upright & Centered');
            } else if (dy > 30) {
              setPostureStatus('Looking Downward');
            } else {
              setPostureStatus('Tilted / Off-Center');
            }

            // Expression classification
            const lumRatio = lowerLuminance / (upperLuminance || 1);
            const jitter = diffSum / (data.length / 16);

            let detectedExpr = 'Confident & Focused';
            let presenceVal = 88;

            if (lumRatio > 1.08) {
              detectedExpr = 'Smiling & Warm';
              presenceVal = 94;
            } else if (jitter > 35) {
              detectedExpr = 'Animated & Expressive';
              presenceVal = 86;
            } else if (dy > 30 || eyeAlignment < 78) {
              detectedExpr = 'Looking Down / Away';
              presenceVal = 76;
            } else if (jitter < 8) {
              detectedExpr = 'Thoughtful & Calm';
              presenceVal = 90;
            } else {
              detectedExpr = 'Confident & Focused';
              presenceVal = 89;
            }

            setExpression(detectedExpr);
            setPresenceScore(presenceVal);

            // If recording an answer, accumulate into telemetry
            if (isRecording) {
              telemetryHistoryRef.current.push({
                expression: detectedExpr,
                eyeContact: eyeAlignment,
                presence: presenceVal,
                posture: dx < 20 && dy < 25 ? 'Upright' : 'Slightly Off'
              });
            }
          }
        } catch (_) {}
      }
    }, 850);

    return () => clearInterval(interval);
  }, [isRecording, isCameraOn]);

  // 2. SPEECH-TO-TEXT LOGIC
  const startSpeechToText = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        setUserAnswer((prev) => prev + finalTranscript + ' ');
      }
    };

    recognition.onerror = (event) => {
      console.log('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    // Reset telemetry accumulator for this answer
    telemetryHistoryRef.current = [];
    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
    toast.info('Audio capture started. Speak clearly into your microphone.');
  };

  const stopSpeechToText = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  useEffect(() => {
    if (!isRecording && userAnswer.trim().length > 10) {
      UpdateUserAnswer();
    }
  }, [isRecording]);

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };

  // 3. ANSWER EVALUATION (VERBAL + FACIAL EXPRESSION & LOOK SUGGESTIONS)
  const UpdateUserAnswer = async () => {
    setLoading(true);

    // Compute session average telemetry
    const history = telemetryHistoryRef.current;
    let avgEyeContact = eyeContactScore;
    let avgPresence = presenceScore;
    let dominantExpr = expression;

    if (history.length > 0) {
      avgEyeContact = Math.round(
        history.reduce((acc, h) => acc + h.eyeContact, 0) / history.length
      );
      avgPresence = Math.round(
        history.reduce((acc, h) => acc + h.presence, 0) / history.length
      );
      // Frequency of expressions
      const counts = {};
      history.forEach((h) => {
        counts[h.expression] = (counts[h.expression] || 0) + 1;
      });
      dominantExpr = Object.keys(counts).reduce((a, b) =>
        counts[a] > counts[b] ? a : b
      );
    }

    try {
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionsList[activeQuestionIndex]?.question,
          correctAns: questionsList[activeQuestionIndex]?.answer,
          userAns: userAnswer,
          visualTelemetry: {
            dominantExpression: dominantExpr,
            eyeContactPercent: avgEyeContact,
            presenceScore: avgPresence,
            postureStatus: postureStatus
          }
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.evaluation) {
        throw new Error(data.error || 'Evaluation failed.');
      }

      const evaluation = data.evaluation;

      // Save to database
      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: questionsList[activeQuestionIndex]?.question,
        correctAns: questionsList[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: JSON.stringify(evaluation),
        rating: String(evaluation.rating || 7),
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-yyyy')
      });

      if (resp) {
        toast.success('Response & visual demeanor evaluated by Gemini AI!');
        setUserAnswer('');
      }
    } catch (err) {
      console.error('Error evaluating answer:', err);
      toast.error('Evaluation capture failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs flex flex-col items-center text-center space-y-5">
      {/* Hidden Offscreen Canvas for Optical Analysis */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Studio Optical Feed with Real-Time Face Expression HUD */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-zinc-900 dark:bg-black border-2 border-zinc-800 shadow-inner flex items-center justify-center">
        {/* Background Placeholder */}
        <Image
          src="/webcam.png"
          width={140}
          height={140}
          className="absolute opacity-20 pointer-events-none"
          alt="Webcam Placeholder"
          suppressHydrationWarning
        />

        {/* Live Webcam Element or Camera Off Placeholder */}
        {isCameraOn ? (
          <Webcam
            ref={webcamRef}
            mirrored={true}
            audio={false}
            className="w-full h-full object-cover z-10"
          />
        ) : (
          <div className="w-full h-full z-10 flex flex-col items-center justify-center p-6 bg-zinc-950/95 text-white space-y-3 select-none">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center shadow-lg relative">
              <VideoOff className="w-7 h-7 text-zinc-400" />
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-zinc-950" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono font-bold text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                CAMERA MUTED • PRIVACY ACTIVE
              </div>
              <p className="text-xs text-zinc-400 max-w-xs">
                Camera feed is disabled. Your microphone & speech recognition remain active for your answers.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={toggleCamera}
              className="rounded-full px-4 py-1.5 text-xs font-bold bg-white text-black hover:bg-zinc-200 border-0 shadow-md cursor-pointer mt-1"
            >
              <Video className="w-3.5 h-3.5 mr-1.5 text-black" />
              Turn Camera On
            </Button>
          </div>
        )}

        {/* TOP HUD BAR: Real-Time Face Expression, Camera Toggle & Eye Contact */}
        <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Expression Pill (or Camera Off indicator) */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {showVisionHUD && (
              <div className="flex items-center gap-2 bg-black/85 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20 text-xs font-mono font-bold text-white shadow-lg">
                <span className={`w-2 h-2 rounded-full ${isCameraOn ? 'bg-white animate-ping' : 'bg-rose-500'}`} />
                <span className="text-zinc-400">EXPRESSION:</span>
                <span>{expression}</span>
              </div>
            )}
          </div>

          {/* Quick Camera & Eye Contact Telemetry */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Direct Camera On/Off Toggle Button */}
            <button
              type="button"
              onClick={toggleCamera}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-mono font-bold shadow-lg transition-all cursor-pointer ${
                isCameraOn
                  ? 'bg-black/85 backdrop-blur-md border-white/20 text-white hover:bg-zinc-900'
                  : 'bg-rose-950/85 backdrop-blur-md border-rose-500/40 text-rose-200 hover:bg-rose-900'
              }`}
              title={isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
            >
              {isCameraOn ? (
                <>
                  <Video className="w-3.5 h-3.5 text-emerald-400" />
                  <span>CAM ON</span>
                </>
              ) : (
                <>
                  <VideoOff className="w-3.5 h-3.5 text-rose-400" />
                  <span>CAM OFF</span>
                </>
              )}
            </button>

            {showVisionHUD && isCameraOn && (
              <>
                <div className="bg-black/85 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20 text-xs font-mono font-bold text-white shadow-lg flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-white" />
                  <span className="text-zinc-400">EYE CONTACT:</span>
                  <span>{eyeContactScore}%</span>
                </div>
                <div className="hidden sm:flex bg-black/85 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20 text-xs font-mono font-bold text-white shadow-lg items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  <span className="text-zinc-400">PRESENCE:</span>
                  <span>{presenceScore}/100</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Recording Active Banner */}
        {isRecording && (
          <div className="absolute top-13 right-3 z-30 flex items-center gap-2 bg-black/90 text-white text-xs font-mono font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-md border border-white/30 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            LIVE AUDIO & VISION STREAM
          </div>
        )}

        {/* BOTTOM HUD: "HOW TO LOOK" DYNAMIC COACHING TIP */}
        {showVisionHUD && (
          <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between gap-2 bg-black/90 backdrop-blur-md p-2.5 rounded-xl border border-white/20 text-white text-left shadow-xl pointer-events-auto">
            <div className="flex items-center gap-2 min-w-0">
              <span className="p-1 rounded-lg bg-white/10 text-white shrink-0">
                <Lightbulb className="w-4 h-4 text-white" />
              </span>
              <p className="text-[11px] sm:text-xs text-zinc-200 font-medium leading-tight line-clamp-2">
                <strong className="text-white font-bold uppercase tracking-wider text-[10px] mr-1 block sm:inline">
                  Interview Presence Tip:
                </strong>
                {currentLookSuggestion}
              </p>
            </div>

            {/* Toggle HUD Button */}
            <button
              type="button"
              onClick={() => setShowVisionHUD(!showVisionHUD)}
              className="text-[10px] font-mono font-bold text-zinc-400 hover:text-white px-2 py-1 rounded-lg bg-white/10 shrink-0 transition-colors cursor-pointer"
              title="Toggle AI Vision HUD"
            >
              HUD {showVisionHUD ? 'ON' : 'OFF'}
            </button>
          </div>
        )}

        {/* Audio Equalizer Waveform Overlay */}
        {isRecording && (
          <div className="absolute bottom-16 left-4 z-20 flex items-end gap-1.5 h-6 px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/20 shadow-md">
            <span className="w-1 bg-white rounded-full animate-bounce" style={{ height: '70%', animationDelay: '0ms' }} />
            <span className="w-1 bg-zinc-300 rounded-full animate-bounce" style={{ height: '95%', animationDelay: '120ms' }} />
            <span className="w-1 bg-zinc-400 rounded-full animate-bounce" style={{ height: '45%', animationDelay: '240ms' }} />
            <span className="w-1 bg-white rounded-full animate-bounce" style={{ height: '85%', animationDelay: '80ms' }} />
            <span className="w-1 bg-zinc-300 rounded-full animate-bounce" style={{ height: '60%', animationDelay: '180ms' }} />
            <span className="w-1 bg-white rounded-full animate-bounce" style={{ height: '100%', animationDelay: '300ms' }} />
          </div>
        )}
      </div>

      {/* Live Transcript Snippet */}
      {userAnswer && (
        <div className="w-full text-left p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-mono font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider text-[11px]">
            <Radio className="w-3.5 h-3.5 text-black dark:text-white animate-pulse" /> SPEECH TRANSCRIPT STREAM
          </div>
          <p className="line-clamp-3 italic text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">
            "{userAnswer}"
          </p>
        </div>
      )}

      {/* Recording & Live Call Action Buttons */}
      <div className="w-full flex flex-col items-center gap-3">
        <div className="flex flex-wrap items-center justify-center gap-3 w-full">
          <Button
            disabled={loading}
            onClick={StartStopRecording}
            size="lg"
            className={`rounded-full px-7 py-6 font-bold text-sm sm:text-base transition-all duration-200 shadow-md cursor-pointer ${
              isRecording
                ? 'bg-zinc-900 text-white border-2 border-white animate-pulse'
                : 'bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-lg'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2 text-white dark:text-black font-mono">
                <LoaderCircle className="w-5 h-5 animate-spin text-white dark:text-black" />
                Evaluating Answer...
              </span>
            ) : isRecording ? (
              <span className="flex items-center gap-2">
                <Square className="w-4 h-4 fill-white" />
                Conclude Recording
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-white dark:text-black" />
                Record Answer
              </span>
            )}
          </Button>

          {/* Camera ON / OFF Toggle Button */}
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={toggleCamera}
            className={`rounded-full px-5 py-6 font-bold text-sm sm:text-base border shadow-md flex items-center gap-2 cursor-pointer transition-all ${
              isCameraOn
                ? 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                : 'border-rose-500/50 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20'
            }`}
            title={isCameraOn ? "Turn camera off for privacy" : "Turn camera on for posture & eye contact coaching"}
          >
            {isCameraOn ? (
              <>
                <Video className="w-4 h-4 text-emerald-500" />
                <span>Camera On</span>
              </>
            ) : (
              <>
                <VideoOff className="w-4 h-4 text-rose-500" />
                <span>Camera Off</span>
              </>
            )}
          </Button>

          {/* Live Audio Call with AI Button */}
          {onOpenLiveCall && !isRecording && (
            <Button
              type="button"
              disabled={loading}
              onClick={onOpenLiveCall}
              size="lg"
              className="rounded-full px-6 py-6 font-bold text-sm sm:text-base bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
              title="Start real-time live audio voice dialogue with AI Interviewer"
            >
              <Phone className="w-4 h-4 text-white animate-bounce" />
              <span>Call AI Interviewer</span>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 dark:text-zinc-400">
          <span>
            {isRecording
              ? '[ AUDIO & OPTICAL TRACKING ACTIVE • CLICK TO CONCLUDE ]'
              : '[ READY TO TRANSMIT AUDIO RESPONSE ]'}
          </span>
          <button
            type="button"
            onClick={() => setShowVisionHUD(!showVisionHUD)}
            className="hover:text-black dark:hover:text-white underline cursor-pointer"
          >
            {showVisionHUD ? 'Hide Vision HUD' : 'Show Vision HUD'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RecordAnswerSection