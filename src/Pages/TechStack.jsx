"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Terminal, Cpu, Database, Server, Settings, ShieldAlert, Award } from "lucide-react";
import { fetchAiContext } from "../lib/api";

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

export default function TechStackPage() {
  const [skillsData, setSkillsData] = useState({ skills: [], skillCategories: [] });
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
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
  }, []);

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
    <div className="px-4 py-20 bg-slate-50/20 dark:bg-[#030014]/40 relative overflow-hidden" id="tech-stack">
      {/* Background ambient light */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center pb-16" data-aos="fade-up" data-aos-duration="1000">
          <h2 className="inline-block text-3xl md:text-5xl font-extrabold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
            Skills & Tech Stack
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-xs md:text-sm mt-3 tracking-wide uppercase font-semibold">
            My technology landscape and engineering capabilities classified by domain
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {groupedSkills.map((category, idx) => (
            <div
              key={category.id || category.slug}
              data-aos="fade-up"
              data-aos-delay={idx * 50}
              className="relative bg-white/80 dark:bg-[#060713]/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(99,102,241,0.08)] flex flex-col justify-between"
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/60 pb-4 mb-5">
                  <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                    {getCategoryIcon(category.slug)}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-wide">
                    {category.name}
                  </h3>
                </div>

                {/* Skill Badges */}
                <div className="flex flex-wrap gap-2.5">
                  {category.skills.map((skill) => {
                    const hasHexColor = skill.color && skill.color.startsWith('#');
                    const badgeColor = skill.color || '#6366f1';
                    const hoverBg = hasHexColor ? `${skill.color}15` : 'rgba(99, 102, 241, 0.15)';
                    const defaultBorder = hasHexColor ? `${skill.color}35` : 'rgba(148, 163, 184, 0.3)';
                    return (
                      <motion.span
                        key={skill.id}
                        whileHover={{ 
                          scale: 1.05,
                          borderColor: badgeColor,
                          color: '#ffffff',
                          backgroundColor: hoverBg
                        }}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100/80 dark:bg-slate-900/60 transition-all duration-200 cursor-default border"
                        style={{
                          borderColor: defaultBorder,
                          color: skill.color ? skill.color : 'var(--text-muted)',
                        }}
                      >
                        {skill.name}
                      </motion.span>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
