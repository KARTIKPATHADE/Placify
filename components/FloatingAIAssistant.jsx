"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Bot,
  Sparkles,
  Send,
  X,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Shuffle,
  ChevronDown,
  ArrowDown
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import ExamMarkdownRenderer from "@/components/ExamMarkdownRenderer";

export default function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const [messages, setMessages] = useState([
    {
      id: "initial",
      role: "assistant",
      content: "Hello! I am your Placify AI Career & Interview Assistant. Ask me any technical, architectural, or interview question, and I will provide full, comprehensive in-depth answers with theoretical models, workflows, and comparison tables!",
      timestamp: "Just now",
    }
  ]);

  const chatContainerRef = useRef(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  // Smooth scroll directly inside chat container without moving window/page
  const scrollToBottom = (behavior = "smooth") => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior
      });
    }
  };

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 60;
    setShowScrollBottom(!isNearBottom);
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        scrollToBottom("smooth");
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [messages, isLoading, isOpen]);

  const handleSend = async (customPrompt) => {
    const textToSend = customPrompt || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMessageId = Date.now().toString();
    const newUserMessage = {
      id: userMessageId,
      role: "user",
      content: textToSend.trim(),
      timestamp: "Now",
    };

    setMessages((prev) => [...prev, newUserMessage]);
    if (!customPrompt) setInputQuery("");
    setIsLoading(true);

    try {
      const previousAnswers = messages
        .filter((m) => m.role === "assistant")
        .slice(-3)
        .map((m) => m.content.slice(0, 100));

      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: textToSend.trim(),
          role: "Senior Tech Professional",
          experience: "Senior",
          field: "Tech & Software Engineering",
          mode: textToSend.toLowerCase().includes("exam") || textToSend.toLowerCase().includes("detail") ? "Comprehensive-InDepth" : "Omni-SuperHuman",
          previousAnswers,
        }),
      });

      const data = await res.json();

      if (data.success && data.answer) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: data.answer,
            originalQuery: textToSend.trim(),
            timestamp: "Now",
          },
        ]);
      } else {
        throw new Error(data.error || "Failed to fetch response");
      }
    } catch (err) {
      toast.error("Could not reach assistant. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id, text) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success("Answer copied!");
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 select-none">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black shadow-xl hover:opacity-90 active:scale-95 transition-all duration-150 cursor-pointer border border-zinc-800 dark:border-zinc-200 backdrop-blur-md"
          title="Open Placify AI Assistant"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-300 dark:bg-zinc-700"></span>
          </span>
          <Bot className="w-4 h-4 transition-transform group-hover:rotate-12" />
          <span className="text-xs font-bold tracking-wide">Ask Placify AI</span>
        </button>
      )}

      {/* Floating Modal Drawer */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[420px] h-[540px] rounded-3xl bg-white/95 dark:bg-black/95 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-4 py-3 bg-black text-white dark:bg-zinc-900 flex items-center justify-between border-b border-zinc-800 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-zinc-800 dark:bg-zinc-800 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold tracking-wide">Placify AI Assistant</h3>
                <p className="text-[10px] text-zinc-400 font-mono">Infinite Tech Intelligence</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Link
                href="/dashboard/assistant"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white transition-colors"
                title="Expand to Full Studio"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Chat Stream with Butter-Smooth Scrolling */}
          <div className="relative flex-1 min-h-0 flex flex-col">
            <div
              ref={chatContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs scroll-smooth overscroll-contain"
            >
              {messages.map((m) => {
                const isUser = m.role === "user";

                return (
                  <div
                    key={m.id}
                    className={`flex gap-2 ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {!isUser && (
                      <div className="w-6 h-6 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div className="max-w-[85%] space-y-1">
                      <div
                        className={`p-3 rounded-2xl ${
                          isUser
                            ? "bg-black text-white dark:bg-white dark:text-black rounded-tr-xs whitespace-pre-wrap leading-relaxed text-xs"
                            : "bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-xs text-xs leading-relaxed overflow-x-auto"
                        }`}
                      >
                        {isUser ? (
                          m.content
                        ) : (
                          <ExamMarkdownRenderer content={m.content} />
                        )}
                      </div>

                      {!isUser && m.id !== "initial" && (
                        <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                          <button
                            onClick={() => handleCopy(m.id, m.content)}
                            className="hover:text-black dark:hover:text-white flex items-center gap-0.5 cursor-pointer"
                          >
                            {copiedId === m.id ? <Check className="w-3 h-3 text-zinc-900 dark:text-zinc-100" /> : <Copy className="w-3 h-3" />} Copy
                          </button>
                          {m.originalQuery && (
                            <button
                              onClick={() =>
                                handleSend(
                                  `Give me a fresh, different perspective for: "${m.originalQuery}" without repeating prior points.`
                                )
                              }
                              className="hover:text-black dark:hover:text-white flex items-center gap-0.5 cursor-pointer"
                            >
                              <Shuffle className="w-3 h-3" /> New Angle
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-2 text-zinc-400 text-xs italic animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-400 animate-spin" />
                  <span>Thinking fresh answer...</span>
                </div>
              )}
            </div>

            {/* Smooth Scroll to Latest Floating Circular Button */}
            {showScrollBottom && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={() => scrollToBottom("smooth")}
                  className="w-7 h-7 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border border-zinc-700 dark:border-zinc-300 shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  title="Scroll to bottom"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Quick Suggestion Pills */}
          <div className="px-3 py-1.5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => handleSend("Provide a comprehensive in-depth explanation of Access Control Policies (DAC, MAC, RBAC, ABAC) with architectures, comparison tables, and real-world implementations")}
              className="text-[10px] shrink-0 px-2 py-0.5 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border border-zinc-700 dark:border-zinc-300 font-medium hover:opacity-90 cursor-pointer"
            >
              📚 Detailed Masterclass
            </button>
            <button
              onClick={() => handleSend("Give me a common System Design interview question & optimal answer")}
              className="text-[10px] shrink-0 px-2 py-0.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer"
            >
              System Design
            </button>
            <button
              onClick={() => handleSend("Give me an Amazon Leadership Principle question with STAR response")}
              className="text-[10px] shrink-0 px-2 py-0.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer"
            >
              Amazon STAR
            </button>
            <button
              onClick={() => handleSend("How to answer 'Tell me about yourself' effectively for Senior Engineer")}
              className="text-[10px] shrink-0 px-2 py-0.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer"
            >
              Tell me about yourself
            </button>
          </div>

          {/* Input Footer */}
          <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-1.5"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask any interview question..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white text-zinc-900 dark:text-zinc-100"
              />
              <Button
                type="submit"
                disabled={!inputQuery.trim() || isLoading}
                variant="default"
                size="sm"
                className="h-8 px-3 rounded-xl font-bold text-xs shrink-0 cursor-pointer bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                <Send className="w-3 h-3" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
