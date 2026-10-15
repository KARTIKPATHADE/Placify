"use client";

import React, { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";

/**
 * Parses inline formatting like **bold**, *italic*, `code`
 */
function renderInline(text, keyPrefix = "") {
  if (!text) return null;

  const parts = [];
  let remaining = text;
  let idx = 0;

  // Regex matching **bold**, *italic*, and `code`
  const inlineRegex = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/;

  while (remaining) {
    const match = remaining.match(inlineRegex);
    if (!match) {
      parts.push(<span key={`${keyPrefix}-t-${idx++}`}>{remaining}</span>);
      break;
    }

    const matchIndex = match.index;
    if (matchIndex > 0) {
      parts.push(
        <span key={`${keyPrefix}-t-${idx++}`}>
          {remaining.slice(0, matchIndex)}
        </span>
      );
    }

    const fullMatch = match[0];
    if (fullMatch.startsWith("**") && fullMatch.endsWith("**")) {
      parts.push(
        <strong
          key={`${keyPrefix}-b-${idx++}`}
          className="font-bold text-white tracking-normal"
        >
          {match[2]}
        </strong>
      );
    } else if (fullMatch.startsWith("*") && fullMatch.endsWith("*")) {
      parts.push(
        <em
          key={`${keyPrefix}-i-${idx++}`}
          className="italic text-zinc-300"
        >
          {match[3]}
        </em>
      );
    } else if (fullMatch.startsWith("`") && fullMatch.endsWith("`")) {
      parts.push(
        <code
          key={`${keyPrefix}-c-${idx++}`}
          className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 font-mono text-[11px]"
        >
          {match[4]}
        </code>
      );
    }

    remaining = remaining.slice(matchIndex + fullMatch.length);
  }

  return parts;
}

/**
 * Code Block Card with Copy Button
 */
function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-md">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-zinc-900/90 border-b border-zinc-800 text-zinc-400 text-[11px] font-mono">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-zinc-400" />
          <span>{language || "code"}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto overscroll-x-contain text-[12px] font-mono leading-relaxed text-zinc-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/**
 * Markdown Table Renderer
 */
function MarkdownTable({ rows, tableKey }) {
  if (!rows || rows.length === 0) return null;

  // Split cells by pipe and trim
  const parsedRows = rows.map((r) => {
    const rawCells = r.split("|").map((c) => c.trim());
    // remove leading/trailing empty string from outer pipes
    if (rawCells.length > 0 && rawCells[0] === "") rawCells.shift();
    if (rawCells.length > 0 && rawCells[rawCells.length - 1] === "") rawCells.pop();
    return rawCells;
  });

  // Check if row 1 is divider
  let header = null;
  let body = [];

  if (
    parsedRows.length >= 2 &&
    parsedRows[1].every((c) => /^[-:\s]+$/.test(c))
  ) {
    header = parsedRows[0];
    body = parsedRows.slice(2);
  } else {
    body = parsedRows;
  }

  return (
    <div className="my-4 overflow-x-auto overscroll-x-contain rounded-xl border border-zinc-800 bg-zinc-950/80 shadow-md">
      <table className="w-full text-xs text-left border-collapse">
        {header && (
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/90 text-white font-semibold">
              {header.map((col, idx) => (
                <th key={`${tableKey}-th-${idx}`} className="px-4 py-2.5 font-bold tracking-tight">
                  {renderInline(col, `${tableKey}-th-${idx}`)}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-zinc-800/70">
          {body.map((row, rIdx) => (
            <tr key={`${tableKey}-tr-${rIdx}`} className="hover:bg-zinc-900/40 transition-colors">
              {row.map((cell, cIdx) => (
                <td key={`${tableKey}-td-${rIdx}-${cIdx}`} className="px-4 py-2.5 text-zinc-300 leading-relaxed">
                  {renderInline(cell, `${tableKey}-td-${rIdx}-${cIdx}`)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * ExamMarkdownRenderer
 * High-contrast, clean Obsidian Black reader matching comprehensive, in-depth technical answers
 */
export default function ExamMarkdownRenderer({ content, className = "" }) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements = [];
  let currentCodeBlock = null;
  let codeLines = [];
  let codeLanguage = "";
  let currentTableRows = [];

  const flushTable = (keyIdx) => {
    if (currentTableRows.length > 0) {
      elements.push(
        <MarkdownTable
          key={`tbl-${keyIdx}`}
          tableKey={`tbl-${keyIdx}`}
          rows={[...currentTableRows]}
        />
      );
      currentTableRows = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Handle code block start/end
    if (trimmed.startsWith("```")) {
      flushTable(i);
      if (currentCodeBlock) {
        elements.push(
          <CodeBlock
            key={`code-${i}`}
            code={codeLines.join("\n")}
            language={codeLanguage}
          />
        );
        currentCodeBlock = null;
        codeLines = [];
        codeLanguage = "";
      } else {
        currentCodeBlock = true;
        codeLanguage = trimmed.slice(3).trim();
      }
      continue;
    }

    if (currentCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // Handle Markdown Tables
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      currentTableRows.push(trimmed);
      continue;
    } else {
      flushTable(i);
    }

    // Empty line
    if (!trimmed) {
      elements.push(<div key={`spacer-${i}`} className="h-2.5" />);
      continue;
    }

    // 1. Callouts / Badges (e.g. 👍 Below are exam-ready answers...)
    if (
      trimmed.startsWith("👍") ||
      trimmed.startsWith("📌") ||
      trimmed.startsWith("⚡") ||
      trimmed.startsWith("💡") ||
      trimmed.startsWith("📚") ||
      trimmed.startsWith("🎯")
    ) {
      elements.push(
        <div
          key={`callout-${i}`}
          className="text-xs sm:text-sm text-zinc-200 font-medium mb-3 flex items-start gap-2 leading-relaxed bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/80"
        >
          <span>{renderInline(trimmed, `callout-${i}`)}</span>
        </div>
      );
      continue;
    }

    // 2. Sub-headings: ### or ####
    if (/^#{3,4}\s+/.test(trimmed)) {
      const headingText = trimmed.replace(/^#{3,4}\s*/, "");
      elements.push(
        <h4
          key={`subhead-${i}`}
          className="text-sm sm:text-base font-bold text-white tracking-tight mt-4 mb-2 flex items-center gap-2"
        >
          {renderInline(headingText, `sub-${i}`)}
        </h4>
      );
      continue;
    }

    // 3. Major Section Heading: # or ## or Q1. Part A.
    if (
      /^#{1,2}\s+/.test(trimmed) ||
      /^Q\d+[\.:\)]\s+/i.test(trimmed) ||
      /^Part\s+[A-Z0-9]+[\.:\)]/i.test(trimmed) ||
      /^Section\s+[A-Z0-9]+[\.:\)]/i.test(trimmed)
    ) {
      const headingText = trimmed.replace(/^#{1,2}\s*/, "");
      elements.push(
        <h2
          key={`sec-head-${i}`}
          className="text-lg sm:text-xl font-extrabold text-white tracking-tight mt-7 mb-3 pt-2 border-b border-zinc-800 pb-2"
        >
          {renderInline(headingText, `sec-${i}`)}
        </h2>
      );
      continue;
    }

    // 4. Question Titles (e.g. "1. What is an Access Control Policy?", "2. Explain Authorization", "**1. What is...**")
    const isQuestionNumbered =
      (/^(\d+[\.:\)]|\([0-9]+\))\s+/.test(trimmed) ||
        /^\*\*(\d+[\.:\)]|\([0-9]+\))\s+/.test(trimmed)) &&
      (trimmed.includes("?") ||
        /\b(What|Why|How|Explain|Define|Compare|Difference|Describe|Discuss|Differentiate)\b/i.test(
          trimmed
        ) ||
        trimmed.length < 90);

    if (isQuestionNumbered) {
      let cleanQuestion = trimmed;
      if (cleanQuestion.startsWith("**") && cleanQuestion.endsWith("**")) {
        cleanQuestion = cleanQuestion.slice(2, -2);
      }

      elements.push(
        <h3
          key={`q-head-${i}`}
          className="text-base sm:text-lg font-bold text-white tracking-tight mt-6 mb-2 pt-2 border-t border-zinc-900"
        >
          {renderInline(cleanQuestion, `q-${i}`)}
        </h3>
      );
      continue;
    }

    // 5. Bullet lists
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const bulletContent = trimmed.slice(2);
      elements.push(
        <div
          key={`bullet-${i}`}
          className="flex items-start gap-2.5 pl-3 text-xs sm:text-sm text-zinc-300 leading-relaxed my-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2 shrink-0" />
          <span>{renderInline(bulletContent, `b-${i}`)}</span>
        </div>
      );
      continue;
    }

    // 6. Numbered Sub-lists (e.g. "1. ", "a) ", "i) ")
    if (/^(\d+[\.:\)]|[a-zA-Z][\.:\)]|\([a-zA-Z0-9]+\))\s+/.test(trimmed)) {
      const match = trimmed.match(/^(\d+[\.:\)]|[a-zA-Z][\.:\)]|\([a-zA-Z0-9]+\))\s+/);
      const prefix = match[0];
      const listContent = trimmed.slice(prefix.length);

      elements.push(
        <div
          key={`numlist-${i}`}
          className="flex items-start gap-2.5 pl-3 text-xs sm:text-sm text-zinc-300 leading-relaxed my-1.5"
        >
          <span className="font-mono font-bold text-white shrink-0 text-xs mt-0.5">{prefix}</span>
          <span>{renderInline(listContent, `nl-${i}`)}</span>
        </div>
      );
      continue;
    }

    // 7. Divider
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      elements.push(
        <hr key={`hr-${i}`} className="my-6 border-zinc-800" />
      );
      continue;
    }

    // 8. Regular In-Depth Answer Paragraph with bold key highlights
    elements.push(
      <p
        key={`p-${i}`}
        className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal mb-3.5"
      >
        {renderInline(trimmed, `p-${i}`)}
      </p>
    );
  }

  flushTable(lines.length);

  return (
    <div className={`exam-document-stream text-white select-text ${className}`}>
      {elements}
    </div>
  );
}
