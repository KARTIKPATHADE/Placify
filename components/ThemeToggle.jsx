"use client"

import * as React from "react"
import { Moon, Sun, Sparkles } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle({ className = "" }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 animate-pulse ${className}`} />
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative group w-9 h-9 rounded-xl border transition-[transform,box-shadow,border-color] duration-150 transform-gpu touch-manipulation active:scale-90 active:duration-75 flex items-center justify-center cursor-pointer overflow-hidden ${
        isDark
          ? "border-zinc-800 bg-zinc-900 text-white hover:border-zinc-600 shadow-sm"
          : "border-zinc-300 bg-white text-black hover:border-zinc-500 shadow-sm"
      } ${className}`}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45 text-white fill-white/20" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-12 text-black fill-black/20" />
      )}
    </button>
  )
}

export default ThemeToggle
