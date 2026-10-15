import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Calendar, Briefcase, Award, ArrowUpRight } from 'lucide-react'

function InterviewItemCard({ interview }) {
  const router = useRouter();

  const onStart = () => {
    router.push('/dashboard/interview/' + interview?.mockId + '/start')
  }

  const onFeedbackPress = () => {
    router.push('/dashboard/interview/' + interview?.mockId + "/feedback")
  }

  const experience = interview?.jobExperience || interview?.jobExperinece || '0';

  return (
    <div className="bg-white/90 dark:bg-zinc-900/80 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-xs hover:shadow-lg hover:border-black dark:hover:border-white hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group backdrop-blur-md">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-base text-zinc-900 dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors line-clamp-1">
            {interview?.jobPosition}
          </h3>
          <span className="shrink-0 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
            <Award className="w-3 h-3 text-black dark:text-white" />
            {experience} YRS
          </span>
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3">
          {interview?.jobDesc || 'General technical and situational interview.'}
        </p>

        <div className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 mb-4 font-mono">
          <Calendar className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
          <span>{interview?.createdAt}</span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 rounded-xl text-xs font-semibold border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          onClick={onFeedbackPress}
        >
          Feedback
        </Button>

        <Button
          size="sm"
          variant="default"
          className="flex-1 rounded-xl text-xs font-bold bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-xs"
          onClick={onStart}
        >
          Practice <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
        </Button>
      </div>
    </div>
  )
}

export default InterviewItemCard
