"use client";

import React, { useState } from "react";
import { API_BASE_URL } from "../config/api";
import { Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setStatus("success");
        setMessage("Thank you for subscribing! You will receive tech updates.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(json.message || "Failed to subscribe.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Error connecting to newsletter service.");
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-4 sm:p-5 space-y-3.5 text-slate-300 shadow-xl">
      <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
        <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
        <span>Subscribe for Tech & Architecture Insights</span>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">
        Get notified on new engineering articles, system design case studies, and code tutorials.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address..."
          required
          className="w-full sm:flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500/60 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg active:scale-95 disabled:opacity-50 shrink-0"
        >
          <span>Subscribe</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {status === "success" && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium pt-1">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {message}
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium pt-1">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {message}
        </div>
      )}
    </div>
  );
}
