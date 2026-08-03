"use client";

import React, { useState } from "react";
import { FiSearch, FiX, FiCheck } from "react-icons/fi";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiHtml5,
  SiCss,
  SiVite,
  SiRedux,
  SiFramer,
  SiSass,
  SiVuedotjs,
  SiAngular,
  SiExpress,
  SiNestjs,
  SiGo,
  SiPython,
  SiFastapi,
  SiDjango,
  SiRust,
  SiPhp,
  SiLaravel,
  SiCplusplus,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiMysql,
  SiPrisma,
  SiSqlite,
  SiSupabase,
  SiFirebase,
  SiGraphql,
  SiDocker,
  SiKubernetes,
  SiGithubactions,
  SiNginx,
  SiPm2,
  SiCloudflare,
  SiVercel,
  SiLinux,
  SiGit,
  SiStripe,
  SiJsonwebtokens,
  SiWebrtc,
} from "react-icons/si";
import { FaNodeJs, FaAws, FaJava } from "react-icons/fa";
import { TbApi, TbTopologyStar3 } from "react-icons/tb";
import { LuBoxes } from "react-icons/lu";
import { Cpu } from "lucide-react";

export interface IconDefinition {
  name: string;
  label: string;
  category: "Frontend" | "Backend" | "Database" | "DevOps" | "Architecture";
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export const ICON_CATALOG: IconDefinition[] = [
  // Backend
  { name: "FaNodeJs", label: "Node.js", category: "Backend", icon: FaNodeJs },
  { name: "SiExpress", label: "Express.js", category: "Backend", icon: SiExpress },
  { name: "SiNestjs", label: "NestJS", category: "Backend", icon: SiNestjs },
  { name: "SiGo", label: "Go (Golang)", category: "Backend", icon: SiGo },
  { name: "SiPython", label: "Python", category: "Backend", icon: SiPython },
  { name: "SiFastapi", label: "FastAPI", category: "Backend", icon: SiFastapi },
  { name: "SiDjango", label: "Django", category: "Backend", icon: SiDjango },
  { name: "SiRust", label: "Rust", category: "Backend", icon: SiRust },
  { name: "SiPhp", label: "PHP", category: "Backend", icon: SiPhp },
  { name: "SiLaravel", label: "Laravel", category: "Backend", icon: SiLaravel },
  { name: "FaJava", label: "Java", category: "Backend", icon: FaJava },
  { name: "SiCplusplus", label: "C++", category: "Backend", icon: SiCplusplus },

  // Frontend
  { name: "SiReact", label: "React.js", category: "Frontend", icon: SiReact },
  { name: "SiNextdotjs", label: "Next.js", category: "Frontend", icon: SiNextdotjs },
  { name: "SiTypescript", label: "TypeScript", category: "Frontend", icon: SiTypescript },
  { name: "SiJavascript", label: "JavaScript", category: "Frontend", icon: SiJavascript },
  { name: "SiTailwindcss", label: "Tailwind CSS", category: "Frontend", icon: SiTailwindcss },
  { name: "SiHtml5", label: "HTML5", category: "Frontend", icon: SiHtml5 },
  { name: "SiCss", label: "CSS3", category: "Frontend", icon: SiCss },
  { name: "SiVite", label: "Vite", category: "Frontend", icon: SiVite },
  { name: "SiRedux", label: "Redux", category: "Frontend", icon: SiRedux },
  { name: "SiFramer", label: "Framer Motion", category: "Frontend", icon: SiFramer },
  { name: "SiSass", label: "Sass / SCSS", category: "Frontend", icon: SiSass },
  { name: "SiVuedotjs", label: "Vue.js", category: "Frontend", icon: SiVuedotjs },
  { name: "SiAngular", label: "Angular", category: "Frontend", icon: SiAngular },

  // Database
  { name: "SiPostgresql", label: "PostgreSQL", category: "Database", icon: SiPostgresql },
  { name: "SiMongodb", label: "MongoDB", category: "Database", icon: SiMongodb },
  { name: "SiRedis", label: "Redis", category: "Database", icon: SiRedis },
  { name: "SiMysql", label: "MySQL", category: "Database", icon: SiMysql },
  { name: "SiPrisma", label: "Prisma ORM", category: "Database", icon: SiPrisma },
  { name: "SiSqlite", label: "SQLite", category: "Database", icon: SiSqlite },
  { name: "SiSupabase", label: "Supabase", category: "Database", icon: SiSupabase },
  { name: "SiFirebase", label: "Firebase", category: "Database", icon: SiFirebase },
  { name: "SiGraphql", label: "GraphQL", category: "Database", icon: SiGraphql },

  // DevOps & Cloud
  { name: "SiDocker", label: "Docker", category: "DevOps", icon: SiDocker },
  { name: "SiKubernetes", label: "Kubernetes", category: "DevOps", icon: SiKubernetes },
  { name: "SiGithubactions", label: "GitHub Actions", category: "DevOps", icon: SiGithubactions },
  { name: "SiNginx", label: "Nginx", category: "DevOps", icon: SiNginx },
  { name: "SiPm2", label: "PM2 Process Manager", category: "DevOps", icon: SiPm2 },
  { name: "FaAws", label: "Amazon Web Services", category: "DevOps", icon: FaAws },
  { name: "SiCloudflare", label: "Cloudflare", category: "DevOps", icon: SiCloudflare },
  { name: "SiVercel", label: "Vercel", category: "DevOps", icon: SiVercel },
  { name: "SiLinux", label: "Linux", category: "DevOps", icon: SiLinux },
  { name: "SiGit", label: "Git / VCS", category: "DevOps", icon: SiGit },

  // Architecture & Utils
  { name: "SiOpenai", label: "AI / OpenAI", category: "Architecture", icon: Cpu },
  { name: "SiStripe", label: "Stripe Payments", category: "Architecture", icon: SiStripe },
  { name: "SiJsonwebtokens", label: "JWT Auth", category: "Architecture", icon: SiJsonwebtokens },
  { name: "SiWebrtc", label: "WebRTC", category: "Architecture", icon: SiWebrtc },
  { name: "TbApi", label: "REST / Microservices API", category: "Architecture", icon: TbApi },
  { name: "TbTopologyStar3", label: "System Topology", category: "Architecture", icon: TbTopologyStar3 },
  { name: "LuBoxes", label: "Distributed Architecture", category: "Architecture", icon: LuBoxes },
];

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIconName: string;
  onSelectIcon: (iconName: string) => void;
}

