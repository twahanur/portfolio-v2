"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { GraduationCap, Briefcase, Award, ArrowUpRight } from "lucide-react";

const TimelineCard = ({ data }) => {
  const containerRef = useRef(null);
  const [circlePoints, setCirclePoints] = useState([]);

  // Map and normalize elements
  const timelineElements = useMemo(() => {
    const elements = [];

    // Helper to extract year for watermark
 const extractYear = (item) => {
  if (item.passingYear) return String(item.passingYear);
  if (item.year) return String(item.year);

  const value = String(item.endDate || item.period || item.date || "");

  // Present / Current handle
  if (/^(present|current)$/i.test(value.trim())) {
    return value;
  }

  const yearMatch = value.match(/\d{4}/);

  return yearMatch ? yearMatch[0] : "";
};

    // 1. Map Experience
    if (data.employmentHistory && Array.isArray(data.employmentHistory)) {
      data.employmentHistory.forEach((item) => {
        const dateStr = item.startDate && item.endDate ? `${item.startDate} – ${item.endDate}` : item.period || item.date;
        elements.push({
          id: `exp-${item.id || item.company}-${item.position}`,
          type: "experience",
          title: item.position,
          subtitle: item.company,
          date: dateStr,
          year: extractYear(item),
          sortDate: item.startDate ? item.startDate : item.date,
          order: item.order !== undefined ? item.order : 0,
          description: item.duties || item.summary,
          highlights: Array.isArray(item.highlights) ? item.highlights : typeof item.highlights === "string" ? (() => { try { return JSON.parse(item.highlights); } catch { return []; } })() : [],
          techStack: Array.isArray(item.techStack) ? item.techStack : typeof item.techStack === "string" ? (() => { try { return JSON.parse(item.techStack); } catch { return []; } })() : [],
          isCurrent: item.isCurrent || false,
          icon: <Briefcase className="h-5 w-5" />,
          color: "from-blue-500 to-indigo-600",
          shadowColor: "rgba(99, 102, 241, 0.4)",
        });
      });
    }

    // 2. Map Education
    if (data.academicQualification && Array.isArray(data.academicQualification)) {
      data.academicQualification.forEach((item) => {
        elements.push({
          id: `edu-${item.id || item.institute}-${item.examTitle}`,
          type: "education",
          title: item.examTitle,
          subtitle: item.institute,
          date: item.passingYear ? `${item.passingYear}` : item.date,
          year: extractYear(item),
          sortDate: item.passingYear ? `${item.passingYear}-01-01` : item.date,
          order: item.order !== undefined ? item.order : 0,
          description: `${item.major} (Duration: ${item.duration || "N/A"})`,
          highlights: item.result ? [`Result: ${item.result}`] : [],
          techStack: [],
          isCurrent: false,
          icon: <GraduationCap className="h-5 w-5" />,
          color: "from-purple-500 to-pink-600",
          shadowColor: "rgba(168, 85, 247, 0.4)",
        });
      });
    }

    // 3. Map Certificates & Training
    if (data.trainingSummary && Array.isArray(data.trainingSummary)) {
      data.trainingSummary.forEach((item) => {
        elements.push({
          id: `train-${item.id || item.trainingTitle}`,
          type: "training",
          title: item.trainingTitle,
          subtitle: item.institute,
          date: item.year ? `${item.year}` : item.date,
          year: extractYear(item),
          sortDate: item.year ? `${item.year}-01-01` : item.date,
          order: item.order !== undefined ? item.order : 0,
          description: item.topics || "Certified Professional Training",
          highlights: item.credentialUrl ? ["Online Credential Verifiable"] : [],
          techStack: [],
          isCurrent: false,
          credentialUrl: item.credentialUrl,
          icon: <Award className="h-5 w-5" />,
          color: "from-amber-500 to-orange-600",
          shadowColor: "rgba(245, 158, 11, 0.4)",
        });
      });
    }

    // Sort: by order first (ascending), then fallback to latest first (descending sortDate)
    return elements.sort((a, b) => {
      const aOrder = a.order !== undefined ? a.order : 999999;
      const bOrder = b.order !== undefined ? b.order : 999999;
      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      return b.sortDate.localeCompare(a.sortDate);
    });
  }, [data]);

  const filteredElements = timelineElements;

  // Scroll Progress for continuous fluid line fill in real-time
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
    trackContentSize: true,
  } as any);

  const pathLength = useTransform(scrollYProgress, [0.02, 0.98], [0, 1]);

  // Measure coordinates of circles relative to container
  // Only needs to run on mount, resize, or layout change — NOT on scroll
  // (circle positions relative to container are fixed during scroll)
  const updatePoints = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const circles = container.querySelectorAll(".timeline-circle-marker");
    const containerRect = container.getBoundingClientRect();

    const points = Array.from(circles).map((circle: any) => {
      const rect = circle.getBoundingClientRect();
      return {
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top + rect.height / 2,
      };
    });
    setCirclePoints(points);
  };

  useEffect(() => {
    updatePoints();
    window.addEventListener("resize", updatePoints);
    
    // Allow layout to settle after data loads / AOS animations
    const t1 = setTimeout(updatePoints, 100);
    const t2 = setTimeout(updatePoints, 500);
    const t3 = setTimeout(updatePoints, 1500);

    return () => {
      window.removeEventListener("resize", updatePoints);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [filteredElements]);

  // Generate smooth S-curves passing vertically through circle points
  const pathData = useMemo(() => {
    if (circlePoints.length < 2) return "";
    let d = `M ${circlePoints[0].x} ${circlePoints[0].y}`;
    for (let i = 1; i < circlePoints.length; i++) {
      const p0 = circlePoints[i - 1];
      const p1 = circlePoints[i];
      const dy = p1.y - p0.y;

      // Vertical entry/exit control points for perfectly smooth transitions
      const cp1x = p0.x;
      const cp2x = p1.x;

      const cp1y = p0.y + dy * 0.45;
      const cp2y = p1.y - dy * 0.45;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }
    return d;
  }, [circlePoints]);

  return (
    <div className="w-full mx-auto py-8">

      {filteredElements.length === 0 ? (
        <div className="text-center py-12" data-aos="fade-up">
          <p className="text-gray-500 text-sm">No qualifications recorded.</p>
        </div>
      ) : (
        <>
          {/* DESKTOP TIMELINE (Alternating deep curvy layout connecting 80% screen width cards) */}
          <div className="relative w-full hidden md:block" ref={containerRef}>
            {/* Scroll-Progressive Smooth SVG Line with Premium Dual Glow */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <linearGradient id="glow-line-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
                <filter id="glow-filter" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {circlePoints.length >= 2 && (
                <>
                  {/* Background Track line */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="rgba(30, 41, 59, 0.35)"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  {/* Outer glow aura */}
                  <motion.path
                    d={pathData}
                    fill="none"
                    stroke="url(#glow-line-gradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    opacity="0.4"
                    filter="url(#glow-filter)"
                    style={{ pathLength }}
                  />
                  {/* Inner neon core */}
                  <motion.path
                    d={pathData}
                    fill="none"
                    stroke="url(#glow-line-gradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    style={{ pathLength }}
                  />
                </>
              )}
            </svg>

            {/* Timeline Rows */}
            <div className="space-y-32 relative z-10">
              {filteredElements.map((element, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div 
                    key={element.id} 
                    className={`relative w-full flex items-center min-h-[180px] ${
                      isEven ? "justify-start" : "justify-end"
                    }`}
                  >
                    {/* Experience Card (takes 90% of width) */}
                    <div className="w-[90%] relative z-10" data-aos={isEven ? "fade-right" : "fade-left"}>
                      <div className="relative bg-white/80 dark:bg-[#060713]/85 backdrop-blur-2xl border border-slate-250 dark:border-slate-800/70 hover:border-indigo-500/30 rounded-2xl p-7 md:p-9 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(99,102,241,0.12)] overflow-hidden group">
                        
                        {/* Left edge accent glow */}
                        <div className={`absolute top-0 bottom-0 left-0 w-[3px] bg-gradient-to-b ${element.color} opacity-80`} />
                        
                        {/* Right side decorative matrix grid dots */}
                        <div className="absolute right-0 top-0 bottom-0 w-48 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none z-0" />

                        {/* Large year watermark in the bottom right corner (e.g. 2025, 2023) */}
                        {element.year && (
                          <div className="absolute right-8 bottom-0 text-[6rem] md:text-[8.5rem] font-black text-slate-300/20 dark:text-slate-800/10 pointer-events-none select-none z-0 transition-transform duration-700 group-hover:scale-105 group-hover:text-indigo-500/5 leading-none">
                            {element.year}
                          </div>
                        )}

                        <div className="relative z-10 space-y-4">
                          {/* Row 1: Large Bold Title, Company & Date */}
                          <h3 className="text-xl md:text-2xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-snug">
                            {element.title} — <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{element.subtitle}</span>{" "}
                            <span className="text-sm font-bold text-slate-600 dark:text-gray-400 bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-full whitespace-nowrap ml-2">
                              {element.date}
                            </span>
                          </h3>

                          {/* Row 2: Subtext description */}
                          <p className="text-sm text-slate-600 dark:text-gray-300/95 leading-relaxed max-w-[85%] font-medium">
                            {element.description}
                          </p>

                          {/* Highlights bullet list if present */}
                          {element.highlights && element.highlights.length > 0 && (
                            <ul className="space-y-2 max-w-[85%]">
                              {element.highlights.map((hl, hidx) => (
                                <li key={hidx} className="text-xs text-slate-500 dark:text-gray-400 flex items-start gap-2.5">
                                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                                  <span>{hl}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {/* Tech Stack tags */}
                          {element.techStack && element.techStack.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-2">
                              {element.techStack.map((tech, tidx) => (
                                <span 
                                  key={tidx} 
                                  className="text-[10px] px-3 py-1 rounded-full font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 shadow-sm"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Row 3: Learn More Link */}
                          <div className="pt-2">
                            {element.credentialUrl ? (
                              <a 
                                href={element.credentialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors uppercase tracking-wider group/link"
                              >
                                Verify Credential 
                                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                              </a>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400/90 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors uppercase tracking-wider cursor-pointer group/link">
                                Learn More 
                                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                              </span>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Alternating Winding Circle Marker on opposite side of the card */}
                    <div 
                      className={`timeline-circle-marker absolute top-1/2 -translate-y-1/2 ${
                        isEven ? "right-[7%]" : "left-[10%]"
                      } -translate-x-1/2 z-30`}
                    >
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0.3 }}
                        whileInView={{ 
                          scale: 1, 
                          opacity: 1,
                          boxShadow: `0 0 25px ${element.shadowColor || "rgba(99,102,241,0.5)"}`
                        }}
                        viewport={{ once: false, margin: "-12% 0px -12% 0px" }}
                        className={`w-7 h-7 rounded-full bg-slate-950 border-4 border-indigo-500 flex items-center justify-center`}
                      >
                        {/* Glow Core */}
                        <div className="w-2 h-2 rounded-full bg-indigo-450 animate-pulse" />
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MOBILE TIMELINE (Left straight track, right cards stacked) */}
          <div className="relative pl-8 md:hidden space-y-8">
            <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-slate-350 dark:bg-slate-800/80" />

            {filteredElements.map((element, idx) => (
              <div 
                key={element.id} 
                className="relative"
                data-aos="fade-up"
                data-aos-delay={idx * 50}
              >
                {/* Node marker */}
                <div className="absolute -left-[27px] top-1.5 w-4.5 h-4.5 rounded-full bg-white dark:bg-slate-950 border-2 border-indigo-500 flex items-center justify-center z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                </div>

                {/* Mobile Card */}
                <div className="bg-white/80 dark:bg-[#060713]/85 backdrop-blur-xl border border-slate-200 dark:border-slate-800/70 rounded-2xl p-5 space-y-3 relative overflow-hidden">
                  <div className={`absolute top-0 bottom-0 left-0 w-[3px] bg-gradient-to-b ${element.color} opacity-80`} />
                  
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-slate-600 dark:text-gray-400 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 px-2 py-0.5 rounded">
                      {element.date}
                    </span>
                    {element.year && (
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                        {element.year}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-slate-950 dark:text-white leading-tight">
                      {element.title}
                    </h3>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                      {element.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-gray-300/95 leading-relaxed pt-1 border-t border-slate-200 dark:border-slate-800/40">
                    {element.description}
                  </p>

                  {element.techStack && element.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {element.techStack.slice(0, 4).map((tech, tidx) => (
                        <span 
                          key={tidx} 
                          className="text-[8px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TimelineCard;