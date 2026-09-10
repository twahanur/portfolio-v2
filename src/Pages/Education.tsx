"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import { ChevronDown, ChevronUp, ChevronRight, Calendar, GraduationCap, Award } from "lucide-react";
import { fetchAiContext } from "../lib/api";

const FALLBACK_EDUCATION_IMAGES = [
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=800&auto=format&fit=crop",
];

const DEFAULT_EDUCATIONS = [
  {
    id: "edu-1",
    examTitle: "B.Sc. in Computer Science & Engineering",
    major: "Computer Science & Engineering",
    institute: "Khulna University of Engineering & Technology",
    result: "CGPA: 3.75 / 4.00",
    passingYear: "2024",
    period: "2020 – 2024",
    duration: "4 Years",
    image: FALLBACK_EDUCATION_IMAGES[0],
    summary:
      "Focused on core computer science concepts including software engineering, algorithms, system architecture, database design, and cloud computing.",
    highlights: [
      "Completed thesis on Distributed Microservice Architecture & Performance Optimization.",
      "Achieved Dean's Honor List for outstanding academic performance across multiple semesters.",
      "Led university competitive programming squad and organized national hackathons.",
    ],
    techStack: ["Algorithms", "Data Structures", "OOP", "DBMS", "Software Engineering", "Cloud Computing"],
  },
  {
    id: "edu-2",
    examTitle: "Higher Secondary Certificate (HSC)",
    major: "Science",
    institute: "Government Science College",
    result: "GPA: 5.00 / 5.00",
    passingYear: "2019",
    period: "2017 – 2019",
    duration: "2 Years",
    image: FALLBACK_EDUCATION_IMAGES[1],
    summary:
      "Studied Higher Mathematics, Physics, Chemistry, and ICT with top academic standing.",
    highlights: [
      "Secured GPA 5.00 with distinction in Mathematics & ICT.",
      "Active member of Science Club and ICT Olympiad team.",
    ],
    techStack: ["Mathematics", "Physics", "ICT", "C Programming"],
  },
  {
    id: "edu-3",
    examTitle: "Secondary School Certificate (SSC)",
    major: "Science",
    institute: "Khulna Zilla School",
    result: "GPA: 5.00 / 5.00",
    passingYear: "2017",
    period: "2015 – 2017",
    duration: "2 Years",
    image: FALLBACK_EDUCATION_IMAGES[2],
    summary:
      "Completed secondary education with focus on general science and computer fundamentals.",
    highlights: [
      "Secured GPA 5.00 with perfect score in Mathematics.",
      "Champion in District Math Olympiad.",
    ],
    techStack: ["General Science", "Mathematics", "Computer Studies"],
  },
];

