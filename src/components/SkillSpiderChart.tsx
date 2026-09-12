"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, Layers, Award, ChevronDown, Cpu, Crosshair, Target, Sparkles, Activity } from "lucide-react";
import {
  SiFastapi,
  SiPrisma,
  SiWebrtc,
  SiPm2,
  SiJsonwebtokens,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiMysql,
  SiGraphql,
  SiDocker,
  SiGithubactions,
  SiNginx,
  SiStripe,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiExpress,
  SiNestjs,
  SiGo,
} from "react-icons/si";
import { FaNodeJs, FaAws } from "react-icons/fa";
import { TbApi, TbTopologyStar3 } from "react-icons/tb";
import { LuBoxes } from "react-icons/lu";
import { FiMail } from "react-icons/fi";

const IconMap: Record<string, any> = {
  FaNodeJs,
  FaAws,
  SiExpress,
  SiNestjs,
  SiGo,
  SiOpenai: Cpu,
  SiFastapi,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiMysql,
  SiPrisma,
  LuBoxes,
  SiGraphql,
  TbApi,
  TbTopologyStar3,
  SiWebrtc,
  SiDocker,
  SiGithubactions,
  SiNginx,
  SiPm2,
  SiJsonwebtokens,
  SiStripe,
  FiMail,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
};

export interface SkillItem {
  id: string;
  name: string;
  endorsements?: number;
  color?: string;
  iconColor?: string;
  iconName?: string;
}

export interface SkillCategoryGroup {
  id: string;
  name: string;
  slug: string;
  score?: number;
  skills: SkillItem[];
}

interface SkillSpiderChartProps {
  categories: SkillCategoryGroup[];
  onEndorse?: (skillId: string) => void;
}

// Preset domain weights/scores (out of 100)
const DOMAIN_BASE_SCORES: Record<string, number> = {
  backend: 95,
  database: 90,
  architecture: 88,
  devops: 85,
  performance: 86,
  ai_payment: 84,
  frontend: 82,
};