export default function IconPickerModal({
  isOpen,
  onClose,
  selectedIconName,
  onSelectIcon,
}: IconPickerModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  if (!isOpen) return null;

  const categories = ["All", "Frontend", "Backend", "Database", "DevOps", "Architecture"];

  const filteredIcons = ICON_CATALOG.filter((item) => {
    const matchesSearch =
      item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
          <div>
            <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <span>Select Technology Icon</span>
            </h3>
            <p className="text-xs text-zinc-400">Click any icon to assign it to your skill badge</p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 rounded-xl bg-zinc-800/60 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 space-y-3 bg-zinc-900/80 border-b border-zinc-800">
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input
              type="text"
              placeholder="Search icons (e.g. React, Node, Python, Docker)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeCategory === cat
                    ? "bg-purple-500 text-white shadow-sm"
                    : "bg-zinc-800/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Icon Grid */}
        <div className="p-4 overflow-y-auto flex-grow grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredIcons.length > 0 ? (
            filteredIcons.map((item) => {
              const IconComp = item.icon;
              const isSelected = selectedIconName === item.name;

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    onSelectIcon(item.name);
                    onClose();
                  }}
                  className={`group relative flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-purple-500/15 border-purple-500 text-purple-200 ring-1 ring-purple-500/30"
                      : "bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-850"
                  }`}
                >
                  <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 group-hover:border-purple-500/40 text-purple-400 shrink-0">
                    <IconComp size={20} />
                  </div>
                  <div className="min-w-0 flex-grow">
                    <p className="text-xs font-bold truncate text-zinc-100">{item.label}</p>
                    <p className="text-[10px] text-zinc-500 truncate font-mono">{item.name}</p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 text-purple-400">
                      <FiCheck size={14} />
                    </div>
                  )}
                </button>
              );
            })
          ) : (
            <div className="col-span-full py-12 text-center text-zinc-500">
              <p className="text-sm">No icons match &quot;{searchTerm}&quot;</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-950/60 flex items-center justify-between text-xs text-zinc-500">
          <span>Showing {filteredIcons.length} icons</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
