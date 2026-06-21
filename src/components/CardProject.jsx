"use client";

/* eslint-disable react/prop-types */
import Link from "next/link";
import { ExternalLink, ArrowRight } from "lucide-react";
import { motion,  useSpring } from "framer-motion";
import { useRef } from "react";

const springValues = {
  damping: 100,
  stiffness:200,
  mass: 2,
};

const CardProject = ({ Img, Title, Description, Link: ProjectLink, id }) => {
  const ref = useRef(null);
  const rotateX = useSpring(0, springValues);
  const rotateY = useSpring(0, springValues);
  const scale = useSpring(1, springValues);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    const rotateAmplitude = 14;

    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude);
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude);
  };

  const handleMouseEnter = () => {
    scale.set(1.05);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  const handleLiveDemo = (e) => {
    if (!ProjectLink) {
      e.preventDefault();
      alert("Live demo link is not available");
    }
  };

  const handleDetails = (e) => {
    if (!id) {
      e.preventDefault();
      alert("Project details are not available");
    }
  };

  return (
    <div
      ref={ref}
      className="relative group w-full cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      {/* Tilted Background */}
      <motion.div
        className="absolute inset-0 rounded-xl z-0"
        style={{
          background: `url(${Img}) no-repeat center center`,
          backgroundSize: "cover",
          rotateX,
          rotateY,
          scale,
          transformStyle: "preserve-3d",
        }}
      />

      {/* Content */}
      <div className="relative z-10 overflow-hidden rounded-xl shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>

        <div className="relative p-5 h-60 flex items-end">
          <div className="opacity-100 md:opacity-0 md:group-hover:opacity-100 backdrop-blur-xl transition-all duration-500 transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 bg-slate-900/80 dark:bg-black/75 p-4 rounded-xl w-full">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent mb-2">
              {Title}
            </h3>

            <p className="text-gray-300/85 text-sm leading-relaxed line-clamp-2 mb-3">
              {Description}
            </p>

            <div className="flex items-center justify-between">
              {ProjectLink ? (
                <a
                  href={ProjectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLiveDemo}
                  className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors duration-200 cursor-target"
                >
                  <span className="text-sm font-medium">Live Demo</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <span className="text-gray-400 text-sm">Demo Not Available</span>
              )}

              {id ? (
                <Link
                  href={`/project/${id}`}
                  onClick={handleDetails}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-target"
                >
                  <span className="text-sm font-medium">Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="text-gray-400 text-sm">Details Not Available</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProject;
