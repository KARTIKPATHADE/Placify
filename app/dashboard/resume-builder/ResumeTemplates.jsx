import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  ExternalLink,
  Award,
  GraduationCap,
  Briefcase,
  Code,
  Layers
} from "lucide-react";

// Crisp inline brand SVG icons
function GithubIcon({ className = "w-3 h-3" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-3 h-3" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46v-8.37M7.85 6.45a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
    </svg>
  );
}

/**
 * Smart CGPA / Percentage Formatter
 * Sanitizes raw inputs like "7.38", "GPA: 7.38", "GPA 8.5 / 10", "8.65 / 10 CGPA"
 * and ensures it always displays standard CGPA terminology.
 */
export const formatCGPA = (val) => {
  if (!val) return "";
  const s = String(val).trim();
  if (!s) return "";
  // If already prefixed with CGPA
  if (/^cgpa\s*[:\-]?\s*/i.test(s)) {
    return s.replace(/^cgpa\s*[:\-]?\s*/i, "CGPA: ");
  }
  // If prefixed with GPA, convert to CGPA
  if (/^gpa\s*[:\-]?\s*/i.test(s)) {
    return s.replace(/^gpa\s*[:\-]?\s*/i, "CGPA: ");
  }
  // If ends with CGPA (e.g. "7.38 CGPA")
  if (/cgpa$/i.test(s)) {
    return s;
  }
  return `CGPA: ${s}`;
};

/**
 * 1. TECH MODERN TEMPLATE
 * Industry-standard single-column ATS layout for Software Engineers and Tech professionals.
 */
