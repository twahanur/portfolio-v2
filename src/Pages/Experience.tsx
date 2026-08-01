"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Calendar, MapPin } from "lucide-react";
import { fetchAiContext } from "../lib/api";

const DEFAULT_EXPERIENCES = [
  {
    id: "exp-mastery",
    company: "Mastery Corporation",
    role: "Lead Software Engineer",
    period: "June 2026 – Present",
    isCurrent: true,
    location: "Remote",
    workMode: "Full-time",
    summary:
      "Leading cross-functional engineering teams in architecting high-throughput microservices and modern Next.js cloud platforms.",
    highlights: [
      "Spearheaded architectural redesign of core backend microservices, boosting API performance by 40%.",
      "Mentored software engineers, enforced strict code review workflows, and automated CI/CD deployment pipelines.",
      "Partnered with product owners to deliver key features for over 100K active production users.",
    ],
    techStack: ["React.js", "Next.js", "Node.js", "TypeScript", "Prisma", "Tailwind"],
  },
  {
    id: "exp-codeprophet",
    company: "Code Prophet",
    role: "Full Stack Developer",
    period: "August 2024 – June 2025",
    isCurrent: false,
    location: "Khulna, Bangladesh",
    workMode: "On-site / Hybrid",
    summary:
      "Built and maintained scalable full-stack applications serving production users using React.js and Node.js.",
    highlights: [
      "Built and maintained scalable full-stack applications serving production users using React.js and Node.js.",
      "Improved backend efficiency by ~20-35% through query optimization and structured API design.",
      "Developed REST APIs handling 10K-50K+ daily requests (estimated production scale) with stable performance.",
    ],
    techStack: ["React.js", "Next.js", "Node.js", "Prisma", "PostgreSQL", "Tailwind"],
  },
  {
    id: "exp-ahamedait",
    company: "Ahamed AIT",
    role: "Software Developer Intern",
    period: "October 2023 – July 2024",
    isCurrent: false,
    location: "Khulna, Bangladesh",
    workMode: "Internship",
    summary:
      "Developed responsive frontend user interfaces, integrated RESTful APIs, and optimized client-side state management.",
    highlights: [
      "Engineered responsive user interfaces and interactive analytical dashboards using React and Tailwind CSS.",
      "Integrated automated unit testing, boosting overall test coverage by 25%.",
      "Participated in daily agile standups, code reviews, and sprint planning sessions.",
    ],
    techStack: ["JavaScript", "React", "Express.js", "MongoDB", "Tailwind CSS"],
  },
];

