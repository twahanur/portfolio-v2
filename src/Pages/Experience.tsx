"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import { ChevronDown, ChevronUp, ChevronRight, Calendar, MapPin } from "lucide-react";
import { fetchAiContext } from "../lib/api";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
];

const DEFAULT_EXPERIENCES = [
  {
    id: "exp-mastery",
    company: "Mastery Corporation",
    role: "Lead Software Engineer",
    period: "June 2026 – Present",
    isCurrent: true,
    location: "Remote",
    workMode: "Full-time",
    image: FALLBACK_IMAGES[0],
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
    image: FALLBACK_IMAGES[1],
    summary:
      "Built and maintained scalable full-stack applications serving production users using React.js and Node.js.",
    highlights: [
      "Built and maintained scalable full-stack applications serving production users using React.js and Node.js.",
      "Improved backend efficiency by ~20-35% through query optimization and structured API design.",
      "Developed REST APIs handling 10K-50K+ daily requests with stable performance.",
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
    image: FALLBACK_IMAGES[2],
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
      image: exp.image || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length],
      summary: exp.summary || exp.duties || "",
      highlights:
        exp.highlights && exp.highlights.length > 0
          ? exp.highlights
          : exp.summary
          ? [exp.summary]
          : [],
      techStack: exp.techStack || exp.technologies || [],
    };
  });
};

