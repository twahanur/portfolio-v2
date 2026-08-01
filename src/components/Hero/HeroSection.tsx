"use client";

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/prop-types */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Globe,
  UserCheck,
  X,
  ArrowDownRight
} from "lucide-react";

// Known word splits for icon accent placement
const WORD_SPLITS: Record<string, [string, string]> = {
  SOFTWARE: ["SOFT", "WARE"],
  ENGINEER: ["EN", "GINEER"],
  DEVELOPER: ["DEV", "ELOPER"],
  DESIGNER: ["DE", "SIGNER"],
  ARCHITECT: ["ARCHI", "TECT"],
  SCIENTIST: ["SCIEN", "TIST"],
  SPECIALIST: ["SPECIA", "LIST"],
  CONSULTANT: ["CONSUL", "TANT"],
  MANAGER: ["MANA", "GER"],
  ANALYST: ["ANA", "LYST"],
};

function splitWord(word: string): [string, string] {
  const clean = word.replace(/[^A-Za-z]/g, "").toUpperCase();
  if (WORD_SPLITS[clean]) return WORD_SPLITS[clean];
  if (word.length >= 6) {
    const mid = Math.ceil(word.length * 0.4);
    return [word.slice(0, mid), word.slice(mid)];
  }
  return [word, ""];
}

interface HeroSectionProps {
  profile: any;
  skills?: any[];
}

