"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";
import { Github, Star, GitFork, Users, Code2 } from "lucide-react";

interface GitHubStats {
  username: string;
  publicRepos: number;
  followers: number;
  totalStars: number;
  topLanguage: string;
  avatarUrl: string;
  profileUrl: string;
}

export default function GitHubStatsCard() {
  const [stats, setStats] = useState<GitHubStats | null>(null);

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/github-stats`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) setStats(json.data);
        }
      } catch (err) {
        console.error("GitHub stats fetch error", err);
      }
    };
    fetchGitHubStats();
  }, []);

  if (!stats) return null;

  return (
    <a
      href={stats.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-5 space-y-4 text-slate-300 hover:border-slate-700 transition-all shadow-xl group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={stats.avatarUrl}
            alt={stats.username}
            className="w-10 h-10 rounded-full border-2 border-indigo-500/40"
          />
          <div>
            <h4 className="text-sm font-extrabold text-slate-100 group-hover:text-indigo-400 transition-colors flex items-center gap-1.5">
              <Github className="w-4 h-4 text-slate-300" /> @{stats.username}
            </h4>
            <span className="text-xs text-slate-400">Live GitHub Profile Stats</span>
          </div>
        </div>
        <span className="text-xs text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
          <Code2 className="w-3.5 h-3.5" /> {stats.topLanguage}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
        <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/80">
          <div className="text-slate-400 flex items-center justify-center gap-1 text-[11px]">
            <GitFork className="w-3 h-3 text-sky-400" /> Repos
          </div>
          <p className="text-base font-black text-slate-100 mt-0.5">{stats.publicRepos}</p>
        </div>

        <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/80">
          <div className="text-slate-400 flex items-center justify-center gap-1 text-[11px]">
            <Star className="w-3 h-3 text-amber-400" /> Stars
          </div>
          <p className="text-base font-black text-slate-100 mt-0.5">{stats.totalStars}</p>
        </div>

        <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/80">
          <div className="text-slate-400 flex items-center justify-center gap-1 text-[11px]">
            <Users className="w-3 h-3 text-purple-400" /> Followers
          </div>
          <p className="text-base font-black text-slate-100 mt-0.5">{stats.followers}</p>
        </div>
      </div>
    </a>
  );
}
