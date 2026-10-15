"use client";

import React from "react";
import { usePathname } from "next/navigation";

/**
 * Intelligent Dynamic Background:
 * - Pure Minimalist Monochrome Obsidian & Crisp White Canvas with subtle moving grid and horizon accent.
 */
export default function LiveRainbowGrill() {
  return (
    <div
      aria-hidden="true"
      suppressHydrationWarning
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
    >
      {/* 1. Base Canvas - Pure White (Light) & Pitch Obsidian Black (Dark) */}
      <div
        className="absolute inset-0 transition-colors duration-300 bg-white dark:bg-black"
      />

      {/* 2. Moving Grid */}
      <div className="absolute inset-0 sane-moving-grid" />

      {/* 3. Horizon Ambient Glow: Elegant Monochrome Subtle Glow */}
      <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[90vw] max-w-5xl h-64 sane-rainbow-accent" />

      {/* 4. Subtle Radial Vignette for High Content Focus */}
      <div
        className="absolute inset-0 bg-radial-[circle_at_center,transparent_50%,rgba(255,255,255,0.75)_100%] dark:bg-radial-[circle_at_center,transparent_50%,rgba(0,0,0,0.85)_100%]"
      />
    </div>
  );
}
