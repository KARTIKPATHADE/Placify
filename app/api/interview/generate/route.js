import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      jobPosition = "Full Stack Developer",
      jobDesc = "React, Node.js, TypeScript, PostgreSQL",
      jobExperience = "2",
      resumeText = "",
      questionCount = 5
    } = body;

    const count = Math.max(3, Math.min(10, Number(questionCount) || 5));

    // Candidate models with fallback
    const candidateModels = ["gemini-3.1-flash-lite", "gemini-1.5-flash"];
    let generatedQuestions = null;

    if (genAI) {
      for (const modelName of candidateModels) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 4096,
              responseMimeType: "application/json"
            }
          });

          let prompt = "";
          if (resumeText && resumeText.trim().length > 50) {
            prompt = `
You are an executive technical recruiter and FAANG hiring manager creating a rigorous mock interview.
The candidate has provided their resume for the role of "${jobPosition}".

Candidate Resume Content:
---
${resumeText.slice(0, 10000)}
---

Target Role Parameters:
- Position: ${jobPosition}
- Tech Stack / Domain: ${jobDesc}
- Experience Level: ${jobExperience} Years

REQUIREMENTS:
Generate exactly ${count} comprehensive interview questions designed for FULL JOB INTERVIEW PREPARATION.
The questions MUST be split into two vital categories:

1. RESUME DEEP-DIVE QUESTIONS (Approximately half of questions):
   - Ask specifically about actual projects, architectural decisions, metrics, tools, and technical challenges listed on the candidate's uploaded resume.
   - Dig into what they personally built, how they made trade-offs, and how they measured success.
   - Set "category": "Resume Project Deep-Dive"

2. CORE EXTERNAL TECHNICAL SKILLS QUESTIONS (Approximately half of questions):
   - Essential industry questions testing core fundamentals and external technical skills required for "${jobPosition}" (e.g., system design, concurrency, memory/performance optimization, error handling, algorithms, and security).
   - Set "category": "Core Technical Skills & System Design"

Output Format:
Return ONLY valid JSON matching this exact structure:
[
  {
    "question": "In your project [X] mentioned on your resume, how did you architect the data synchronization layer and what latency improvements were achieved?",
    "answer": "An exemplary answer should explain the choice of protocol (e.g. WebSockets or SSE), cache invalidation strategy, error boundaries, and quote quantifiable performance metrics.",
    "category": "Resume Project Deep-Dive",
    "skillsTested": "Architecture, Realtime Systems, State Sync"
  },
  {
    "question": "How do you mitigate race conditions and database deadlocks in high-throughput distributed transactions?",
    "answer": "A senior engineer should discuss optimistic vs pessimistic concurrency control, isolation levels (Serializable vs Read Committed), idempotent requests, and distributed locks.",
    "category": "Core Technical Skills & System Design",
    "skillsTested": "Database Concurrency, ACID, Distributed Systems"
  }
]
`;
          } else {
            prompt = `
You are an executive hiring bar-raiser creating a comprehensive technical interview session for "${jobPosition}".

Parameters:
- Target Role: ${jobPosition}
- Required Tech Stack & Skills: ${jobDesc}
- Experience: ${jobExperience} Years

REQUIREMENTS:
Generate exactly ${count} high-impact interview questions providing fully balanced preparation across:
1. Core Technical Fundamentals & System Design ("Core Technical Skills & System Design")
2. Practical Architecture & Problem Solving ("Practical Technical Execution")

Output Format:
Return ONLY valid JSON array:
[
  {
    "question": "Question text here...",
    "answer": "Comprehensive benchmark answer here...",
    "category": "Core Technical Skills & System Design",
    "skillsTested": "Key skills tested..."
  }
]
`;
          }

          const result = await model.generateContent(prompt);
          const rawText = result.response.text().trim();
          const cleaned = rawText.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
          const parsed = JSON.parse(cleaned);

          let list = Array.isArray(parsed)
            ? parsed
            : (parsed?.interview_questions ||
               parsed?.interviewQuestions ||
               parsed?.questions ||
               parsed?.mockInterviewQuestions ||
               parsed?.data ||
               Object.values(parsed || {}).find(v => Array.isArray(v)));

          if (Array.isArray(list) && list.length >= 3) {
            generatedQuestions = list;
            break;
          }
        } catch (err) {
          console.warn(`Model ${modelName} question generation error:`, err?.message);
        }
      }
    }

    // Heuristic Fallback if Gemini is unavailable
    if (!generatedQuestions || !Array.isArray(generatedQuestions)) {
      const skillsList = jobDesc.split(/[,/|]/).map(s => s.trim()).filter(Boolean);
      const primarySkill = skillsList[0] || "JavaScript";
      const secondarySkill = skillsList[1] || "system architecture";

      if (resumeText && resumeText.trim().length > 50) {
        generatedQuestions = [
          {
            question: `Based on your resume experience, can you walk through the most complex architectural challenge you solved using ${primarySkill}? What tradeoffs did you consider?`,
            answer: `A strong response should describe the problem context, specific architectural options evaluated, trade-offs between speed, cost, and maintainability, and measurable outcomes.`,
            category: "Resume Project Deep-Dive",
            skillsTested: `${primarySkill}, Architectural Tradeoffs`
          },
          {
            question: `In your resume projects, how did you ensure production code reliability, testing coverage, and automated deployment pipelines?`,
            answer: `The candidate should discuss CI/CD tooling (e.g. GitHub Actions, Docker), testing pyramids (unit, integration, end-to-end), monitoring, and automated rollbacks.`,
            category: "Resume Project Deep-Dive",
            skillsTested: "CI/CD, Automated Testing, DevOps"
          },
          {
            question: `Explain how you design for high availability and low latency when querying large datasets in ${secondarySkill}.`,
            answer: `A benchmark answer discusses indexing, query optimization, connection pooling, caching layers (like Redis), and read replicas.`,
            category: "Core Technical Skills & System Design",
            skillsTested: `${secondarySkill}, Query Optimization, Caching`
          },
          {
            question: `How do you handle asynchronous error boundaries, unhandled promise rejections, and graceful degradation in modern applications?`,
            answer: `The candidate should explain global error middleware, structured logging, user-friendly fallback UIs, circuit breakers, and alerting thresholds.`,
            category: "Core Technical Skills & System Design",
            skillsTested: "Error Handling, Resilience, Observability"
          },
          {
            question: `How do you approach securing APIs against common vulnerabilities like CSRF, XSS, rate-limit exhaustion, and injection attacks?`,
            answer: `A top response covers input sanitization, parametrized queries, secure HTTP headers (CSP, CORS), rate limiting via token bucket, and JWT/OAuth best practices.`,
            category: "Core Technical Skills & System Design",
            skillsTested: "Application Security, OWASP Top 10"
          }
        ].slice(0, count);
      } else {
        generatedQuestions = [
          {
            question: `What are the core architectural principles of ${primarySkill}, and when would you choose it over alternative solutions?`,
            answer: `The candidate should cover the fundamental runtime/paradigm model, strengths, limitations, ecosystem benefits, and specific production use cases.`,
            category: "Core Technical Skills & System Design",
            skillsTested: `${primarySkill}, System Architecture`
          },
          {
            question: `How would you design a scalable service handling 10,000 requests per second with sub-100ms response times using ${secondarySkill}?`,
            answer: `A senior engineer details horizontal scaling, load balancing, caching strategies, asynchronous message queues, and database sharding.`,
            category: "Core Technical Skills & System Design",
            skillsTested: "High Scalability, Load Balancing, Caching"
          },
          {
            question: `How do you identify, isolate, and debug memory leaks and event loop bottlenecks in high-concurrency environments?`,
            answer: `The response should cover profiling tools, heap snapshots, monitoring CPU/memory metrics, GC behavior, and leak prevention patterns.`,
            category: "Core Technical Skills & System Design",
            skillsTested: "Performance Profiling, Memory Optimization"
          },
          {
            question: `Walk through your approach to managing state and data consistency across distributed services.`,
            answer: `Covers eventual consistency, distributed transactions (Saga pattern), idempotent messaging, and event-driven architecture.`,
            category: "Core Technical Skills & System Design",
            skillsTested: "Distributed State, Eventual Consistency"
          },
          {
            question: `Describe a scenario where you had to refactor a legacy codebase under tight deadlines. How did you balance speed with code quality?`,
            answer: `Demonstrates pragmatic engineering, test-driven refactoring, modular boundaries, avoiding premature optimization, and team communication.`,
            category: "Core Technical Skills & System Design",
            skillsTested: "Refactoring, Technical Debt, Engineering Leadership"
          }
        ].slice(0, count);
      }
    }

    return NextResponse.json({
      success: true,
      questions: generatedQuestions,
      hasResume: !!(resumeText && resumeText.trim().length > 50)
    });
  } catch (err) {
    console.error("Interview generate route error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to generate interview questions." },
      { status: 500 }
    );
  }
}
