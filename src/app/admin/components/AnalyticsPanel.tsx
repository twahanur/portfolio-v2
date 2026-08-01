"use client";

import { useState, useEffect } from "react";
import PageHeader from "./ui/PageHeader";
import {
  FiActivity,
  FiEye,
  FiMousePointer,
  FiGlobe,
  FiMonitor,
  FiSmartphone,
  FiRefreshCw,
  FiExternalLink,
  FiShield,
  FiSearch,
  FiFilter,
  FiCpu,
  FiShare2,
} from "react-icons/fi";

export interface VisitorLogItem {
  id: string;
  path: string;
  country: string;
  countryCode: string;
  flagEmoji?: string;
  referrer: string;
  ip?: string | null;
  userAgent?: string | null;
  browser?: string;
  device?: string;
  os?: string;
  isClick?: boolean;
  createdAt: string;
}

export interface DetailedAnalyticsData {
  totalVisitorLogs: number;
  activeVisitors15m: number;
  pageViewsCount: number;
  clickEventsCount: number;
  topClicks: { target: string; count: number }[];
  topPages: { path: string; count: number }[];
  topReferrers?: { source: string; count: number; percentage: number }[];
  deviceCounts: Record<string, number>;
  browserCounts: Record<string, number>;
  osCounts?: Record<string, number>;
  recentLogs: VisitorLogItem[];
}

interface AnalyticsPanelProps {
  initialData: DetailedAnalyticsData;
  onRefresh: () => void;
}

