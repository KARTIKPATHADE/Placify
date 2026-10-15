"use client";

/**
 * Placify User Plan & Premium Subscription State Management
 */

export function getUserPlan() {
  if (typeof window === "undefined") {
    return { plan: "free", isPro: false, name: "Starter Simulator" };
  }
  try {
    const raw = localStorage.getItem("placify_user_plan");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && (parsed.plan === "pro" || parsed.isPro)) {
        return {
          plan: "pro",
          isPro: true,
          name: "Placify Pro",
          ...parsed
        };
      }
    }
  } catch (_) {}
  return { plan: "free", isPro: false, name: "Starter Simulator" };
}

export function setUserPlan(planKey) {
  if (typeof window === "undefined") return;
  try {
    if (planKey === "pro" || planKey === "enterprise") {
      const data = {
        plan: planKey,
        isPro: true,
        name: planKey === "enterprise" ? "Enterprise Fleet" : "Placify Pro",
        activatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        features: [
          "Unlimited custom mock sessions",
          "Live AI Audio Voice Call with Gemini Live",
          "Advanced Demeanor & Posture Coaching",
          "Official Candidate Performance PDF Dossier",
          "FAANG / Tier 1 Technical System Design Rubrics",
          "Instant ATS Resume Audits & Enhancers"
        ]
      };
      localStorage.setItem("placify_user_plan", JSON.stringify(data));
      window.dispatchEvent(new Event("placify_plan_updated"));
      return data;
    } else {
      const data = {
        plan: "free",
        isPro: false,
        name: "Starter Simulator",
        activatedAt: new Date().toISOString()
      };
      localStorage.setItem("placify_user_plan", JSON.stringify(data));
      window.dispatchEvent(new Event("placify_plan_updated"));
      return data;
    }
  } catch (err) {
    console.error("Failed to update user plan:", err);
  }
}
