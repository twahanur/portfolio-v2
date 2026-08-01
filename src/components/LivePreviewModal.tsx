"use client";

import { useState } from "react";
import {
  X,
  RefreshCw,
  ExternalLink,
  Laptop,
  Smartphone,
  Tablet,
  Monitor,
  Maximize2,
  Minimize2,
  ShieldCheck,
} from "lucide-react";

interface LivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectUrl: string;
  projectTitle: string;
}

export default function LivePreviewModal({
  isOpen,
  onClose,
  projectUrl,
  projectTitle,
}: LivePreviewModalProps) {
  const [viewport, setViewport] = useState<"desktop" | "laptop" | "tablet" | "mobile">("laptop");
  const [key, setKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen) return null;

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  const getViewportWidth = () => {
    switch (viewport) {
      case "mobile":
        return "w-[375px] h-[667px]";
      case "tablet":
        return "w-[768px] h-[800px]";
      case "laptop":
        return "w-[1024px] h-[720px]";
      case "desktop":
      default:
        return "w-full h-full min-h-[650px]";
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div
        className={`relative flex flex-col bg-[#0b0c10] border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          isFullscreen ? "w-full h-full" : "w-full max-w-6xl max-h-[92vh] h-[90vh]"
        }`}
      >
        {/* Mock Browser Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-[#12131a] border-b border-white/10 shrink-0">
          {/* Left Controls: OS Buttons & Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <button
                onClick={onClose}
                className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-600 transition flex items-center justify-center text-[8px] text-red-950 font-bold"
                title="Close"
              >
                ✕
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="w-3.5 h-3.5 rounded-full bg-yellow-500 hover:bg-yellow-600 transition"
                title="Toggle Fullscreen"
              />
              <button
                onClick={handleRefresh}
                className="w-3.5 h-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 transition"
                title="Reload Frame"
              />
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-white/90">
              <span className="truncate max-w-[180px]">{projectTitle}</span>
              <span className="text-emerald-400 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Live Demo
              </span>
            </div>
          </div>

          {/* Center: Device Viewport Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
            <button
              onClick={() => setViewport("desktop")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
                viewport === "desktop" ? "bg-[#6366f1] text-white font-bold" : "text-white/60 hover:text-white"
              }`}
              title="Desktop View (Full)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Desktop</span>
            </button>
            <button
              onClick={() => setViewport("laptop")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
                viewport === "laptop" ? "bg-[#6366f1] text-white font-bold" : "text-white/60 hover:text-white"
              }`}
              title="Laptop View (1024px)"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Laptop</span>
            </button>
            <button
              onClick={() => setViewport("tablet")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
                viewport === "tablet" ? "bg-[#6366f1] text-white font-bold" : "text-white/60 hover:text-white"
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Tablet</span>
            </button>
            <button
              onClick={() => setViewport("mobile")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
                viewport === "mobile" ? "bg-[#6366f1] text-white font-bold" : "text-white/60 hover:text-white"
              }`}
              title="Mobile View (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mobile</span>
            </button>
          </div>

          {/* Right Actions: Reload, External Link, Fullscreen & Close */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
              title="Reload Frame"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <a
              href={projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
              title="Open in New Tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-red-500/20 transition"
              title="Close Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mock Browser URL Bar */}
        <div className="px-4 py-2 bg-[#0d0e14] border-b border-white/5 flex items-center gap-2 text-xs text-white/60 shrink-0">
          <span className="text-emerald-400 font-mono text-[11px]">https://</span>
          <span className="font-mono truncate text-white/80">{projectUrl.replace(/^https?:\/\//, "")}</span>
        </div>

        {/* Simulated Viewport Stage */}
        <div className="flex-grow flex items-center justify-center p-4 bg-[#050508] overflow-auto">
          <div
            className={`transition-all duration-300 flex flex-col items-center justify-center ${
              viewport === "mobile" || viewport === "tablet"
                ? "p-3 bg-zinc-900/90 border border-zinc-700/60 rounded-[32px] shadow-2xl"
                : "w-full h-full"
            }`}
          >
            {/* Speaker notch for simulated mobile */}
            {viewport === "mobile" && (
              <div className="w-20 h-4 bg-zinc-800 rounded-full mb-2 flex items-center justify-center">
                <div className="w-3 h-1 bg-zinc-700 rounded-full" />
              </div>
            )}

            <iframe
              key={key}
              src={projectUrl}
              title={projectTitle}
              className={`rounded-xl border border-white/10 bg-white transition-all duration-300 ${getViewportWidth()}`}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
