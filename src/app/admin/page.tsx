"use client";

import { useAdminData } from "./hooks/useAdminData";
import { Profile, Project, Experience, Skill, Certificate } from "./types";
import AdminPageLoader from "./components/ui/AdminPageLoader";
import AdminErrorState from "./components/ui/AdminErrorState";
import {
  FiUser,
  FiBriefcase,
  FiAward,
  FiSettings,
  FiCheckSquare,
  FiArrowRight,
  FiActivity,
  FiServer,
  FiClock,
  FiGlobe,
  FiMail,
  FiMessageSquare,
  FiTrendingUp,
} from "react-icons/fi";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { adminRequest } from "@/lib/admin-api";

interface DashboardData {
  profile: Profile | null;
  projects: Project[];
  experiences: Experience[];
  skills: Skill[];
  certificates: Certificate[];
}

export default function AdminDashboard() {
  const { data, loading, error, refetch: refetchCore } = useAdminData<DashboardData>(
    (resData) => ({
      profile: resData.profile || null,
      projects: resData.projects || [],
      experiences: resData.experiences || [],
      skills: resData.skills || [],
      certificates: resData.certificates || [],
    }),
    "Failed to load dashboard data"
  );

  const [analyticsSummary, setAnalyticsSummary] = useState<any[]>([]);
  const [dailyStats, setDailyStats] = useState<any[]>([]);
  const [leadsCount, setLeadsCount] = useState(0);
  const [chatCount, setChatCount] = useState(0);
  const [loadingExtra, setLoadingExtra] = useState(true);

  const fetchExtraData = useCallback(async () => {
    try {
      setLoadingExtra(true);
      const [summaryRes, dailyRes, leadsRes, auditRes] = await Promise.allSettled([
        adminRequest("/api/analytics/summary"),
        adminRequest("/api/analytics/daily"),
        adminRequest("/api/leads"),
        adminRequest("/api/audit/sessions"),
      ]);

      if (summaryRes.status === "fulfilled" && summaryRes.value.success) {
        setAnalyticsSummary(summaryRes.value.data || []);
      }
      if (dailyRes.status === "fulfilled" && dailyRes.value.success) {
        setDailyStats(dailyRes.value.data || []);
      }
      if (leadsRes.status === "fulfilled" && leadsRes.value.success) {
        setLeadsCount(leadsRes.value.data?.length || 0);
      }
      if (auditRes.status === "fulfilled" && auditRes.value.success) {
        setChatCount(auditRes.value.data?.length || 0);
      }
    } catch (err) {
      console.error("Failed to load analytics extra data", err);
    } finally {
      setLoadingExtra(false);
    }
  }, []);

  useEffect(() => {
    if (data) {
      fetchExtraData();
    }
  }, [data, fetchExtraData]);

  const handleFullRefresh = () => {
    refetchCore();
    fetchExtraData();
  };

  if (loading) {
    return <AdminPageLoader variant="overview" />;
  }

  if (error || !data) {
    return <AdminErrorState message={error || "Could not fetch dashboard overview"} onRetry={handleFullRefresh} />;
  }

  const { profile, projects, experiences, skills, certificates } = data;

  // Compute stats totals
  const totalViews = analyticsSummary.reduce((sum, item) => sum + (item.totalViews || 0), 0);
  const totalUniqueVisitors = analyticsSummary.reduce((sum, item) => sum + (item.uniqueVisitors || 0), 0);

  const statCards = [
    {
      title: "Page Views",
      value: totalViews,
      icon: FiTrendingUp,
      color: "from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-400",
      link: "/admin",
      description: `${totalUniqueVisitors} unique visitors`,
    },
    {
      title: "Contacts / Leads",
      value: leadsCount,
      icon: FiMail,
      color: "from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-400",
      link: "/admin/leads",
      description: "User inquiry entries",
    },
    {
      title: "Chat Sessions",
      value: chatCount,
      icon: FiMessageSquare,
      color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-400",
      link: "/admin/audit",
      description: "AI assistant audit logs",
    },
    {
      title: "Projects List",
      value: projects.length,
      icon: FiBriefcase,
      color: "from-purple-500/10 to-fuchsia-500/10 border-purple-500/20 text-purple-400",
      link: "/admin/projects",
      description: "Showcase items",
    },
  ];

  // Process chart data: sum daily views from page dailyStats
  const statsByDate: Record<string, { dateStr: string; dateObj: Date; views: number }> = {};
  dailyStats.forEach((item) => {
    const d = new Date(item.date);
    const dateKey = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    if (!statsByDate[dateKey]) {
      statsByDate[dateKey] = { dateStr: dateKey, dateObj: d, views: 0 };
    }
    statsByDate[dateKey].views += item.views || 0;
  });

  const sortedChartData = Object.values(statsByDate)
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())
    .slice(-15); // Show last 15 days

  // Compute SVG coords for custom chart
  const chartHeight = 160;
  const chartWidth = 500;
  const padding = 20;
  const maxViews = Math.max(...sortedChartData.map((d) => d.views), 10);

  const points = sortedChartData.map((d, index) => {
    const x = padding + (index / (Math.max(sortedChartData.length - 1, 1))) * (chartWidth - padding * 2);
    const y = chartHeight - padding - (d.views / maxViews) * (chartHeight - padding * 2);
    return { x, y, ...d };
  });

  const linePath = points.length > 0
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ")
    : "";

  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`
    : "";

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-900/60 bg-gradient-to-r from-zinc-900/40 via-zinc-900/20 to-transparent p-8 shadow-xl backdrop-blur-md">
        <div className="absolute right-0 top-0 -z-10 h-full w-[40%] bg-[radial-gradient(circle_300px_at_120%_0%,rgba(16,185,129,0.06),transparent)]" />
        <div className="max-w-2xl">
          <h2 className="text-3xl font-extrabold text-zinc-50 tracking-tight sm:text-4xl">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              {profile?.name || "Admin"}
            </span>
          </h2>
          <p className="text-sm text-zinc-400 mt-2.5 leading-relaxed">
            Manage your personal brand, track accomplishments, configure system details, and publish modifications directly to your live portfolio website.
          </p>
        </div>
      </div>

      {/* Grid of Stats */}
      <div>
        <h3 className="text-lg font-bold text-zinc-200 mb-5 flex items-center justify-between">
          <span>Portfolio Dashboard Overview</span>
          {loadingExtra && <span className="text-xs text-zinc-500 font-semibold animate-pulse">Loading live stats...</span>}
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.link}
                className={`group relative flex flex-col justify-between rounded-2xl border bg-gradient-to-br p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-zinc-700/80 ${card.color}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-zinc-100 leading-none group-hover:text-zinc-50 transition-colors">
                    {card.value}
                  </span>
                  <div className="rounded-xl border border-zinc-800/80 p-2.5 bg-zinc-950/45">
                    <Icon size={20} />
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-bold text-zinc-200 text-sm leading-none">{card.title}</h4>
                  <p className="text-[11px] text-zinc-500 mt-1">{card.description}</p>
                </div>
                <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition duration-300 transform translate-x-1 group-hover:translate-x-0">
                  <FiArrowRight size={14} className="text-zinc-400" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Analytics Chart & Popular Pages */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Custom SVG Line Chart */}
        <div className="lg:col-span-2 rounded-3xl border border-zinc-900 bg-zinc-900/10 p-6 shadow-xl backdrop-blur-md">
          <h3 className="text-base font-bold text-zinc-200 mb-4 flex items-center gap-2">
            <FiActivity className="text-emerald-450" />
            Page Views History (Last 15 Days)
          </h3>
          {sortedChartData.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center text-zinc-500 italic text-sm">
              No page view events recorded yet
            </div>
          ) : (
            <div className="relative">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal gridlines */}
                {[0, 0.5, 1].map((ratio, i) => {
                  const y = padding + ratio * (chartHeight - padding * 2);
                  const val = Math.round(maxViews - ratio * maxViews);
                  return (
                    <g key={i} className="opacity-40">
                      <line
                        x1={padding}
                        y1={y}
                        x2={chartWidth - padding}
                        y2={y}
                        stroke="#27272a"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                      <text x={padding - 5} y={y + 3} fill="#71717a" fontSize="8" textAnchor="end" fontWeight="bold">
                        {val}
                      </text>
                    </g>
                  );
                })}
                {/* Filled Area */}
                <path d={areaPath} fill="url(#chartGradient)" />
                {/* Smooth Line */}
                <path d={linePath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                {/* Data Points */}
                {points.map((p, i) => (
                  <g key={i} className="group/node">
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="4"
                      className="fill-zinc-950 stroke-emerald-400 stroke-2 hover:r-6 cursor-pointer transition-all duration-150"
                    />
                    <text
                      x={p.x}
                      y={p.y - 8}
                      fill="#e4e4e7"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="opacity-0 group-hover/node:opacity-100 transition-opacity bg-zinc-950 px-1 rounded py-0.5 pointer-events-none"
                    >
                      {p.views}
                    </text>
                  </g>
                ))}
              </svg>
              {/* X Axis Labels */}
              <div className="flex justify-between px-3.5 mt-2.5 text-[9px] font-bold text-zinc-550">
                <span>{sortedChartData[0]?.dateStr}</span>
                <span>{sortedChartData[Math.floor(sortedChartData.length / 2)]?.dateStr}</span>
                <span>{sortedChartData[sortedChartData.length - 1]?.dateStr}</span>
              </div>
            </div>
          )}
        </div>

        {/* Popular Pages Table */}
        <div className="rounded-3xl border border-zinc-900 bg-zinc-900/10 p-6 shadow-xl backdrop-blur-md">
          <h3 className="text-base font-bold text-zinc-200 mb-4 flex items-center gap-2">
            <FiGlobe className="text-blue-400" />
            Top Pages
          </h3>
          {analyticsSummary.length === 0 ? (
            <div className="py-12 text-center text-zinc-550 text-xs italic">No page visits recorded</div>
          ) : (
            <div className="space-y-3.5">
              {analyticsSummary
                .sort((a, b) => b.totalViews - a.totalViews)
                .slice(0, 5)
                .map((item, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-zinc-900/50 pb-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-zinc-300 truncate">{item.page}</p>
                      <p className="text-[10px] text-zinc-500">{item.uniqueVisitors} visitors</p>
                    </div>
                    <div className="text-right">
                      <span className="rounded bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-xs font-black text-zinc-150">
                        {item.totalViews} views
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions & System Info */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* System Information */}
        <div className="lg:col-span-1 rounded-2xl border border-zinc-900 bg-zinc-900/10 p-5 space-y-4 backdrop-blur-sm">
          <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2 border-b border-zinc-900 pb-3">
            <FiServer className="text-emerald-450" /> System Information
          </h3>
          <div className="space-y-3 text-xs text-zinc-400">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">API Endpoint</span>
              <span className="font-semibold text-zinc-300">http://localhost:5001</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Environment</span>
              <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/15">
                Development
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Database Engine</span>
              <span className="font-semibold text-zinc-300">Prisma (Neon PG)</span>
            </div>
          </div>
          <div className="pt-2 border-t border-zinc-900">
            <button
              onClick={handleFullRefresh}
              className="w-full rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-850 py-2.5 text-center text-xs font-bold text-zinc-300 hover:text-zinc-200 transition active:scale-[0.98]"
            >
              Re-sync System Context
            </button>
          </div>
        </div>

        {/* Content summary stats */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-900 bg-zinc-900/10 p-5 space-y-4 backdrop-blur-sm">
          <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2 border-b border-zinc-900 pb-3">
            <FiClock className="text-purple-400" /> Active Portfolio Schema
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl bg-zinc-950/35 border border-zinc-900 p-3.5">
              <p className="text-zinc-500 font-semibold">Experiences Count</p>
              <p className="text-xl font-black text-zinc-205 mt-1">{experiences.length}</p>
            </div>
            <div className="rounded-xl bg-zinc-950/35 border border-zinc-900 p-3.5">
              <p className="text-zinc-500 font-semibold">Skills Badges</p>
              <p className="text-xl font-black text-zinc-205 mt-1">{skills.length}</p>
            </div>
            <div className="rounded-xl bg-zinc-950/35 border border-zinc-900 p-3.5">
              <p className="text-zinc-500 font-semibold">Certifications</p>
              <p className="text-xl font-black text-zinc-205 mt-1">{certificates.length}</p>
            </div>
            <div className="rounded-xl bg-zinc-950/35 border border-zinc-900 p-3.5">
              <p className="text-zinc-500 font-semibold">Projects Featured</p>
              <p className="text-xl font-black text-zinc-205 mt-1">{projects.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
