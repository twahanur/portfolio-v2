"use client";

import React, { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../config/api";
import { Search, X, Folder, BookOpen, Code, Briefcase, Award, ArrowRight } from "lucide-react";

interface SearchResults {
  query: string;
  totalMatches: number;
  results: {
    projects: Array<{ id: string; title: string; tagline: string }>;
    blogs: Array<{ id: string; title: string; summary: string }>;
    skills: Array<{ id: string; name: string; category: string }>;
    experiences: Array<{ id: string; role: string; company: string }>;
    certificates: Array<{ id: string; name: string; issuer: string }>;
  };
}

export default function GlobalSearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-search", handleOpen);
    return () => window.removeEventListener("open-search", handleOpen);
  }, []);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Debounced search API request
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success) setResults(json.data);
        }
      } catch (err) {
        console.error("Search API error", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <>
      {/* Search trigger button (for Navbar) */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 dark:bg-slate-900/80 border border-slate-700/60 text-xs text-slate-400 hover:text-slate-200 hover:border-indigo-500/40 transition-all shadow-sm group"
      >
        <Search className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
        <span className="hidden md:inline font-medium">Search portfolio...</span>
        <kbd className="hidden sm:inline-block text-[10px] bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded font-mono text-slate-400">
          ⌘K
        </kbd>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
            
            {/* Search Input Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-slate-900/80">
              <Search className="w-5 h-5 text-indigo-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects, skills, blogs, experiences (e.g. NestJS, Redis, React)..."
                className="flex-1 bg-transparent text-slate-100 text-sm focus:outline-none placeholder-slate-500"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-slate-400 hover:text-slate-200">
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 hover:text-slate-200"
              >
                ESC
              </button>
            </div>

            {/* Results Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs text-slate-300">
              {loading && (
                <div className="text-center py-8 text-slate-400 animate-pulse">
                  Searching unified database...
                </div>
              )}

              {!loading && !results && query.trim() && (
                <div className="text-center py-8 text-slate-400">
                  No matching results found for &quot;{query}&quot;.
                </div>
              )}

              {!loading && !query.trim() && (
                <div className="text-center py-8 text-slate-500 font-mono">
                  Type a keyword like <span className="text-indigo-400 font-semibold">&quot;Cloudflare&quot;</span>, <span className="text-indigo-400 font-semibold">&quot;PostgreSQL&quot;</span>, or <span className="text-indigo-400 font-semibold">&quot;Prisma&quot;</span>.
                </div>
              )}

              {results && (
                <div className="space-y-4">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                    Found {results.totalMatches} matches for &quot;{results.query}&quot;
                  </div>

                  {/* Projects */}
                  {results.results.projects.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="font-bold text-slate-200 flex items-center gap-1.5 text-xs text-indigo-400">
                        <Folder className="w-3.5 h-3.5" /> Projects ({results.results.projects.length})
                      </h5>
                      <div className="space-y-1.5">
                        {results.results.projects.map((p) => (
                          <a
                            key={p.id}
                            href={`/project/${p.id}`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-indigo-500/40 transition-all group"
                          >
                            <div>
                              <div className="font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">
                                {p.title}
                              </div>
                              <div className="text-slate-400 text-[11px] truncate max-w-md">{p.tagline}</div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-transform group-hover:translate-x-1" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {results.results.skills.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="font-bold text-slate-200 flex items-center gap-1.5 text-xs text-sky-400">
                        <Code className="w-3.5 h-3.5" /> Skills ({results.results.skills.length})
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {results.results.skills.map((s) => (
                          <span
                            key={s.id}
                            className="px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-300 font-semibold"
                          >
                            {s.name} <span className="text-[10px] text-sky-500">({s.category})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
