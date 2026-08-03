"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Terminal, Cpu, Database, Server, Settings, ShieldAlert, Award, PieChart, LayoutGrid, Layers } from "lucide-react";
import { fetchAiContext } from "../lib/api";
import SkillSpiderChart from "../components/SkillSpiderChart";
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
  SiGo
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

// Helper to match icons to category slugs
const getCategoryIcon = (slug) => {
  switch (slug) {
    case "backend":
      return <Server className="w-5 h-5 text-indigo-400" />;
    case "frontend":
      return <Cpu className="w-5 h-5 text-blue-400" />;
    case "database":
      return <Database className="w-5 h-5 text-emerald-400" />;
    case "devops":
      return <Settings className="w-5 h-5 text-cyan-400" />;
    case "architecture":
      return <Terminal className="w-5 h-5 text-purple-400" />;
    case "performance":
      return <Award className="w-5 h-5 text-pink-400" />;
    default:
      return <Cpu className="w-5 h-5 text-indigo-400" />;
  }
};

export default function TechStackPage({ skills: propSkills, skillCategories: propSkillCategories }) {
  const [skillsData, setSkillsData] = useState({ skills: [], skillCategories: [] });
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (propSkills || propSkillCategories) {
      setSkillsData({
        skills: propSkills || [],
        skillCategories: propSkillCategories || [],
      });
      setHasLoaded(true);
      return;
    }

    const fetchSkills = async () => {
      try {
        const payload = await fetchAiContext();
        if (payload.success && payload.data) {
          setSkillsData({
            skills: payload.data.skills || [],
            skillCategories: payload.data.skillCategories || [],
          });
        }
      } catch (err) {
        console.error("Failed to fetch skills data:", err);
      } finally {
        setHasLoaded(true);
      }
    };
    fetchSkills();
  }, [propSkills, propSkillCategories]);

  // Group skills by category slugs
  const groupedSkills = useMemo(() => {
    if (skillsData.skills.length === 0) return [];

    const categories = [...skillsData.skillCategories].sort((a, b) => a.order - b.order);
    const groups = [];

    categories.forEach((cat) => {
      const filtered = skillsData.skills
        .filter((s) => s.category === cat.slug || s.category === cat.name)
        .sort((a, b) => a.order - b.order);

      if (filtered.length > 0) {
        groups.push({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          score: (cat as any).score,
          skills: filtered,
        });
      }
    });

    // Handle any orphaned skills that don't match configured category slugs
    const configuredSlugs = new Set(categories.map((c) => c.slug).concat(categories.map((c) => c.name)));
    const orphans = skillsData.skills
      .filter((s) => !configuredSlugs.has(s.category))
      .sort((a, b) => a.order - b.order);

    if (orphans.length > 0) {
      groups.push({
        id: "orphans",
        name: "Other Skills",
        slug: "other",
        skills: orphans,
      });
    }

    return groups;
  }, [skillsData]);

  // If no skills found, do not render this section
  if (!hasLoaded || groupedSkills.length === 0) {
    return null;
  }

  return (
    <div className="md:px-[10%] px-[5%] py-20 bg-slate-50/20 dark:bg-[#030014]/40 relative overflow-hidden" id="tech-stack">
      {/* Background ambient light */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full mx-auto">
        <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
          <h2 className="inline-block text-3xl md:text-5xl font-extrabold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
            Skills & Tech Stack
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-xs md:text-sm mt-3 tracking-wide uppercase font-semibold">
            My technology landscape and engineering capabilities classified by domain
          </p>
        </div>

        {/* Spider Radar Chart View */}
        <div className="mb-6" data-aos="fade-up">
          <SkillSpiderChart categories={groupedSkills} />
        </div>
      </div>
    </div>
  );
}