export default function ExperiencePage({ experiences: propExperiences }) {
  const [experiences, setExperiences] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);

  const formatExperiences = (exps) => {
    if (!exps || exps.length === 0) return DEFAULT_EXPERIENCES;
    return exps.map((exp, i) => {
      const parts = exp.period ? exp.period.split(/\s*[-–—]\s*/) : [];
      const startDate = parts[0] || exp.period || "";
      const endDate = exp.isCurrent ? "Present" : parts[1] || "";
      const periodStr =
        startDate && endDate ? `${startDate} – ${endDate}` : exp.period || "";

      return {
        id: exp.id || `exp-${i}`,
        company: exp.company || "Company",
        role: exp.role || exp.position || "Developer",
        period: periodStr,
        isCurrent: exp.isCurrent || false,
        location: exp.location || "Remote",
        workMode: exp.workMode || "Full-time",
        summary: exp.summary || exp.duties || "",
        highlights:
          exp.highlights && exp.highlights.length > 0
            ? exp.highlights
            : exp.summary
            ? [exp.summary]
            : [],
        techStack: exp.techStack || [],
      };
    });
  };

  useEffect(() => {
    if (propExperiences && propExperiences.length > 0) {
      setExperiences(formatExperiences(propExperiences));
      return;
    }

    const fetchExperience = async () => {
      try {
        const payload = await fetchAiContext();
        if (payload.success && payload.data && payload.data.experiences) {
          setExperiences(formatExperiences(payload.data.experiences));
        } else {
          setExperiences(DEFAULT_EXPERIENCES);
        }
      } catch (err) {
        console.error("Failed to fetch experience data:", err);
        setExperiences(DEFAULT_EXPERIENCES);
      }
    };
    fetchExperience();
  }, [propExperiences]);

  const listToRender = experiences.length > 0 ? experiences : DEFAULT_EXPERIENCES;
  const activeExp = listToRender[activeIdx] || listToRender[0];

  return (
    <div
      className="md:px-[10%] px-[5%] py-16 bg-transparent relative overflow-hidden"
      id="experience"
    >
      {/* Background ambient glowing shapes */}
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header section matching reference design */}
      <div className="w-full mx-auto mb-12" data-aos="fade-up" data-aos-duration="1000">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold tracking-wider uppercase mb-3 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span>EXPERIENCE</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          A non-linear path.
        </h2>
        <p className="text-slate-400 max-w-2xl text-sm md:text-base mt-2.5 leading-relaxed">
          From co-founding ventures to leading media production crews — the throughline is shipping.
        </p>
      </div>

      {/* Main Tabbed Experience Layout */}
      <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Interactive Company Cards List */}
        <div className="lg:col-span-4 space-y-3">
          {listToRender.map((exp, idx) => {
            const isActive = activeIdx === idx;
            return (
              <button
                key={exp.id}
                onClick={() => setActiveIdx(idx)}
                className={`w-full text-left p-4 md:p-5 rounded-2xl transition-all duration-300 relative overflow-hidden group border backdrop-blur-xl ${
                  isActive
                    ? "bg-purple-950/30 border-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.15)]"
                    : "bg-white/[0.02] hover:bg-white/[0.05] border-white/5 hover:border-purple-500/20 text-slate-400"
                }`}
              >
                {/* Active Indicator Bar on Left Edge */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-r-full shadow-[0_0_12px_#a855f7]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}

                <div className="pl-2 flex items-start justify-between gap-3">
                  <div>
                    <h3
                      className={`font-bold text-base md:text-lg transition-colors duration-200 ${
                        isActive
                          ? "text-white"
                          : "text-slate-300 group-hover:text-white"
                      }`}
                    >
                      {exp.company}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-400 mt-0.5 font-medium">
                      {exp.period}
                    </p>
                  </div>

                  {exp.isCurrent && (
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30 shrink-0">
                      Present
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Selected Experience Detail Card */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeExp.id}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="group relative rounded-2xl border border-purple-500/30 bg-slate-950/80 backdrop-blur-2xl p-6 md:p-8 shadow-2xl overflow-hidden"
            >
              {/* Subtle Ambient Background Gradient */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-transparent opacity-80 rounded-2xl" />

              {/* Top Header: Role Title, Company & Date Badge */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                    {activeExp.role}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg md:text-xl font-bold text-purple-400">
                      @ {activeExp.company}
                    </span>
                    {activeExp.location && (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full font-medium ml-2">
                        <MapPin size={11} className="text-purple-400" />
                        {activeExp.location}
                      </span>
                    )}
                  </div>
                </div>

                {/* Date Badge */}
                <div className="shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-slate-200 backdrop-blur-md shadow-inner">
                    <Calendar size={13} className="text-purple-400" />
                    {activeExp.period}
                  </span>
                </div>
              </div>

              {/* Main Summary Paragraph if available */}
              {activeExp.summary && (
                <p className="text-slate-300 text-sm md:text-base leading-relaxed mt-6 mb-4 font-normal">
                  {activeExp.summary}
                </p>
              )}

              {/* Key Contributions & Highlights Bullet List */}
              {activeExp.highlights && activeExp.highlights.length > 0 && (
                <div className="space-y-3 my-6">
                  {activeExp.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="shrink-0 mt-1 text-purple-400">
                        <ChevronRight size={16} strokeWidth={2.5} />
                      </span>
                      <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom Tech Stack Tags */}
              {activeExp.techStack && activeExp.techStack.length > 0 && (
                <div className="pt-6 border-t border-white/10">
                  <span className="text-xs font-semibold text-slate-400 block mb-3 uppercase tracking-wider">
                    Technologies Used
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeExp.techStack.map((tech, tidx) => (
                      <span
                        key={tidx}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 backdrop-blur-md hover:bg-purple-500/20 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
