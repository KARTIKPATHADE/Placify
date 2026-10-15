import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      type = "bullet", // "bullet" | "summary" | "skills" | "spellcheck" | "fix_all_spelling"
      content = "",
      role = "Software Engineer",
      education = "B.Tech Computer Science",
      context = "",
      resumeData = null
    } = body;

    if (!content && type !== "skills" && type !== "summary" && type !== "fix_all_spelling") {
      return NextResponse.json(
        { success: false, error: "Content is required for enhancement." },
        { status: 400 }
      );
    }

    if (genAI) {
      try {
        const candidateModels = ["gemini-3.1-flash-lite", "gemini-1.5-flash"];
        let enhancedText = null;

        for (const modelName of candidateModels) {
          try {
            const model = genAI.getGenerativeModel({
              model: modelName,
              generationConfig: {
                temperature: type === "spellcheck" || type === "fix_all_spelling" ? 0.1 : 0.4,
                maxOutputTokens: 2048,
              }
            });
            let prompt = "";
            if (type === "spellcheck") {
              prompt = `
You are an executive resume proofreader and editor.
Fix all spelling mistakes, typos, grammatical errors, capitalization, and punctuation in the following text.
DO NOT change factual meanings, numbers, metrics, or technical frameworks/tools (e.g., Next.js, PostgreSQL, Docker, AWS).
Ensure clean, polished professional English.

Original Text:
"${content}"

Return ONLY the corrected text with NO quotes, NO extra explanation, and NO markdown fences.
`;
            } else if (type === "fix_all_spelling") {
              prompt = `
You are an executive resume proofreader.
Carefully review this resume JSON and correct any spelling mistakes, typos, grammar errors, and awkward phrasing across:
- "summary"
- Every item in "experience[].bullets"
- Every item in "projects[].bullets"
- "personalInfo.jobTitle"

Do NOT alter facts, numbers, dates, company names, or technical terms.
Return ONLY valid JSON matching the exact schema with NO markdown wrappers.

Resume JSON:
${JSON.stringify(resumeData || {})}
`;
            } else if (type === "bullet") {
              prompt = `
You are an executive FAANG technical recruiter. Rewrite the following resume bullet point using the Placify XYZ formula:
"Accomplished [X] as measured by [Y], by doing [Z]"
Target Role: ${role}
Candidate Education: ${education}
Original Bullet: "${content}"

Requirements:
- Start with a powerful action verb (Engineered, Architected, Spearheaded, Optimized, Orchestrated).
- Incorporate realistic, high-impact quantifiable metrics (percentage improvements, latency reductions, user scale, request throughput).
- Keep it concise, punchy, professional, and ATS-friendly (1-2 sentences max).
- Return ONLY the improved bullet point with NO extra commentary, quotes, or markdown wrappers.
`;
            } else if (type === "summary") {
              prompt = `
You are an executive resume writer. Craft a high-impact, 2-3 sentence professional resume summary for:
Target Role: ${role}
Education Background: ${education}
Current Notes / Draft: "${content || "Passionate engineer eager to deliver high-impact software solutions."}"

Requirements:
- Highlight technical acumen, problem-solving mindset, and business orientation.
- Tailor the tone to their background (e.g., if fresher or non-tech, emphasize fast learning and practical proof-of-work; if experienced, emphasize architectural ownership).
- Return ONLY the final summary text with NO quotes or introductory text.
`;
            } else if (type === "skills") {
              prompt = `
List the top 12 most critical, high-demand ATS technical keywords and technologies for a candidate targeting:
Role: ${role}
Education: ${education}
Context: ${context || "Modern enterprise development"}

Return as a comma-separated list of keywords only. No numbers, no bullet points, just names separated by commas (e.g. React, TypeScript, Next.js, Docker, PostgreSQL, AWS).
`;
            }

            const result = await model.generateContent(prompt);
            enhancedText = result.response.text().trim();
            if (enhancedText) break;
          } catch (mErr) {
            console.warn(`Model ${modelName} failed in enhance:`, mErr?.message);
          }
        }

        if (enhancedText) {
          if (type === "fix_all_spelling") {
            try {
              let cleaned = enhancedText.replace(/^```json/, "").replace(/```$/, "").trim();
              const parsed = JSON.parse(cleaned);
              return NextResponse.json({
                success: true,
                type,
                enhanced: parsed,
                source: "gemini-ai"
              });
            } catch (_) {}
          }

          return NextResponse.json({
            success: true,
            type,
            enhanced: enhancedText,
            source: "gemini-ai"
          });
        }
      } catch (geminiError) {
        console.warn("Gemini enhance API failed, falling back to smart rephraser:", geminiError?.message);
      }
    }

    // Heuristic Fallback for Enhancement / Spellcheck
    const typoMap = {
      teh: "the",
      comapre: "compare",
      speling: "spelling",
      assestant: "assistant",
      reapeat: "repeat",
      baground: "background",
      colunm: "column",
      eduction: "education",
      experiance: "experience",
      experence: "experience",
      developped: "developed",
      responsable: "responsible",
      databse: "database",
      mangement: "management",
      langauge: "language",
      langauges: "languages",
      softare: "software",
      softwear: "software",
      univeristy: "university",
      colledge: "college",
      seperate: "separate",
      recieved: "received",
      occured: "occurred",
      untill: "until"
    };

    const cleanTypos = (str) => {
      if (!str || typeof str !== "string") return str;
      let res = str;
      for (const [bad, good] of Object.entries(typoMap)) {
        const reg = new RegExp(`\\b${bad}\\b`, "gi");
        res = res.replace(reg, good);
      }
      return res;
    };

    let fallbackText = "";
    if (type === "spellcheck") {
      fallbackText = cleanTypos(content);
      // Capitalize first letter if needed
      if (fallbackText.length > 0) {
        fallbackText = fallbackText.charAt(0).toUpperCase() + fallbackText.slice(1);
      }
    } else if (type === "fix_all_spelling") {
      const fixed = JSON.parse(JSON.stringify(resumeData || {}));
      if (fixed.summary) fixed.summary = cleanTypos(fixed.summary);
      if (fixed.experience) {
        fixed.experience.forEach((e) => {
          e.bullets = (e.bullets || []).map(cleanTypos);
        });
      }
      if (fixed.projects) {
        fixed.projects.forEach((p) => {
          p.bullets = (p.bullets || []).map(cleanTypos);
        });
      }
      return NextResponse.json({
        success: true,
        type,
        enhanced: fixed,
        source: "placify-neural-template"
      });
    } else if (type === "bullet") {
      const verbs = ["Spearheaded", "Architected", "Engineered", "Orchestrated", "Optimized"];
      const selectedVerb = verbs[Math.floor(Math.random() * verbs.length)];
      fallbackText = `${selectedVerb} end-to-end implementation of ${cleanTypos(content).replace(/^(worked on|built|developed|responsible for|helped in)\s*/i, "")}, boosting overall efficiency by 32% and reducing response latency across 20,000+ active user interactions.`;
    } else if (type === "summary") {
      fallbackText = `Driven and results-focused ${role} with a solid foundation in ${education}. Proven ability to build scalable, high-performance applications with modern frameworks, clean code practices, and a relentless focus on user impact and operational excellence.`;
    } else if (type === "skills") {
      fallbackText = "React, TypeScript, Next.js, Node.js, PostgreSQL, Docker, AWS, RESTful APIs, Tailwind CSS, Git, CI/CD, Jest";
    }

    return NextResponse.json({
      success: true,
      type,
      enhanced: fallbackText,
      source: "placify-neural-template"
    });
  } catch (err) {
    console.error("Resume enhance route error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to enhance content." },
      { status: 500 }
    );
  }
}
