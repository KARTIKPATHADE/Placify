"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  Radio,
  CheckCircle2,
  Send,
  Loader2,
  Bot,
  User,
  Activity,
  AlertCircle,
  CornerDownLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import moment from "moment";
import { useUser } from "@clerk/nextjs";
import { speakPlacifyVoice, stopPlacifyVoice } from "@/utils/placifyVoice";

export default function LiveAIVoiceCallModal({
  isOpen,
  onClose,
  mockInterviewQuestion = [],
  activeQuestionIndex = 0,
  setActiveQuestionIndex,
  interviewData,
}) {
  const { user } = useUser();

  const questionsList = Array.isArray(mockInterviewQuestion)
    ? mockInterviewQuestion
    : mockInterviewQuestion?.interview_questions ||
      mockInterviewQuestion?.interviewQuestions ||
      mockInterviewQuestion?.questions ||
      mockInterviewQuestion?.mockInterviewQuestions ||
      mockInterviewQuestion?.data ||
      [];

  // Call Lifecycle States: "connecting" | "active" | "ended"
  const [callState, setCallState] = useState("connecting");
  // Turn State: "ai_speaking" | "user_listening" | "ai_thinking"
  const [turnState, setTurnState] = useState("ai_speaking");
  const [isMuted, setIsMuted] = useState(false);
  const [isAiMuted, setIsAiMuted] = useState(false);

  // Call Timer
  const [callDuration, setCallDuration] = useState(0);

  // Spoken Transcript Accumulator for current turn & full session
  const [currentSpeech, setCurrentSpeech] = useState("");
  const [manualInput, setManualInput] = useState("");
  const [conversation, setConversation] = useState([]);
  const [audioLevel, setAudioLevel] = useState(15); // 0-100 live microphone volume meter
  const [silenceCountdown, setSilenceCountdown] = useState(null); // seconds until auto-turn send

  // Refs for Speech APIs and State synchronization to prevent closure lag
  const recognitionRef = useRef(null);
  const speechUtteranceRef = useRef(null);
  const isListeningRef = useRef(false);
  const silenceTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const restartTimeoutRef = useRef(null);
  const watchdogTimerRef = useRef(null);

  const turnStateRef = useRef("ai_speaking");
  const isMutedRef = useRef(false);
  const isAiMutedRef = useRef(false);
  const isOpenRef = useRef(isOpen);
  const currentSpeechRef = useRef("");
  const accumulatedFinalRef = useRef("");

  // Web Audio Context for live mic analyzer
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const micStreamRef = useRef(null);
  const animFrameRef = useRef(null);
  const transcriptBottomRef = useRef(null);

  // Sync refs with state
  useEffect(() => {
    turnStateRef.current = turnState;
  }, [turnState]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    isAiMutedRef.current = isAiMuted;
  }, [isAiMuted]);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // Auto scroll transcript to latest entry
  useEffect(() => {
    if (transcriptBottomRef.current) {
      transcriptBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  // 1. WEB AUDIO API CHIMES (Pure native browser audio, zero external file dependency)
  const playCallChime = (type = "connect") => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "connect") {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
      } else {
        osc.frequency.setValueAtTime(580, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(290, ctx.currentTime + 0.35);
      }
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      console.warn("Chime audio context notice:", e);
    }
  };

  // 2. LIVE MICROPHONE VOLUME ANALYSER
  const setupMicStream = async () => {
    if (micStreamRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.6;
      source.connect(analyser);
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateMeter = () => {
        if (!analyserRef.current || !isOpenRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setAudioLevel(normalized);
        animFrameRef.current = requestAnimationFrame(updateMeter);
      };
      updateMeter();
    } catch (e) {
      console.warn("Live mic stream note (using fallback visualizer):", e);
    }
  };

  const tearDownMicStream = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }
  };

  // 3. TEXT-TO-SPEECH (UNIFIED PLACIFY AI VOICE)
  const speakText = (text, onFinish) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      if (onFinish) onFinish();
      return;
    }

    stopPlacifyVoice();
    if (isAiMutedRef.current) {
      if (onFinish) onFinish();
      return;
    }

    let hasEnded = false;
    const finish = () => {
      if (hasEnded) return;
      hasEnded = true;
      speechUtteranceRef.current = null;
      if (onFinish) onFinish();
    };

    const utterance = speakPlacifyVoice(text, {
      onStart: () => {
        setTurnState("ai_speaking");
        turnStateRef.current = "ai_speaking";
        stopListening();
      },
      onEnd: () => finish(),
      onError: () => finish(),
    });

    speechUtteranceRef.current = utterance;
  };

  // 4. SPEECH RECOGNITION (UNBROKEN CONTINUOUS LISTENING WITH LIVE INTERIM UPDATES)
  const startListeningInstance = () => {
    if (!isOpenRef.current || isMutedRef.current) return;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Live voice recognition is best supported in Google Chrome, Microsoft Edge, or Safari.");
      return;
    }

    // Abort existing instance cleanly before creating a new session
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        isListeningRef.current = true;
        setTurnState("user_listening");
        turnStateRef.current = "user_listening";
      };

      recognition.onresult = (event) => {
        let interimText = "";
        let finalChunk = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          if (item.isFinal) {
            finalChunk += item[0].transcript + " ";
          } else {
            interimText += item[0].transcript;
          }
        }

        if (finalChunk) {
          accumulatedFinalRef.current = (
            (accumulatedFinalRef.current ? accumulatedFinalRef.current + " " : "") +
            finalChunk.trim()
          ).trim();
        }

        const combined = (
          (accumulatedFinalRef.current ? accumulatedFinalRef.current + " " : "") +
          interimText.trim()
        ).trim();

        if (combined) {
          setCurrentSpeech(combined);
          currentSpeechRef.current = combined;
        }

        // Auto-pause detection:
        // Clear previous silence timer & countdown
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

        const wordCount = combined.split(/\s+/).filter(Boolean).length;
        if (wordCount >= 2) {
          // Set 2.0-second silence countdown before auto-submitting turn
          setSilenceCountdown(2);
          let remaining = 2;
          countdownIntervalRef.current = setInterval(() => {
            remaining -= 1;
            if (remaining > 0) {
              setSilenceCountdown(remaining);
            } else {
              setSilenceCountdown(null);
              clearInterval(countdownIntervalRef.current);
            }
          }, 1000);

          silenceTimerRef.current = setTimeout(() => {
            setSilenceCountdown(null);
            if (
              turnStateRef.current === "user_listening" &&
              currentSpeechRef.current.trim().length > 0
            ) {
              handleSendCandidateTurn(currentSpeechRef.current.trim());
            }
          }, 2000);
        }
      };

      recognition.onerror = (e) => {
        if (e.error !== "no-speech" && e.error !== "aborted") {
          console.warn("Speech recognition notice:", e.error);
        }
      };

      recognition.onend = () => {
        isListeningRef.current = false;
        // If still in user listening mode, modal is open and not muted, seamlessly restart
        if (
          turnStateRef.current === "user_listening" &&
          !isMutedRef.current &&
          isOpenRef.current
        ) {
          if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
          restartTimeoutRef.current = setTimeout(() => {
            if (
              turnStateRef.current === "user_listening" &&
              !isMutedRef.current &&
              isOpenRef.current
            ) {
              startListeningInstance();
            }
          }, 120);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn("Recognition start notice:", err);
    }
  };

  const startListening = () => {
    accumulatedFinalRef.current = "";
    setCurrentSpeech("");
    currentSpeechRef.current = "";
    setSilenceCountdown(null);
    setTurnState("user_listening");
    turnStateRef.current = "user_listening";
    startListeningInstance();
    setupMicStream();
  };

  const stopListening = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
    setSilenceCountdown(null);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    isListeningRef.current = false;
  };

  // 5. CALL INITIALIZATION
  useEffect(() => {
    if (!isOpen) return;

    setCallState("connecting");
    setCallDuration(0);
    setCurrentSpeech("");
    currentSpeechRef.current = "";
    accumulatedFinalRef.current = "";
    setConversation([]);
    playCallChime("connect");
    setupMicStream();

    // Establish live session after 1.2s connection ring animation
    const connectTimer = setTimeout(() => {
      setCallState("active");
      initiateAiCallGreeting();
    }, 1200);

    return () => {
      clearTimeout(connectTimer);
      cleanUpCall();
    };
  }, [isOpen]);

  // Duration Timer
  useEffect(() => {
    if (callState !== "active") return;
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callState]);

  // 6. CALL CLEANUP
  const cleanUpCall = () => {
    stopListening();
    tearDownMicStream();
    if (watchdogTimerRef.current) clearTimeout(watchdogTimerRef.current);
    stopPlacifyVoice();
  };

  const handleEndCall = () => {
    cleanUpCall();
    playCallChime("disconnect");
    setCallState("ended");
    toast.success("AI Voice Call concluded. Session synchronized with interview progress.");
    setTimeout(() => {
      onClose();
    }, 800);
  };

  // 7. AI INITIATES CALL WITH GREETING & QUESTION 1
  const initiateAiCallGreeting = async () => {
    const currentQ =
      questionsList[activeQuestionIndex]?.question ||
      "Can you introduce yourself and tell me about your background?";

    try {
      const res = await fetch("/api/interview/live-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start_call",
          question: currentQ,
          jobPosition: interviewData?.jobPosition || "Technical Candidate",
          activeQuestionIndex,
          totalQuestions: questionsList?.length || 5,
        }),
      });

      const json = await res.json();
      const spokenText =
        json?.data?.spokenText ||
        `Hello! I'm your Placify AI interviewer today for the ${interviewData?.jobPosition || "Software Engineer"} role. Let's begin with our first question: ${currentQ}. Whenever you're ready, please share your thoughts.`;

      setConversation([
        {
          id: Date.now(),
          role: "ai",
          text: spokenText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);

      // Speak text aloud, then auto-listen
      speakText(spokenText, () => {
        startListening();
      });
    } catch (err) {
      const fallbackText = `Hello! Welcome to your live interview for ${interviewData?.jobPosition || "this position"}. Let's discuss: ${currentQ}. Please answer when you are ready.`;
      setConversation([
        {
          id: Date.now(),
          role: "ai",
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      speakText(fallbackText, () => startListening());
    }
  };

  // 8. CANDIDATE FINISHES SPEAKING -> AI EVALUATES & RESPONDS LIVE
  const handleSendCandidateTurn = async (spokenInput) => {
    const textToSend = (
      spokenInput ||
      currentSpeechRef.current ||
      currentSpeech ||
      manualInput
    ).trim();

    if (!textToSend || turnStateRef.current === "ai_thinking") return;

    stopListening();
    setTurnState("ai_thinking");
    turnStateRef.current = "ai_thinking";

    // Clear accumulated speech
    accumulatedFinalRef.current = "";
    setCurrentSpeech("");
    currentSpeechRef.current = "";
    setManualInput("");

    const userEntry = {
      id: Date.now(),
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setConversation((prev) => [...prev, userEntry]);

    const currentQ = questionsList[activeQuestionIndex]?.question || "";
    const correctAns = questionsList[activeQuestionIndex]?.answer || "";

    try {
      // 1. Call real-time live dialogue conversational API
      const res = await fetch("/api/interview/live-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "user_speaking",
          question: currentQ,
          jobPosition: interviewData?.jobPosition || "Technical Role",
          userSpeech: textToSend,
          activeQuestionIndex,
          totalQuestions: questionsList?.length || 5,
          history: conversation.slice(-4),
        }),
      });

      const json = await res.json();
      const aiData = json?.data || {};
      const aiSpoken =
        aiData.spokenText ||
        "Thank you for sharing that answer. You explained the main concepts clearly. Let's move on to our next question.";

      const aiEntry = {
        id: Date.now() + 1,
        role: "ai",
        text: aiSpoken,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setConversation((prev) => [...prev, aiEntry]);

      // 2. Persist answer and evaluation asynchronously to Drizzle UserAnswer table
      try {
        db.insert(UserAnswer)
          .values({
            mockIdRef: interviewData?.mockId,
            question: currentQ,
            correctAns: correctAns,
            userAns: textToSend,
            feedback: JSON.stringify({
              feedback: aiData.evaluationSnippet || "Answer articulated effectively during live audio call.",
              rating: aiData.rating || 8,
            }),
            rating: String(aiData.rating || 8),
            userEmail: user?.primaryEmailAddress?.emailAddress || "candidate@placify.ai",
            createdAt: moment().format("DD-MM-yyyy"),
          })
          .catch((dbErr) => console.warn("DB save note:", dbErr));
      } catch (dbErr) {
        console.warn("DB save note:", dbErr);
      }

      // 3. AI Speaks the reaction aloud
      speakText(aiSpoken, () => {
        // If AI indicated question is complete and there are more questions, transition forward
        if (
          aiData.isQuestionComplete &&
          activeQuestionIndex < (questionsList?.length || 1) - 1
        ) {
          const nextIdx = activeQuestionIndex + 1;
          setActiveQuestionIndex(nextIdx);
          const nextQ = questionsList[nextIdx]?.question;
          const nextIntro = `Now, here is Question ${nextIdx + 1}: ${nextQ}`;

          setTimeout(() => {
            setConversation((prev) => [
              ...prev,
              {
                id: Date.now() + 2,
                role: "ai",
                text: nextIntro,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              },
            ]);
            speakText(nextIntro, () => {
              startListening();
            });
          }, 350);
        } else {
          startListening();
        }
      });
    } catch (err) {
      console.error("Live call turn error:", err);
      const fallbackAi = "Understood. That covers the essentials. Let's continue.";
      setConversation((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "ai",
          text: fallbackAi,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      speakText(fallbackAi, () => startListening());
    }
  };

  // 9. CENTRAL ORB CLICK (BARGE-IN / INTERRUPT OR INSTANT SEND)
  const handleOrbClick = () => {
    if (turnState === "ai_speaking") {
      // Barge-in: Interrupt AI speaking and switch directly to listening
      stopPlacifyVoice();
      if (watchdogTimerRef.current) clearTimeout(watchdogTimerRef.current);
      toast.info("AI Interrupted — Listening to you!");
      startListening();
      return;
    }

    if (turnState === "user_listening") {
      const text = (currentSpeechRef.current || currentSpeech || manualInput).trim();
      if (text) {
        handleSendCandidateTurn(text);
      } else {
        toast.info("Microphone active — Speak your answer now!");
        startListeningInstance();
      }
      return;
    }
  };

  // 10. TRANSITION TO NEXT QUESTION MANUALLY BY BUTTON
  const handleNextQuestionCall = () => {
    if (activeQuestionIndex >= (questionsList?.length || 1) - 1) {
      toast.info("All interview questions covered!");
      handleEndCall();
      return;
    }

    const nextIdx = activeQuestionIndex + 1;
    setActiveQuestionIndex(nextIdx);
    const nextQ = questionsList[nextIdx]?.question;
    const nextIntro = `Moving to Question ${nextIdx + 1}: ${nextQ}. Please share your answer.`;

    stopListening();
    setConversation((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "ai",
        text: nextIntro,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);

    speakText(nextIntro, () => {
      startListening();
    });
  };

  // Format Elapsed Time
  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl h-[94vh] max-h-[820px] rounded-3xl bg-black border border-zinc-800 shadow-2xl flex flex-col overflow-hidden text-white select-none">
        
        {/* Top Call HUD Header */}
        <div className="px-5 py-4 border-b border-zinc-800/80 bg-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <h3 className="text-sm font-bold tracking-tight flex items-center gap-2">
                <span>Placify AI Live Audio Call</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono">
                  GEMINI LIVE
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono">
                {interviewData?.jobPosition || "Technical Mock Interview"} • Q#{activeQuestionIndex + 1} of{" "}
                {questionsList?.length || 5}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono font-bold text-zinc-200">
              {formatTimer(callDuration)}
            </div>
            <button
              onClick={handleEndCall}
              className="p-2 rounded-full bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
              title="Hang Up Call"
            >
              <PhoneOff className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Central Interactive Voice Canvas with Sound Wave Orb */}
        <div className="relative flex-1 flex flex-col items-center justify-center p-5 sm:p-6 bg-radial from-zinc-900/60 via-black to-black overflow-hidden">
          {/* Concentric Pulsing Ripples */}
          <div className="relative flex items-center justify-center mb-5">
            {turnState === "ai_speaking" && (
              <>
                <div className="absolute w-56 h-56 rounded-full border border-white/10 animate-ping opacity-40 duration-1000" />
                <div className="absolute w-44 h-44 rounded-full border border-white/20 animate-pulse duration-700" />
              </>
            )}

            {turnState === "user_listening" && (
              <>
                <div
                  className="absolute rounded-full border border-emerald-500/30 transition-all duration-150"
                  style={{
                    width: `${Math.min(260, 140 + audioLevel * 1.2)}px`,
                    height: `${Math.min(260, 140 + audioLevel * 1.2)}px`,
                  }}
                />
                <div
                  className="absolute rounded-full border border-emerald-400/20 animate-ping duration-1000"
                  style={{
                    width: "210px",
                    height: "210px",
                  }}
                />
              </>
            )}

            {/* Core Interactive Animated Orb Button */}
            <button
              onClick={handleOrbClick}
              title={
                turnState === "ai_speaking"
                  ? "Click to interrupt AI and speak"
                  : currentSpeech
                  ? "Click to send your turn immediately"
                  : "Microphone active — Speak your answer"
              }
              className={`relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full aspect-square flex flex-col items-center justify-center shadow-2xl transition-all duration-300 border-2 cursor-pointer focus:outline-none ${
                turnState === "ai_speaking"
                  ? "bg-white text-black border-white shadow-white/20 hover:scale-105 active:scale-95"
                  : turnState === "user_listening"
                  ? "bg-zinc-900 text-white border-emerald-400 shadow-emerald-500/30 hover:scale-105 active:scale-95"
                  : "bg-zinc-900 text-zinc-400 border-zinc-700 animate-pulse"
              }`}
            >
              {turnState === "ai_speaking" ? (
                <>
                  <Bot className="w-9 h-9 sm:w-10 sm:h-10 text-black animate-bounce" />
                  <span className="text-[10px] font-mono font-bold mt-1 uppercase tracking-wider text-black">
                    Speaking
                  </span>
                  <span className="text-[8px] font-mono text-zinc-600 mt-0.5">
                    (Click to interrupt)
                  </span>
                </>
              ) : turnState === "user_listening" ? (
                <>
                  <Mic
                    className={`w-9 h-9 sm:w-10 sm:h-10 text-emerald-400 ${
                      audioLevel > 20 ? "animate-bounce" : "animate-pulse"
                    }`}
                  />
                  <span className="text-[10px] font-mono font-bold mt-1 uppercase tracking-wider text-emerald-400">
                    Listening
                  </span>
                  <span className="text-[8px] font-mono text-zinc-400 mt-0.5">
                    {currentSpeech ? "(Click to send)" : "(Speak naturally)"}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-8 h-8 text-zinc-400 animate-spin" />
                  <span className="text-[10px] font-mono font-bold mt-1 uppercase tracking-wider text-zinc-400">
                    Thinking
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Dynamic Voice Status Badge with Countdown */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-mono font-semibold text-zinc-200 shadow-md mb-3">
            <Activity className="w-3.5 h-3.5 text-zinc-400" />
            <span>
              {turnState === "ai_speaking"
                ? "AI Interviewer is speaking aloud..."
                : turnState === "user_listening"
                ? silenceCountdown !== null
                  ? `Pause detected • Auto-sending in ${silenceCountdown}s...`
                  : currentSpeech
                  ? "Listening to your answer • Keep speaking or pause to send"
                  : "Microphone Live • Speak your answer naturally"
                : "AI is evaluating your response..."}
            </span>
          </div>

          {/* Real Audio Reactive Equalizer Bars */}
          <div className="flex items-center justify-center gap-1.5 h-8 my-1">
            {[35, 70, 95, 55, 85, 45, 75, 90, 50, 65].map((h, i) => {
              const dynamicHeight =
                turnState === "ai_speaking"
                  ? Math.max(25, (h * (i % 2 === 0 ? 0.9 : 1.1)) % 100)
                  : turnState === "user_listening"
                  ? Math.max(15, Math.min(100, audioLevel * (0.8 + (i % 5) * 0.15)))
                  : 20;

              return (
                <span
                  key={i}
                  className={`w-1 rounded-full transition-all duration-100 ${
                    turnState === "ai_speaking"
                      ? "bg-white"
                      : turnState === "user_listening"
                      ? audioLevel > 20
                        ? "bg-emerald-400 shadow-xs shadow-emerald-400/50"
                        : "bg-emerald-600/70"
                      : "bg-zinc-700"
                  }`}
                  style={{
                    height: `${dynamicHeight}%`,
                  }}
                />
              );
            })}
          </div>

          {/* Live Spoken Speech Stream (Candidate Transcript) */}
          <div className="w-full max-w-lg mt-3 p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 text-center min-h-[58px] flex items-center justify-center">
            <p className="text-xs text-zinc-200 font-mono italic leading-relaxed line-clamp-2">
              {currentSpeech ? (
                <span className="flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                  &quot;{currentSpeech}&quot;
                </span>
              ) : (
                <span className="text-zinc-500">
                  Waiting for spoken voice input... (Speak into your mic)
                </span>
              )}
            </p>
          </div>

          {/* Inline Text Fallback Form for Low Noise/Mute */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (manualInput.trim()) {
                handleSendCandidateTurn(manualInput.trim());
              }
            }}
            className="w-full max-w-lg mt-2 flex items-center gap-2"
          >
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="Or type your reply here if microphone is quiet..."
              disabled={turnState === "ai_thinking"}
              className="flex-1 px-3.5 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
            />
            {manualInput.trim() && (
              <Button
                type="submit"
                size="sm"
                disabled={turnState === "ai_thinking"}
                className="rounded-xl px-3 h-8 text-xs font-bold bg-white text-black hover:bg-zinc-200 cursor-pointer"
              >
                <span>Send</span>
                <CornerDownLeft className="w-3 h-3 ml-1" />
              </Button>
            )}
          </form>
        </div>

        {/* Live Conversation Transcript Drawer (Scrollable Dialogue History) */}
        <div className="h-44 border-t border-zinc-800/80 bg-zinc-950/95 p-3.5 overflow-y-auto space-y-2.5 text-xs font-sans">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 mb-1 flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-zinc-400" /> Live Audio Transcript Stream
          </div>

          {conversation.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "ai" && (
                <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                  AI
                </div>
              )}
              <div
                className={`max-w-[85%] px-3 py-2 rounded-2xl leading-relaxed ${
                  msg.role === "user"
                    ? "bg-zinc-800 text-white rounded-tr-xs"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-xs"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={transcriptBottomRef} />
        </div>

        {/* Bottom Phone Action Bar */}
        <div className="p-4 border-t border-zinc-800 bg-black flex items-center justify-around gap-2">
          {/* Mute Mic Button */}
          <button
            onClick={() => {
              if (isMuted) {
                setIsMuted(false);
                isMutedRef.current = false;
                startListening();
                toast.success("Microphone unmuted");
              } else {
                setIsMuted(true);
                isMutedRef.current = true;
                stopListening();
                toast.info("Microphone muted");
              }
            }}
            className={`p-3.5 rounded-full border transition-all cursor-pointer ${
              isMuted
                ? "bg-zinc-800 border-zinc-700 text-red-400"
                : "bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800"
            }`}
            title={isMuted ? "Unmute Mic" : "Mute Mic"}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Toggle AI Voice Audio Output */}
          <button
            onClick={() => {
              if (isAiMuted) {
                setIsAiMuted(false);
                isAiMutedRef.current = false;
                toast.success("AI Voice unmuted");
              } else {
                setIsAiMuted(true);
                isAiMutedRef.current = true;
                stopPlacifyVoice();
                toast.info("AI Voice muted");
              }
            }}
            className={`p-3.5 rounded-full border transition-all cursor-pointer ${
              isAiMuted
                ? "bg-zinc-800 border-zinc-700 text-red-400"
                : "bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800"
            }`}
            title={isAiMuted ? "Unmute AI Voice" : "Mute AI Voice"}
          >
            {isAiMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Submit Spoken Turn Button */}
          <Button
            onClick={() => handleSendCandidateTurn()}
            disabled={
              (!currentSpeech.trim() && !manualInput.trim()) ||
              turnState === "ai_thinking"
            }
            className="rounded-full px-5 py-6 font-bold text-xs bg-white text-black hover:bg-zinc-200 transition-all shadow-md cursor-pointer disabled:opacity-40"
          >
            <span>Send Turn</span>
            <Send className="w-3.5 h-3.5 ml-1.5" />
          </Button>

          {/* Next Question Audio Trigger */}
          <button
            onClick={handleNextQuestionCall}
            className="p-3.5 rounded-full bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition-all cursor-pointer"
            title="Next Question"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Red Hang Up Button */}
          <button
            onClick={handleEndCall}
            className="p-3.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
            title="End Voice Call"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
