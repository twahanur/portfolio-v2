"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Code2,
  Star,
  ChevronRight,
  Layers,
  Layout,
  Globe,
  Package,
  Cpu,
  Code,
  Database,
  Cloud,
  AlertCircle,
  Compass,
  TrendingUp,
  Maximize2,
  X,
  Play,
  Terminal,
  Activity,
  GitBranch,
  Shield,
  Layers2,
  LayoutGrid,
  CheckCircle2,
  FileCode2,
  Lightbulb,
  Clock,
  Sparkles,
  ChevronLeft
} from "lucide-react";
import Swal from "sweetalert2";
import PremiumLoader from "./PremiumLoader";

const TECH_ICONS = {
  React: Globe,
  NextJS: Layers,
  Tailwind: Layout,
  Express: Cpu,
  NodeJS: Cpu,
  Python: Code,
  Django: Code2,
  Flask: Code2,
  Javascript: Code,
  Typescript: Code,
  HTML: Code,
  CSS: Code,
  SASS: Code,
  PostgreSQL: Database,
  MongoDB: Database,
  MySQL: Database,
  Firebase: Cloud,
  Supabase: Cloud,
  Git: Github,
  Docker: Package,
  Kubernetes: Package,
  AWS: Cloud,
  Azure: Cloud,
  default: Package,
};

const TechBadge = ({ tech }) => {
  if (tech) tech = tech[0].toUpperCase() + tech.slice(1);
  const Icon = TECH_ICONS[tech] || TECH_ICONS["default"];

  return (
    <div className="group relative overflow-hidden px-3.5 py-2 bg-white/[0.03] hover:bg-white/[0.08] rounded-xl border border-white/[0.08] hover:border-blue-500/30 transition-all duration-300 cursor-default">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500" />
      <div className="relative flex items-center gap-2">
        <Icon className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
        <span className="text-xs md:text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
          {tech}
        </span>
      </div>
    </div>
  );
};

const FeatureItem = ({ feature }) => {
  return (
    <motion.li 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group flex items-start space-x-3.5 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-300"
    >
      <div className="relative mt-1">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-full blur group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
        <div className="relative w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 group-hover:scale-125 transition-transform duration-300" />
      </div>
      <span className="text-sm md:text-base text-slate-300 group-hover:text-white transition-colors leading-relaxed">
        {feature}
      </span>
    </motion.li>
  );
};

const handleGithubClick = (githubLink, sourceNote) => {
  if (sourceNote === "Private Repository" || githubLink === "Private" || githubLink === "Private Repository") {
    Swal.fire({
      icon: "info",
      title: "Source Code Private",
      text: "Sorry, the source code for this project is private.",
      confirmButtonText: "Understand",
      confirmButtonColor: "#3b82f6",
      background: "#0b0b1a",
      color: "#ffffff",
      customClass: {
        popup: "border border-white/10 rounded-2xl backdrop-blur-xl bg-slate-950/95"
      }
    });
    return false;
  }
  return true;
};

// Group tech stack list dynamically into standard categories
const groupTechStack = (techList) => {
  const categories = {
    frontend: { name: "Frontend UI/UX", items: [], color: "from-blue-500/20 to-cyan-500/20 text-cyan-300 border-cyan-500/30", icon: Layout },
    backend: { name: "Backend & APIs", items: [], color: "from-purple-500/20 to-indigo-500/20 text-purple-300 border-purple-500/30", icon: Cpu },
    database: { name: "Databases & Storage", items: [], color: "from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30", icon: Database },
    devops: { name: "Infrastructure & DevOps", items: [], color: "from-pink-500/20 to-rose-500/20 text-pink-300 border-pink-500/30", icon: Cloud },
  };
  
  const frontendKeywords = ["react", "next", "tailwind", "html", "css", "sass", "javascript", "typescript", "bootstrap", "vue", "angular", "material", "headless", "shadcn", "mui", "motion"];
  const backendKeywords = ["node", "express", "python", "django", "flask", "nest", "graphql", "ruby", "rails", "go", "php", "java", "spring", "apis", "jwt"];
  const databaseKeywords = ["postgres", "mongo", "mysql", "redis", "supabase", "firebase", "sqlite", "sql", "db"];
  
  techList.forEach(t => {
    const lower = t.toLowerCase();
    if (frontendKeywords.some(kw => lower.includes(kw))) {
      categories.frontend.items.push(t);
    } else if (backendKeywords.some(kw => lower.includes(kw))) {
      categories.backend.items.push(t);
    } else if (databaseKeywords.some(kw => lower.includes(kw))) {
      categories.database.items.push(t);
    } else {
      categories.devops.items.push(t);
    }
  });

  return Object.values(categories).filter(c => c.items.length > 0);
};

const ProjectDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // overview, architecture, challenges
  const [activeCodeFile, setActiveCodeFile] = useState("architecture.json");
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null);
  const [expandedChallengeIndex, setExpandedChallengeIndex] = useState(null);

  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 450;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    // Immediately read from localStorage cache to show data instantly
    const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    const selectedProject = storedProjects.find((p) => String(p.id) === id);
    if (selectedProject) {
      setProject({
        ...selectedProject,
        Features: selectedProject.features || selectedProject.Features || [],
        Metrics: selectedProject.metrics || selectedProject.Metrics || [],
        DevOps: selectedProject.devOps || selectedProject.DevOps || [],
        Problem: selectedProject.problem || selectedProject.Problem || "",
        Architecture: selectedProject.architecture || selectedProject.Architecture || "",
        FutureEnhancements: selectedProject.futureEnhancements || selectedProject.FutureEnhancements || "",
        ChallengeSolutions: selectedProject.challengeSolutions || selectedProject.ChallengeSolutions || [],
        TechStack: selectedProject.TechStack ? selectedProject.TechStack.map((t) => typeof t === "object" && t.tag ? t.tag.name : t) : [],
        Github: selectedProject.Github || "https://github.com/Twahanur",
        SourceNote: selectedProject.sourceNote || selectedProject.SourceNote || "",
        Tagline: selectedProject.tagline || selectedProject.Tagline || "",
        Images: selectedProject.images || selectedProject.Images || [],
      });
    }

    const fetchProject = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
        const res = await fetch(`${apiUrl}/api/projects/${id}`);
        if (res.ok) {
          const payload = await res.json();
          if (payload.success && payload.data) {
            const p = payload.data;
            const featuredImage = p.images?.find((img) => img.isFeatured) || p.images?.[0];
            const formattedProject = {
              id: p.id,
              Title: p.title,
              Tagline: p.tagline || "",
              Description: p.description,
              Link: p.live,
              Github: p.code || "https://github.com/Twahanur",
              SourceNote: p.sourceNote || "",
              TechStack: p.tags ? p.tags.map((t) => typeof t === "object" && t.tag ? t.tag.name : t) : [],
              Features: p.features || [],
              Metrics: p.metrics || [],
              DevOps: p.devOps || [],
              Problem: p.problem || "",
              Architecture: p.architecture || "",
              FutureEnhancements: p.futureEnhancements || "",
              ChallengeSolutions: p.challengeSolutions || [],
              Img: featuredImage ? featuredImage.url : "",
              Images: p.images || [],
            };
            setProject(formattedProject);
          }
        }
      } catch (err) {
        console.error("Failed to fetch project detail from API:", err);
      }
    };

    fetchProject();
  }, [id]);

  if (!project) {
    return <PremiumLoader mode="project" />;
  }

  // Edge cases handling: Check if other images are present
  const allImages = project.Images && project.Images.length > 0
    ? project.Images
    : (project.Img ? [{ url: project.Img, alt: project.Title }] : []);

  const activeImage = allImages[activeImageIndex]?.url || project.Img;
  const projectCategories = groupTechStack(project.TechStack);

  // Generate mock package.json content based on project details
  const getMockPackageJson = () => {
    return JSON.stringify({
      name: project.Title.toLowerCase().replace(/\s+/g, "-"),
      version: "1.0.0",
      description: project.Tagline || "Developer showcase project case study.",
      private: true,
      architecture: "Decentralized Modular Architecture",
      host: "Vercel / Cloudflare Edge",
      database: projectCategories.find(c => c.name.includes("Database"))?.items?.[0] || "No Database Configured",
      dependencies: project.TechStack.reduce((acc, curr) => {
        acc[curr.toLowerCase()] = "latest";
        return acc;
      }, {}),
      devops: project.DevOps && project.DevOps.length > 0 ? project.DevOps : ["Git", "GitHub Actions"]
    }, null, 2);
  };

  const getMockArchitectureConfig = () => {
    return `// System Design & Architecture Configurations
module.exports = {
  project: "${project.Title}",
  environment: "production",
  security: {
    ssl: true,
    authType: "OAuth2 / JWT Token Session",
    waf: "Cloudflare Web Application Firewall"
  },
  scaling: {
    strategy: "Auto-scalable micro instances",
    cdn: "Edge caching network enabled",
    optimization: "Gzip, Next.js Automatic Image optimization"
  },
  infrastructure: {
    stackType: "${projectCategories.length > 1 ? "MERN / Next.js Enterprise Stack" : "Custom Stack"}",
    monitoring: "Sentry Error Monitoring, Google Search Console"
  }
};`;
  };

  return (
    <div className="min-h-screen bg-[#030014] text-slate-100 relative overflow-hidden font-sans pb-16 selection:bg-blue-500/30 selection:text-white">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[120px]" />
        <div className="absolute top-[30%] right-[10%] w-[35%] h-[35%] rounded-full bg-pink-900/5 blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.015]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-10">
        
        {/* Navigation & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-white/5 pb-6">
          <div className="flex items-center space-x-3 text-sm">
            <button
              onClick={() => router.back()}
              className="group inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] hover:bg-white/[0.08] backdrop-blur-md rounded-xl text-slate-300 hover:text-white border border-white/[0.08] hover:border-white/20 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back</span>
            </button>
            <div className="flex items-center text-slate-500 space-x-1.5 font-medium">
              <span>Projects</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-blue-400/90 truncate max-w-[150px] sm:max-w-none">{project.Title}</span>
            </div>
          </div>
        </div>

        {/* Cinematic Project Info & Stats Grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-10">
          
          {/* Left Column: Title Block & Description */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-full text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                Case Study
              </span>
              
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent leading-none">
                {project.Title}
              </h1>

              {project.Tagline && (
                <p className="text-lg md:text-xl font-medium text-slate-300/90 leading-normal">
                  {project.Tagline}
                </p>
              )}
              
              <p className="text-sm md:text-base text-slate-405 leading-relaxed text-slate-400">
                {project.Description}
              </p>
            </div>

            {/* Quick Action Link Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={project.Github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => !handleGithubClick(project.Github, project.SourceNote) && e.preventDefault()}
                className={`flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-slate-200 font-medium transition-all duration-300 text-sm ${
                  project.SourceNote === "Private Repository"
                    ? "hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-300"
                    : "hover:bg-purple-500/10 hover:border-purple-500/30 hover:text-purple-300"
                }`}
              >
                <Github className="w-4.5 h-4.5" />
                <span>{project.SourceNote === "Private Repository" ? "Private Repository" : "Source Code"}</span>
                {project.SourceNote === "Private Repository" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-550 bg-rose-550/90 animate-pulse block" style={{ backgroundColor: '#f43f5e' }} />
                )}
              </a>

              <a
                href={project.Link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl text-white font-medium shadow-[0_4px_20px_-4px_rgba(59,130,246,0.4)] hover:shadow-[0_4px_20px_-2px_rgba(59,130,246,0.6)] transition-all duration-300 text-sm"
              >
                <ExternalLink className="w-4.5 h-4.5" />
                <span>Live System</span>
              </a>
            </div>
          </div>

          {/* Right Column: Hero Metadata & Stats */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Metadata Info Grid */}
            <div className="grid grid-cols-2 gap-4 p-5 bg-white/[0.02] border border-white/[0.04] rounded-2xl">
              <div className="space-y-1">
                <span className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider block">Project Domain</span>
                <span className="text-sm font-medium text-slate-200">
                  {projectCategories[0]?.name.split(" ")[0] || "Development"} Systems
                </span>
              </div>
              
              <div className="space-y-1">
                <span className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider block">Repository Code</span>
                <span className="text-sm font-medium text-slate-200 truncate">
                  {project.SourceNote === "Private Repository" ? "Private" : "Open-Source"}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider block">Developer Role</span>
                <span className="text-sm font-medium text-slate-200">Full-Stack Developer</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider block">System Health</span>
                <span className="text-sm font-medium text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active / Online
                </span>
              </div>
            </div>

            {/* Key Metrics Stats */}
            <div className="grid grid-cols-2 gap-4">
              
              <div className="p-5 bg-gradient-to-br from-[#0c0c22] to-[#080816] rounded-2xl border border-blue-500/10 hover:border-blue-500/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 font-medium">Technology Nodes</span>
                  <Code2 className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-extrabold text-blue-300">{project.TechStack.length}</span>
                  <span className="text-xs text-slate-500">units</span>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-[#0c0c22] to-[#080816] rounded-2xl border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 font-medium">Verified Features</span>
                  <Layers className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-extrabold text-purple-300">{project.Features.length}</span>
                  <span className="text-xs text-slate-500">modules</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Play Store Style Horizontal Screenshot Gallery */}
        {allImages.length > 0 && (
          <div className="mb-14 relative group/carousel">
            <div className="flex items-center justify-between mb-5">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-blue-400" />
                  System Showcase Gallery
                </h3>
                <p className="text-xs text-slate-400">
                  Swipe or use the controls to browse high-definition captures of the platform.
                </p>
              </div>

              {/* Slider Controls (Top-Right) */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => scroll("left")}
                    className="p-2 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 rounded-full text-slate-300 hover:text-white transition-all duration-300"
                    aria-label="Previous screenshots"
                  >
                    <ChevronLeft className="w-4.5 h-4.5" />
                  </button>
                  <button
                    onClick={() => scroll("right")}
                    className="p-2 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 rounded-full text-slate-300 hover:text-white transition-all duration-300"
                    aria-label="Next screenshots"
                  >
                    <ChevronRight className="w-4.5 h-4.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Horizontal Scroll Track */}
            <div className="relative">
              {/* Left/Right Floating Hover Arrows (Play Store Web Style) */}
              {allImages.length > 1 && (
                <>
                  <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#030014] to-transparent pointer-events-none z-10 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300" />
                  <button
                    onClick={() => scroll("left")}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 rounded-full text-white shadow-xl opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:scale-110 z-20"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#030014] to-transparent pointer-events-none z-10 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300" />
                  <button
                    onClick={() => scroll("right")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 rounded-full text-white shadow-xl opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:scale-110 z-20"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Scroll Area containing uniform images */}
              <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {allImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setActiveImageIndex(idx);
                      setIsLightboxOpen(true);
                    }}
                    className="snap-start shrink-0 cursor-zoom-in relative rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500/40 bg-slate-950/80 transition-all duration-300 group/card shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] w-[280px] sm:w-[380px] md:w-[460px] aspect-[16/9]"
                  >
                    {/* Image forced to uniform size using object-cover */}
                    <img
                      src={img.url}
                      alt={img.alt || `${project.Title} screenshot ${idx}`}
                      className="w-full h-full object-cover transition-transform duration-550 ease-out group-hover/card:scale-[1.03]"
                      loading="lazy"
                    />
                    
                    {/* Hover Glow & Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <div className="flex items-center justify-between text-white">
                        <span className="text-xs font-semibold tracking-wider font-mono">
                          {img.alt || `Screenshot ${idx + 1}`}
                        </span>
                        <div className="p-1.5 bg-white/10 rounded-lg border border-white/10 backdrop-blur-md">
                          <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Interactive Case-Study Details Control Tabs */}
        <div className="space-y-8">
          
          {/* Glass Tab Headers */}
          <div className="flex border-b border-white/5 pb-0.5 overflow-x-auto no-scrollbar">
            <div className="flex space-x-6">
              {[
                { id: "overview", name: "System Overview & Features", icon: Activity },
                { id: "architecture", name: "Architecture & Systems Design", icon: Layers2 },
                { id: "challenges", name: "Engineering Log & Solutions", icon: Terminal },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                // Hide challenges tab if no challenges are provided
                if (tab.id === "challenges" && (!project.ChallengeSolutions || project.ChallengeSolutions.length === 0)) {
                  return null;
                }

                // Hide architecture tab if no architecture data is provided
                if (tab.id === "architecture" && !project.Architecture && !project.Problem) {
                  return null;
                }

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="relative pb-4 text-sm font-semibold flex items-center gap-2.5 transition-colors whitespace-nowrap"
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-500"}`} />
                    <span className={isActive ? "text-white" : "text-slate-400 hover:text-slate-200"}>
                      {tab.name}
                    </span>
                    {isActive && (
                      <motion.div 
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500" 
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content Display Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid lg:grid-cols-12 gap-8 items-start"
            >
              
              {/* TAB 1: OVERVIEW & SPECIFICATIONS */}
              {activeTab === "overview" && (
                <>
                  {/* Left Column: Tech Stack & System Categorization */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="p-6 bg-white/[0.01] border border-white/[0.04] rounded-2xl space-y-6">
                      <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                        <Code2 className="w-4.5 h-4.5 text-blue-400" />
                        Technological Stack
                      </h3>
                      
                      <div className="space-y-5">
                        {projectCategories.map((category, idx) => {
                          const Icon = category.icon;
                          return (
                            <div key={idx} className="space-y-2">
                              <span className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                <Icon className="w-3.5 h-3.5 text-slate-400" />
                                {category.name}
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {category.items.map((tech, tIdx) => (
                                  <TechBadge key={tIdx} tech={tech} />
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* DevOps Infrastructure section */}
                      {project.DevOps && project.DevOps.length > 0 && (
                        <div className="pt-4 border-t border-white/5 space-y-2">
                          <span className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                            <Cloud className="w-3.5 h-3.5 text-pink-400" />
                            Infrastructure & DevOps
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {project.DevOps.map((tech, idx) => (
                              <TechBadge key={idx} tech={tech} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Features and Impact */}
                  <div className="lg:col-span-8 space-y-8">
                    
                    {/* Key Features Modules */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2.5">
                        <Star className="w-5 h-5 text-amber-400 fill-amber-400/20" />
                        <h3 className="text-lg font-bold text-slate-100">Functional Modules & Features</h3>
                      </div>
                      
                      {project.Features && project.Features.length > 0 ? (
                        <ul className="grid sm:grid-cols-2 gap-4">
                          {project.Features.map((feat, idx) => (
                            <FeatureItem key={idx} feature={feat} />
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-slate-500 italic">No modular system logs available.</p>
                      )}
                    </div>

                    {/* Metrics / Technical Outcomes */}
                    {project.Metrics && project.Metrics.length > 0 && (
                      <div className="pt-6 border-t border-white/5 space-y-5">
                        <div className="flex items-center gap-2.5">
                          <TrendingUp className="w-5 h-5 text-emerald-400" />
                          <h3 className="text-lg font-bold text-slate-100">Performance Metrics & Outcomes</h3>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          {project.Metrics.map((metric, idx) => (
                            <div 
                              key={idx} 
                              className="p-4 bg-emerald-500/[0.01] hover:bg-emerald-500/[0.03] border border-emerald-500/10 hover:border-emerald-500/20 rounded-2xl flex items-start gap-3.5 transition-colors"
                            >
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                              <span className="text-sm text-slate-300 leading-relaxed">{metric}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </>
              )}

              {/* TAB 2: SYSTEM ARCHITECTURE & CODE EDITOR */}
              {activeTab === "architecture" && (
                <>
                  {/* Left Column: Problem & Architecture Decisions */}
                  <div className="lg:col-span-6 space-y-6">
                    {project.Problem && (
                      <div className="p-6 bg-white/[0.01] border border-white/[0.04] rounded-2xl hover:border-rose-500/10 transition-all duration-300">
                        <h4 className="text-base font-bold text-slate-200 mb-3 flex items-center gap-2">
                          <AlertCircle className="w-4.5 h-4.5 text-rose-400" />
                          Problem Statement
                        </h4>
                        <p className="text-sm text-slate-350 leading-relaxed whitespace-pre-line">
                          {project.Problem}
                        </p>
                      </div>
                    )}

                    {project.Architecture && (
                      <div className="p-6 bg-white/[0.01] border border-white/[0.04] rounded-2xl hover:border-purple-500/10 transition-all duration-300">
                        <h4 className="text-base font-bold text-slate-200 mb-3 flex items-center gap-2">
                          <Layers2 className="w-4.5 h-4.5 text-purple-400" />
                          Architecture Decisions
                        </h4>
                        <p className="text-sm text-slate-350 leading-relaxed whitespace-pre-line font-normal">
                          {project.Architecture}
                        </p>
                      </div>
                    )}

                    {project.FutureEnhancements && (
                      <div className="p-6 bg-white/[0.01] border border-white/[0.04] rounded-2xl hover:border-blue-500/10 transition-all duration-300">
                        <h4 className="text-base font-bold text-slate-200 mb-3 flex items-center gap-2">
                          <Lightbulb className="w-4.5 h-4.5 text-blue-400" />
                          Future Scope & Enhancements
                        </h4>
                        <p className="text-sm text-slate-350 leading-relaxed whitespace-pre-line">
                          {project.FutureEnhancements}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Code Editor Widget Pane */}
                  <div className="lg:col-span-6 space-y-4">
                    <div className="bg-[#080816] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                      
                      {/* Editor Tabs Header */}
                      <div className="flex items-center justify-between px-4 bg-[#05050f] border-b border-white/[0.06] py-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setActiveCodeFile("architecture.json")}
                            className={`px-3 py-1.5 text-xs font-mono rounded-md flex items-center gap-1.5 transition-colors ${
                              activeCodeFile === "architecture.json"
                                ? "bg-white/[0.05] text-blue-400 font-semibold"
                                : "text-slate-500 hover:text-slate-300"
                            }`}
                          >
                            <FileCode2 className="w-3.5 h-3.5" />
                            architecture.json
                          </button>
                          
                          <button
                            onClick={() => setActiveCodeFile("architecture.config.js")}
                            className={`px-3 py-1.5 text-xs font-mono rounded-md flex items-center gap-1.5 transition-colors ${
                              activeCodeFile === "architecture.config.js"
                                ? "bg-white/[0.05] text-purple-400 font-semibold"
                                : "text-slate-500 hover:text-slate-300"
                            }`}
                          >
                            <FileCode2 className="w-3.5 h-3.5" />
                            architecture.config.js
                          </button>
                        </div>

                        <div className="flex items-center space-x-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                          <span className="text-[10px] text-slate-500 font-mono">Config Active</span>
                        </div>
                      </div>

                      {/* Code Area */}
                      <div className="p-4 overflow-x-auto text-[11px] md:text-[12.5px] font-mono leading-relaxed text-slate-300 max-h-[360px] overflow-y-auto bg-[#060611]/80">
                        {activeCodeFile === "architecture.json" ? (
                          <pre className="text-blue-300">
                            {getMockPackageJson().split('\n').map((line, i) => {
                              // Custom simple regex coloring for JSON key-value
                              let coloredLine = line;
                              if (line.includes(':')) {
                                const parts = line.split(':');
                                const key = parts[0];
                                const value = parts.slice(1).join(':');
                                coloredLine = `<span class="text-indigo-400">${key}</span>:<span class="text-teal-300">${value}</span>`;
                              }
                              return (
                                <div key={i} className="flex">
                                  <span className="w-6 text-slate-600 text-right select-none pr-3 text-[10px]">{i + 1}</span>
                                  <span dangerouslySetInnerHTML={{ __html: coloredLine }} />
                                </div>
                              );
                            })}
                          </pre>
                        ) : (
                          <pre className="text-purple-300">
                            {getMockArchitectureConfig().split('\n').map((line, i) => {
                              let coloredLine = line;
                              if (line.startsWith('//')) {
                                coloredLine = `<span class="text-slate-500">${line}</span>`;
                              } else if (line.includes('const') || line.includes('module.exports')) {
                                coloredLine = line.replace('const', '<span class="text-blue-400">const</span>')
                                                  .replace('module.exports', '<span class="text-pink-400">module.exports</span>');
                              }
                              return (
                                <div key={i} className="flex">
                                  <span className="w-6 text-slate-600 text-right select-none pr-3 text-[10px]">{i + 1}</span>
                                  <span dangerouslySetInnerHTML={{ __html: coloredLine }} />
                                </div>
                              );
                            })}
                          </pre>
                        )}
                      </div>

                    </div>
                  </div>
                </>
              )}

              {/* TAB 3: CHALLENGES & ENGINEERING SOLUTIONS */}
              {activeTab === "challenges" && (
                <div className="lg:col-span-12 space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Terminal className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-bold text-slate-100">Engineering logs & Solutions</h3>
                  </div>

                  <div className="space-y-4">
                    {project.ChallengeSolutions.map((item, index) => {
                      const isExpanded = expandedChallengeIndex === index;
                      return (
                        <div
                          key={index}
                          className="bg-white/[0.01] border border-white/[0.05] hover:border-white/10 rounded-2xl overflow-hidden transition-all duration-300"
                        >
                          {/* Card Trigger Header */}
                          <button
                            onClick={() => setExpandedChallengeIndex(isExpanded ? null : index)}
                            className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-white/[0.01] transition-colors"
                          >
                            <div className="flex items-start gap-4">
                              <div className="p-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl shrink-0 mt-0.5">
                                <GitBranch className="w-4 h-4" />
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] font-semibold text-rose-400 uppercase tracking-widest">
                                  Challenge #{index + 1} Logged
                                </span>
                                <h4 className="text-base font-bold text-slate-200 leading-snug">
                                  {item.challenge}
                                </h4>
                              </div>
                            </div>
                            <div className="text-slate-400 pl-4">
                              <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`} />
                            </div>
                          </button>

                          {/* Collapsible Solution Drawer */}
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <div className="p-6 bg-slate-950/40 border-t border-white/5 md:pl-[4.5rem] space-y-4">
                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-2xs font-semibold uppercase tracking-wider">
                                    <Shield className="w-3 h-3" />
                                    Engineering Solution Merged
                                  </div>
                                  <p className="text-sm md:text-base text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                                    {item.solution}
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

        </div>

      </div>

      {/* Lightbox / High-res Mockup Viewer Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
              {allImages.length > 1 && (
                <span className="text-xs font-semibold text-slate-400 font-mono">
                  {activeImageIndex + 1} / {allImages.length}
                </span>
              )}
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white border border-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Arrows for Lightbox */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
                  }}
                  className="absolute left-4 p-3 bg-white/5 hover:bg-white/15 rounded-full text-white border border-white/10 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
                  }}
                  className="absolute right-4 p-3 bg-white/5 hover:bg-white/15 rounded-full text-white border border-white/10 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-5xl max-h-[85vh] overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeImage}
                alt={project.Title}
                className="w-full h-full object-contain max-h-[80vh]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ProjectDetails;
