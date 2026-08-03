"use client";

import { useState, useEffect, useCallback } from "react";
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
  AlertTriangle,
  Loader2,
  Lock,
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
  const [isLoading, setIsLoading] = useState(true);
  const [showWarning, setShowWarning] = useState(false);

  // Normalize project URL
  const getFormattedUrl = useCallback((url: string) => {
    if (!url) return "";
    const trimmed = url.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    return `https://${trimmed}`;
  }, []);

  const formattedUrl = getFormattedUrl(projectUrl);

  // Refresh handler
  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    setShowWarning(false);
    setKey((prev) => prev + 1);
  }, []);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    setIsLoading(true);
    setShowWarning(false);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    // Timeout fallback for sites that block iframe onLoad or load slowly
    const timer = setTimeout(() => {
      setShowWarning(true);
    }, 4500);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose, projectUrl, key]);

  if (!isOpen) return null;

  // Compute container dimensions depending on viewport mode
  const getViewportDimensions = () => {
    switch (viewport) {
      case "mobile":
        return "w-[375px] max-w-full h-[667px] max-h-[75vh]";
      case "tablet":
        return "w-[768px] max-w-full h-[750px] max-h-[80vh]";
      case "laptop":
        return "w-[1024px] max-w-full h-[680px] max-h-[82vh]";
      case "desktop":
      default:
        return "w-full h-full min-h-[550px]";
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative flex flex-col bg-[#0a0b10] border border-white/15 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden transition-all duration-300 ${
          isFullscreen ? "w-full h-full rounded-none" : "w-full max-w-7xl max-h-[94vh] h-[92vh]"
        }`}
      >
        {/* Mock Browser Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-[#11121c] border-b border-white/10 shrink-0">
          {/* Left Controls: OS Buttons & Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="w-3.5 h-3.5 rounded-full bg-rose-500 hover:bg-rose-600 transition flex items-center justify-center text-[9px] text-rose-950 font-bold shadow-sm"
                title="Close (Esc)"
              >
                ✕
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="w-3.5 h-3.5 rounded-full bg-amber-500 hover:bg-amber-600 transition shadow-sm"
                title="Toggle Fullscreen"
              />
              <button
                onClick={handleRefresh}
                className="w-3.5 h-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 transition shadow-sm"
                title="Reload Frame"
              />
            </div>

            <div className="hidden sm:flex items-center gap-2.5 text-xs font-semibold text-white/90">
              <span className="truncate max-w-[200px] text-slate-200">{projectTitle}</span>
              <span className="text-emerald-400 text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Live Demo
              </span>
            </div>
          </div>

          {/* Center: Device Viewport Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
            <button
              onClick={() => setViewport("desktop")}
              className={`flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-lg transition-all ${
                viewport === "desktop"
                  ? "bg-indigo-600 text-white font-bold shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
              title="Desktop View (Responsive)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Desktop</span>
            </button>

            <button
              onClick={() => setViewport("laptop")}
              className={`flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-lg transition-all ${
                viewport === "laptop"
                  ? "bg-indigo-600 text-white font-bold shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
              title="Laptop View (1024px)"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Laptop</span>
            </button>

            <button
              onClick={() => setViewport("tablet")}
              className={`flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-lg transition-all ${
                viewport === "tablet"
                  ? "bg-indigo-600 text-white font-bold shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Tablet</span>
            </button>

            <button
              onClick={() => setViewport("mobile")}
              className={`flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-lg transition-all ${
                viewport === "mobile"
                  ? "bg-indigo-600 text-white font-bold shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
              title="Mobile View (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mobile</span>
            </button>
          </div>

          {/* Right Actions: Reload, External Link, Fullscreen & Close */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleRefresh}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
              title="Reload Frame"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-indigo-400" : ""}`} />
            </button>

            {formattedUrl && (
              <a
                href={formattedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition flex items-center gap-1"
                title="Open in New Tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-rose-500/20 transition"
              title="Close Modal (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mock Browser Address Bar */}
        <div className="px-4 py-2 bg-[#0c0d14] border-b border-white/5 flex items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-1 flex-1 max-w-3xl overflow-hidden">
            <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="text-emerald-400 font-mono text-[11px] shrink-0">https://</span>
            <span className="font-mono text-slate-300 truncate">
              {formattedUrl ? formattedUrl.replace(/^https?:\/\//, "") : "no-url-available"}
            </span>
          </div>

          {showWarning && (
            <div className="hidden lg:flex items-center gap-2 text-amber-400 text-xs bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-lg">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Blank frame? Target site may restrict embedding (X-Frame-Options).</span>
              <a
                href={formattedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold hover:text-amber-300 ml-1"
              >
                Open in Tab ↗
              </a>
            </div>
          )}
        </div>

        {/* Viewport Stage Area */}
        <div className="flex-1 relative flex items-center justify-center p-3 sm:p-6 bg-[#040407] overflow-auto">
          {/* Loading Indicator */}
          {isLoading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#06070c]/90 backdrop-blur-sm transition-opacity">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-white">Loading Frame Preview...</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs truncate">{projectTitle}</p>
                </div>
              </div>
            </div>
          )}

          {!formattedUrl ? (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-white/5 border border-white/10 rounded-2xl max-w-md">
              <AlertTriangle className="w-10 h-10 text-amber-400 mb-3" />
              <h4 className="text-base font-semibold text-white mb-1">Live URL Not Available</h4>
              <p className="text-xs text-slate-400 mb-4">
                This project doesn&apos;t have an active live preview URL linked yet.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition"
              >
                Close Preview
              </button>
            </div>
          ) : (
            <div
              className={`transition-all duration-300 flex flex-col items-center justify-center ${
                viewport === "mobile"
                  ? "p-3 bg-zinc-900 border border-zinc-700/80 rounded-[36px] shadow-2xl relative shrink-0"
                  : viewport === "tablet"
                  ? "p-4 bg-zinc-900 border border-zinc-700/80 rounded-[28px] shadow-2xl relative shrink-0"
                  : viewport === "laptop"
                  ? "p-2 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl relative shrink-0"
                  : "w-full h-full"
              }`}
            >
              {/* Dynamic device notches */}
              {viewport === "mobile" && (
                <div className="w-24 h-4 bg-zinc-800 rounded-full mb-2 flex items-center justify-center gap-1.5 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-black/80" />
                  <div className="w-8 h-1 bg-zinc-700 rounded-full" />
                </div>
              )}

              {viewport === "tablet" && (
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 mb-2 border border-zinc-700 shrink-0" />
              )}

              {/* Responsive iframe */}
              <iframe
                key={key}
                src={formattedUrl}
                title={projectTitle}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setShowWarning(true);
                }}
                className={`rounded-xl border border-white/10 bg-white transition-all duration-300 ${getViewportDimensions()}`}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads allow-presentation"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              />

              {/* Mobile Home Bar */}
              {viewport === "mobile" && (
                <div className="w-28 h-1 bg-zinc-700 rounded-full mt-2 shrink-0" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
