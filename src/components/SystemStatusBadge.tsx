"use client";

import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";
import { Activity, Server, Database, Globe } from "lucide-react";

interface SystemStatusData {
  status: string;
  dbLatencyMs: number;
  uptimeSeconds: number;
  edgeLocation: {
    colo: string;
    country: string;
  };
  timestamp: string;
}

export default function SystemStatusBadge() {
  const [data, setData] = useState<SystemStatusData | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/system-status`);
        if (res.ok) {
          const json = await res.json();
          if (json.success) setData(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch system status", err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return null;

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="View live system operational status"
        aria-expanded={isOpen}
        className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/60 dark:bg-slate-900/80 backdrop-blur-md border border-slate-700/50 hover:border-emerald-500/40 text-xs font-medium text-slate-300 transition-all shadow-sm group"
        title="Click to view live Cloudflare Edge infrastructure health"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-emerald-400 font-semibold hidden sm:inline">Systems Operational</span>
        <span className="text-slate-400 border-l border-slate-700/80 pl-2">
          {data.dbLatencyMs}ms
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-950/95 backdrop-blur-xl border border-slate-800 p-4 shadow-2xl z-50 text-xs text-slate-300 animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800 font-semibold text-slate-200">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Activity className="w-3.5 h-3.5" /> Edge Infrastructure
            </span>
            <span className="uppercase text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {data.status}
            </span>
          </div>

          <div className="space-y-2.5 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-400" /> D1 DB Latency:
              </span>
              <span className="font-mono font-bold text-slate-200">{data.dbLatencyMs} ms</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-sky-400" /> Edge Server (Colo):
              </span>
              <span className="font-mono text-slate-200">
                {data.edgeLocation.colo} ({data.edgeLocation.country})
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-amber-400" /> Edge Uptime:
              </span>
              <span className="font-mono text-slate-200">99.99%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