export default function AnalyticsPanel({
  initialData,
  onRefresh,
}: AnalyticsPanelProps) {
  const [data, setData] = useState<DetailedAnalyticsData>(initialData);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filterType, setFilterType] = useState<"ALL" | "PAGE_VIEW" | "CLICK">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      onRefresh();
    }, 10000); // 10s auto-refresh
    return () => clearInterval(interval);
  }, [autoRefresh, onRefresh]);

  const logs = data?.recentLogs || [];
  const topPages = data?.topPages || [];
  const topClicks = data?.topClicks || [];
  const topReferrers = data?.topReferrers || [];
  const osCounts = data?.osCounts || {};

  // Filter logs based on filterType and searchQuery
  const filteredLogs = logs.filter((log) => {
    const isClick = log.isClick || log.path.startsWith("[CLICK]");
    if (filterType === "PAGE_VIEW" && isClick) return false;
    if (filterType === "CLICK" && !isClick) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchPath = log.path.toLowerCase().includes(q);
      const matchCountry = log.country.toLowerCase().includes(q);
      const matchIp = (log.ip || "").toLowerCase().includes(q);
      const matchBrowser = (log.browser || "").toLowerCase().includes(q);
      const matchOs = (log.os || "").toLowerCase().includes(q);
      const matchRef = (log.referrer || "").toLowerCase().includes(q);
      return matchPath || matchCountry || matchIp || matchBrowser || matchOs || matchRef;
    }
    return true;
  });

  const formatTimeAgo = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
      if (seconds < 30) return "Just now";
      if (seconds < 60) return `${seconds}s ago`;
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Realtime Analytics & Visitor Feed"
          description="Track live visitor navigation, geographic location, device OS, and button click interactions in real time."
        />
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition border flex items-center gap-1.5 ${
              autoRefresh
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-zinc-900 text-zinc-400 border-zinc-800"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${autoRefresh ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"}`} />
            {autoRefresh ? "Live Sync ON" : "Live Sync OFF"}
          </button>
          <button
            onClick={onRefresh}
            className="p-2.5 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 transition"
            title="Refresh Analytics"
          >
            <FiRefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-zinc-900 bg-zinc-900/30 p-6 flex items-center gap-4 shadow-lg">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <FiActivity size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-400">Active Right Now (15m)</p>
            <p className="text-2xl font-black text-emerald-400">{data?.activeVisitors15m || 1}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-900 bg-zinc-900/30 p-6 flex items-center gap-4 shadow-lg">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <FiEye size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-400">Total Page Views</p>
            <p className="text-2xl font-black text-zinc-100">{data?.pageViewsCount || 0}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-900 bg-zinc-900/30 p-6 flex items-center gap-4 shadow-lg">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <FiMousePointer size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-400">Tracked Click Events</p>
            <p className="text-2xl font-black text-amber-400">{data?.clickEventsCount || 0}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-900 bg-zinc-900/30 p-6 flex items-center gap-4 shadow-lg">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <FiGlobe size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-400">Total Recorded Hits</p>
            <p className="text-2xl font-black text-zinc-100">{data?.totalVisitorLogs || 0}</p>
          </div>
        </div>
      </div>

      {/* Top Pages, Top Clicks & Traffic Sources Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Popular Page Routes */}
        <div className="rounded-2xl border border-zinc-900 bg-zinc-900/30 p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <FiEye className="text-emerald-400" /> Popular Page Routes
          </h3>
          <div className="space-y-3">
            {topPages.length === 0 ? (
              <p className="text-xs text-zinc-500 py-4">No page view data recorded yet.</p>
            ) : (
              topPages.map((p, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-zinc-300">
                    <span className="font-mono text-emerald-400 truncate max-w-[200px]">{p.path}</span>
                    <span>{p.count} views</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{
                        width: `${Math.min(100, (p.count / (topPages[0]?.count || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Clicked Buttons & Links */}
        <div className="rounded-2xl border border-zinc-900 bg-zinc-900/30 p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <FiMousePointer className="text-amber-400" /> Top Clicked Buttons & Links
          </h3>
          <div className="space-y-3">
            {topClicks.length === 0 ? (
              <p className="text-xs text-zinc-500 py-4">No button clicks recorded yet.</p>
            ) : (
              topClicks.map((c, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-zinc-300">
                    <span className="truncate max-w-[200px] text-amber-300">&quot;{c.target}&quot;</span>
                    <span>{c.count} clicks</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{
                        width: `${Math.min(100, (c.count / (topClicks[0]?.count || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Operating Systems & Traffic Sources */}
        <div className="rounded-2xl border border-zinc-900 bg-zinc-900/30 p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <FiCpu className="text-indigo-400" /> Operating Systems & Sources
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">OS Distribution</p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(osCounts).length === 0 ? (
                  <span className="text-xs text-zinc-500">No OS data</span>
                ) : (
                  Object.entries(osCounts).map(([osName, count]) => (
                    <span
                      key={osName}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-800/80 px-2.5 py-1 text-xs font-semibold text-zinc-200 border border-zinc-700/60"
                    >
                      <span className="text-indigo-400 font-bold">{osName}:</span> {count}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-800/60">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <FiShare2 size={12} /> Traffic Sources
              </p>
              <div className="space-y-2">
                {topReferrers.length === 0 ? (
                  <span className="text-xs text-zinc-500">No referrer data</span>
                ) : (
                  topReferrers.slice(0, 4).map((ref, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs text-zinc-300">
                      <span className="font-medium">{ref.source}</span>
                      <span className="font-mono text-zinc-400">{ref.count} ({ref.percentage}%)</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Visitor Feed Table with Filters */}
      <div className="rounded-2xl border border-zinc-900 bg-zinc-900/30 overflow-hidden shadow-xl space-y-4 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <FiActivity className="text-emerald-400 animate-pulse" /> Live Visitor Activity Stream
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">Showing {filteredLogs.length} of {logs.length} recent events</p>
          </div>

          {/* Controls: Filter Buttons & Search Input */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Tabs */}
            <div className="flex items-center p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold">
              <button
                onClick={() => setFilterType("ALL")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filterType === "ALL"
                    ? "bg-zinc-800 text-zinc-100 font-bold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType("PAGE_VIEW")}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                  filterType === "PAGE_VIEW"
                    ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <FiEye size={12} /> Page Views
              </button>
              <button
                onClick={() => setFilterType("CLICK")}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                  filterType === "CLICK"
                    ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <FiMousePointer size={12} /> Clicks
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
              <input
                type="text"
                placeholder="Search IP, country, path..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 w-44 md:w-56"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-900/80 text-xs uppercase text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="px-4 py-3.5 font-bold">Country / Location</th>
                <th className="px-4 py-3.5 font-bold">Event / Target</th>
                <th className="px-4 py-3.5 font-bold">Device & OS</th>
                <th className="px-4 py-3.5 font-bold">Source</th>
                <th className="px-4 py-3.5 font-bold">IP Address</th>
                <th className="px-4 py-3.5 font-bold text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 font-semibold">
                    No matching activity logs found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isClick = log.isClick || log.path.startsWith("[CLICK]");
                  const displayTarget = isClick ? log.path.replace("[CLICK] ", "") : log.path;

                  return (
                    <tr key={log.id} className="hover:bg-zinc-900/50 transition">
                      <td className="px-4 py-3 font-semibold text-zinc-100 flex items-center gap-2">
                        <span className="text-base">{log.flagEmoji || "🌐"}</span>
                        <span>{log.country || "United States"}</span>
                      </td>

                      <td className="px-4 py-3">
                        {isClick ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-400 border border-amber-500/20 max-w-[300px] truncate" title={displayTarget}>
                            <FiMousePointer size={11} className="shrink-0" /> {displayTarget}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/20 max-w-[300px] truncate" title={displayTarget}>
                            <FiEye size={11} className="shrink-0" /> {displayTarget}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-xs text-zinc-300">
                        <div className="flex items-center gap-1.5">
                          {log.device === "Mobile" ? <FiSmartphone size={13} className="text-zinc-400 shrink-0" /> : <FiMonitor size={13} className="text-zinc-400 shrink-0" />}
                          <span>{log.os || "Desktop"} • {log.browser || "Browser"}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-xs text-zinc-400 truncate max-w-[140px]">
                        {log.referrer || "Direct"}
                      </td>

                      <td className="px-4 py-3 text-xs font-mono text-zinc-500">
                        {log.ip || "127.0.0.1"}
                      </td>

                      <td className="px-4 py-3 text-right text-xs font-semibold text-zinc-400">
                        {formatTimeAgo(log.createdAt)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guidance Card */}
      <div className="rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900/40 via-zinc-900/20 to-emerald-950/10 p-6 md:p-8 space-y-4 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <FiShield className="text-emerald-400" /> Microsoft Clarity Integration (100% Free Visual Heatmaps)
            </h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed max-w-2xl">
              Want to see actual screen recordings of how visitors move their mouse and scroll through your portfolio?
              You can add <strong>Microsoft Clarity</strong> — it is 100% free with unlimited session recording and zero impact on site performance.
            </p>
          </div>
          <a
            href="https://clarity.microsoft.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-bold text-zinc-200 hover:bg-zinc-700 transition shrink-0"
          >
            Microsoft Clarity <FiExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
