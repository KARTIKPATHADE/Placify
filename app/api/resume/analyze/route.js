import { NextResponse } from "next/server";
import { analyzeResumeWithAI } from "@/utils/PlacifyResumeAnalyzer";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      resumeText,
      education = "B.Tech Computer Science",
      targetRole = "Software Engineer",
      targetCategory = "Software Engineering",
      experienceLevel = "Fresher (0-1 yrs)",
      targetJobDesc = ""
    } = body;

    if (!resumeText || typeof resumeText !== "string" || !resumeText.trim()) {
      return NextResponse.json(
        { success: false, error: "Please provide resume text to analyze." },
        { status: 400 }
      );
    }

    const analysis = await analyzeResumeWithAI({
      resumeText: resumeText.trim(),
      education,
      targetRole,
      targetCategory,
      experienceLevel,
      targetJobDesc
    });

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Resume Analyzer API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "An unexpected error occurred during resume analysis."
      },
      { status: 500 }
    );
  }
}
