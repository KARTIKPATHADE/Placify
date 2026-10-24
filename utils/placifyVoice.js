/**
 * Placify Unified AI Voice Engine
 * Ensures 100% voice consistency across all AI assistant and interview assessment features.
 * 
 * Works across:
 * - Live AI Voice Call Interviewer (Modal)
 * - Live AI Voice Call Assistant (Modal)
 * - AI Assistant Dialogue Stream (Read Aloud)
 * - Interview Question Player (Speaker)
 * - Practice Question Bank (Speaker)
 */

export const PLACIFY_VOICE_CONFIG = {
  lang: "en-US",
  rate: 1.0,   // Balanced executive tempo
  pitch: 1.0,  // Natural conversational pitch
};

let cachedSelectedVoice = null;
let isVoiceInitialized = false;

/**
 * Calculates a quality score for a given browser speech synthesis voice.
 * Prioritizes natural, neural, and premier studio voices in en-US.
 */
function scoreVoice(voice) {
  if (!voice) return -1000;
  const name = voice.name || "";
  const lang = (voice.lang || "").toLowerCase();
  let score = 0;

  // Language priority
  if (lang === "en-us" || lang.startsWith("en-us") || lang.startsWith("en_us")) {
    score += 150;
  } else if (lang.startsWith("en-gb") || lang.startsWith("en_gb")) {
    score += 90;
  } else if (lang.startsWith("en")) {
    score += 70;
  } else {
    // Non-English gets heavily penalized
    return -1000;
  }

  const lowerName = name.toLowerCase();

  // Natural / Neural online voices (Edge / Chrome / Modern OS)
  if (lowerName.includes("natural")) score += 300;
  if (lowerName.includes("neural")) score += 300;
  if (lowerName.includes("online")) score += 150;

  // Specific high-clarity voice profiles
  if (lowerName.includes("google us english")) score += 450;
  else if (lowerName.includes("google")) score += 220;

  if (lowerName.includes("jenny")) score += 400;
  if (lowerName.includes("aria")) score += 380;
  if (lowerName.includes("guy")) score += 350;
  if (lowerName.includes("samantha")) score += 340;
  if (lowerName.includes("daniel")) score += 300;
  if (lowerName.includes("zira")) score += 220;
  if (lowerName.includes("david")) score += 200;

  if (voice.default) score += 25;

  return score;
}

/**
 * Discovers and returns the single best unified voice available on the device.
 */
export function getPlacifyVoice() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) {
    return cachedSelectedVoice;
  }

  let bestVoice = null;
  let highestScore = -999;

  for (const voice of voices) {
    const score = scoreVoice(voice);
    if (score > highestScore) {
      highestScore = score;
      bestVoice = voice;
    }
  }

  if (bestVoice) {
    cachedSelectedVoice = bestVoice;
  }
  return cachedSelectedVoice || voices[0] || null;
}

/**
 * Initializes the voice cache and attaches the onvoiceschanged handler.
 */
export function initPlacifyVoice() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }

  if (isVoiceInitialized) return;
  isVoiceInitialized = true;

  // Query immediately
  getPlacifyVoice();

  // Also query when voices finish loading asynchronously
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    const prevHandler = window.speechSynthesis.onvoiceschanged;
    window.speechSynthesis.onvoiceschanged = (e) => {
      getPlacifyVoice();
      if (typeof prevHandler === "function") {
        prevHandler(e);
      }
    };
  }
}

// Automatically initialize in browser environments
if (typeof window !== "undefined") {
  initPlacifyVoice();
}

/**
 * Strips markdown symbols, headers, brackets, links, and redundant whitespace
 * so the text reads aloud like natural human conversation.
 */
export function cleanTextForSpeech(text) {
  if (!text) return "";
  return text
    .replace(/```[\s\S]*?```/g, " Code block omitted. ") // Remove raw code blocks
    .replace(/[#*_`~>|\\-]/g, " ")                        // Remove markdown formatting chars
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")             // Convert [Label](url) to Label
    .replace(/https?:\/\/\S+/g, " ")                      // Remove raw URLs
    .replace(/\s+/g, " ")                                 // Collapse whitespace
    .trim();
}

/**
 * Stops any ongoing speech synthesis across the entire application cleanly.
 */
export function stopPlacifyVoice() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }

  try {
    if (window._placifyWatchdogTimer) {
      clearTimeout(window._placifyWatchdogTimer);
      window._placifyWatchdogTimer = null;
    }
    window.speechSynthesis.cancel();
    window._placifyActiveUtterance = null;
  } catch (_) {}
}

/**
 * Universal speech function that speaks text using the exact same Placify voice,
 * rate, and pitch everywhere in the application.
 * 
 * @param {string} text - The text to speak
 * @param {object} options - Callbacks & configuration overrides:
 *   - onStart: () => void
 *   - onEnd: () => void
 *   - onError: (err) => void
 *   - maxWords: number (optional word count limit for conversational replies)
 *   - rate: number (default 1.0)
 *   - pitch: number (default 1.0)
 */
export function speakPlacifyVoice(text, options = {}) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    if (options.onEnd) options.onEnd();
    return null;
  }

  // Cancel prior utterance
  stopPlacifyVoice();

  let cleaned = cleanTextForSpeech(text);
  if (!cleaned) {
    if (options.onEnd) options.onEnd();
    return null;
  }

  if (options.maxWords && options.maxWords > 0) {
    const words = cleaned.split(/\s+/);
    cleaned = words.slice(0, options.maxWords).join(" ") + (words.length > options.maxWords ? "..." : "");
  }

  const utterance = new SpeechSynthesisUtterance(cleaned);
  utterance.lang = PLACIFY_VOICE_CONFIG.lang;
  utterance.rate = options.rate || PLACIFY_VOICE_CONFIG.rate;
  utterance.pitch = options.pitch || PLACIFY_VOICE_CONFIG.pitch;

  // Apply the same unified voice
  const voice = getPlacifyVoice();
  if (voice) {
    utterance.voice = voice;
  }

  let hasEnded = false;
  const finish = (isError = false) => {
    if (hasEnded) return;
    hasEnded = true;
    if (window._placifyWatchdogTimer) {
      clearTimeout(window._placifyWatchdogTimer);
      window._placifyWatchdogTimer = null;
    }
    window._placifyActiveUtterance = null;
    if (isError && options.onError) {
      options.onError();
    } else if (options.onEnd) {
      options.onEnd();
    }
  };

  // Watchdog timer: Chrome bug can occasionally swallow onend on long utterances
  const estimatedDurationMs = Math.max(
    3000,
    cleaned.split(/\s+/).length * 400 + 3500
  );
  window._placifyWatchdogTimer = setTimeout(() => {
    finish(false);
  }, estimatedDurationMs);

  utterance.onstart = () => {
    if (options.onStart) options.onStart();
  };

  utterance.onend = () => finish(false);
  utterance.onerror = (e) => finish(true);

  // Pin reference on window to prevent Chrome garbage-collection bug
  window._placifyActiveUtterance = utterance;

  // Unpause if stalled
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }

  window.speechSynthesis.speak(utterance);
  return utterance;
}
