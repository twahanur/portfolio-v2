"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Terminal,
  Search,
  MessageSquare,
  ArrowUp,
  FolderGit2,
  Mail,
  Copy,
  RotateCw,
  Check,
  Sparkles,
} from "lucide-react";

interface MenuPosition {
  x: number;
  y: number;
}

export default function CustomContextMenu() {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<MenuPosition>({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();

      const menuWidth = 230;
      const menuHeight = 360;

      let x = e.clientX;
      let y = e.clientY;

      if (x + menuWidth > window.innerWidth) {
        x = window.innerWidth - menuWidth - 10;
      }
      if (y + menuHeight > window.innerHeight) {
        y = window.innerHeight - menuHeight - 10;
      }

      setPosition({ x: Math.max(10, x), y: Math.max(10, y) });
      setVisible(true);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setVisible(false);
      } else {
        setVisible(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setVisible(false);
      }
    };

    const handleScroll = () => {
      if (visible) setVisible(false);
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("click", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [visible]);

  const handleAction = (action: () => void) => {
    setVisible(false);
    action();
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!visible) return null;

  return (
    <div
      ref={menuRef}
      style={{ top: position.y, left: position.x }}
      className="fixed z-[99999] w-56 py-2 px-1.5 rounded-2xl bg-slate-950/90 backdrop-blur-2xl border border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-slate-200 text-xs font-sans animate-in fade-in zoom-in-95 duration-150 select-none"
    >
      {/* Header Badge */}
      <div className="px-3 py-1.5 mb-1.5 flex items-center justify-between border-b border-slate-800/60">
        <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-400 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-purple-400" /> Twaha Portfolio
        </span>
        <span className="text-[9px] text-slate-500 font-mono">v2.0</span>
      </div>

      {/* Main Command Group */}
      <div className="space-y-0.5">
        <button
          onClick={() => handleAction(() => window.dispatchEvent(new CustomEvent("open-terminal")))}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-teal-500/10 hover:text-emerald-400 transition-all font-medium group"
        >
          <Terminal className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="flex-1 text-left">CLI Terminal</span>
          <span className="text-[9px] font-mono bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
            Cmd
          </span>
        </button>

        <button
          onClick={() => handleAction(() => window.dispatchEvent(new CustomEvent("open-search")))}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-purple-500/10 hover:text-indigo-300 transition-all font-medium group"
        >
          <Search className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span className="flex-1 text-left">Global Search</span>
          <span className="text-[9px] font-mono bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
            Ctrl+K
          </span>
        </button>

        <button
          onClick={() => handleAction(() => window.dispatchEvent(new CustomEvent("open-chat")))}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/10 hover:text-purple-300 transition-all font-medium group"
        >
          <MessageSquare className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          <span className="flex-1 text-left">Ask AI Assistant</span>
          <span className="text-[9px] font-mono bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">
            AI
          </span>
        </button>
      </div>

      <div className="my-1.5 border-t border-slate-800/60" />

      {/* Navigation Group */}
      <div className="space-y-0.5">
        <button
          onClick={() =>
            handleAction(() => {
              const el = document.querySelector("#Portofolio");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            })
          }
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-slate-300 hover:bg-slate-900 hover:text-slate-100 transition-all"
        >
          <FolderGit2 className="w-3.5 h-3.5 text-blue-400" />
          <span className="flex-1 text-left">View Projects</span>
        </button>

        <button
          onClick={() =>
            handleAction(() => {
              const el = document.querySelector("#Contact");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            })
          }
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-slate-300 hover:bg-slate-900 hover:text-slate-100 transition-all"
        >
          <Mail className="w-3.5 h-3.5 text-rose-400" />
          <span className="flex-1 text-left">Get in Touch</span>
        </button>

        <button
          onClick={() => handleAction(() => window.scrollTo({ top: 0, behavior: "smooth" }))}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-slate-300 hover:bg-slate-900 hover:text-slate-100 transition-all"
        >
          <ArrowUp className="w-3.5 h-3.5 text-sky-400" />
          <span className="flex-1 text-left">Back to Top</span>
        </button>
      </div>

      <div className="my-1.5 border-t border-slate-800/60" />

      {/* Quick Utilities */}
      <div className="space-y-0.5">
        <button
          onClick={() => handleAction(copyUrl)}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-slate-300 hover:bg-slate-900 hover:text-slate-100 transition-all"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-slate-400" />
          )}
          <span className="flex-1 text-left">{copied ? "URL Copied!" : "Copy Page URL"}</span>
        </button>

        <button
          onClick={() => handleAction(() => window.location.reload())}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-slate-300 hover:bg-slate-900 hover:text-slate-100 transition-all"
        >
          <RotateCw className="w-3.5 h-3.5 text-amber-400" />
          <span className="flex-1 text-left">Reload Page</span>
        </button>
      </div>
    </div>
  );
}
