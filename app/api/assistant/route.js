import { NextResponse } from "next/server";
import { askPlacifyAssistant } from "@/utils/PlacifyAIAssistant";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      query,
      role = "Full Stack Engineer",
      experience = "Senior (L5)",
      field = "Software Engineering",
      style = "Comprehensive",
      mode = "Omni-SuperHuman",
      history = [],
      previousAnswers = []
    } = body;

    if (!query || typeof query !== "string" || !query.trim()) {
      return NextResponse.json(
        { success: false, error: "A valid query is required." },
        { status: 400 }
      );
    }

    const response = await askPlacifyAssistant({
      query: query.trim(),
      role,
      experience,
      field,
      style,
      mode,
      history,
      previousAnswers,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("AI Assistant API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to generate AI assistant response.",
      },
      { status: 500 }
    );
  }
}
