"use client";

import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";
import { Briefcase } from "lucide-react";

interface AvailabilityData {
  isAvailable: boolean;
  statusText: string;
  preferredRoles: string[];
  noticePeriod: string;
}

export default function AvailabilityWidget() {
  const [data, setData] = useState<AvailabilityData | null>(null);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/availability`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) setData(json.data);
        }
      } catch (err) {
        console.error("Availability fetch error", err);
      }
    };
    fetchAvailability();
  }, []);

  if (!data || !data.statusText) return null;

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-800 text-xs text-slate-200 shadow-lg">
      <span className="relative flex h-2.5 w-2.5">
        {data.isAvailable && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        )}
        <span
          className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
            data.isAvailable ? "bg-emerald-500" : "bg-amber-500"
          }`}
        ></span>
      </span>

      <span className="font-semibold text-slate-100">{data.statusText}</span>

      {data.noticePeriod && (
        <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
          {data.noticePeriod}
        </span>
      )}
    </div>
  );
}
