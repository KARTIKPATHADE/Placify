import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

/**
 * Live Voice Call AI Interviewer Endpoint
 * Powers real-time interactive voice dialogue between candidate and AI
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      question = "",
      jobPosition = "Software Engineer",
      userSpeech = "",
      action = "user_speaking", // "start_call" | "user_speaking" | "next_question"
      activeQuestionIndex = 0,
      totalQuestions = 5,
      history = []
    } = body;

    const candidateModels = ["gemini-3.1-flash-lite", "gemini-1.5-flash"];
    let aiResponse = null;

    if (genAI) {
      for (const modelName of candidateModels) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 1024,
              responseMimeType: "application/json"
            }
          });

          let prompt = "";

          if (action === "start_call") {
            prompt = `
You are an executive AI Interviewer conducting a live phone/audio interview with a candidate for the position of "${jobPosition}".
This is the very start of the call.
CURRENT FIRST QUESTION: "${question}"

INSTRUCTIONS FOR AUDIO SPEECH:
- Greet the candidate warmly and professionally (1 sentence).
- Formally introduce Question 1 clearly and concisely.
- Keep your entire spoken text natural, conversational, and under 50 words so it sounds realistic when spoken aloud over phone audio.

Return JSON:
{
  "spokenText": "Hello! I am your Placify AI interviewer for the ${jobPosition} role. Let's begin with our first question: ${question}. Whenever you're ready, please share your thoughts.",
  "status": "ready_to_listen",
  "isQuestionComplete": false
}
`;
          } else {
            prompt = `
You are an executive AI Interviewer conducting a live audio interview for the "${jobPosition}" role.
CURRENT QUESTION:
"${question}"

CANDIDATE JUST SPOKE (Audio Transcript):
"${userSpeech || "(Candidate paused or finished their statement)"}"

RECENT CONVERSATION HISTORY:
${history.slice(-4).map(h => `${h.role === "user" ? "Candidate" : "Interviewer"}: ${h.text}`).join("\n")}

YOUR GOAL AS A LIVE CONVERSATIONAL INTERVIEWER:
1. Provide a direct, natural 1-2 sentence verbal reaction to what the candidate just said.
   - If they gave a strong answer, briefly acknowledge their key technical point (e.g. "Great breakdown of the non-blocking event loop.").
   - If they asked for clarification, answer directly.
   - If their answer was incomplete, ask a brief 1-sentence follow-up.
2. Determine if the candidate has sufficiently answered Question ${activeQuestionIndex + 1} or if we should move to the next topic.
3. Keep "spokenText" completely conversational, clear, and between 20 to 45 words — optimized for Text-To-Speech audio without markdown asterisks or robotic symbols.

Return ONLY valid JSON:
{
  "spokenText": "Natural verbal reaction spoken aloud to candidate...",
  "evaluationSnippet": "1-line assessment of their answer depth",
  "rating": 8,
  "isQuestionComplete": true,
  "suggestedNextIndex": ${activeQuestionIndex + 1}
}
`;
          }

          const result = await model.generateContent(prompt);
          const rawText = result.response.text().trim();
          let parsed = null;
          try {
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              parsed = JSON.parse(jsonMatch[0]);
            } else {
              const cleaned = rawText.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
              parsed = JSON.parse(cleaned);
            }
          } catch (pe) {
            console.warn("JSON parse attempt note:", pe.message);
          }

          if (parsed && parsed.spokenText) {
            aiResponse = parsed;
            break;
          }
        } catch (err) {
          console.warn(`Model ${modelName} error in live call:`, err?.message);
        }
      }
    }

    // Heuristic Fallback for zero latency or offline situations
    if (!aiResponse) {
      if (action === "start_call") {
        aiResponse = {
          spokenText: `Welcome to your live mock interview session for the ${jobPosition} position. Let's begin with Question ${activeQuestionIndex + 1}: ${question}. Take your time, and speak your answer clearly.`,
          status: "ready_to_listen",
          isQuestionComplete: false
        };
      } else {
        const words = (userSpeech || "").trim().split(/\s+/).filter(Boolean).length;
        if (words > 25) {
          aiResponse = {
            spokenText: `Thank you for sharing that detailed explanation. You covered the core principles effectively. Let's proceed to the next question when you're ready.`,
            evaluationSnippet: "Solid technical explanation with clear structural clarity.",
            rating: 8,
            isQuestionComplete: true,
            suggestedNextIndex: activeQuestionIndex + 1
          };
        } else {
          aiResponse = {
            spokenText: `I hear you. Could you elaborate a bit more on the specific architecture or trade-offs involved?`,
            evaluationSnippet: "Brief response; candidate encouraged to expand.",
            rating: 6,
            isQuestionComplete: false,
            suggestedNextIndex: activeQuestionIndex
          };
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: aiResponse
    });
  } catch (err) {
    console.error("Live call route error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Failed to process live call turn.",
        fallbackSpokenText: "I heard your response. That makes sense. Let's proceed to the next topic."
      },
      { status: 500 }
    );
  }
}
