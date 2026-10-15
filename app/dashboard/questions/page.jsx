"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Volume2, Sparkles, Search, Layers, PlayCircle, Bot, Code, Server, Users, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export default function QuestionsLibraryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [playingId, setPlayingId] = useState(null)

  const categories = ['All', 'Frontend', 'Backend', 'System Design', 'Behavioral']

  const sampleQuestions = [
    {
      id: 1,
      category: 'Frontend',
      title: 'React Reconciliation & Virtual DOM',
      question: 'How does React Fiber diffing algorithm work, and how does key prop optimize list updates?',
      difficulty: 'Intermediate',
      recommendedFor: 'Frontend / Full Stack Engineer'
    },
    {
      id: 2,
      category: 'Frontend',
      title: 'Next.js Server vs Client Components',
      question: 'When should you mark a Next.js component with "use client" versus keeping it as a React Server Component (RSC)?',
      difficulty: 'Advanced',
      recommendedFor: 'Next.js / React Specialist'
    },
    {
      id: 3,
      category: 'Backend',
      title: 'Database Indexing Trade-offs',
      question: 'Explain how B-Tree indexes work in PostgreSQL and what happens during high write workloads.',
      difficulty: 'Intermediate',
      recommendedFor: 'Backend / Database Engineer'
    },
    {
      id: 4,
      category: 'Backend',
      title: 'JWT vs Session-based Authentication',
      question: 'Compare JWT tokens and server-side session stores for scalable distributed microservice auth.',
      difficulty: 'Intermediate',
      recommendedFor: 'Security / API Architect'
    },
    {
      id: 5,
      category: 'System Design',
      title: 'Rate Limiting Architecture',
      question: 'How would you design a distributed API rate limiter using Redis and the Token Bucket algorithm?',
      difficulty: 'Advanced',
      recommendedFor: 'Senior / Staff Systems Architect'
    },
    {
      id: 6,
      category: 'System Design',
      title: 'WebSocket vs Server-Sent Events (SSE)',
      question: 'When is SSE preferable over bidirectional WebSockets for real-time AI streaming outputs?',
      difficulty: 'Intermediate',
      recommendedFor: 'Full Stack / AI Applications Engineer'
    },
    {
      id: 7,
      category: 'Behavioral',
      title: 'Managing Technical Debt',
      question: 'Describe a situation where product deadlines clashed with architectural refactoring. How did you negotiate?',
      difficulty: 'All Levels',
      recommendedFor: 'Engineering Leads & Senior ICs'
    },
    {
      id: 8,
      category: 'Behavioral',
      title: 'Handling Production Incidents',
      question: 'Walk me through the most critical production outage you responded to. What was your triage protocol?',
      difficulty: 'All Levels',
      recommendedFor: 'DevOps / SRE / Full Stack ICs'
    }
  ]

  const playSpeech = (id, text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      if (playingId === id) {
        setPlayingId(null)
        return
      }
      const utterance = new SpeechSynthesisUtterance(text)
      setPlayingId(id)
      utterance.onend = () => {
        setPlayingId(null)
        window.speechSynthesis.cancel()
      }
      utterance.onerror = () => setPlayingId(null)
      window.speechSynthesis.speak(utterance)
    } else {
      alert('Speech synthesis is not supported on this browser.')
    }
  }

  const filteredQuestions = sampleQuestions.filter((q) => {
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.recommendedFor.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-mono font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
            <span>AI QUESTION MATRIX</span>
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
            Interview Question Bank
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Explore industry benchmark questions curated by Gemini AI across technical and leadership domains.
          </p>
        </div>

        <Link href="/dashboard">
          <Button className="rounded-full font-bold bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
            + Create Custom Session
          </Button>
        </Link>
      </div>

      {/* Filter and Search HUD */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Search questions or roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white focus-visible:border-black focus-visible:ring-black dark:focus-visible:border-white dark:focus-visible:ring-white"
          />
        </div>
      </div>

      {/* Question Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredQuestions.map((q) => (
          <div
            key={q.id}
            className="p-6 rounded-3xl bg-white dark:bg-zinc-900 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-600 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700">
                  {q.category}
                </span>
                <span className="text-[11px] font-mono text-zinc-400 font-medium">
                  {q.difficulty}
                </span>
              </div>

              <h3 className="font-bold text-base text-zinc-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                {q.title}
              </h3>

              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
                "{q.question}"
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono truncate max-w-[200px]">
                {q.recommendedFor}
              </span>

              <div className="flex items-center gap-2">
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => playSpeech(q.id, q.question)}
                  className={`rounded-xl text-xs font-semibold border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                    playingId === q.id
                      ? 'animate-pulse'
                      : ''
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5 mr-1 text-zinc-900 dark:text-zinc-100" />
                  {playingId === q.id ? 'Playing...' : 'Audio'}
                </Button>

                <Link href="/dashboard">
                  <Button
                    size="xs"
                    className="rounded-xl text-xs font-bold bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  >
                    Simulate <ArrowUpRight className="w-3 h-3 ml-0.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
