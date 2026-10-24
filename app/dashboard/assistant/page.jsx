"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Bot,
  Sparkles,
  Send,
  RotateCcw,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Cpu,
  Layers,
  Briefcase,
  Award,
  Zap,
  Globe,
  Shuffle,
  Compass,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ArrowDown,
  FileText,
  Printer,
  BookOpen,
  Phone
} from "lucide-react";
import { toast } from "sonner";
import ExamMarkdownRenderer from "@/components/ExamMarkdownRenderer";
import LiveAssistantVoiceCallModal from "./_components/LiveAssistantVoiceCallModal";
import { speakPlacifyVoice, stopPlacifyVoice } from "@/utils/placifyVoice";

export default function AIAssistantPage() {
  const capabilityModes = [
    {
      id: "Comprehensive-InDepth",
      label: "📚 In-Depth Masterclass Guide",
      desc: "Full comprehensive answers, architectural workflows, comparative tables, and real-world examples"
    },
    {
      id: "Omni-SuperHuman",
      label: "⚡ Super-Human Omni AGI",
      desc: "Level 5 omniscient reasoning, zero fluff, highest cognitive depth across all knowledge domains"
    },
    {
      id: "FAANG-Architect",
      label: "👑 FAANG Principal Architect",
      desc: "Petabyte-scale distributed systems, RPS/QPS math, Raft/Paxos consensus & microsecond latency"
    },
    {
      id: "Bar-Raiser",
      label: "🎯 Bar-Raiser Rubric",
      desc: "Top 1% hiring bar evaluation, lethal counter-questions & candidate differentiators"
    },
    {
      id: "Code-Synthesizer",
      label: "🚀 Production Code Synthesizer",
      desc: "Zero boilerplate, concurrent-safe typed code, edge-case coverage & asymptotic Big-O proofs"
    },
    {
      id: "STAR-Behavioral",
      label: "💼 Executive STAR Behavioral",
      desc: "High-stakes executive storytelling, multi-million dollar metrics & crisis resolution"
    }
  ];

  const [viewMode, setViewMode] = useState("exam"); // "exam" (Obsidian Document View) | "chat" (Studio Bubble View)

  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content: `📚 Below is the comprehensive, in-depth technical answer guide. Every section includes theoretical foundations, execution workflows, key terminology, and comparative analysis.

Q1. Comprehensive Guide to Access Control Models & Security Architectures

1. What is an Access Control Policy?
### 1. Comprehensive Definition & Theoretical Foundation
An **Access Control Policy (ACP)** is a formal, high-level specification that dictates the rules, constraints, and mechanisms governing how **subjects** (users, system processes, threads, or services) are permitted or prohibited from performing specific **operations** (read, write, execute, delete, append) upon protected **objects** (files, memory regions, sockets, databases, cloud APIs). In formal computer security (Lampson's Access Matrix model), an access control policy translates organizational security requirements into actionable mathematical decision predicates: \`f(Subject, Object, Operation, Environment) -> {Permit, Deny}\`.

### 2. Core Architecture & Workflow Execution
Access control policies operate through a reference monitor architecture consisting of four essential functional entities:
- **Policy Enforcement Point (PEP)**: Intercepts incoming user or process requests and pauses execution until authorization is decided.
- **Policy Decision Point (PDP)**: Evaluates the request against active rules stored in the policy repository.
- **Policy Information Point (PIP)**: Retrieves auxiliary contextual attributes (e.g., user department, geolocation, device compliance posture, time-of-day).
- **Policy Administration Point (PAP)**: The centralized control plane where security administrators author, audit, and distribute policies.

### 3. Essential Terminology & Key Components
- **Subjects**: Active entities that initiate requests (e.g., authenticated users, service accounts, background daemons).
- **Objects**: Passive entities containing data or resources (e.g., database tables, S3 buckets, REST endpoints).
- **Access Rights / Operations**: Permitted actions defined over the object (e.g., **READ**, **WRITE**, **EXECUTE**, **DELETE**, **DELEGATE**).
- **Reference Monitor**: An abstract machine that mediates all accesses, ensuring tamper-resistance, complete mediation (cannot be bypassed), and verifiable correctness.

---

2. What is Authorization and how does it differ from Authentication?
### 1. Comprehensive Definition & Foundational Distinction
**Authentication (AuthN)** is the mechanism of verifying the identity of a subject ("*Who are you?*") using credentials such as passwords, cryptographic keys, biometric signatures, or multi-factor tokens (TOTP, WebAuthn). In contrast, **Authorization (AuthZ)** is the subsequent process of determining whether an authenticated subject holds the explicit permission or legal entitlement to access a particular resource or invoke a specific action ("*What are you permitted to do?*"). Authentication always precedes authorization.

### 2. Architectural Comparison Matrix
| Dimension | Authentication (AuthN) | Authorization (AuthZ) |
| :--- | :--- | :--- |
| **Primary Question** | "Who are you?" (Identity Verification) | "What can you do?" (Privilege Enforcement) |
| **Execution Point** | Pre-session handshake (Gateway / IdP) | Per-request mediation (PEP / Microservice handler) |
| **Standard Protocols** | SAML 2.0, OpenID Connect (OIDC), Kerberos, WebAuthn | OAuth 2.0 Scopes, XACML, Open Policy Agent (OPA), AWS IAM |
| **Data Artifacts** | ID Token, SSL/TLS Client Certificate, Session Cookie | Access Token, Capability Ticket, Access Control List (ACL) |
| **Failure Response** | HTTP \`401 Unauthorized\` (Unauthenticated) | HTTP \`403 Forbidden\` (Insufficient Privileges) |

---

3. What is Discretionary Access Control (DAC)?
### 1. Comprehensive Definition & Theoretical Foundation
**Discretionary Access Control (DAC)** is an access control model where the **data owner** (the entity that created or currently owns the object) possesses total discretion over who is granted access permissions and can freely transfer or delegate those permissions to other subjects.

### 2. Core Mechanism & Implementation
- In POSIX/Linux file systems, DAC is implemented via standard mode bits (\`rwxr-xr-x\`) and file ownership (\`UID:GID\`).
- The owner executes \`chmod\` or \`setfacl\` to modify the object's **Access Control List (ACL)** without needing administrative root privileges.
- **Vulnerability**: DAC is susceptible to Trojan horse attacks and privilege leakages; if an owner grants read access to an untrusted user or malware, that user can copy the sensitive data to another file they own and share it with everyone, bypassing the original security intent.

---

4. What is Mandatory Access Control (MAC)?
### 1. Comprehensive Definition & Theoretical Foundation
**Mandatory Access Control (MAC)** is a non-discretionary, centrally enforced security paradigm where access decisions are governed strictly by the operating system kernel or security subsystem based on **fixed security labels** assigned to subjects (clearance levels) and objects (classification levels). Individual users and resource owners cannot modify, override, or delegate permissions.

### 2. Core Security Models
- **Bell-LaPadula Model (Confidentiality)**: Implements multi-level security (Unclassified, Confidential, Secret, Top Secret).
  - *No Read Up (Simple Security Property)*: A subject at Secret cannot read Top Secret.
  - *No Write Down (*-Property)*: A subject at Top Secret cannot write or leak data down to Secret.
- **Biba Integrity Model (Integrity)**: Inverts Bell-LaPadula to prevent malicious data tampering.
  - *No Read Down*: Cannot read data from untrusted low-integrity sources.
  - *No Write Up*: Cannot corrupt high-integrity data.
- **Enterprise Implementations**: SELinux (Security-Enhanced Linux with Type Enforcement), AppArmor, and military defense systems.

---

5. What is Role-Based Access Control (RBAC)?
### 1. Comprehensive Definition & Core Mechanism
**Role-Based Access Control (RBAC)** is an authorization model where permissions are grouped into **organizational roles** (e.g., \`BillingAdmin\`, \`EngineeringLead\`, \`SupportTier1\`), and subjects are subsequently assigned to those roles. Users never receive direct permissions; they inherit permissions dynamically through their role memberships.

### 2. Core Components & NIST RBAC Standards
- **Core RBAC**: Many-to-Many mapping of Users to Roles, and Roles to Permissions: \`User -> [Roles] -> [Permissions] -> Object\`.
- **Hierarchical RBAC**: Roles support inheritance graphs (e.g., \`SuperAdmin\` inherits all permissions of \`Manager\`, which inherits all permissions of \`Employee\`).
- **Constrained RBAC (Separation of Duties)**:
  - *Static Separation of Duties (SSD)*: A user cannot be assigned both \`PaymentInitiator\` and \`PaymentApprover\` roles.
  - *Dynamic Separation of Duties (DSD)*: A user may possess both roles, but cannot activate both within the same active login session.

---

6. What is a Capability List vs an Access Control List (ACL)?
### 1. Conceptual Duality (Lampson's Access Matrix)
In an Access Matrix where rows represent Subjects and columns represent Objects:
- **Access Control List (ACL)**: A column-wise slice. Stored with the **Object**. It lists every subject and the operations that subject can execute (e.g., \`File_A: {Alice: R, Bob: RW, Charlie: None}\`).
- **Capability List (C-List)**: A row-wise slice. Possessed by the **Subject** as an unforgeable cryptographic ticket or token (e.g., \`Alice: {File_A: R, File_B: RW}\`).

### 2. Architectural Trade-offs
| Feature | Access Control List (ACL) | Capability List (C-List) |
| :--- | :--- | :--- |
| **Storage Location** | Attached directly to the Object | Held by the Subject (Client Token) |
| **Permission Verification** | Simple for the object server | Fast for distributed systems (stateless tokens) |
| **Revocation Complexity** | Trivial (simply edit the object's ACL entry) | Complex (requires token blacklisting, expiration, or nonce checks) |
| **Modern Analog** | Linux File ACLs, Database Grants | Kerberos Service Tickets, Cryptographic JWTs, OAuth Bearer Tokens |

---

7. Comprehensive Access Control Model Comparison Matrix
| Model | Authority / Ownership | Granularity | Management Overhead | Best Enterprise Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **DAC** | Resource Owner | Low (User/Group/Other) | Low initially, high drift | Desktop OS, Personal storage, Git repos |
| **MAC** | Central Security Policy | Extreme (Kernel labels) | High (Rigid configuration) | Military defense, Banking kernels, SELinux |
| **RBAC** | Enterprise Organization | Medium (Role-centric) | Low to Medium (Scalable) | Enterprise SaaS, Cloud IAM, Internal Portals |
| **ABAC** | Policy Engine (Attributes) | Fine-grained (Dynamic) | Medium (Expression complexity) | Healthcare (HIPAA), Cloud Zero-Trust, Banking APIs |

---

8. What is the Principle of Least Privilege (PoLP) and Zero Trust?
### 1. Theoretical Foundation
The **Principle of Least Privilege (PoLP)** dictates that every security principal (user, service account, thread, daemon) must be granted only the absolute minimum permissions, access scopes, and temporal validity required to complete its legitimate business function, and nothing more.

### 2. Modern Zero Trust Architecture (ZTA) Integration
Under NIST SP 800-207 Zero Trust Architecture:
- **Never Trust, Always Verify**: Network perimeter security is replaced with continuous micro-segmentation.
- **Just-In-Time (JIT) Elevation**: Long-lived admin credentials are eliminated in favor of ephemeral access (e.g., AWS STS AssumeRole with 15-minute expirations).
- **Contextual Verification**: Access evaluates dynamic risk signals including IP reputation, device TPM health, geographic travel velocity, and behavioral anomalies.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);

  // Super-Human Operational Mode
  const [capabilityMode, setCapabilityMode] = useState("Comprehensive-InDepth");

  // Persona Controls
  const [targetField, setTargetField] = useState("Software Engineering");
  const [experienceLevel, setExperienceLevel] = useState("Senior (L5)");
  const [companyContext, setCompanyContext] = useState("FAANG / Big Tech");
  const [isLiveVoiceOpen, setIsLiveVoiceOpen] = useState(false);

  const [isCalibrationCollapsed, setIsCalibrationCollapsed] = useState(false);

  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [hasNewUnreadBottom, setHasNewUnreadBottom] = useState(false);
  const isNearBottomRef = useRef(true);
  const shouldForceScrollRef = useRef(false);

  // Smooth scroll directly within the dialogue stream container without window jumping
  const scrollToBottom = (behavior = "smooth") => {
    const doScroll = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior,
          block: "end",
          inline: "nearest"
        });
      } else if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior
        });
      }
    };

    doScroll();
    requestAnimationFrame(() => {
      doScroll();
    });
    setHasNewUnreadBottom(false);
  };

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    // User is near bottom if within 140px threshold
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 140;
    isNearBottomRef.current = isAtBottom;
    setShowScrollBottom(!isAtBottom);
    if (isAtBottom) {
      setHasNewUnreadBottom(false);
    }
  };

  // Auto-scroll when messages update, but never interrupt the user if they've scrolled up to read
  useEffect(() => {
    if (shouldForceScrollRef.current || isNearBottomRef.current) {
      const timer = setTimeout(() => {
        scrollToBottom("smooth");
        shouldForceScrollRef.current = false;
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setHasNewUnreadBottom(true);
    }
  }, [messages, isLoading]);

  // Maintain stable bottom anchor on view mode toggle
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom("auto");
    }, 40);
    return () => clearTimeout(timer);
  }, [viewMode]);

  // Clean up speech synthesis on component unmount
  useEffect(() => {
    return () => {
      stopPlacifyVoice();
    };
  }, []);

  const handleCopyFullSheet = () => {
    const text = messages
      .filter((m) => m.role === "assistant")
      .map((m) => m.content)
      .join("\n\n---\n\n");
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      toast.success("Complete exam answers sheet copied to clipboard!");
    }
  };

  const handlePrintSheet = () => {
    window.print();
  };

  const fields = [
    "Software Engineering",
    "Frontend & Web Architecture",
    "Backend & Distributed Systems",
    "System Design & Cloud",
    "AI, LLMs & Machine Learning",
    "DevOps & Cloud Infrastructure",
    "Cybersecurity & AppSec",
    "Mobile (iOS / Android / Flutter)",
    "Product Management",
    "Behavioral & Leadership (STAR)"
  ];

  const levels = [
    "Entry / Junior",
    "Mid-Level Specialist",
    "Senior (L5)",
    "Staff / Principal Architect",
    "Engineering Manager"
  ];

  const quickPrompts = [
    "Explain Access Control Models (DAC, MAC, RBAC, ABAC) in full depth with comparison tables & architectures",
    "Detailed Masterclass on Database Concurrency: ACID, 2PL, MVCC, and Isolation Levels with real-world examples",
    "Comprehensive Deep-Dive on Computer Networking: TCP 3-way handshake, TLS 1.3 flow, and DNS resolution",
    "Design a real-time messaging system like WhatsApp for 2 Billion users with capacity calculations",
    "Amazon Bar-Raiser: Tell me about a time you made a high-stakes decision with incomplete data",
    "Synthesize a lock-free multi-producer ring buffer in TypeScript with asymptotic analysis"
  ];

  const handleSend = async (customPrompt) => {
    const textToSend = customPrompt || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMessageId = Date.now().toString();
    const newUserMessage = {
      id: userMessageId,
      role: "user",
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    shouldForceScrollRef.current = true;
    isNearBottomRef.current = true;
    setHasNewUnreadBottom(false);
    setMessages((prev) => [...prev, newUserMessage]);
    if (!customPrompt) setInputQuery("");
    setIsLoading(true);

    // Stop ongoing speech if any
    stopPlacifyVoice();
    setSpeakingId(null);

    try {
      // Collect past answer history for strict anti-repetition constraint
      const previousAnswers = messages
        .filter((m) => m.role === "assistant" && m.id !== "welcome")
        .slice(-4)
        .map((m) => m.content.slice(0, 400));

      const history = messages
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content.slice(0, 300) }));

      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: textToSend.trim(),
          role: targetField,
          experience: experienceLevel,
          field: targetField,
          style: companyContext,
          mode: capabilityMode,
          previousAnswers,
          history,
        }),
      });

      const data = await res.json();

      if (data.success && data.answer) {
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.answer,
          modelUsed: data.modelUsed || "Placify-AI-Intelligence",
          originalQuery: textToSend.trim(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || "No response received");
      }
    } catch (err) {
      toast.error("Could not fetch assistant response. Please retry.");
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "⚠️ I encountered an error connecting to the neural inference service. Please verify your connection and try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlternativeAnswer = (originalQuery) => {
    if (!originalQuery) return;
    const prompt = `Give me a completely different perspective, alternative architectural design, or contrasting STAR scenario for: "${originalQuery}". Avoid repeating previous points.`;
    handleSend(prompt);
  };

  const handleCopy = (id, text) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success("Answer copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleToggleSpeak = (id, text) => {
    if (speakingId === id) {
      stopPlacifyVoice();
      setSpeakingId(null);
    } else {
      speakPlacifyVoice(text, {
        onStart: () => setSpeakingId(id),
        onEnd: () => setSpeakingId(null),
        onError: () => setSpeakingId(null),
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Studio Header Card */}
      <div className="rounded-3xl bg-black dark:bg-zinc-950 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-zinc-800">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono font-bold text-zinc-200 border border-white/20">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span>PLACIFY SUPER-HUMAN OMNI-INTELLIGENCE • LEVEL 5 AGI ENGINE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Placify Super-Human AI Assistant
            </h1>
            <p className="text-zinc-300 text-sm leading-relaxed">
              World-first super-human AI engineered to outperform ChatGPT. Zero fluff, mathematically rigorous system design, production-grade code synthesis, executive STAR narratives, and dynamic anti-repetition memory.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 text-xs font-mono">
            <Button
              onClick={() => setIsLiveVoiceOpen(true)}
              className="w-full px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
              title="Start live interactive audio conversation with AI Assistant"
            >
              <Phone className="w-4 h-4 text-white animate-bounce" />
              <span>Call AI Assistant (Live Voice)</span>
            </Button>
            <div className="px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-2 text-zinc-200">
              <Cpu className="w-4 h-4 text-white" />
              <span>Engine: Omni-AGI v4.0 Flash</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-2 text-zinc-200">
              <Zap className="w-4 h-4 text-white" />
              <span>Inference: Sub-2ms Cached</span>
            </div>
          </div>
        </div>
      </div>

      {/* Super-Human Operational Mode & Target Persona Calibration */}
      <div className="rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden transition-all duration-300">
        <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-2.5 flex-wrap text-xs">
            <span className="font-mono font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-black dark:text-white" />
              <span>Persona & Operational Engine</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[11px] font-mono font-semibold text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60">
              {capabilityModes.find((m) => m.id === capabilityMode)?.label?.split(" ")[1] || capabilityMode} • {targetField} • {experienceLevel}
            </span>
          </div>

          <button
            onClick={() => setIsCalibrationCollapsed((prev) => !prev)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
            title={isCalibrationCollapsed ? "Expand persona settings" : "Collapse persona settings"}
          >
            <span>{isCalibrationCollapsed ? "Adjust Settings" : "Compact View"}</span>
            {isCalibrationCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        {!isCalibrationCollapsed && (
          <div className="p-4 sm:p-5 space-y-4 animate-in fade-in duration-200">
            {/* Capability Modes */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Select Cognitive Depth:
                </span>
                <span className="text-[11px] text-zinc-800 dark:text-zinc-200 font-semibold">
                  Mode: {capabilityModes.find((m) => m.id === capabilityMode)?.label || capabilityMode}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                {capabilityModes.map((m) => {
                  const isActive = capabilityMode === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setCapabilityMode(m.id)}
                      className={`flex flex-col text-left p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden group touch-manipulation active:scale-95 ${
                        isActive
                          ? "bg-black text-white dark:bg-white dark:text-black border-transparent shadow-md scale-[1.02]"
                          : "bg-zinc-50/70 dark:bg-zinc-950/60 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white"
                      }`}
                    >
                      <span className={`text-xs font-bold flex items-center gap-1.5 ${isActive ? "text-white dark:text-black" : "text-zinc-900 dark:text-zinc-100"}`}>
                        {m.label}
                      </span>
                      <span className={`text-[10px] mt-1 line-clamp-2 leading-tight ${isActive ? "text-zinc-300 dark:text-zinc-700" : "text-zinc-500 dark:text-zinc-400"}`}>
                        {m.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Interview Persona Calibration */}
            <div className="pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-zinc-500" />
                  Target Interview Persona Calibration:
                </span>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Shapes response terminology & expectations
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* Field Selector */}
                <div>
                  <label className="block font-semibold mb-1 text-zinc-600 dark:text-zinc-400">
                    Domain / Job Category
                  </label>
                  <select
                    value={targetField}
                    onChange={(e) => setTargetField(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/70 text-zinc-800 dark:text-zinc-200 font-medium focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                  >
                    {fields.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Level Selector */}
                <div>
                  <label className="block font-semibold mb-1 text-zinc-600 dark:text-zinc-400">
                    Seniority Target
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/70 text-zinc-800 dark:text-zinc-200 font-medium focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                  >
                    {levels.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Company Context */}
                <div>
                  <label className="block font-semibold mb-1 text-zinc-600 dark:text-zinc-400">
                    Company Archetype
                  </label>
                  <input
                    type="text"
                    value={companyContext}
                    onChange={(e) => setCompanyContext(e.target.value)}
                    placeholder="e.g. Google, Amazon, Stripe, Early YC Startup"
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/70 text-zinc-800 dark:text-zinc-200 font-medium focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Interactive Dialogue & Exam Document Stream */}
      <div className={`rounded-3xl border shadow-xl flex flex-col h-[calc(100vh-14rem)] min-h-[580px] max-h-[850px] overflow-hidden transition-all duration-300 ${
        viewMode === "exam"
          ? "bg-black border-zinc-900 text-white"
          : "bg-white/90 dark:bg-zinc-900/80 backdrop-blur-xl border-zinc-200 dark:border-zinc-800"
      }`}>
        {/* Stream Top Toolbar with View Mode Switch */}
        <div className="px-4 sm:px-6 py-3 border-b border-zinc-800/80 bg-zinc-950 flex flex-wrap items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-wider text-zinc-300 flex items-center gap-1.5">
              {viewMode === "exam" ? (
                <>
                  <FileText className="w-3.5 h-3.5 text-white" />
                  <span>IN-DEPTH COMPREHENSIVE ANSWER SHEET</span>
                </>
              ) : (
                <>
                  <Bot className="w-3.5 h-3.5 text-white" />
                  <span>STUDIO DIALOGUE VIEW</span>
                </>
              )}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono font-bold">
              Level 5 AGI
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-0.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold">
              <button
                onClick={() => setViewMode("exam")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "exam"
                    ? "bg-white text-black shadow-xs font-black"
                    : "text-zinc-400 hover:text-white"
                }`}
                title="Exact obsidian exam paper & answer layout"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Exam Document UI</span>
              </button>
              <button
                onClick={() => setViewMode("chat")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "chat"
                    ? "bg-white text-black shadow-xs font-black"
                    : "text-zinc-400 hover:text-white"
                }`}
                title="Traditional bubble dialogue view"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Dialogue UI</span>
              </button>
            </div>

            {/* Copy Full Sheet */}
            <button
              onClick={handleCopyFullSheet}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium cursor-pointer transition-colors flex items-center gap-1"
              title="Copy all answers to clipboard"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Copy Sheet</span>
            </button>

            {/* Print Sheet */}
            <button
              onClick={handlePrintSheet}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium cursor-pointer transition-colors flex items-center gap-1"
              title="Print or export to PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Messages Stream with Butter-Smooth Scrolling */}
        <div className="relative flex-1 min-h-0 flex flex-col">
          <div
            ref={chatContainerRef}
            onScroll={handleScroll}
            tabIndex={0}
            className={`flex-1 assistant-dialogue-scroll focus:outline-none ${
              viewMode === "exam"
                ? "bg-black p-6 sm:p-10 space-y-6 text-white assistant-dialogue-scroll-dark"
                : "p-4 sm:p-6 space-y-6"
            }`}
          >
            {viewMode === "exam" ? (
              /* Exact Obsidian Black Exam Document View matching user screenshot */
              <div className="max-w-4xl mx-auto space-y-6 select-text font-sans">
                {messages.map((message) => {
                  const isUser = message.role === "user";

                  if (isUser) {
                    return (
                      <div
                        key={message.id}
                        className="pt-4 pb-2 border-b border-zinc-800/80 flex items-baseline justify-between gap-3 text-xs font-mono"
                      >
                        <div>
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            QUESTION / TOPIC PROMPT:
                          </span>
                          <span className="ml-2 font-semibold text-white">
                            {message.content}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-600 shrink-0">
                          {message.timestamp}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div key={message.id} className="space-y-3">
                      <ExamMarkdownRenderer content={message.content} />

                      {/* Footer Actions per section */}
                      {message.id !== "welcome" && (
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-900 text-[11px] text-zinc-500 font-mono">
                          <button
                            onClick={() => handleCopy(message.id, message.content)}
                            className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            {copiedId === message.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span>{copiedId === message.id ? "Copied" : "Copy Section"}</span>
                          </button>

                          <button
                            onClick={() => handleToggleSpeak(message.id, message.content)}
                            className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors ml-2"
                          >
                            {speakingId === message.id ? (
                              <>
                                <VolumeX className="w-3.5 h-3.5 text-rose-400" /> Stop Speaking
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5" /> Listen
                              </>
                            )}
                          </button>

                          {message.originalQuery && (
                            <button
                              onClick={() => handleAlternativeAnswer(message.originalQuery)}
                              className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors ml-2"
                            >
                              <Shuffle className="w-3.5 h-3.5" />
                              <span>Alternative Perspective</span>
                            </button>
                          )}

                          <span className="ml-auto text-[10px] text-zinc-600">
                            {message.timestamp}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex gap-3 items-center text-xs text-zinc-400 animate-pulse pl-2 font-mono py-4">
                    <div className="w-6 h-6 rounded-lg bg-zinc-800 text-white flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    </div>
                    <span>Placify AI is compiling exam-ready one-line definitions & answers...</span>
                  </div>
                )}
              </div>
            ) : (
              /* Studio Dialogue View */
              <>
                {messages.map((message) => {
                  const isUser = message.role === "user";

                  return (
                    <div
                      key={message.id}
                      className={`flex gap-3.5 ${isUser ? "justify-end" : "justify-start"} animate-in fade-in duration-200`}
                    >
                      {!isUser && (
                        <div className="w-9 h-9 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shrink-0 shadow-md mt-0.5">
                          <Bot className="w-5 h-5" />
                        </div>
                      )}

                      <div className={`max-w-2xl sm:max-w-3xl space-y-2`}>
                        <div
                          className={`rounded-2xl p-4 sm:p-5 text-sm leading-relaxed ${
                            isUser
                              ? "bg-black text-white dark:bg-white dark:text-black rounded-tr-xs shadow-md"
                              : "bg-zinc-50/80 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-xs shadow-2xs"
                          }`}
                        >
                          <ExamMarkdownRenderer content={message.content} />
                        </div>

                        {/* Assistant Footer Meta & Actions */}
                        {!isUser && message.id !== "welcome" && (
                          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                            <button
                              onClick={() => handleToggleSpeak(message.id, message.content)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                                speakingId === message.id
                                  ? "bg-rose-500/10 text-rose-600 border-rose-300 dark:border-rose-500/30 animate-pulse"
                                  : "bg-zinc-100/70 dark:bg-zinc-800/70 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-black dark:hover:text-white"
                              }`}
                              title="Listen to spoken answer"
                            >
                              {speakingId === message.id ? (
                                <>
                                  <VolumeX className="w-3.5 h-3.5 text-rose-500" /> Stop Speaking
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3.5 h-3.5" /> Listen Aloud
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => handleCopy(message.id, message.content)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-800/70 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white text-xs font-medium cursor-pointer transition-colors"
                              title="Copy answer"
                            >
                              {copiedId === message.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" /> Copy
                                </>
                              )}
                            </button>

                            {message.originalQuery && (
                              <button
                                onClick={() => handleAlternativeAnswer(message.originalQuery)}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-semibold cursor-pointer transition-all shadow-2xs"
                                title="Generate a completely different perspective"
                              >
                                <Shuffle className="w-3.5 h-3.5" />
                                <span>Generate Alternative Angle</span>
                              </button>
                            )}

                            {message.modelUsed && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                                {message.modelUsed}
                              </span>
                            )}

                            <span className="text-[10px] text-zinc-400 font-mono ml-auto">
                              {message.timestamp}
                            </span>
                          </div>
                        )}
                      </div>

                      {isUser && (
                        <div className="w-9 h-9 rounded-2xl bg-zinc-800 text-white dark:bg-white dark:text-black flex items-center justify-center shrink-0 shadow-sm mt-0.5 text-xs font-bold font-mono">
                          ME
                        </div>
                      )}
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex gap-3 items-center text-xs text-zinc-500 dark:text-zinc-400 animate-pulse pl-2 font-mono">
                    <div className="w-7 h-7 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-md">
                      <Sparkles className="w-4 h-4 animate-spin" />
                    </div>
                    <span>Placify AI is synthesizing non-repetitive response across tech knowledge graph...</span>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} className="h-4 w-full shrink-0 pointer-events-none" aria-hidden="true" />
          </div>

          {/* Floating Circular Down-Arrow Button (Accurate circle shape, centered with smooth glide) */}
          {showScrollBottom && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
              <button
                onClick={() => scrollToBottom("smooth")}
                className="relative w-10 h-10 rounded-full aspect-square bg-zinc-900/95 hover:bg-zinc-800 border border-zinc-600/70 text-white flex items-center justify-center shadow-2xl backdrop-blur-md hover:scale-110 active:scale-95 transition-all cursor-pointer animate-in fade-in zoom-in-95 group"
                title={hasNewUnreadBottom ? "New response below - click to scroll" : "Scroll to bottom"}
                aria-label="Scroll to bottom"
              >
                <ArrowDown className="w-4 h-4 text-white transition-transform group-hover:translate-y-0.5" />
                {hasNewUnreadBottom && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-black"></span>
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Quick Launch Suggestions */}
        <div className="px-4 py-2 border-t border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-zinc-400 shrink-0 font-mono">
            QUICK PROMPTS:
          </span>
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="text-xs shrink-0 px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white transition-all cursor-pointer whitespace-nowrap shadow-2xs"
            >
              {q.length > 40 ? q.slice(0, 38) + "..." : q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={`Ask any interview question for ${targetField} (${experienceLevel})...`}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-2xl bg-zinc-100/80 dark:bg-zinc-950/80 border border-zinc-200/80 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 text-zinc-900 dark:text-zinc-100 transition-all"
            />
            <Button
              type="button"
              onClick={() => setIsLiveVoiceOpen(true)}
              variant="outline"
              title="Call AI Assistant with live voice audio"
              className="h-11 px-3.5 rounded-2xl border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-emerald-500 animate-pulse" />
            </Button>
            <Button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              variant="default"
              className="h-11 px-5 rounded-2xl font-bold text-xs shrink-0 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-md"
            >
              <span>Ask AI</span>
              <Send className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </form>
        </div>
      </div>

      {/* Live AI Voice Call Modal with Assistant */}
      <LiveAssistantVoiceCallModal
        isOpen={isLiveVoiceOpen}
        onClose={() => setIsLiveVoiceOpen(false)}
        targetField={targetField}
        experienceLevel={experienceLevel}
        capabilityMode={capabilityMode}
      />
    </div>
  );
}
