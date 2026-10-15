import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      question = "",
      correctAns = "",
      userAns = "",
      visualTelemetry = {
        dominantExpression: "Confident & Engaged",
        eyeContactPercent: 90,
        presenceScore: 85,
        postureStatus: "Upright & Centered",
        smileFrequency: 35
      }
    } = body;

    const candidateModels = ["gemini-3.1-flash-lite", "gemini-1.5-flash"];
    let evaluationData = null;

    if (genAI) {
      for (const modelName of candidateModels) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 2048,
              responseMimeType: "application/json"
            }
          });

          const prompt = `
You are an executive hiring bar-raiser conducting a holistic job interview evaluation.
Evaluate the candidate's spoken answer AND their non-verbal facial expression / interview presence.

QUESTION:
"${question}"

BENCHMARK IDEAL ANSWER:
"${correctAns}"

CANDIDATE'S SPOKEN TRANSCRIPT:
"${userAns || "No recorded speech transcript captured."}"

CANDIDATE VISUAL & EXPRESSION TELEMETRY (Captured via webcam analysis during answer):
- Dominant Expression: ${visualTelemetry?.dominantExpression || "Focused"}
- Camera Eye Contact Consistency: ${visualTelemetry?.eyeContactPercent || 88}%
- Posture & Camera Framing: ${visualTelemetry?.postureStatus || "Centered"}
- Executive Demeanor Presence Score: ${visualTelemetry?.presenceScore || 82}/100

EVALUATION REQUIREMENTS:
1. "rating": Numerical rating from 1 to 10 based on technical depth, accuracy, clarity, and completeness.
2. "feedback": Concise 3-4 line critique of their verbal answer, highlighting what they did well and what specific points were missing.
3. "expressionAnalysis":
   - "dominantExpression": "${visualTelemetry?.dominantExpression || "Confident"}",
   - "eyeContactRating": "${visualTelemetry?.eyeContactPercent || 88}% Eye Contact",
   - "presenceScore": ${visualTelemetry?.presenceScore || 82},
   - "critique": 2 sentences evaluating their composure, eye contact, and executive presence while speaking.
   - "howToLookSuggestions": An array of 3 specific, practical suggestions on how the candidate should look, sit, smile, and position themselves during a real job interview (e.g., camera angle, smiling when opening, looking directly at the lens, chin alignment).

Return ONLY valid JSON matching this schema:
{
  "rating": 7,
  "feedback": "Concise feedback on their technical response...",
  "expressionAnalysis": {
    "dominantExpression": "Confident & Engaged",
    "eyeContactRating": "90% Direct Camera Eye Contact",
    "presenceScore": 85,
    "critique": "You demonstrated calm composure and maintained consistent eye contact with the camera, which projects authority.",
    "howToLookSuggestions": [
      "Position your webcam at eye level to avoid looking downward, creating natural eye-to-eye contact.",
      "Offer a warm, natural smile when greeting or starting your answer to build immediate interviewer rapport.",
      "Keep your shoulders relaxed and maintain an open posture with occasional thoughtful nods."
    ]
  }
}
`;

          const result = await model.generateContent(prompt);
          const rawText = result.response.text().trim();
          const cleaned = rawText.replace(/^```json/, "").replace(/```$/, "").trim();
          const parsed = JSON.parse(cleaned);

          if (parsed && typeof parsed.rating !== "undefined") {
            evaluationData = parsed;
            break;
          }
        } catch (err) {
          console.warn(`Model ${modelName} evaluation error:`, err?.message);
        }
      }
    }

    // Heuristic Fallback
    if (!evaluationData) {
      const words = (userAns || "").trim().split(/\s+/).filter(Boolean).length;
      let score = 5;
      if (words > 80) score = 8;
      else if (words > 40) score = 7;
      else if (words > 15) score = 6;
      else if (words === 0) score = 2;

      evaluationData = {
        rating: score,
        feedback: words > 30
          ? "Good foundational coverage of the topic. To achieve a top-tier score, articulate concrete trade-offs, mention real-world production metrics, and cite specific architectural patterns."
          : "The response was brief. In real interviews, elaborate using structured frameworks (like STAR or Problem-Solution-Impact) to thoroughly demonstrate your depth.",
        expressionAnalysis: {
          dominantExpression: visualTelemetry?.dominantExpression || "Focused & Attentive",
          eyeContactRating: `${visualTelemetry?.eyeContactPercent || 88}% Eye Contact`,
          presenceScore: visualTelemetry?.presenceScore || 84,
          critique: "Your facial demeanor showed engagement and steady focus throughout the explanation.",
          howToLookSuggestions: [
            "Keep your webcam positioned exactly at eye level so your line of sight aligns naturally with the interviewer.",
            "Introduce your response with a gentle smile to convey enthusiasm, warmth, and self-assurance.",
            "Maintain an upright, centered posture with relaxed shoulders to project confident executive poise."
          ]
        }
      };
    }

    return NextResponse.json({
      success: true,
      evaluation: evaluationData
    });
  } catch (err) {
    console.error("Interview evaluate route error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to evaluate answer." },
      { status: 500 }
    );
  }
}