export default function SkillSpiderChart({ categories }: SkillSpiderChartProps) {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [expandedCategoryIdx, setExpandedCategoryIdx] = useState<number | null>(0);
  const [localSkillsData, setLocalSkillsData] = useState<SkillCategoryGroup[]>(categories);

  React.useEffect(() => {
    setLocalSkillsData(categories);
  }, [categories]);

  if (!localSkillsData || localSkillsData.length < 3) {
    return null;
  }

  const radarCategories = localSkillsData.slice(0, 8);
  const numAxes = radarCategories.length;

  // Radar Geometry Metrics (optimized for zero label clipping & high readability)
  const size = 640;
  const center = size / 2; // 320
  const maxRadius = 185;   // Balanced radar radius allowing ample margin for text
  const gridLevels = [0.25, 0.5, 0.75, 1.0]; // 50m, 100m, 150m, 200m style range rings

  // Compute stats per category
  const radarData = radarCategories.map((cat, idx) => {
    const skillCount = cat.skills.length;
    const totalEndorsements = cat.skills.reduce((acc, s) => acc + (s.endorsements || 0), 0);

    const slugKey = cat.slug.toLowerCase();
    
    // If admin explicitly set a proficiency percentage score for this category, use it directly
    const finalScore = typeof cat.score === "number" && cat.score > 0
      ? Math.min(100, Math.max(1, cat.score))
      : (() => {
          const baseScore = DOMAIN_BASE_SCORES[slugKey] || 80;
          const bonus = Math.min(10, skillCount * 1.5 + totalEndorsements * 0.5);
          return Math.min(99, Math.round(baseScore + bonus));
        })();

    const angle = (2 * Math.PI * idx) / numAxes - Math.PI / 2;
    const r = (finalScore / 100) * maxRadius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);

    const labelR = maxRadius + 42;
    const labelX = center + labelR * Math.cos(angle);
    const labelY = center + labelR * Math.sin(angle);

    return {
      index: idx,
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      skills: cat.skills,
      skillCount,
      totalEndorsements,
      score: finalScore,
      angle,
      x,
      y,
      labelX,
      labelY,
    };
  });

  const polygonPoints = radarData.map((d) => `${d.x},${d.y}`).join(" ");

  const totalSkillsCount = radarCategories.reduce((acc, c) => acc + c.skills.length, 0);
  const totalEndorsementsCount = radarData.reduce((acc, d) => acc + d.totalEndorsements, 0);
  const avgScore = Math.round(radarData.reduce((acc, d) => acc + d.score, 0) / numAxes);

  const handleEndorseClick = async (skillId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`https://api.twahanur.dev/api/skills/${skillId}/endorse`, {
        method: "POST",
      });
      if (res.ok) {
        setLocalSkillsData((prev) =>
          prev.map((cat) => ({
            ...cat,
            skills: cat.skills.map((s) =>
              s.id === skillId ? { ...s, endorsements: (s.endorsements || 0) + 1 } : s
            ),
          }))
        );
      }
    } catch (err) {
      console.error("Endorse error", err);
    }
  };

  // Compass degrees for tactical HUD bezel
  const compassDegrees = [
    { label: "N (0°)", angle: -Math.PI / 2 },
    { label: "45°", angle: -Math.PI / 4 },
    { label: "E (90°)", angle: 0 },
    { label: "135°", angle: Math.PI / 4 },
    { label: "S (180°)", angle: Math.PI / 2 },
    { label: "225°", angle: (3 * Math.PI) / 4 },
    { label: "W (270°)", angle: Math.PI },
    { label: "315°", angle: (-3 * Math.PI) / 4 },
  ];

  // Smart multiline label renderer to prevent text clipping & improve contrast
  const renderCategoryLabel = (name: string, score: number, labelX: number, labelY: number, isActive: boolean) => {
    let line1 = name;
    let line2 = "";

    if (name.includes("&")) {
      const parts = name.split("&");
      line1 = parts[0].trim();
      line2 = "& " + parts.slice(1).join("&").trim();
    } else {
      const words = name.split(" ");
      if (words.length > 2) {
        const mid = Math.ceil(words.length / 2);
        line1 = words.slice(0, mid).join(" ");
        line2 = words.slice(mid).join(" ");
      }
    }

    const textAnchor =
      Math.abs(labelX - center) < 30
        ? "middle"
        : labelX > center
        ? "start"
        : "end";

    const baseClass = `font-sans text-[12px] sm:text-[13px] font-extrabold tracking-wide transition-all duration-200 ${
      isActive
        ? "fill-cyan-300 filter drop-shadow-[0_0_10px_rgba(6,182,212,0.9)]"
        : "fill-slate-100 dark:fill-slate-100 hover:fill-indigo-300"
    }`;

    if (!line2) {
      return (
        <text
          x={labelX}
          y={labelY}
          textAnchor={textAnchor}
          dominantBaseline="middle"
          className={baseClass}
        >
          {line1} <tspan className="fill-indigo-400 font-mono font-bold">({score}%)</tspan>
        </text>
      );
    }

    return (
      <text
        x={labelX}
        y={labelY}
        textAnchor={textAnchor}
        dominantBaseline="middle"
        className={baseClass}
      >
        <tspan x={labelX} dy="-0.65em">
          {line1}
        </tspan>
        <tspan x={labelX} dy="1.3em">
          {line2} <tspan className="fill-indigo-400 font-mono font-bold">({score}%)</tspan>
        </tspan>
      </text>
    );
  };

  return (
    <div className="w-full relative font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200/10 dark:border-slate-800/60 pb-5 mb-6">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            <span>Engineering Domain Spider Stats</span>
          </h3>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-300">
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            <span>OVERALL SCORE: {avgScore}%</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-300">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>{totalSkillsCount} TOTAL TECHNOLOGIES</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-300">
            <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>{totalEndorsementsCount} ENDORSEMENTS</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left centered radar net + Right cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* SVG Radar Chart Column - Centered Horizontally & Vertically */}
        <div className="lg:col-span-6 flex flex-col justify-center items-center relative py-2 lg:sticky lg:top-24 w-full h-full my-auto px-2 sm:px-4">
          <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[580px] lg:max-w-[640px] h-auto overflow-visible select-none">
            <defs>
              {/* Matching Portfolio Gradient: Indigo -> Purple -> Cyan */}
              <linearGradient id="portfolioRadarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.30" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.20" />
              </linearGradient>

              {/* Glowing Filter */}
              <filter id="indigoGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Outer Bezel Ring & Compass Ticks */}
            <circle
              cx={center}
              cy={center}
              r={maxRadius + 20}
              className="fill-none stroke-indigo-500/30"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <circle
              cx={center}
              cy={center}
              r={maxRadius + 2}
              className="fill-none stroke-indigo-500/40"
              strokeWidth="1"
            />

            {/* Compass Degrees Labels Around Outer Bezel */}
            {compassDegrees.map((cd, cIdx) => {
              const degR = maxRadius + 30;
              const degX = center + degR * Math.cos(cd.angle);
              const degY = center + degR * Math.sin(cd.angle);
              return (
                <text
                  key={`compass-deg-${cIdx}`}
                  x={degX}
                  y={degY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-indigo-400/70 text-[10px] font-mono font-bold tracking-tighter"
                >
                  {cd.label}
                </text>
              );
            })}

            {/* Crosshair Axis Lines (N-S, E-W) */}
            <line
              x1={center}
              y1={center - maxRadius - 10}
              x2={center}
              y2={center + maxRadius + 10}
              className="stroke-indigo-500/25"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <line
              x1={center - maxRadius - 10}
              y1={center}
              x2={center + maxRadius + 10}
              y2={center}
              className="stroke-indigo-500/25"
              strokeWidth="1"
              strokeDasharray="3 3"
            />

            {/* Concentric Polygon Range Rings (25%, 50%, 75%, 100%) */}
            {gridLevels.map((level, lIdx) => {
              const r = level * maxRadius;
              const gridPoints = Array.from({ length: numAxes }).map((_, idx) => {
                const angle = (2 * Math.PI * idx) / numAxes - Math.PI / 2;
                return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
              }).join(" ");

              const percent = `${Math.round(level * 100)}%`;

              return (
                <g key={`grid-level-${lIdx}`}>
                  <polygon
                    points={gridPoints}
                    className="fill-none stroke-indigo-500/25 dark:stroke-indigo-500/25"
                    strokeWidth={lIdx === gridLevels.length - 1 ? "1.5" : "1"}
                    strokeDasharray={lIdx === gridLevels.length - 1 ? "none" : "4 4"}
                  />
                  <circle
                    cx={center}
                    cy={center}
                    r={r}
                    className="fill-none stroke-indigo-500/10"
                    strokeWidth="0.75"
                  />
                  <text
                    x={center + 6}
                    y={center - r + 3}
                    className="fill-indigo-400/60 text-[10px] font-mono font-bold"
                  >
                    {percent}
                  </text>
                </g>
              );
            })}

            {/* Axis Spokes from Center to Outer Edge */}
            {radarData.map((d, idx) => {
              const edgeX = center + maxRadius * Math.cos(d.angle);
              const edgeY = center + maxRadius * Math.sin(d.angle);
              return (
                <line
                  key={`spoke-${idx}`}
                  x1={center}
                  y1={center}
                  x2={edgeX}
                  y2={edgeY}
                  className="stroke-indigo-500/25"
                  strokeWidth="1"
                />
              );
            })}

            {/* Radar Data Polygon Mesh */}
            <polygon
              points={polygonPoints}
              fill="url(#portfolioRadarGradient)"
              className="stroke-indigo-400 dark:stroke-indigo-300 transition-all duration-300"
              strokeWidth="2.5"
              strokeLinejoin="round"
              filter="url(#indigoGlow)"
            />

            {/* Center Reticle Point */}
            <circle cx={center} cy={center} r="6" className="fill-indigo-500/40 stroke-indigo-400 stroke-1.5" />
            <circle cx={center} cy={center} r="2.5" className="fill-cyan-300" />

            {/* Interactive Radar Data Nodes */}
            {radarData.map((d, idx) => {
              const isHovered = activeCategory === idx;
              const isSelected = expandedCategoryIdx === idx;
              const isActive = isHovered || isSelected;

              return (
                <g
                  key={`node-${d.id}`}
                  className="cursor-pointer group"
                  onClick={() => setExpandedCategoryIdx(expandedCategoryIdx === idx ? null : idx)}
                  onMouseEnter={() => setActiveCategory(idx)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  {/* Outer Target Ring when Active */}
                  {isActive && (
                    <circle
                      cx={d.x}
                      cy={d.y}
                      r="12"
                      className="fill-none stroke-cyan-300 stroke-2"
                      strokeDasharray="3 2"
                    />
                  )}

                  {/* Main Node Point */}
                  <circle
                    cx={d.x}
                    cy={d.y}
                    r={isActive ? "8" : "6"}
                    filter="url(#indigoGlow)"
                    className={`transition-all duration-200 ${
                      isActive
                        ? "fill-cyan-300 stroke-slate-950 stroke-2"
                        : "fill-indigo-400 stroke-slate-900 stroke-1.5"
                    }`}
                  />

                  {/* Multiline Category Label */}
                  {renderCategoryLabel(d.name, d.score, d.labelX, d.labelY, isActive)}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Expandable Category Breakdown Cards (6 cols on lg) */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <Crosshair className="w-3.5 h-3.5 text-indigo-400" />
              <span>Domain Proficiency Breakdown</span>
            </h4>
            <span className="text-[10px] text-indigo-400/70 font-mono font-bold uppercase tracking-wider">
              [ Click to expand technologies ]
            </span>
          </div>

          {radarData.map((d, idx) => {
            const isHovered = activeCategory === idx;
            const isExpanded = expandedCategoryIdx === idx;

            return (
              <div
                key={`item-${d.id}`}
                onClick={() => setExpandedCategoryIdx(isExpanded ? null : idx)}
                onMouseEnter={() => setActiveCategory(idx)}
                onMouseLeave={() => setActiveCategory(null)}
                className={`rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                  isExpanded
                    ? "bg-indigo-500/15 dark:bg-indigo-950/40 border-indigo-500/50 ring-1 ring-indigo-500/30"
                    : isHovered
                    ? "bg-indigo-500/10 border-indigo-500/30"
                    : "bg-slate-900/40 dark:bg-slate-900/30 border-slate-800 hover:border-indigo-500/30"
                }`}
              >
                {/* Card Header Row */}
                <div className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-sm rotate-45 transition-all ${
                        isExpanded || isHovered
                          ? "bg-cyan-400 scale-125"
                          : "bg-slate-600"
                      }`}
                    />
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{d.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-3 mt-0.5 font-mono">
                        <span>{d.skillCount} Technologies</span>
                        <span>•</span>
                        <span className="text-indigo-300">👍 {d.totalEndorsements} Endorsements</span>
                      </div>
                    </div>
                  </div>

                  {/* Right side: score bar & toggle */}
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden hidden sm:block border border-slate-700">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full transition-all duration-500"
                        style={{ width: `${d.score}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono font-black text-indigo-400 w-10 text-right">
                      {d.score}%
                    </span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </div>
                </div>

                {/* Collapsible Expanded Technologies Content */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      key={`expanded-content-${d.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                      className="overflow-hidden border-t border-indigo-500/20 bg-slate-950/60"
                    >
                      <div className="p-4">
                        <div className="text-[11px] font-mono font-bold text-indigo-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
                          <span>Technologies & Capabilities:</span>
                        </div>

                        <div className="flex flex-wrap gap-2.5">
                          {d.skills.map((skill, sIdx) => {
                            const IconComp = skill.iconName ? IconMap[skill.iconName] : null;
                            const hasHexColor = skill.color && skill.color.startsWith("#");
                            const defaultBorder = hasHexColor ? `${skill.color}50` : "rgba(99, 102, 241, 0.4)";

                            return (
                              <motion.button
                                key={`skill-${skill.id}`}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: sIdx * 0.025 }}
                                onClick={(e) => handleEndorseClick(skill.id, e)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                aria-label={`Endorse ${skill.name}`}
                                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900/90 border transition-all duration-200 cursor-pointer"
                                style={{
                                  borderColor: defaultBorder,
                                  color: skill.color || "#818cf8",
                                }}
                                title={`Click to endorse ${skill.name}!`}
                              >
                                {IconComp && (
                                  <span
                                    aria-hidden="true"
                                    style={{ color: skill.iconColor || skill.color || undefined }}
                                    className="text-sm shrink-0 flex items-center"
                                  >
                                    <IconComp className="w-4 h-4" aria-hidden="true" role="presentation" />
                                  </span>
                                )}
                                <span className="text-white font-medium">{skill.name}</span>
                                <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono font-bold border border-indigo-500/30 group-hover:scale-110 transition-transform flex items-center gap-0.5" aria-label={`${skill.endorsements || 0} endorsements`}>
                                  <span aria-hidden="true">👍</span> {skill.endorsements || 0}
                                </span>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