export function TechModernTemplate({ resumeData }) {
  const { personalInfo, summary, experience, education, projects, skills } = resumeData;

  return (
    <div className="w-full text-zinc-900 font-sans leading-normal">
      {/* Header */}
      <div className="border-b-2 border-black pb-3 mb-3 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 uppercase">
          {personalInfo.fullName || "Your Full Name"}
        </h1>
        <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-700 mt-0.5">
          {personalInfo.jobTitle || "Target Job Role"}
        </p>

        {/* Contact Line */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-[11px] text-zinc-600 font-medium mt-1.5">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.portfolioUrl && (
            <span>
              •{" "}
              <a href={personalInfo.portfolioUrl} target="_blank" rel="noreferrer" className="underline hover:text-black">
                Portfolio
              </a>
            </span>
          )}
          {personalInfo.githubUrl && (
            <span>
              •{" "}
              <a href={personalInfo.githubUrl} target="_blank" rel="noreferrer" className="underline hover:text-black">
                GitHub
              </a>
            </span>
          )}
          {personalInfo.linkedinUrl && (
            <span>
              •{" "}
              <a href={personalInfo.linkedinUrl} target="_blank" rel="noreferrer" className="underline hover:text-black">
                LinkedIn
              </a>
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-3.5">
          <h2 className="text-xs font-black uppercase tracking-wider border-b border-zinc-200 pb-1 mb-1.5 text-zinc-950">
            Professional Summary
          </h2>
          <p className="text-[11px] leading-relaxed text-zinc-700">{summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {experience?.length > 0 && (
        <div className="mb-3.5">
          <h2 className="text-xs font-black uppercase tracking-wider border-b border-zinc-200 pb-1 mb-2 text-zinc-950">
            Work Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-bold text-zinc-950">
                    {exp.role} <span className="font-normal text-zinc-600">| {exp.company}</span>
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-zinc-500">
                    {exp.startDate} – {exp.endDate} {exp.location ? `• ${exp.location}` : ""}
                  </span>
                </div>
                <ul className="list-disc list-outside pl-4 space-y-1 text-[11px] text-zinc-700 leading-relaxed">
                  {exp.bullets?.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Technical Projects */}
      {projects?.length > 0 && (
        <div className="mb-3.5">
          <h2 className="text-xs font-black uppercase tracking-wider border-b border-zinc-200 pb-1 mb-2 text-zinc-950">
            Key Technical Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="space-y-1">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-bold text-zinc-950">
                    {proj.title}{" "}
                    {proj.techStack && (
                      <span className="font-normal text-zinc-500 text-[10px]">
                        ({proj.techStack})
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="underline hover:text-black">
                        Live Demo
                      </a>
                    )}
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="underline hover:text-black">
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
                <ul className="list-disc list-outside pl-4 space-y-1 text-[11px] text-zinc-700 leading-relaxed">
                  {proj.bullets?.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <div className="mb-3.5">
          <h2 className="text-xs font-black uppercase tracking-wider border-b border-zinc-200 pb-1 mb-2 text-zinc-950">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="text-xs space-y-0.5">
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-zinc-950">
                    {edu.degree} <span className="font-normal text-zinc-600">| {edu.institution}</span>
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-zinc-600">
                    {edu.graduationYear} {edu.gpa ? `• ${formatCGPA(edu.gpa)}` : ""}
                  </span>
                </div>
                {edu.details && (
                  <p className="text-[10px] text-zinc-600 italic">{edu.details}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technical Skills */}
      <div>
        <h2 className="text-xs font-black uppercase tracking-wider border-b border-zinc-200 pb-1 mb-2 text-zinc-950">
          Technical Skills & Tools
        </h2>
        <div className="space-y-1 text-[11px] text-zinc-800 leading-relaxed">
          {skills?.languages && (
            <div>
              <strong className="font-bold text-zinc-950">Languages:</strong> {skills.languages}
            </div>
          )}
          {skills?.frameworks && (
            <div>
              <strong className="font-bold text-zinc-950">Frameworks & Libraries:</strong> {skills.frameworks}
            </div>
          )}
          {skills?.tools && (
            <div>
              <strong className="font-bold text-zinc-950">Cloud & Tools:</strong> {skills.tools}
            </div>
          )}
          {skills?.softSkills && (
            <div>
              <strong className="font-bold text-zinc-950">Architecture & Methodologies:</strong> {skills.softSkills}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 2. IVY CLASSIC (HARVARD / ACADEMIC) TEMPLATE
 * Traditional academic serif layout with centered header, prominent education, and bold dividing rules.
 */
export function IvyClassicTemplate({ resumeData }) {
  const { personalInfo, summary, experience, education, projects, skills } = resumeData;

  return (
    <div className="w-full text-zinc-900 font-serif leading-normal">
      {/* Centered Academic Header */}
      <div className="border-b-2 border-black pb-3 mb-3 text-center">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-wider text-black uppercase">
          {personalInfo.fullName || "Your Full Name"}
        </h1>
        {personalInfo.jobTitle && (
          <p className="text-xs font-serif italic text-zinc-700 mt-0.5">
            {personalInfo.jobTitle}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[10.5px] font-sans text-zinc-700 mt-2">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.portfolioUrl && (
            <span>
              •{" "}
              <a href={personalInfo.portfolioUrl} target="_blank" rel="noreferrer" className="underline hover:text-black">
                Portfolio
              </a>
            </span>
          )}
          {personalInfo.githubUrl && (
            <span>
              •{" "}
              <a href={personalInfo.githubUrl} target="_blank" rel="noreferrer" className="underline hover:text-black">
                GitHub
              </a>
            </span>
          )}
          {personalInfo.linkedinUrl && (
            <span>
              •{" "}
              <a href={personalInfo.linkedinUrl} target="_blank" rel="noreferrer" className="underline hover:text-black">
                LinkedIn
              </a>
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-3.5">
          <h2 className="text-xs font-serif font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-1.5 text-black">
            Objective / Summary
          </h2>
          <p className="text-[11px] leading-relaxed text-zinc-800 font-sans">{summary}</p>
        </div>
      )}

      {/* Education (Prominently Placed in Ivy Style) */}
      {education?.length > 0 && (
        <div className="mb-3.5">
          <h2 className="text-xs font-serif font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-2 text-black">
            Education
          </h2>
          <div className="space-y-2 font-sans">
            {education.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="flex items-baseline justify-between">
                  <span className="font-serif font-bold text-zinc-950 text-xs">
                    {edu.institution}
                  </span>
                  <span className="text-[10.5px] font-mono text-zinc-700 font-medium">
                    {edu.location || ""}
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-[11px]">
                  <span className="italic font-serif text-zinc-800">{edu.degree}</span>
                  <span className="font-mono text-[10.5px] font-bold text-black">
                    {edu.graduationYear} {edu.gpa ? `• ${formatCGPA(edu.gpa)}` : ""}
                  </span>
                </div>
                {edu.details && (
                  <p className="text-[10px] text-zinc-600 mt-0.5">{edu.details}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <div className="mb-3.5">
          <h2 className="text-xs font-serif font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-2 text-black">
            Professional Experience
          </h2>
          <div className="space-y-3 font-sans">
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-serif font-bold text-zinc-950">
                    {exp.company} <span className="font-normal font-sans text-zinc-600">| {exp.role}</span>
                  </span>
                  <span className="text-[10px] font-mono text-zinc-600 font-medium">
                    {exp.startDate} – {exp.endDate} {exp.location ? `• ${exp.location}` : ""}
                  </span>
                </div>
                <ul className="list-disc list-outside pl-4 space-y-1 text-[11px] text-zinc-800 leading-relaxed">
                  {exp.bullets?.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <div className="mb-3.5">
          <h2 className="text-xs font-serif font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-2 text-black">
            Selected Projects & Research
          </h2>
          <div className="space-y-3 font-sans">
            {projects.map((proj) => (
              <div key={proj.id} className="space-y-1">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-serif font-bold text-zinc-950">
                    {proj.title}{" "}
                    {proj.techStack && (
                      <span className="font-normal font-sans text-zinc-600 text-[10px]">
                        [{proj.techStack}]
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-2 text-[10.5px] text-zinc-600 font-mono">
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="underline hover:text-black">
                        Demo
                      </a>
                    )}
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="underline hover:text-black">
                        Code
                      </a>
                    )}
                  </div>
                </div>
                <ul className="list-disc list-outside pl-4 space-y-1 text-[11px] text-zinc-800 leading-relaxed">
                  {proj.bullets?.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technical Skills */}
      <div>
        <h2 className="text-xs font-serif font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-2 text-black">
          Skills & Core Competencies
        </h2>
        <div className="space-y-1 text-[11px] font-sans text-zinc-800 leading-relaxed">
          {skills?.languages && (
            <div>
              <strong className="font-serif font-bold text-black">Languages:</strong> {skills.languages}
            </div>
          )}
          {skills?.frameworks && (
            <div>
              <strong className="font-serif font-bold text-black">Frameworks & Technologies:</strong> {skills.frameworks}
            </div>
          )}
          {skills?.tools && (
            <div>
              <strong className="font-serif font-bold text-black">Tools & Cloud:</strong> {skills.tools}
            </div>
          )}
          {skills?.softSkills && (
            <div>
              <strong className="font-serif font-bold text-black">Methodologies:</strong> {skills.softSkills}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 3. TWO-COLUMN SPLIT TEMPLATE
 * Contemporary split layout with a prominent left sidebar for contact, education with CGPA badge, and skills.
 */
export function TwoColumnTemplate({ resumeData }) {
  const { personalInfo, summary, experience, education, projects, skills } = resumeData;

  return (
    <div className="w-full text-zinc-900 font-sans leading-normal">
      {/* Top Banner with Name & Title */}
      <div className="border-b-2 border-zinc-900 pb-3 mb-4">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 uppercase">
          {personalInfo.fullName || "Your Full Name"}
        </h1>
        <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-700 mt-0.5">
          {personalInfo.jobTitle || "Target Job Role"}
        </p>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left Sidebar (35% width) */}
        <div className="md:col-span-4 space-y-4 pr-0 md:pr-4 md:border-r border-zinc-200">
          {/* Contact Details */}
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-wider border-b border-zinc-300 pb-1 mb-2 text-zinc-900">
              Contact Details
            </h3>
            <div className="space-y-1.5 text-[10.5px] text-zinc-700 font-medium">
              {personalInfo.email && (
                <div className="break-all flex items-center gap-1.5">
                  <Mail className="w-3 h-3 shrink-0 text-zinc-900" />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 shrink-0 text-zinc-900" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 shrink-0 text-zinc-900" />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.portfolioUrl && (
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3 h-3 shrink-0 text-zinc-900" />
                  <a href={personalInfo.portfolioUrl} target="_blank" rel="noreferrer" className="underline hover:text-black truncate">
                    Portfolio
                  </a>
                </div>
              )}
              {personalInfo.githubUrl && (
                <div className="flex items-center gap-1.5">
                  <GithubIcon className="w-3 h-3 shrink-0 text-zinc-900" />
                  <a href={personalInfo.githubUrl} target="_blank" rel="noreferrer" className="underline hover:text-black truncate">
                    GitHub
                  </a>
                </div>
              )}
              {personalInfo.linkedinUrl && (
                <div className="flex items-center gap-1.5">
                  <LinkedinIcon className="w-3 h-3 shrink-0 text-zinc-900" />
                  <a href={personalInfo.linkedinUrl} target="_blank" rel="noreferrer" className="underline hover:text-black truncate">
                    LinkedIn
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Education with Prominent CGPA Badge */}
          {education?.length > 0 && (
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-wider border-b border-zinc-300 pb-1 mb-2 text-zinc-900 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" /> Education
              </h3>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="space-y-1">
                    <div className="font-bold text-[11px] text-zinc-950 leading-tight">
                      {edu.degree}
                    </div>
                    <div className="text-[10px] text-zinc-600 font-medium">
                      {edu.institution}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500">
                      Class of {edu.graduationYear}
                    </div>
                    {edu.gpa && (
                      <div className="mt-1">
                        <span className="inline-block px-2 py-0.5 rounded bg-zinc-900 text-white font-mono font-bold text-[9.5px]">
                          {formatCGPA(edu.gpa)}
                        </span>
                      </div>
                    )}
                    {edu.details && (
                      <p className="text-[9.5px] text-zinc-600 italic mt-0.5">{edu.details}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Skills Sidebar */}
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-wider border-b border-zinc-300 pb-1 mb-2 text-zinc-900 flex items-center gap-1">
              <Code className="w-3.5 h-3.5" /> Skills & Tools
            </h3>
            <div className="space-y-2 text-[10.5px]">
              {skills?.languages && (
                <div>
                  <div className="font-bold text-zinc-950 text-[10px] uppercase">Languages</div>
                  <div className="text-zinc-700">{skills.languages}</div>
                </div>
              )}
              {skills?.frameworks && (
                <div>
                  <div className="font-bold text-zinc-950 text-[10px] uppercase">Frameworks</div>
                  <div className="text-zinc-700">{skills.frameworks}</div>
                </div>
              )}
              {skills?.tools && (
                <div>
                  <div className="font-bold text-zinc-950 text-[10px] uppercase">Cloud & Tools</div>
                  <div className="text-zinc-700">{skills.tools}</div>
                </div>
              )}
              {skills?.softSkills && (
                <div>
                  <div className="font-bold text-zinc-950 text-[10px] uppercase">Methodologies</div>
                  <div className="text-zinc-700">{skills.softSkills}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Main Body (65% width) */}
        <div className="md:col-span-8 space-y-4">
          {/* Summary */}
          {summary && (
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider border-b border-zinc-200 pb-1 mb-1.5 text-zinc-950">
                Executive Profile
              </h2>
              <p className="text-[11px] leading-relaxed text-zinc-700">{summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience?.length > 0 && (
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider border-b border-zinc-200 pb-1 mb-2 text-zinc-950 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" /> Work Experience
              </h2>
              <div className="space-y-3">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="font-bold text-zinc-950">
                        {exp.role} <span className="font-normal text-zinc-600">| {exp.company}</span>
                      </span>
                      <span className="text-[10px] font-mono font-semibold text-zinc-500">
                        {exp.startDate} – {exp.endDate}
                      </span>
                    </div>
                    <ul className="list-disc list-outside pl-4 space-y-1 text-[11px] text-zinc-700 leading-relaxed">
                      {exp.bullets?.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects?.length > 0 && (
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider border-b border-zinc-200 pb-1 mb-2 text-zinc-950 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Technical Projects
              </h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="space-y-1">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="font-bold text-zinc-950">
                        {proj.title}{" "}
                        {proj.techStack && (
                          <span className="font-normal text-zinc-500 text-[10px]">
                            ({proj.techStack})
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                        {proj.liveUrl && (
                          <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="underline hover:text-black">
                            Demo
                          </a>
                        )}
                        {proj.githubUrl && (
                          <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="underline hover:text-black">
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                    <ul className="list-disc list-outside pl-4 space-y-1 text-[11px] text-zinc-700 leading-relaxed">
                      {proj.bullets?.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 4. MINIMALIST OBSIDIAN (SWISS NUMBERED) TEMPLATE
 * High-contrast Swiss design with numbered sections (01 // SUMMARY), sharp typography and monospace badges.
 */
export function MonochromeTemplate({ resumeData }) {
  const { personalInfo, summary, experience, education, projects, skills } = resumeData;

  return (
    <div className="w-full text-zinc-900 font-sans leading-normal">
      {/* Swiss Brutalist Header */}
      <div className="border-b-2 border-black pb-3 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-black uppercase">
              {personalInfo.fullName || "Your Full Name"}
            </h1>
            <p className="text-xs font-mono font-bold tracking-widest text-zinc-700 uppercase mt-0.5">
              // {personalInfo.jobTitle || "Target Job Role"}
            </p>
          </div>
          <div className="text-[10px] font-mono text-zinc-600 sm:text-right space-y-0.5">
            {personalInfo.email && <div>EMAIL: {personalInfo.email}</div>}
            {personalInfo.phone && <div>TEL: {personalInfo.phone}</div>}
            {personalInfo.location && <div>LOC: {personalInfo.location}</div>}
          </div>
        </div>

        {/* Links Bar */}
        {(personalInfo.portfolioUrl || personalInfo.githubUrl || personalInfo.linkedinUrl) && (
          <div className="flex flex-wrap gap-4 text-[10px] font-mono font-bold text-black border-t border-zinc-200 pt-2 mt-2">
            {personalInfo.portfolioUrl && (
              <a href={personalInfo.portfolioUrl} target="_blank" rel="noreferrer" className="underline hover:bg-black hover:text-white px-1">
                [PORTFOLIO]
              </a>
            )}
            {personalInfo.githubUrl && (
              <a href={personalInfo.githubUrl} target="_blank" rel="noreferrer" className="underline hover:bg-black hover:text-white px-1">
                [GITHUB]
              </a>
            )}
            {personalInfo.linkedinUrl && (
              <a href={personalInfo.linkedinUrl} target="_blank" rel="noreferrer" className="underline hover:bg-black hover:text-white px-1">
                [LINKEDIN]
              </a>
            )}
          </div>
        )}
      </div>

      {/* 01 // Summary */}
      {summary && (
        <div className="mb-4">
          <div className="text-[11px] font-mono font-black uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
            01 // PROFILE & OBJECTIVE
          </div>
          <p className="text-[11px] leading-relaxed text-zinc-800">{summary}</p>
        </div>
      )}

      {/* 02 // Experience */}
      {experience?.length > 0 && (
        <div className="mb-4">
          <div className="text-[11px] font-mono font-black uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2">
            02 // WORK EXPERIENCE
          </div>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-bold text-black">
                    {exp.role}{" "}
                    <span className="font-normal text-zinc-600">@ {exp.company}</span>
                  </span>
                  <span className="text-[10px] font-mono text-zinc-600 font-semibold">
                    [{exp.startDate} -> {exp.endDate}] {exp.location ? `// ${exp.location}` : ""}
                  </span>
                </div>
                <ul className="list-disc list-outside pl-4 space-y-1 text-[11px] text-zinc-800 leading-relaxed">
                  {exp.bullets?.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 03 // Technical Projects */}
      {projects?.length > 0 && (
        <div className="mb-4">
          <div className="text-[11px] font-mono font-black uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2">
            03 // TECHNICAL PROJECTS
          </div>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="space-y-1">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-bold text-black">
                    {proj.title}{" "}
                    {proj.techStack && (
                      <span className="font-mono text-zinc-500 text-[10px]">
                        [{proj.techStack}]
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="underline font-bold hover:bg-black hover:text-white px-0.5">
                        DEMO
                      </a>
                    )}
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="underline font-bold hover:bg-black hover:text-white px-0.5">
                        SRC
                      </a>
                    )}
                  </div>
                </div>
                <ul className="list-disc list-outside pl-4 space-y-1 text-[11px] text-zinc-800 leading-relaxed">
                  {proj.bullets?.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 04 // Education */}
      {education?.length > 0 && (
        <div className="mb-4">
          <div className="text-[11px] font-mono font-black uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2">
            04 // ACADEMIC BACKGROUND
          </div>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="text-xs space-y-0.5">
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-black">
                    {edu.degree}{" "}
                    <span className="font-normal text-zinc-600">// {edu.institution}</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-zinc-800">
                    [{edu.graduationYear}] {edu.gpa ? `// ${formatCGPA(edu.gpa)}` : ""}
                  </span>
                </div>
                {edu.details && (
                  <p className="text-[10px] font-mono text-zinc-600">{edu.details}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 05 // Technical Arsenal */}
      <div>
        <div className="text-[11px] font-mono font-black uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2">
          05 // TECHNICAL ARSENAL
        </div>
        <div className="space-y-1 text-[11px] text-zinc-800 leading-relaxed font-mono">
          {skills?.languages && (
            <div>
              <strong className="text-black font-bold">LANGUAGES:</strong> {skills.languages}
            </div>
          )}
          {skills?.frameworks && (
            <div>
              <strong className="text-black font-bold">FRAMEWORKS:</strong> {skills.frameworks}
            </div>
          )}
          {skills?.tools && (
            <div>
              <strong className="text-black font-bold">TOOLS/CLOUD:</strong> {skills.tools}
            </div>
          )}
          {skills?.softSkills && (
            <div>
              <strong className="text-black font-bold">METHODOLOGY:</strong> {skills.softSkills}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 5. CAMPUS / FRESHER (CGPA HIGHLIGHTED) TEMPLATE
 * Tailored specifically for students and campus placements: Education with prominent CGPA badge first,
 * followed immediately by Key Technical Projects.
 */
export function CampusFresherTemplate({ resumeData }) {
  const { personalInfo, summary, experience, education, projects, skills } = resumeData;

  return (
    <div className="w-full text-zinc-900 font-sans leading-normal">
      {/* Header */}
      <div className="border-b-2 border-zinc-950 pb-3 mb-3 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 uppercase">
              {personalInfo.fullName || "Your Full Name"}
            </h1>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-700 mt-0.5">
              {personalInfo.jobTitle || "Entry-Level Software Engineer"}
            </p>
          </div>

          {/* Fresher / Graduate Badge */}
          <div className="self-start sm:self-center">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-300 text-zinc-900 font-mono text-[10px] font-bold">
              <Award className="w-3 h-3" /> CAMPUS CANDIDATE
            </span>
          </div>
        </div>

        {/* Contact Links */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-[11px] text-zinc-600 font-medium mt-2">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.portfolioUrl && (
            <span>
              •{" "}
              <a href={personalInfo.portfolioUrl} target="_blank" rel="noreferrer" className="underline hover:text-black">
                Portfolio
              </a>
            </span>
          )}
          {personalInfo.githubUrl && (
            <span>
              •{" "}
              <a href={personalInfo.githubUrl} target="_blank" rel="noreferrer" className="underline hover:text-black">
                GitHub
              </a>
            </span>
          )}
          {personalInfo.linkedinUrl && (
            <span>
              •{" "}
              <a href={personalInfo.linkedinUrl} target="_blank" rel="noreferrer" className="underline hover:text-black">
                LinkedIn
              </a>
            </span>
          )}
        </div>
      </div>

      {/* Career Objective */}
      {summary && (
        <div className="mb-3.5">
          <h2 className="text-xs font-black uppercase tracking-wider border-b border-zinc-200 pb-1 mb-1.5 text-zinc-950">
            Career Objective
          </h2>
          <p className="text-[11px] leading-relaxed text-zinc-700">{summary}</p>
        </div>
      )}

      {/* EDUCATION FIRST (CRITICAL FOR FRESHERS WITH CGPA BADGE) */}
      {education?.length > 0 && (
        <div className="mb-3.5 bg-zinc-50/70 p-3 rounded-xl border border-zinc-200">
          <div className="flex items-center justify-between border-b border-zinc-300 pb-1 mb-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-zinc-950 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-black" /> Academic Background & Education
            </h2>
            <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold">
              Official University Standing
            </span>
          </div>

          <div className="space-y-2.5">
            {education.map((edu) => (
              <div key={edu.id} className="text-xs space-y-1">
                <div className="flex items-baseline justify-between flex-wrap gap-1">
                  <span className="font-bold text-zinc-950 text-[12px]">
                    {edu.degree}{" "}
                    <span className="font-semibold text-zinc-700">| {edu.institution}</span>
                  </span>

                  {/* HIGH-IMPACT CGPA BADGE */}
                  {edu.gpa && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black text-white font-mono font-bold text-[10px] shadow-xs">
                      ★ {formatCGPA(edu.gpa)}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[10.5px] text-zinc-600 font-mono">
                  <span>Class of {edu.graduationYear}</span>
                  {edu.location && <span>{edu.location}</span>}
                </div>

                {edu.details && (
                  <p className="text-[10px] text-zinc-700 italic border-l-2 border-black pl-2 mt-1">
                    {edu.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KEY TECHNICAL PROJECTS (SHOWCASE IMMEDIATELY AFTER EDUCATION) */}
      {projects?.length > 0 && (
        <div className="mb-3.5">
          <h2 className="text-xs font-black uppercase tracking-wider border-b border-zinc-200 pb-1 mb-2 text-zinc-950">
            Key Software & Engineering Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="space-y-1">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-bold text-zinc-950">
                    {proj.title}{" "}
                    {proj.techStack && (
                      <span className="font-normal text-zinc-600 text-[10px]">
                        ({proj.techStack})
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-mono">
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="underline hover:text-black">
                        Live Demo
                      </a>
                    )}
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="underline hover:text-black">
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
                <ul className="list-disc list-outside pl-4 space-y-1 text-[11px] text-zinc-700 leading-relaxed">
                  {proj.bullets?.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Work / Internship Experience */}
      {experience?.length > 0 && (
        <div className="mb-3.5">
          <h2 className="text-xs font-black uppercase tracking-wider border-b border-zinc-200 pb-1 mb-2 text-zinc-950">
            Internships & Work Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-bold text-zinc-950">
                    {exp.role} <span className="font-normal text-zinc-600">| {exp.company}</span>
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-zinc-500">
                    {exp.startDate} – {exp.endDate} {exp.location ? `• ${exp.location}` : ""}
                  </span>
                </div>
                <ul className="list-disc list-outside pl-4 space-y-1 text-[11px] text-zinc-700 leading-relaxed">
                  {exp.bullets?.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technical Skills */}
      <div>
        <h2 className="text-xs font-black uppercase tracking-wider border-b border-zinc-200 pb-1 mb-2 text-zinc-950">
          Technical Arsenal & Core Competencies
        </h2>
        <div className="space-y-1 text-[11px] text-zinc-800 leading-relaxed">
          {skills?.languages && (
            <div>
              <strong className="font-bold text-zinc-950">Programming Languages:</strong> {skills.languages}
            </div>
          )}
          {skills?.frameworks && (
            <div>
              <strong className="font-bold text-zinc-950">Frameworks & Libraries:</strong> {skills.frameworks}
            </div>
          )}
          {skills?.tools && (
            <div>
              <strong className="font-bold text-zinc-950">Developer Tools & Cloud:</strong> {skills.tools}
            </div>
          )}
          {skills?.softSkills && (
            <div>
              <strong className="font-bold text-zinc-950">Computer Science Fundamentals:</strong> {skills.softSkills}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 6. EXECUTIVE LEAD TEMPLATE
 * Sophisticated corporate leadership design with top accent header, competencies matrix, and architecture focus.
 */
export function ExecutiveTemplate({ resumeData }) {
  const { personalInfo, summary, experience, education, projects, skills } = resumeData;

  return (
    <div className="w-full text-zinc-900 font-sans leading-normal">
      {/* Executive Card Header */}
      <div className="border-t-4 border-black pt-3 pb-3 mb-4 bg-zinc-50/80 p-4 rounded-xl border-x border-b border-zinc-200">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 uppercase">
            {personalInfo.fullName || "Your Full Name"}
          </h1>
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-zinc-700 mt-1">
            {personalInfo.jobTitle || "Engineering Director & Systems Architect"}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-zinc-600 font-medium mt-2.5 pt-2 border-t border-zinc-200">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo.location && <span>• {personalInfo.location}</span>}
            {personalInfo.portfolioUrl && (
              <span>
                •{" "}
                <a href={personalInfo.portfolioUrl} target="_blank" rel="noreferrer" className="underline hover:text-black">
                  Portfolio
                </a>
              </span>
            )}
            {personalInfo.linkedinUrl && (
              <span>
                •{" "}
                <a href={personalInfo.linkedinUrl} target="_blank" rel="noreferrer" className="underline hover:text-black">
                  LinkedIn
                </a>
              </span>
            )}
            {personalInfo.githubUrl && (
              <span>
                •{" "}
                <a href={personalInfo.githubUrl} target="_blank" rel="noreferrer" className="underline hover:text-black">
                  GitHub
                </a>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      {summary && (
        <div className="mb-4">
          <h2 className="text-xs font-black uppercase tracking-wider border-b-2 border-black pb-1 mb-1.5 text-zinc-950">
            Executive Summary & Leadership Scope
          </h2>
          <p className="text-[11px] leading-relaxed text-zinc-800">{summary}</p>
        </div>
      )}

      {/* Core Competencies Matrix */}
      {skills && (skills.languages || skills.frameworks || skills.tools || skills.softSkills) && (
        <div className="mb-4">
          <h2 className="text-xs font-black uppercase tracking-wider border-b-2 border-black pb-1 mb-2 text-zinc-950">
            Core Competencies & Technical Mastery
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px]">
            {skills.languages && (
              <div className="p-2 rounded-lg bg-zinc-100/70 border border-zinc-200">
                <span className="font-bold text-zinc-950 uppercase block text-[10px]">Languages:</span>
                <span className="text-zinc-700">{skills.languages}</span>
              </div>
            )}
            {skills.frameworks && (
              <div className="p-2 rounded-lg bg-zinc-100/70 border border-zinc-200">
                <span className="font-bold text-zinc-950 uppercase block text-[10px]">Frameworks:</span>
                <span className="text-zinc-700">{skills.frameworks}</span>
              </div>
            )}
            {skills.tools && (
              <div className="p-2 rounded-lg bg-zinc-100/70 border border-zinc-200">
                <span className="font-bold text-zinc-950 uppercase block text-[10px]">Infrastructure:</span>
                <span className="text-zinc-700">{skills.tools}</span>
              </div>
            )}
            {skills.softSkills && (
              <div className="p-2 rounded-lg bg-zinc-100/70 border border-zinc-200">
                <span className="font-bold text-zinc-950 uppercase block text-[10px]">Methodology:</span>
                <span className="text-zinc-700">{skills.softSkills}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Professional Experience */}
      {experience?.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-black uppercase tracking-wider border-b-2 border-black pb-1 mb-2 text-zinc-950">
            Professional Experience & Career History
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-bold text-zinc-950">
                    {exp.role} <span className="font-normal text-zinc-600">| {exp.company}</span>
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-zinc-500">
                    {exp.startDate} – {exp.endDate} {exp.location ? `• ${exp.location}` : ""}
                  </span>
                </div>
                <ul className="list-disc list-outside pl-4 space-y-1 text-[11px] text-zinc-700 leading-relaxed">
                  {exp.bullets?.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Systems & Technical Projects */}
      {projects?.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-black uppercase tracking-wider border-b-2 border-black pb-1 mb-2 text-zinc-950">
            Systems Architecture & Key Initiatives
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="space-y-1">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-bold text-zinc-950">
                    {proj.title}{" "}
                    {proj.techStack && (
                      <span className="font-normal text-zinc-500 text-[10px]">
                        ({proj.techStack})
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="underline hover:text-black">
                        Demo
                      </a>
                    )}
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="underline hover:text-black">
                        Code
                      </a>
                    )}
                  </div>
                </div>
                <ul className="list-disc list-outside pl-4 space-y-1 text-[11px] text-zinc-700 leading-relaxed">
                  {proj.bullets?.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider border-b-2 border-black pb-1 mb-2 text-zinc-950">
            Education & Academic Credentials
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="text-xs space-y-0.5">
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-zinc-950">
                    {edu.degree} <span className="font-normal text-zinc-600">| {edu.institution}</span>
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-zinc-600">
                    {edu.graduationYear} {edu.gpa ? `• ${formatCGPA(edu.gpa)}` : ""}
                  </span>
                </div>
                {edu.details && (
                  <p className="text-[10px] text-zinc-600 italic">{edu.details}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Master Resume Template Switcher
 */
export default function ResumeTemplateRenderer({ template, resumeData }) {
  switch (template) {
    case "ivy":
      return <IvyClassicTemplate resumeData={resumeData} />;
    case "two-column":
      return <TwoColumnTemplate resumeData={resumeData} />;
    case "monochrome":
      return <MonochromeTemplate resumeData={resumeData} />;
    case "student":
      return <CampusFresherTemplate resumeData={resumeData} />;
    case "executive":
      return <ExecutiveTemplate resumeData={resumeData} />;
    case "tech":
    default:
      return <TechModernTemplate resumeData={resumeData} />;
  }
}
