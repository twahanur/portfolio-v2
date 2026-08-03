"use client";

/* eslint-disable react/prop-types */
import Link from "next/link";
import { ExternalLink, ArrowRight } from "lucide-react";
import { useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";

const CardProject = ({ Img, Title, Description, Link: ProjectLink, id }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const { setPageTransitionLoading } = usePortfolio();

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:shadow-[0_8px_40px_-12px_rgba(99,102,241,0.15)]">
      {/* Image section */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900/50">
        {Img && (
          <img
            src={Img}
            alt={Title || "Project"}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
        {/* Subtle gradient overlay at bottom of image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030014]/80 via-transparent to-transparent" />

        {/* Floating action button - appear on hover */}
        {ProjectLink && (
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
            <a
              href={ProjectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:bg-black/70 transition-all duration-200"
              title="Open Live Site"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>

      {/* Content section - always visible */}
      <div className="p-4 space-y-2">
        <h3 className="text-base font-semibold text-white/90 group-hover:text-white transition-colors duration-200 line-clamp-1">
          {Title}
        </h3>

        <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 min-h-[2.5rem]">
          {Description}
        </p>

        {/* Bottom row */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
          {ProjectLink ? (
            <a
              href={ProjectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1.5 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Live
            </a>
          ) : (
            <span className="text-xs text-slate-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600 inline-block" />
              No Demo
            </span>
          )}

          {id ? (
            <Link
              href={`/project/${id}`}
              onClick={() => setPageTransitionLoading("project")}
              className="text-xs text-slate-400 hover:text-white font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-white/[0.06] transition-all duration-200"
            >
              View Details
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CardProject;