export default function HeroSection({ profile }: HeroSectionProps) {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isMobileCardOpen, setIsMobileCardOpen] = useState(false);

  // Parse available social links dynamically from profile
  const socialItems = useMemo(() => {
    const list: { icon: any; link: string; label: string; key: string }[] = [];
    if (profile?.github) list.push({ icon: Github, link: profile.github, label: "GitHub", key: "github" });
    if (profile?.linkedin) list.push({ icon: Linkedin, link: profile.linkedin, label: "LinkedIn", key: "linkedin" });
    if (profile?.instagram) list.push({ icon: Instagram, link: profile.instagram, label: "Instagram", key: "instagram" });
    if (profile?.facebook) list.push({ icon: Facebook, link: profile.facebook, label: "Facebook", key: "facebook" });
    if (profile?.twitter) list.push({ icon: Twitter, link: profile.twitter, label: "Twitter", key: "twitter" });
    if (profile?.youtube) list.push({ icon: Youtube, link: profile.youtube, label: "YouTube", key: "youtube" });
    if (profile?.medium) list.push({ icon: Globe, link: profile.medium, label: "Medium", key: "medium" });
    if (profile?.devto) list.push({ icon: Globe, link: profile.devto, label: "Dev.to", key: "devto" });

    // Fallback social links if profile has none defined
    if (list.length === 0) {
      list.push(
        { icon: Github, link: "https://github.com", label: "GitHub", key: "github" },
        { icon: Linkedin, link: "https://linkedin.com", label: "LinkedIn", key: "linkedin" },
        { icon: Instagram, link: "https://instagram.com", label: "Instagram", key: "instagram" }
      );
    }
    return list;
  }, [profile]);

  const name = profile?.name || "Twahanur Rahman";
  const title = profile?.title || "Software Engineer";
  const bio = profile?.bio || profile?.shortBio || `${name} is a dedicated Software Engineer focused on building scalable, intelligent systems and robust software architectures. He specializes in bridging technical innovation with high-performance execution.`;
  const avatarUrl = profile?.avatar || profile?.aboutImage || profile?.profileImage || "";

  // Dynamic title parsing matching the 2-row wireframe structure
  const titleParts = useMemo(() => {
    const raw = (title || "").trim().toUpperCase();
    const words = raw.split(/\s+/).filter(Boolean);

    if (words.length >= 3) {
      const lastWord = words[words.length - 1];
      const secondLast = words[words.length - 2];
      const head = words.slice(0, -2).join(" ");
      const [lFirstA, lFirstB] = splitWord(secondLast);
      const [lEndA, lEndB] = splitWord(lastWord);
      return { head, lFirstA, lFirstB, lEndA, lEndB };
    } else if (words.length === 2) {
      const [lFirstA, lFirstB] = splitWord(words[0]);
      const [lEndA, lEndB] = splitWord(words[1]);
      return { head: "", lFirstA, lFirstB, lEndA, lEndB };
    } else {
      return { head: "AI & DATA", lFirstA: "SOFT", lFirstB: "WARE", lEndA: "EN", lEndB: "GINEER" };
    }
  }, [title]);

  const handleSocialClick = (url: string) => {
    if (url && url !== "#") window.open(url, "_blank", "noopener,noreferrer");
  };

  // Safe helper to render social icon at specific wireframe positions
  const renderSocialIcon = (index: number, className: string) => {
    const item = socialItems[index % socialItems.length];
    if (!item) return null;
    const IconComponent = item.icon;
    return (
      <motion.button
        key={`${item.key}-${index}`}
        whileHover={{ scale: 1.25, rotate: index % 2 === 0 ? 12 : -12 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleSocialClick(item.link)}
        className={className}
        title={item.label}
      >
        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
      </motion.button>
    );
  };

  return (
    <section
      id="Home"
      className="relative w-full min-h-screen bg-transparent text-[var(--text-primary)] overflow-hidden select-none flex flex-col justify-center items-center px-4 sm:px-8 lg:px-16 py-12"
    >
      {/* ===== DIAGONAL LIGHT WAVE SWEEP ===== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[60%] -left-[60%] w-[250%] h-[900px] bg-gradient-to-r from-transparent via-purple-500/10 to-transparent blur-3xl animate-diagonal-sweep" />
        <div className="absolute -top-[50%] -left-[50%] w-[230%] h-[600px] bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent blur-2xl animate-diagonal-sweep-delayed" />
      </div>

      {/* ===== MAIN HERO GRID ===== */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-6 lg:gap-10 justify-center my-auto">

        {/* ── ROW 1: [ Top Left Text ]  [ Title First Part ] ── */}
        <div className="relative w-full flex flex-col lg:flex-row items-center lg:items-center justify-between gap-6 lg:gap-12">
          
          {/* 1. Top Left Text Block */}
          <div className="relative w-full lg:w-auto lg:max-w-[260px] shrink-0 font-mono text-xs sm:text-sm tracking-[0.12em] uppercase leading-relaxed text-[var(--text-secondary)] text-left font-medium">
            {/* ICON 1 (Left of Top Left Text) */}
            {renderSocialIcon(
              1,
              "absolute -left-8 sm:-left-12 lg:-left-16 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-[var(--text-primary)] transition-all cursor-pointer backdrop-blur-md shadow-xl hidden sm:flex animate-float-reverse z-30"
            )}

            <p className="text-[var(--text-primary)] font-semibold mb-1">HI, I&apos;M {name.toUpperCase()}.</p>
            <p className="text-[var(--text-muted)]">I BUILD SCALABLE SYSTEMS</p>
            <p className="text-[var(--text-secondary)]">POWERED BY INTELLIGENCE.</p>
          </div>

          {/* 2. Title First Part */}
          <div className="relative grow flex flex-col items-center lg:items-end text-center lg:text-right font-black tracking-[-0.04em] uppercase leading-[0.88] text-[var(--text-primary)]">
            {/* ICON 0 (Top Right of Title First Part) */}
            {renderSocialIcon(
              0,
              "absolute -top-6 -right-4 sm:-right-8 lg:-right-10 p-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-[var(--text-primary)] transition-all cursor-pointer backdrop-blur-md shadow-xl hidden sm:flex animate-float-slow z-30"
            )}

            {titleParts.head && (
              <div className="relative text-5xl sm:text-7xl md:text-8xl lg:text-[8.5rem] xl:text-[10rem] bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                {titleParts.head}
              </div>
            )}

            <div className="relative flex items-center justify-center gap-2 sm:gap-4 text-5xl sm:text-7xl md:text-8xl lg:text-[9.5rem] xl:text-[11rem]">
              <span className="text-[var(--text-primary)]">{titleParts.lFirstA}</span>

              {/* Lightning Bolt Accent */}
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                className="inline-flex items-center justify-center text-purple-400"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-10 h-10 sm:w-16 sm:h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 xl:w-36 xl:h-36 drop-shadow-[0_0_35px_rgba(168,85,247,0.65)]"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </motion.div>

              <span className="bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 bg-clip-text text-transparent">
                {titleParts.lFirstB}
              </span>
            </div>
          </div>

        </div>

        {/* ICON 2: Center between Row 1 and Row 2 */}
        <div className="relative w-full flex justify-center -my-2 sm:-my-4 lg:-my-6 z-30 pointer-events-none">
          {renderSocialIcon(
            2,
            "pointer-events-auto p-3.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-[var(--text-primary)] transition-all cursor-pointer backdrop-blur-md shadow-2xl hidden sm:flex animate-float-slow"
          )}
        </div>

        {/* ── ROW 2: [ Title End Part ]  [ Right Bottom Text ] ── */}
        <div className="relative w-full flex flex-col-reverse lg:flex-row items-center lg:items-center justify-between gap-6 lg:gap-12">
          
          {/* 4. Title End Part */}
          <div className="relative grow flex items-center justify-center lg:justify-start text-5xl sm:text-7xl md:text-8xl lg:text-[9.5rem] xl:text-[11rem] font-black tracking-[-0.04em] uppercase leading-[0.88] text-[var(--text-primary)]">
            {/* ICON 3 (Bottom Left of Title End Part) */}
            {renderSocialIcon(
              3,
              "absolute -bottom-6 left-4 sm:left-8 lg:left-12 p-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-[var(--text-primary)] transition-all cursor-pointer backdrop-blur-md shadow-xl hidden sm:flex animate-float-reverse z-30"
            )}

            <div className="relative flex items-center justify-center gap-2 sm:gap-4">
              <span className="text-[var(--text-primary)]">{titleParts.lEndA}</span>

              {/* Robot Accent */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="inline-flex items-center justify-center text-amber-400"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-10 h-10 sm:w-16 sm:h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 xl:w-36 xl:h-36 drop-shadow-[0_0_35px_rgba(251,191,36,0.65)]"
                >
                  <rect x="3" y="11" width="18" height="10" rx="2" />
                  <circle cx="8.5" cy="16" r="1.5" fill="currentColor" />
                  <circle cx="15.5" cy="16" r="1.5" fill="currentColor" />
                  <path d="M12 2v5" />
                  <circle cx="12" cy="2" r="1.5" fill="currentColor" />
                </svg>
              </motion.div>

              <span className="bg-gradient-to-r from-gray-300 via-gray-500 to-gray-700 bg-clip-text text-transparent">
                {titleParts.lEndB}
              </span>
            </div>
          </div>

          {/* 5. Right Bottom Text Block */}
          <div className="relative w-full lg:w-auto lg:max-w-[260px] shrink-0 font-mono text-xs sm:text-sm tracking-[0.12em] uppercase leading-relaxed text-[var(--text-secondary)] text-right font-medium">
            {/* ICON 4 (Between Title End Part and Right Bottom Text) */}
            {renderSocialIcon(
              4,
              "absolute -left-8 sm:-left-12 lg:-left-14 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-[var(--text-primary)] transition-all cursor-pointer backdrop-blur-md shadow-xl hidden sm:flex animate-float-slow z-30"
            )}

            <p className="text-[var(--text-muted)]">OPEN TO ALL FORMS OF COLLABORATION,</p>
            <p className="text-[var(--text-secondary)]">REGARDLESS OF LOCATION AND LANGUAGE.</p>
          </div>

        </div>

      </div>

      {/* ===== BOTTOM FOOTER BAR ===== */}
      <div className="relative z-20 w-full max-w-7xl mx-auto flex items-center justify-end gap-4 font-mono text-[11px] sm:text-xs text-[var(--text-secondary)] pt-6">
        <span className="tracking-[0.25em] uppercase">DHAKA, BD — 2026</span>
        <a
          href="#About"
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-[var(--text-primary)] flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
          title="Scroll Down"
        >
          <ArrowDownRight className="w-5 h-5 stroke-[2.5]" />
        </a>
      </div>

      {/* ===== LEFT VERTICAL "AVAILABLE FOR OPPORTUNITY" BADGE + HOVER CARD ===== */}
      <div
        className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex items-center"
        onMouseEnter={() => setIsCardHovered(true)}
        onMouseLeave={() => setIsCardHovered(false)}
      >
        {/* Vertical pill badge using theme colors */}
        <div
          onClick={() => setIsMobileCardOpen(!isMobileCardOpen)}
          className="cursor-pointer flex items-center bg-white/10 hover:bg-white/20 text-[var(--text-primary)] border border-white/15 backdrop-blur-xl rounded-r-2xl py-7 px-3 shadow-2xl transition-colors z-50"
        >
          <div className="writing-mode-vertical uppercase font-mono text-[10px] sm:text-[11px] tracking-[0.3em] font-bold">
            AVAILABLE FOR OPPORTUNITY
          </div>
        </div>

        {/* Dynamic Hover Card using Theme Vars */}
        <AnimatePresence>
          {(isCardHovered || isMobileCardOpen) && (
            <motion.div
              initial={{ opacity: 0, x: -30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -30, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="ml-3 sm:ml-4 flex items-start z-50 pointer-events-auto"
            >
              {/* 1. HERO IMAGE */}
              <div className="relative w-[200px] sm:w-[250px] md:w-[280px] h-[280px] sm:h-[330px] md:h-[360px] rounded-[2.5rem] overflow-hidden border border-white/15 shadow-2xl shrink-0 z-10 bg-[var(--bg-secondary)]">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)] font-mono text-xs">
                    Hero Image
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 border border-emerald-500/40 backdrop-blur-md flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Available</span>
                </div>
              </div>

              {/* 2. DETAILS CARD using Theme Card Vars */}
              <div className="relative mt-5 sm:mt-3 md:mt-5 -ml-5 sm:-ml-10 md:-ml-10 z-20 w-[310px] sm:w-[380px] md:w-[530px] p-6 sm:p-7 rounded-[2.5rem] bg-[var(--card-bg)] border border-[var(--border-primary)] backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col justify-between gap-3 text-left">
                {/* Mobile close button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMobileCardOpen(false);
                    setIsCardHovered(false);
                  }}
                  className="sm:hidden absolute top-3 right-3 p-1 rounded-full bg-white/10 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Top Section */}
                <div className="relative w-full pt-1">
                  <h3 className="text-xl sm:text-2xl md:text-xl font-bold text-[var(--text-primary)] pt-4 sm:pt-3">
                    {name.split("").join(" ")}
                  </h3>
                  <span className="text-lg sm:text-xs font-mono text-purple-400 uppercase tracking-wider">
                    {title}
                  </span>
                </div>

                {/* Body Section */}
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-light line-clamp-4 my-2 px-2">
                  {bio}
                </p>

                {/* Bottom Section */}
                <div className="flex items-center justify-center gap-3 pt-3 border-t border-[var(--border-primary)]">
                  {socialItems.slice(0, 5).map((social) => {
                    const IconComp = social.icon;
                    return (
                      <motion.button
                        key={social.key}
                        whileHover={{ scale: 1.2, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSocialClick(social.link)}
                        className="p-1.5 sm:p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-purple-400/40 text-[var(--text-primary)] transition-all cursor-pointer shadow-lg"
                        title={social.label}
                      >
                        <IconComp className="w-4 h-4 sm:w-5 sm:h-5" />
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
