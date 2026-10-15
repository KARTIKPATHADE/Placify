"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Sparkles, Dices, Layers, Orbit } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * VantaRingsHero - Live Interactive 3D Vanta Rings Experience
 * Directly integrates Three.js and Vanta.RINGS with mouse and touch orbital controls.
 * Features customizable color presets, randomize capability, and responsive WebGL rendering.
 */
export default function VantaRingsHero({ className = "", children }) {
  const vantaRef = useRef(null);
  const vantaEffectRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeColorPreset, setActiveColorPreset] = useState(0);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Monochrome palette combinations for Vanta Rings
  const colorPresets = [
    { name: "Obsidian Platinum", color: isDark ? 0xffffff : 0x18181b, backgroundColor: isDark ? 0x000000 : 0xffffff },
    { name: "Silver Titanium", color: isDark ? 0xe4e4e7 : 0x27272a, backgroundColor: isDark ? 0x000000 : 0xffffff },
    { name: "Monochrome Minimal", color: isDark ? 0xd4d4d8 : 0x3f3f46, backgroundColor: isDark ? 0x000000 : 0xffffff },
    { name: "Carbon Slate", color: isDark ? 0xa1a1aa : 0x52525b, backgroundColor: isDark ? 0x000000 : 0xffffff },
  ];

  // Helper to load external scripts sequentially
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        if (existing.getAttribute("data-loaded") === "true") {
          resolve();
        } else {
          existing.addEventListener("load", () => resolve());
          existing.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)));
        }
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => {
        script.setAttribute("data-loaded", "true");
        resolve();
      };
      script.onerror = () => reject(new Error(`Failed to load script ${src}`));
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    let mounted = true;

    async function initVanta() {
      try {
        // 1. Ensure Three.js r121 / compatible
        if (!window.THREE) {
          await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js");
        }

        // 2. Ensure Vanta Rings is loaded
        if (!window.VANTA || !window.VANTA.RINGS) {
          await loadScript("https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.rings.min.js");
        }

        if (!mounted || !vantaRef.current || !window.VANTA?.RINGS) return;

        // Clean up any existing effect
        if (vantaEffectRef.current) {
          vantaEffectRef.current.destroy();
          vantaEffectRef.current = null;
        }

        const preset = colorPresets[activeColorPreset] || colorPresets[0];

        // 3. Initialize Vanta Rings matching user code and screenshot specifications
        vantaEffectRef.current = window.VANTA.RINGS({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          backgroundColor: preset.backgroundColor,
          backgroundAlpha: 0.0, // Fully transparent - renders directly on page background without any box
          color: preset.color,
        });

        setIsLoaded(true);
      } catch (err) {
        console.warn("Vanta.js Rings initialization warning:", err);
      }
    }

    initVanta();

    return () => {
      mounted = false;
      if (vantaEffectRef.current) {
        try {
          vantaEffectRef.current.destroy();
        } catch (_) {}
        vantaEffectRef.current = null;
      }
    };
  }, [resolvedTheme]);

  // Handle color or preset cycle ("Randomize!" functionality from Vanta.js)
  const handleRandomize = () => {
    const nextIndex = (activeColorPreset + 1) % colorPresets.length;
    setActiveColorPreset(nextIndex);
    const nextPreset = colorPresets[nextIndex];

    if (vantaEffectRef.current && typeof vantaEffectRef.current.setOptions === "function") {
      try {
        vantaEffectRef.current.setOptions({
          color: nextPreset.color,
          backgroundColor: nextPreset.backgroundColor,
          backgroundAlpha: 0.0,
        });
      } catch (e) {
        console.log("Error updating vanta options:", e);
      }
    }
  };

  return (
    <div className={`relative w-full overflow-hidden select-none ${className}`}>
      {/* 3D WebGL Canvas Container */}
      <div
        ref={vantaRef}
        className="absolute inset-0 w-full h-full pointer-events-auto"
        style={{ minHeight: "100%" }}
      />

      {/* Fallback CSS 3D Rings Animation while WebGL initializes */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
          <div className="relative w-96 h-96 animate-pulse">
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-zinc-400 dark:border-zinc-600 animate-spin" style={{ animationDuration: "20s" }} />
            <div className="absolute inset-8 rounded-full border-4 border-dotted border-zinc-500 dark:border-zinc-400 animate-spin" style={{ animationDuration: "14s", animationDirection: "reverse" }} />
            <div className="absolute inset-16 rounded-full border-2 border-zinc-600 dark:border-zinc-300 animate-spin" style={{ animationDuration: "8s" }} />
          </div>
        </div>
      )}

      {/* Interactive Controls Overlay Bar */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={handleRandomize}
          title="Cycle 3D Rings Monochrome Tone"
          className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-white dark:bg-black text-black dark:text-white border border-zinc-300 dark:border-zinc-700 backdrop-blur-md shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Dices className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300 group-hover:rotate-45 transition-transform duration-300" />
          <span>Style Preset</span>
        </button>
      </div>

      {/* Content Layer with Backdrop Gradient Fade for Content Readability */}
      <div className="relative z-10 w-full h-full pointer-events-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto [&_input]:pointer-events-auto">
        {children}
      </div>
    </div>
  );
}