export default function ExperiencePage({ experiences: propExperiences }) {
  const [experiences, setExperiences] = useState(() =>
    propExperiences && propExperiences.length > 0
      ? formatExperiences(propExperiences)
      : DEFAULT_EXPERIENCES
  );
  const [activeIdx, setActiveIdx] = useState(0);

  const containerRef = useRef(null);
  const timelineRef = useRef(null);
  const itemRefs = useRef([]);

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

  // Timeline Progress animation scoped to the timeline list
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 70%", "end 50%"],
  });

  const smoothLineProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 35,
    restDelta: 0.001,
  });

  const beamTop = useTransform(smoothLineProgress, [0, 1], ["0%", "100%"]);

  // Auto-activate card when scrolled into center view
  useEffect(() => {
    if (typeof window === "undefined") return;

    const observers = [];
    itemRefs.current.forEach((el, index) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveIdx(index);
          }
        },
        {
          threshold: 0.1,
          rootMargin: "-20% 0px -40% 0px",
        }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [listToRender.length]);

  return (
    <div
      ref={containerRef}
      className="relative h-auto bg-slate-950/60 text-slate-100 py-16 md:py-24 px-[5%] md:px-[8%]"
      id="experience"
    >
      {/* Background ambient glowing shapes — isolated overflow-hidden wrapper so sticky works */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-lime-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 -right-32 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Main Experience Layout: Left Column (Sticky Header & Images) & Right Column (Scroll Timeline) */}
      <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative z-10">
        
        {/* Left Column: Header Title + Dynamic Staggered Image Gallery (Sticky at top-24) */}
        <div className="lg:col-span-6 hidden lg:block lg:sticky lg:top-24 self-start space-y-6 py-2 z-20">
          {/* Header section */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime-500/10 border border-lime-500/20 text-lime-400 text-xs font-semibold tracking-wider uppercase mb-3 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
              <span>EXPERIENCE & TIMELINE</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Professional Journey.
            </h2>
            <p className="text-slate-400 max-w-xl text-sm md:text-base mt-2.5 leading-relaxed">
              Scroll down to explore my career evolution, key accomplishments, and technical impact.
            </p>
          </div>

          {/* Dynamic Multi-Column Staggered Pill Layout */}
          {(() => {
            const numCols = listToRender.length <= 2 ? 2 : 3;
            const columns = Array.from({ length: numCols }, () => []);

            listToRender.forEach((exp, idx) => {
              columns[idx % numCols].push({ exp, originalIdx: idx });
            });

            return (
              <div className={`grid gap-3.5 sm:gap-4 items-start ${numCols === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                {columns.map((colItems, colIdx) => (
                  <div
                    key={`col-${colIdx}`}
                    className={`flex flex-col gap-3.5 sm:gap-4 ${
                      colIdx === 1 ? "mt-6 sm:mt-8" : colIdx === 2 ? "mt-1 sm:mt-2" : "mt-0"
                    }`}
                  >
                    {colItems.map(({ exp, originalIdx }) => {
                      const isActive = activeIdx === originalIdx;
                      return (
                        <div
                          key={exp.id || originalIdx}
                          onClick={() => setActiveIdx(originalIdx)}
                          className={`relative aspect-[3/4.5] w-full rounded-[1.8rem] sm:rounded-[2.2rem] overflow-hidden cursor-pointer transition-all duration-300 ease-out transform-gpu ${
                            isActive
                              ? "border-2 border-lime-400/90 shadow-[0_0_30px_rgba(163,230,53,0.35)] ring-4 ring-lime-400/30 scale-[1.04] z-20"
                              : "border border-white/10 opacity-40 grayscale hover:opacity-90 hover:grayscale-0 hover:border-white/30 scale-100"
                          }`}
                        >
                          <img
                            src={exp.image}
                            alt={exp.company}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                          <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1">
                            <span className="text-[11px] sm:text-xs font-extrabold text-white truncate drop-shadow-md">
                              {exp.company}
                            </span>
                            {isActive && (
                              <span className="self-start px-2 py-0.5 text-[8px] sm:text-[9px] font-black uppercase tracking-wider rounded-md bg-lime-400 text-slate-950 shadow-[0_0_12px_#a3e635]">
                                Active
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Mobile Header (Visible only on mobile screens < lg) */}
        <div className="lg:hidden block col-span-1 mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime-500/10 border border-lime-500/20 text-lime-400 text-xs font-semibold tracking-wider uppercase mb-3 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
            <span>EXPERIENCE & TIMELINE</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            Professional Journey.
          </h2>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            Scroll down to explore my career evolution, key accomplishments, and technical impact.
          </p>
        </div>

        {/* Right Column: Scroll-Driven Timeline with Smooth Progress Line & Accordion */}
        <div ref={timelineRef} className="lg:col-span-6 relative pl-6 md:pl-10 pb-6">

          {/* Base Track Line */}
          <div className="absolute left-[11px] md:left-[15px] top-4 bottom-4 w-1 rounded-full bg-slate-800/80" />

          {/* Smooth Scroll-Driven Active Progress Line */}
          <motion.div
            className="absolute left-[11px] md:left-[15px] top-4 bottom-4 w-1 rounded-full bg-gradient-to-b from-lime-400 via-emerald-400 to-purple-500 shadow-[0_0_14px_#a3e635] origin-top"
            style={{ scaleY: smoothLineProgress }}
          />

          {/* Glowing Beam Tracer at Tip of Scroll Progress Line */}
          <motion.div
            className="absolute left-[7px] md:left-[11px] w-3 h-3 rounded-full bg-lime-300 shadow-[0_0_18px_#a3e635] z-10 pointer-events-none"
            style={{ top: beamTop }}
          />

          <div className="space-y-6">
            {listToRender.map((exp, idx) => {
              const isActive = activeIdx === idx;

              return (
                <div
                  key={exp.id || idx}
                  data-index={idx}
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  className="relative group"
                >
                  {/* Timeline Marker Node */}
                  <div
                    onClick={() => setActiveIdx(idx)}
                    className={`absolute -left-[24px] md:-left-[28px] top-6 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                      isActive
                        ? "w-4 h-9 rounded-full bg-lime-400 shadow-[0_0_18px_#a3e635] ring-4 ring-lime-400/25 z-20"
                        : "w-3 h-3 rounded-full bg-slate-700 hover:bg-slate-400 border border-slate-600 z-10"
                    }`}
                  />

                  {/* Experience Card Container (Borderless Clean Layout) */}
                  <div
                    onClick={() => setActiveIdx(idx)}
                    className={`transition-all duration-300 py-3 px-2 cursor-pointer ${
                      isActive ? "opacity-100" : "opacity-60 hover:opacity-90"
                    }`}
                  >
                    {/* Collapsed / Always Visible Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3
                          className={`font-bold text-lg md:text-xl transition-colors ${
                            isActive ? "text-white" : "text-slate-300 group-hover:text-white"
                          }`}
                        >
                          {exp.company}
                        </h3>
                        <p className="text-xs md:text-sm font-semibold uppercase tracking-wider text-lime-400 mt-0.5">
                          {exp.role}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {exp.isCurrent && (
                          <span className="px-2.5 py-0.5 rounded-full bg-lime-400/20 text-lime-300 text-[10px] font-bold border border-lime-400/30">
                            Present
                          </span>
                        )}
                        <button
                          type="button"
                          aria-label={`Toggle details for ${exp.company}`}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isActive
                              ? "bg-lime-400/20 text-lime-400"
                              : "text-slate-400 group-hover:text-white"
                          }`}
                        >
                          {isActive ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
                        </button>
                      </div>
                    </div>

                    {/* Smooth Ultra-Fluid Accordion Body */}
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden border-t border-white/10 pt-4"
                        >
                          {/* Date and Location Badges */}
                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-slate-300">
                              <Calendar size={12} className="text-lime-400" />
                              {exp.period}
                            </span>
                            {exp.location && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-slate-300">
                                <MapPin size={12} className="text-lime-400" />
                                {exp.location}
                              </span>
                            )}
                            {exp.workMode && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-lime-500/10 border border-lime-500/20 rounded-full text-xs font-medium text-lime-300">
                                {exp.workMode}
                              </span>
                            )}
                          </div>

                          {/* Summary text */}
                          {exp.summary && (
                            <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-4 font-normal">
                              {exp.summary}
                            </p>
                          )}

                          {/* Highlights bullet points */}
                          {exp.highlights && exp.highlights.length > 0 && (
                            <div className="space-y-2 mb-5">
                              {exp.highlights.map((item, hIdx) => (
                                <div key={hIdx} className="flex items-start gap-2.5">
                                  <span className="shrink-0 mt-1 text-lime-400">
                                    <ChevronRight size={15} strokeWidth={2.5} />
                                  </span>
                                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                                    {item}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Tech stack badges */}
                          {exp.techStack && exp.techStack.length > 0 && (
                            <div className="pt-3 border-t border-white/5">
                              <span className="text-[11px] font-semibold text-slate-400 block mb-2 uppercase tracking-wider">
                                Technologies & Tools
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {exp.techStack.map((tech, tIdx) => (
                                  <span
                                    key={tIdx}
                                    className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-lime-400/10 text-lime-300 border border-lime-400/20"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
