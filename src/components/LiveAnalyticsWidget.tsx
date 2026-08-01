"use client";

import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";
import { Users, Eye, Globe, ExternalLink } from "lucide-react";

interface AnalyticsData {
  activeVisitors15m: number;
  totalPageViews: number;
  topCountries: Array<{
    country: string;
    code: string;
    flag: string;
    count: number;
    percentage: number;
  }>;
  topReferrers: Array<{
    source: string;
    count: number;
    percentage: number;
  }>;
}

export default function LiveAnalyticsWidget() {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    // 1. Log visit hit
    const trackHit = async () => {
      try {
        await fetch(`${API_BASE_URL}/api/analytics/track`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: window.location.pathname,
            referrer: document.referrer || "Direct",
          }),
        });
      } catch (err) {
        console.error("Analytics hit error", err);
      }
    };

    // 2. Fetch realtime summary
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/analytics/realtime`);
        if (res.ok) {
          const json = await res.json();
          if (json.success) setData(json.data);
        }
      } catch (err) {
        console.error("Analytics fetch error", err);
      }
    };

    trackHit().then(fetchAnalytics);
    const interval = setInterval(fetchAnalytics, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return null;

  return (
    <div className="rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-5 space-y-4 text-slate-300 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-400" /> Live Global Traffic Analytics
        </h4>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          {data.activeVisitors15m} Active Now
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
          <span className="text-slate-400 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-sky-400" /> Total Views
          </span>
          <p className="text-lg font-black text-slate-100 mt-1">{data.totalPageViews}</p>
        </div>
        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
          <span className="text-slate-400 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-purple-400" /> Top Region
          </span>
          <p className="text-lg font-black text-slate-100 mt-1">
            {data.topCountries[0]?.flag || "🌐"} {data.topCountries[0]?.country || "Global"}
          </p>
        </div>
      </div>

      {/* Top Countries breakdown */}
      {data.topCountries && data.topCountries.length > 0 && (
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Top Visitor Locations</span>
          <div className="space-y-1.5">
            {data.topCountries.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span>{item.flag}</span>
                  <span className="font-medium text-slate-300">{item.country}</span>
                </span>
                <span className="font-mono text-slate-400">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