export default function EducationPage({ educations: propEducations }) {
  const [educations, setEducations] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);

  const containerRef = useRef(null);
  const timelineRef = useRef(null);
  const itemRefs = useRef([]);

  const formatEducations = (edus) => {
    if (!edus || edus.length === 0) return DEFAULT_EDUCATIONS;
    return edus.map((edu, i) => ({
      id: edu.id || `edu-${i}`,
      examTitle: edu.examTitle || edu.title || "Degree / Qualification",
      major: edu.major || edu.fieldOfStudy || "",
      institute: edu.institute || edu.university || "Institution",
      result: edu.result || edu.grade || "",
      passingYear: edu.passingYear ? String(edu.passingYear) : "",
      period: edu.passingYear ? `Class of ${edu.passingYear}` : edu.period || "",
      duration: edu.duration || "",
      image: edu.image || FALLBACK_EDUCATION_IMAGES[i % FALLBACK_EDUCATION_IMAGES.length],
      summary:
        edu.summary ||
        (edu.major && edu.institute
          ? `Pursued ${edu.examTitle || "studies"} focusing on ${edu.major} at ${edu.institute}.`
          : ""),
      highlights:
        edu.highlights && edu.highlights.length > 0
          ? edu.highlights
          : edu.result
          ? [`Achieved result: ${edu.result}`]
          : [],
      techStack: edu.techStack || edu.subjects || [],
    }));
  };

  useEffect(() => {
    if (propEducations && propEducations.length > 0) {
      setEducations(formatEducations(propEducations));
      return;
    }

    const fetchEducation = async () => {
      try {
        const payload = await fetchAiContext();
        if (payload.success && payload.data && payload.data.educations) {
          setEducations(formatEducations(payload.data.educations));
        } else {
          setEducations(DEFAULT_EDUCATIONS);
        }
      } catch (err) {
        console.error("Failed to fetch education data:", err);
        setEducations(DEFAULT_EDUCATIONS);
      }
    };
    fetchEducation();
  }, [propEducations]);

  const listToRender = educations.length > 0 ? educations : DEFAULT_EDUCATIONS;

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
      className="relative h-auto bg-slate-950/70 text-slate-100 py-16 md:py-24 px-[5%] md:px-[8%]"
      id="education"
    >
      {/* Background ambient glowing shapes — isolated overflow-hidden wrapper so sticky works */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 -left-32 w-96 h-96 bg-pink-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Main Education Layout: Scrollable Timeline (Left) & Sticky Image Gallery (Right) */}
      <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative z-10">

        {/* Left Column (lg:col-span-6): Scroll-Driven Timeline with Smooth Progress Line & Accordion */}
        <div ref={timelineRef} className="lg:col-span-6 relative pl-6 md:pl-10 order-2 lg:order-1 pb-6">
        
          {/* Base Track Line */}
          <div className="absolute left-[11px] md:left-[15px] top-4 bottom-4 w-1 rounded-full bg-slate-800/80" />

          {/* Smooth Scroll-Driven Active Progress Line */}
          <motion.div
            className="absolute left-[11px] md:left-[15px] top-4 bottom-4 w-1 rounded-full bg-gradient-to-b from-purple-400 via-pink-400 to-amber-500 shadow-[0_0_14px_#c084fc] origin-top"
            style={{ scaleY: smoothLineProgress }}
          />

          {/* Glowing Beam Tracer at Tip of Scroll Progress Line */}
          <motion.div
            className="absolute left-[7px] md:left-[11px] w-3 h-3 rounded-full bg-purple-300 shadow-[0_0_18px_#c084fc] z-10 pointer-events-none"
            style={{ top: beamTop }}
          />

          <div className="space-y-6">
            {listToRender.map((edu, idx) => {
              const isActive = activeIdx === idx;

              return (
                <div
                  key={edu.id || idx}
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
                        ? "w-4 h-9 rounded-full bg-purple-400 shadow-[0_0_18px_#c084fc] ring-4 ring-purple-400/25 z-20"
                        : "w-3 h-3 rounded-full bg-slate-700 hover:bg-slate-400 border border-slate-600 z-10"
                    }`}
                  />

                  {/* Education Card Container (Borderless Clean Layout) */}
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
                          {edu.examTitle}
                        </h3>
                        <p className="text-xs md:text-sm font-semibold uppercase tracking-wider text-purple-400 mt-0.5">
                          {edu.institute}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-400/20 text-purple-300 text-[10px] font-bold border border-purple-400/30">
                          {edu.passingYear || edu.period}
                        </span>
                        <button
                          aria-label="Toggle details"
                          className={`p-1.5 rounded-lg transition-colors ${
                            isActive
                              ? "bg-purple-400/20 text-purple-400"
                              : "text-slate-400 group-hover:text-white"
                          }`}
                        >
                          {isActive ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
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
                          {/* Badges */}
                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            {edu.major && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-slate-300">
                                <GraduationCap size={13} className="text-purple-400" />
                                {edu.major}
                              </span>
                            )}
                            {edu.result && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-slate-300">
                                <Award size={13} className="text-purple-400" />
                                {edu.result}
                              </span>
                            )}
                            {edu.duration && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs font-medium text-purple-300">
                                <Calendar size={13} className="text-purple-400" />
                                {edu.duration}
                              </span>
                            )}
                          </div>

                          {/* Summary text */}
                          {edu.summary && (
                            <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-4 font-normal">
                              {edu.summary}
                            </p>
                          )}

                          {/* Highlights bullet points */}
                          {edu.highlights && edu.highlights.length > 0 && (
                            <div className="space-y-2 mb-5">
                              {edu.highlights.map((item, hIdx) => (
                                <div key={hIdx} className="flex items-start gap-2.5">
                                  <span className="shrink-0 mt-1 text-purple-400">
                                    <ChevronRight size={15} strokeWidth={2.5} />
                                  </span>
                                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                                    {item}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Subjects / Tech stack badges */}
                          {edu.techStack && edu.techStack.length > 0 && (
                            <div className="pt-3 border-t border-white/5">
                              <span className="text-[11px] font-semibold text-slate-400 block mb-2 uppercase tracking-wider">
                                Key Subjects & Technologies
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {edu.techStack.map((tech, tIdx) => (
                                  <span
                                    key={tIdx}
                                    className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-400/10 text-purple-300 border border-purple-400/20"
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

        {/* Mobile Header (Visible only on mobile screens < lg) */}
        <div className="lg:hidden block col-span-1 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold tracking-wider uppercase mb-3 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span>ACADEMIC QUALIFICATIONS</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            Education & Degrees.
          </h2>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            Explore my academic achievements, degree qualifications, and institution highlights.
          </p>
        </div>

        {/* Right Column (lg:col-span-6): Sticky Header Title + Dynamic Staggered Image Gallery */}
        <div className="lg:col-span-6 hidden lg:block lg:sticky lg:top-24 self-start space-y-6 py-2 order-1 lg:order-2 z-20">
          {/* Header section */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold tracking-wider uppercase mb-3 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span>ACADEMIC QUALIFICATIONS</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-purple-300 tracking-tight leading-tight">
              Education & Degrees.
            </h2>
            <p className="text-slate-400 max-w-xl text-sm md:text-base mt-2.5 leading-relaxed">
              Explore my academic achievements, degree qualifications, and institution highlights.
            </p>
          </div>
          {/* Dynamic Multi-Column Staggered Pill Layout */}
          {(() => {
            const numCols = listToRender.length <= 2 ? 2 : 3;
            const columns = Array.from({ length: numCols }, () => []);

            listToRender.forEach((edu, idx) => {
              columns[idx % numCols].push({ edu, originalIdx: idx });
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
                    {colItems.map(({ edu, originalIdx }) => {
                      const isActive = activeIdx === originalIdx;
                      return (
                        <div
                          key={edu.id || originalIdx}
                          onClick={() => setActiveIdx(originalIdx)}
                          className={`relative aspect-[3/4.5] w-full rounded-[1.8rem] sm:rounded-[2.2rem] overflow-hidden cursor-pointer transition-all duration-300 ease-out transform-gpu ${
                            isActive
                              ? "border-2 border-purple-400/90 shadow-[0_0_30px_rgba(192,132,252,0.35)] ring-4 ring-purple-400/30 scale-[1.04] z-20"
                              : "border border-white/10 opacity-40 grayscale hover:opacity-90 hover:grayscale-0 hover:border-white/30 scale-100"
                          }`}
                        >
                          <img
                            src={edu.image}
                            alt={edu.institute || edu.examTitle}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                          <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1">
                            <span className="text-[11px] sm:text-xs font-extrabold text-white truncate drop-shadow-md">
                              {edu.institute || edu.examTitle}
                            </span>
                            {isActive && (
                              <span className="self-start px-2 py-0.5 text-[8px] sm:text-[9px] font-black uppercase tracking-wider rounded-md bg-purple-400 text-slate-950 shadow-[0_0_12px_#c084fc]">
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

      </div>
    </div>
  );
}
