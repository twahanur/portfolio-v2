"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
} from "lucide-react";
import Swal from "sweetalert2";

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
  console.log("tech: ", tech);
  if (tech) tech = tech[0].toUpperCase() + tech.slice(1);
  console.log("tech: ", tech);

  const Icon = TECH_ICONS[tech] || TECH_ICONS["default"];

  return (
    <div className="group relative overflow-hidden px-3 py-2 md:px-4 md:py-2.5 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl border border-blue-500/10 hover:border-blue-500/30 transition-all duration-300 cursor-default">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500" />
      <div className="relative flex items-center gap-1.5 md:gap-2">
        <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
        <span className="text-xs md:text-sm font-medium text-blue-300/90 group-hover:text-blue-200 transition-colors">
          {tech}
        </span>
      </div>
    </div>
  );
};

const FeatureItem = ({ feature }) => {
  return (
    <li className="group flex items-start space-x-3 p-2.5 md:p-3.5 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10">
      <div className="relative mt-2">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
        <div className="relative w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 group-hover:scale-125 transition-transform duration-300" />
      </div>
      <span className="text-sm md:text-base text-gray-300 group-hover:text-white transition-colors">
        {feature}
      </span>
    </li>
  );
};

const ProjectStats = ({ project }) => {
  const techStackCount = project?.TechStack?.length || 0;
  const featuresCount = project?.Features?.length || 0;

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 p-3 md:p-4 bg-[#0a0a1a] rounded-xl overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 opacity-50 blur-2xl z-0" />

      <div className="relative z-10 flex items-center space-x-2 md:space-x-3 bg-white/5 p-2 md:p-3 rounded-lg border border-blue-500/20 transition-all duration-300 hover:scale-105 hover:border-blue-500/50 hover:shadow-lg">
        <div className="bg-blue-500/20 p-1.5 md:p-2 rounded-full">
          <Code2
            className="text-blue-300 w-4 h-4 md:w-6 md:h-6"
            strokeWidth={1.5}
          />
        </div>
        <div className="flex-grow">
          <div className="text-lg md:text-xl font-semibold text-blue-200">
            {techStackCount}
          </div>
          <div className="text-[10px] md:text-xs text-gray-400">
            Total Technology
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center space-x-2 md:space-x-3 bg-white/5 p-2 md:p-3 rounded-lg border border-purple-500/20 transition-all duration-300 hover:scale-105 hover:border-purple-500/50 hover:shadow-lg">
        <div className="bg-purple-500/20 p-1.5 md:p-2 rounded-full">
          <Layers
            className="text-purple-300 w-4 h-4 md:w-6 md:h-6"
            strokeWidth={1.5}
          />
        </div>
        <div className="flex-grow">
          <div className="text-lg md:text-xl font-semibold text-purple-200">
            {featuresCount}
          </div>
          <div className="text-[10px] md:text-xs text-gray-400">
            Features
          </div>
        </div>
      </div>
    </div>
  );
};

const handleGithubClick = (githubLink) => {
  if (githubLink === "Private") {
    Swal.fire({
      icon: "info",
      title: "Source Code Private",
      text: "Maaf, source code untuk proyek ini bersifat privat.",
      confirmButtonText: "Mengerti",
      confirmButtonColor: "#3085d6",
      background: "#030014",
      color: "#ffffff",
    });
    return false;
  }
  return true;
};

const ProjectDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
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
              Description: p.description,
              Link: p.live,
              Github: p.code || "https://github.com/Twahanur",
              TechStack: p.tags ? p.tags.map((t) => typeof t === "object" && t.tag ? t.tag.name : t) : [],
              Features: p.features || [],
              Metrics: p.metrics || [],
              DevOps: p.devOps || [],
              Problem: p.problem || "",
              Architecture: p.architecture || "",
              FutureEnhancements: p.futureEnhancements || "",
              ChallengeSolutions: p.challengeSolutions || [],
              Img: featuredImage ? featuredImage.url : "",
            };
            setProject(formattedProject);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to fetch project detail from API:", err);
      }

      // Fallback to localStorage
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
        });
      }
    };

    fetchProject();
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <div className="text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <h2 className="text-xl md:text-3xl font-bold text-white">
            Loading Project...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030014] px-[2%] sm:px-0 relative overflow-hidden">
      {/* Background animations remain unchanged */}
      <div className="fixed inset-0">
        <div className="absolute -inset-[10px] opacity-20">
          <div className="absolute top-0 -left-4 w-72 md:w-96 h-72 md:h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 md:w-96 h-72 md:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 md:w-96 h-72 md:h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
        </div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      </div>

      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
          <div className="flex items-center space-x-2 md:space-x-4 mb-8 md:mb-12 animate-fadeIn">
            <button
              onClick={() => router.back()}
              className="group inline-flex items-center space-x-1.5 md:space-x-2 px-3 md:px-5 py-2 md:py-2.5 bg-white/5 backdrop-blur-xl rounded-xl text-white/90 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 text-sm md:text-base"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
            <div className="flex items-center space-x-1 md:space-x-2 text-sm md:text-base text-white/50">
              <span>Projects</span>
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-white/90 truncate">{project.Title}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-16">
            <div className="space-y-6 md:space-y-10 animate-slideInLeft">
              <div className="space-y-4 md:space-y-6">
                <h1 className="text-3xl md:text-6xl font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
                  {project.Title}
                </h1>
                <div className="relative h-1 w-16 md:w-24">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm" />
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-base md:text-lg text-gray-300/90 leading-relaxed">
                  {project.Description}
                </p>
              </div>

              <ProjectStats project={project} />

              <div className="flex flex-wrap gap-3 md:gap-4">
                {/* Action buttons */}
                <a
                  href={project.Link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center space-x-1.5 md:space-x-2 px-4 md:px-8 py-2.5 md:py-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 hover:from-blue-600/20 hover:to-purple-600/20 text-blue-300 rounded-xl transition-all duration-300 border border-blue-500/20 hover:border-blue-500/40 backdrop-blur-xl overflow-hidden text-sm md:text-base"
                >
                  <div className="absolute inset-0 translate-y-[100%] bg-gradient-to-r from-blue-600/10 to-purple-600/10 transition-transform duration-300 group-hover:translate-y-[0%]" />
                  <ExternalLink className="relative w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                  <span className="relative font-medium">Live Demo</span>
                </a>

                <a
                  href={project.Github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center space-x-1.5 md:space-x-2 px-4 md:px-8 py-2.5 md:py-4 bg-gradient-to-r from-purple-600/10 to-pink-600/10 hover:from-purple-600/20 hover:to-pink-600/20 text-purple-300 rounded-xl transition-all duration-300 border border-purple-500/20 hover:border-purple-500/40 backdrop-blur-xl overflow-hidden text-sm md:text-base"
                  onClick={(e) =>
                    !handleGithubClick(project.Github) && e.preventDefault()
                  }
                >
                  <div className="absolute inset-0 translate-y-[100%] bg-gradient-to-r from-purple-600/10 to-pink-600/10 transition-transform duration-300 group-hover:translate-y-[0%]" />
                  <Github className="relative w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                  <span className="relative font-medium">Github</span>
                </a>
              </div>

              <div className="space-y-4 md:space-y-6">
                <h3 className="text-lg md:text-xl font-semibold text-white/90 mt-[3rem] md:mt-0 flex items-center gap-2 md:gap-3">
                  <Code2 className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                  Technologies Used
                </h3>
                {project.TechStack.length > 0 ? (
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {project.TechStack.map((tech, index) => (
                      <TechBadge key={index} tech={tech} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm md:text-base text-gray-400 opacity-50">
                    No technologies added.
                  </p>
                )}
              </div>

              {/* DevOps Stack */}
              {project.DevOps && project.DevOps.length > 0 && (
                <div className="space-y-4 md:space-y-6 mt-6">
                  <h3 className="text-lg md:text-xl font-semibold text-white/90 flex items-center gap-2 md:gap-3">
                    <Cloud className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                    DevOps & Infrastructure
                  </h3>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {project.DevOps.map((tech, index) => (
                      <TechBadge key={index} tech={tech} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6 md:space-y-10 animate-slideInRight">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img
                  src={project.Img}
                  alt={project.Title}
                  className="w-full  object-cover transform transition-transform duration-700 will-change-transform group-hover:scale-105"
                  onLoad={() => setIsImageLoaded(true)}
                />
                <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 transition-colors duration-300 rounded-2xl" />
              </div>

              {/* Fitur Utama */}
              <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-8 border border-white/10 space-y-6 hover:border-white/20 transition-colors duration-300 group">
                <h3 className="text-xl font-semibold text-white/90 flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-400 group-hover:rotate-[20deg] transition-transform duration-300" />
                  Key Features
                </h3>
                {project.Features.length > 0 ? (
                  <ul className="list-none space-y-2">
                    {project.Features.map((feature, index) => (
                      <FeatureItem key={index} feature={feature} />
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 opacity-50">No features added.</p>
                )}
              </div>

              {/* Key Metrics & Impact */}
              {project.Metrics && project.Metrics.length > 0 && (
                <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-8 border border-white/10 space-y-6 hover:border-white/20 transition-colors duration-300 group">
                  <h3 className="text-xl font-semibold text-white/90 flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
                    Key Metrics & Impact
                  </h3>
                  <ul className="list-none space-y-2">
                    {project.Metrics.map((metric, index) => (
                      <FeatureItem key={index} feature={metric} />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Case Study Details */}
          {(project.Problem || project.Architecture || project.FutureEnhancements) && (
            <div className="mt-16 space-y-8 animate-fadeIn border-t border-white/5 pt-12">
              <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Case Study & Architecture
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {project.Problem && (
                  <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-red-500/20 transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 bg-red-500/10 rounded-xl text-red-400">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-white/90">The Problem</h3>
                    </div>
                    <p className="text-sm md:text-base text-gray-300/85 leading-relaxed whitespace-pre-line">
                      {project.Problem}
                    </p>
                  </div>
                )}
                {project.Architecture && (
                  <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/20 transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400">
                        <Layers className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-white/90">Architecture Decisions</h3>
                    </div>
                    <p className="text-sm md:text-base text-gray-300/85 leading-relaxed whitespace-pre-line">
                      {project.Architecture}
                    </p>
                  </div>
                )}
                {project.FutureEnhancements && (
                  <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-blue-500/20 transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400">
                        <Compass className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-white/90">Future Scope</h3>
                    </div>
                    <p className="text-sm md:text-base text-gray-300/85 leading-relaxed whitespace-pre-line">
                      {project.FutureEnhancements}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Challenges & Solutions */}
          {project.ChallengeSolutions && project.ChallengeSolutions.length > 0 && (
            <div className="mt-16 space-y-8 animate-fadeIn border-t border-white/5 pt-12">
              <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Challenges & Engineering Solutions
              </h2>
              <div className="space-y-6">
                {project.ChallengeSolutions.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col md:flex-row gap-6 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-red-500 via-purple-500 to-emerald-500" />
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-red-500/10 text-red-400 rounded border border-red-500/20">
                          CHALLENGE #{index + 1}
                        </span>
                      </div>
                      <h3 className="text-base md:text-lg font-semibold text-white/90 leading-snug">
                        {item.challenge}
                      </h3>
                    </div>
                    
                    <div className="hidden md:flex items-center justify-center text-gray-500">
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </div>
                    
                    <div className="flex-1 space-y-3 md:pl-6 md:border-l border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20">
                          SOLUTION
                        </span>
                      </div>
                      <p className="text-sm md:text-base text-gray-300/80 leading-relaxed whitespace-pre-line">
                        {item.solution}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s ease-out;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.7s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.7s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectDetails;
