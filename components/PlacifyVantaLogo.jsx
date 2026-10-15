"use client";

import React from "react";
import Link from "next/link";

/**
 * PlacifyVantaLogo - Ultra-modern 3D Concentric Rainbow Rings Logo
 * Inspired by Vanta.js 3D Rings aesthetic:
 * Concentric elliptical rings tilted in 3D perspective with neon rainbow arcs,
 * luminous AI core, and stylish futuristic wordmark.
 */
export default function PlacifyVantaLogo({
  href = "/",
  size = "md", // "sm", "md", "lg", "hero"
  showText = true,
  showBadge = true,
  className = "",
  animated = true,
}) {
  const sizeMap = {
    sm: { height: 32, width: showText ? 150 : 36, emblemSize: 32, textScale: "scale-90" },
    md: { height: 42, width: showText ? 190 : 44, emblemSize: 42, textScale: "scale-100" },
    lg: { height: 54, width: showText ? 240 : 54, emblemSize: 54, textScale: "scale-110" },
    hero: { height: 72, width: showText ? 320 : 72, emblemSize: 72, textScale: "scale-125" },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div
      className={`inline-flex items-center gap-3 select-none group cursor-pointer ${className}`}
      suppressHydrationWarning
    >
      {/* 3D Concentric Rings Emblem Container */}
      <div
        className="relative shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 active:scale-95"
        style={{ width: currentSize.emblemSize, height: currentSize.emblemSize }}
      >
        {/* Ambient Chromatic Glow */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500 via-cyan-400 to-amber-400 opacity-30 blur-md group-hover:opacity-75 transition-opacity duration-300 pointer-events-none"
        />

        {/* 3D Rings SVG Element */}
        <svg
          viewBox="0 0 64 64"
          className={`w-full h-full relative z-10 drop-shadow-md ${
            animated ? "transition-transform duration-500 group-hover:rotate-12" : ""
          }`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="vantaRingGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF007A" />
              <stop offset="30%" stopColor="#A855F7" />
              <stop offset="70%" stopColor="#00F0FF" />
              <stop offset="100%" stopColor="#00FF88" />
            </linearGradient>

            <linearGradient id="vantaRingGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FF6B00" />
              <stop offset="40%" stopColor="#FACC15" />
              <stop offset="70%" stopColor="#FF007A" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>

            <linearGradient id="vantaRingGrad3" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>

            <radialGradient id="vantaCenterGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#FDE047" />
              <stop offset="85%" stopColor="#00F0FF" />
              <stop offset="100%" stopColor="#A855F7" />
            </radialGradient>
          </defs>

          {/* 3D Tilted Orbiting Rings System */}
          <g transform="translate(32, 32) rotate(-22)">
            {/* Outer Orbit Back (Dim) */}
            <ellipse cx="0" cy="0" rx="27" ry="11" stroke="#312E81" strokeWidth="1.5" strokeDasharray="14 36" opacity="0.45" />

            {/* Outer Orbit Front (Rainbow Arc) */}
            <path
              d="M -26.5,2.5 C -22,9.5 -3,12 14,10 C 23,8.5 27,4 26.5,-1"
              stroke="url(#vantaRingGrad1)"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <circle cx="26.5" cy="-1" r="2" fill="#00FF88" />
            <circle cx="-26.5" cy="2.5" r="1.8" fill="#FF007A" />

            {/* Middle Orbit Back */}
            <ellipse cx="0" cy="0" rx="20.5" ry="8.5" stroke="#1E1B4B" strokeWidth="1.8" strokeDasharray="18 24" opacity="0.4" />

            {/* Middle Orbit Front (Warm Gold to Pink Arc) */}
            <path
              d="M -20,1.5 C -16,6.8 -2,8.8 11,7.2 C 18,6.2 20.5,3 20,-1.5"
              stroke="url(#vantaRingGrad2)"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            {/* Highlight line on middle band */}
            <path d="M -13,5 C -5,7.5 6,6.8 13,4.8" stroke="#FFFFFF" strokeWidth="1.1" strokeLinecap="round" opacity="0.85" />

            {/* Inner Ring Loop */}
            <ellipse
              cx="0"
              cy="0"
              rx="14"
              ry="6"
              stroke="url(#vantaRingGrad3)"
              strokeWidth="2.5"
              strokeDasharray="36 16"
              strokeLinecap="round"
            />

            {/* Core Tight Ring */}
            <ellipse
              cx="0"
              cy="0"
              rx="8.5"
              ry="3.6"
              stroke="url(#vantaRingGrad2)"
              strokeWidth="2"
              strokeDasharray="20 10"
              strokeLinecap="round"
            />

            {/* Radiant Nucleus Star */}
            <circle cx="0" cy="0" r="4.2" fill="url(#vantaCenterGlow)" />
            <polygon points="0,-4.5 1.2,-0.5 4.5,0 1.2,0.5 0,4.5 -1.2,0.5 -4.5,0 -1.2,-0.5" fill="#FFFFFF" />
            <circle cx="0" cy="0" r="1.2" fill="#00F0FF" />
          </g>

          {/* Stylized 3D Monogram "P" Facet Over Ring */}
          <g transform="translate(18, 14)">
            <path d="M 0,22 L 5,25 L 5,3 L 0,0 Z" fill="#00F0FF" opacity="0.85" />
            <polygon points="0,0 5,3 10,0 5,-3" fill="#FFFFFF" />
            <path
              d="M 5,3 C 12,3 17,6 17,11 C 17,16 12,19 5,19 L 5,14 C 9,14 12,12.5 12,11 C 12,9.5 9,8 5,8 Z"
              fill="url(#vantaRingGrad2)"
            />
          </g>
        </svg>
      </div>

      {/* Typography: "Placify" Name & Subtitle */}
      {showText && (
        <div className={`flex flex-col justify-center leading-none ${currentSize.textScale} origin-left`}>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-stone-900 dark:text-white flex items-center">
              <span>Plac</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-cyan-400 via-emerald-400 via-amber-400 to-pink-500">
                ify
              </span>
            </span>

            {showBadge && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold tracking-wider bg-gradient-to-r from-pink-500/15 via-cyan-500/15 to-amber-500/15 text-pink-600 dark:text-cyan-300 border border-pink-400/30 dark:border-cyan-400/30 shadow-2xs">
                ✦ AI
              </span>
            )}
          </div>

          <span className="text-[8px] font-mono font-bold tracking-[0.25em] text-stone-500 dark:text-stone-400 uppercase mt-0.5">
            AI INTERVIEW ENGINE
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
}
