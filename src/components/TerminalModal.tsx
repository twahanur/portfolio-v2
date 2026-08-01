"use client";

import React, { useState, useRef, useEffect } from "react";
import { API_BASE_URL } from "../config/api";
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, Send } from "lucide-react";

interface TerminalHistoryItem {
  command: string;
  output: string;
}

export default function TerminalModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<TerminalHistoryItem[]>([
    {
      command: "welcome",
      output: `Welcome to Twahanur's Interactive CLI Portfolio! 🚀\nType 'help' to see available commands (e.g. bio, projects, skills, system, hire).`,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-terminal", handleOpen);
    return () => window.removeEventListener("open-terminal", handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, history]);

  const handleExecute = async (cmdToRun?: string) => {
    const cmd = (cmdToRun || input).trim();
    if (!cmd) return;

    if (cmd.toLowerCase() === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/terminal/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: cmd }),
      });

      const json = await res.json();
      const outputText = json.success ? json.data.output : json.message || "Command error";

      setHistory((prev) => [...prev, { command: cmd, output: outputText }]);
    } catch (err) {
      setHistory((prev) => [
        ...prev,
        { command: cmd, output: "Error: Unable to connect to terminal API." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/90 text-emerald-400 border border-slate-700/80 shadow-2xl hover:border-emerald-500/60 hover:scale-105 transition-all backdrop-blur-xl group font-mono text-xs"
        title="Open Interactive Portfolio CLI Terminal"
      >
        <TerminalIcon className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
        <span className="font-bold tracking-wide">CLI Terminal</span>
        <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded">
          v2.0
        </span>
      </button>

      {/* Terminal Window Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs flex flex-col h-[520px] max-h-[85vh]">
            
            {/* Header Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 text-slate-400">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                </div>
                <span className="text-slate-300 font-bold ml-2 flex items-center gap-1.5">
                  <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
                  twahanur@dev: ~ (zsh)
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-500 hidden sm:inline">Type &apos;help&apos; or &apos;clear&apos;</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-slate-100 transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-slate-300 bg-slate-950/90">
              {history.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <span>twahanur@dev:~$</span>
                    <span className="text-slate-100">{item.command}</span>
                  </div>
                  <pre className="whitespace-pre-wrap text-slate-300 font-mono text-xs leading-relaxed bg-slate-900/40 p-2.5 rounded-lg border border-slate-900/80">
                    {item.output}
                  </pre>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-emerald-400 animate-pulse">
                  <span>Executing command...</span>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleExecute();
              }}
              className="flex items-center gap-2 p-3 bg-slate-900 border-t border-slate-800"
            >
              <span className="text-emerald-400 font-bold">twahanur@dev:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type command (e.g. bio, projects, skills)..."
                className="flex-1 bg-transparent text-slate-100 focus:outline-none placeholder-slate-600 font-mono text-xs"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 disabled:opacity-40 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
