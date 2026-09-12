"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";
import { Github, Star, GitFork, Users, Code2, Activity, ExternalLink, Calendar } from "lucide-react";

interface GitHubStats {
  username: string;
  publicRepos: number;
  followers: number;
  totalStars: number;
  totalForks: number;
  topLanguages: Array<{ name: string; count: number; percentage: number }>;
  avatarUrl: string;
  profileUrl?: string;
}

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContributionData {
  total: { [year: string]: number };
  contributions: ContributionDay[];
}

const AVAILABLE_YEARS = ["last", "2026", "2025", "2024", "2023"];

export default function GitHubContributionGraph() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [contribData, setContribData] = useState<ContributionData | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("last");
  const [loadingGraph, setLoadingGraph] = useState(true);
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);
  const [imgError, setImgError] = useState(false);

  const username = stats?.username || "twahanur";
  const profileUrl = stats?.profileUrl || `https://github.com/${username}`;

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

  useEffect(() => {
    const fetchContribData = async () => {
      setLoadingGraph(true);
      try {
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=${selectedYear}`);
        if (res.ok) {
          const json: ContributionData = await res.json();
          if (json && json.contributions) {
            setContribData(json);
          }
        }
      } catch (err) {
        console.error("GitHub contributions API error:", err);
      } finally {
        setLoadingGraph(false);
      }
    };
    fetchContribData();
  }, [username, selectedYear]);

  // Color mapping for high visibility on dark background
  const getLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return "bg-[#0e4429] border-[#0e4429]";
      case 2:
        return "bg-[#006d32] border-[#006d32]";
      case 3:
        return "bg-[#26a641] border-[#26a641] shadow-[0_0_6px_rgba(38,166,65,0.4)]";
      case 4:
        return "bg-[#39d353] border-[#39d353] shadow-[0_0_10px_rgba(57,211,83,0.7)]";
      case 0:
      default:
        return "bg-[#161b22] border-[#30363d]/60 hover:border-slate-500";
    }
  };

  const renderInteractiveGrid = () => {
    if (!contribData || !contribData.contributions || contribData.contributions.length === 0) {
      return null;
    }

    const contributionsToRender = contribData.contributions;

    // Group into columns of 7 days (weeks)
    const weeks: ContributionDay[][] = [];
    for (let i = 0; i < contributionsToRender.length; i += 7) {
      weeks.push(contributionsToRender.slice(i, i + 7));
    }

    // Calculate total contributions
    const totalContributions =
      contribData.total?.[selectedYear === "last" ? "lastYear" : selectedYear] ??
      contributionsToRender.reduce((acc, curr) => acc + curr.count, 0);

    const yearLabel = selectedYear === "last" ? "the last year" : selectedYear;

    return (
      <div className="space-y-3">
        {/* Subheader */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-300">
          <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            {totalContributions.toLocaleString()} contributions in {yearLabel}
          </span>
          {hoveredDay ? (
            <span className="font-mono text-[11px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-emerald-300 self-start sm:self-auto">
              {hoveredDay.count} contribution{hoveredDay.count === 1 ? "" : "s"} on {hoveredDay.date}
            </span>
          ) : (
            <span className="text-slate-500 text-[11px] hidden sm:inline">Hover over squares for details</span>
          )}
        </div>

        {/* Scrollable Grid */}
        <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="flex gap-1 min-w-[680px] justify-between items-center py-1">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1">
                {week.map((day, dIdx) => (
                  <div
                    key={dIdx}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-xs border transition-all duration-150 transform hover:scale-125 cursor-pointer ${getLevelColor(
                      day.level
                    )}`}
                    title={`${day.count} contributions on ${day.date}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
          <span>Less</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#161b22] border border-[#30363d]" />
            <span className="w-2.5 h-2.5 rounded-xs bg-[#0e4429]" />
            <span className="w-2.5 h-2.5 rounded-xs bg-[#006d32]" />
            <span className="w-2.5 h-2.5 rounded-xs bg-[#26a641]" />
            <span className="w-2.5 h-2.5 rounded-xs bg-[#39d353] shadow-[0_0_6px_rgba(57,211,83,0.8)]" />
          </div>
          <span>More</span>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-4 sm:p-6 space-y-5 text-slate-300 shadow-xl overflow-hidden">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {stats?.avatarUrl && (
            <img
              src={stats.avatarUrl}
              alt={username}
              className="w-10 h-10 rounded-full border-2 border-emerald-500/40"
            />
          )}
          <div>
            <h4 className="text-sm font-extrabold text-slate-100 flex items-center gap-1.5">
              <Github className="w-4 h-4 text-emerald-400" /> @{username}
            </h4>
            <span className="text-xs text-slate-400">GitHub Contribution Activity</span>
          </div>
        </div>

        {/* Controls: Year Selector + Profile Button */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl p-1 gap-1">
            {AVAILABLE_YEARS.map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedYear === yr
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                {yr === "last" ? "Last Year" : yr}
              </button>
            ))}
          </div>

          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl shrink-0"
          >
            Profile <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Contribution Graph Box */}
      <div className="relative rounded-xl overflow-hidden bg-[#0d1117] border border-slate-800/80 p-4 shadow-inner">
        {loadingGraph ? (
          <div className="flex items-center justify-center h-28">
            <div className="flex items-center gap-2 text-xs text-emerald-400 animate-pulse font-mono">
              <Activity className="w-4 h-4 animate-spin" />
              Fetching GitHub contribution data...
            </div>
          </div>
        ) : contribData ? (
          renderInteractiveGrid()
        ) : (
          /* Fallback chart image with bright green palette and high contrast */
          !imgError && (
            <img
              src={`https://ghchart.rshah.org/39d353/${username}`}
              alt={`${username}'s GitHub Contribution Graph`}
              className="w-full h-auto"
              onError={() => setImgError(true)}
              style={{ filter: "brightness(1.25) contrast(1.2)" }}
            />
          )
        )}
      </div>

      {/* Stats Row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
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

          <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/80">
            <div className="text-slate-400 flex items-center justify-center gap-1 text-[11px]">
              <Code2 className="w-3 h-3 text-emerald-400" /> Forks
            </div>
            <p className="text-base font-black text-slate-100 mt-0.5">{stats.totalForks || 0}</p>
          </div>
        </div>
      )}

      {/* Top Languages */}
      {stats?.topLanguages && stats.topLanguages.length > 0 && (
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Top Languages
          </span>
          <div className="flex flex-wrap gap-2">
            {stats.topLanguages.slice(0, 5).map((lang, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-950/60 border border-slate-800/80 rounded-lg text-xs font-semibold text-slate-300"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {lang.name}
                <span className="text-slate-500 font-mono">{lang.percentage}%</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

