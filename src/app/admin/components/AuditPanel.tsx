"use client";

import { useState } from "react";
import { ChatSession } from "../audit/page";
import { adminRequest } from "@/lib/admin-api";
import {
  FiMessageSquare,
  FiTrash2,
  FiUser,
  FiCpu,
  FiClock,
  FiMonitor,
  FiActivity,
  FiSearch,
  FiChevronRight,
} from "react-icons/fi";
import PageHeader from "./ui/PageHeader";
import AdminMessage from "./ui/AdminMessage";

interface AuditPanelProps {
  initialSessions: ChatSession[];
  onRefresh: () => void;
}

export default function AuditPanel({ initialSessions, onRefresh }: AuditPanelProps) {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    initialSessions.length > 0 ? initialSessions[0].id : null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this chat session?")) return;
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      await adminRequest(`/api/audit/sessions/${id}`, "DELETE");
      showMessage("Chat session deleted successfully!", "success");
      if (selectedSessionId === id) {
        setSelectedSessionId(null);
      }
      onRefresh();
    } catch (err: any) {
      console.error(err);
      showMessage(err.message || "Failed to delete session", "error");
    } finally {
      setLoading(false);
    }
  };

  const getBrowserInfo = (ua: string | null) => {
    if (!ua) return "Unknown Client";
    const u = ua.toLowerCase();
    if (u.includes("firefox")) return "Firefox";
    if (u.includes("chrome") && !u.includes("edg") && !u.includes("opr")) return "Chrome";
    if (u.includes("safari") && !u.includes("chrome")) return "Safari";
    if (u.includes("edg")) return "Edge";
    if (u.includes("opr") || u.includes("opera")) return "Opera";
    if (u.includes("bot") || u.includes("crawler")) return "Search Bot";
    return "Browser";
  };

  const getOsInfo = (ua: string | null) => {
    if (!ua) return "Unknown OS";
    const u = ua.toLowerCase();
    if (u.includes("windows")) return "Windows";
    if (u.includes("macintosh") || u.includes("mac os")) return "macOS";
    if (u.includes("linux")) return "Linux";
    if (u.includes("android")) return "Android";
    if (u.includes("iphone") || u.includes("ipad")) return "iOS";
    return "OS";
  };

  // Filter sessions
  const filteredSessions = initialSessions.filter((s) => {
    const ipMatch = s.ipAddress?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const uaMatch = s.userAgent?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const msgMatch = s.messages.some((m) =>
      m.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return searchQuery === "" || ipMatch || uaMatch || msgMatch;
  });

  const selectedSession = initialSessions.find((s) => s.id === selectedSessionId) || filteredSessions[0];

  // Stats calculations
  const totalSessions = initialSessions.length;
  const totalMessages = initialSessions.reduce((sum, s) => sum + s.messages.length, 0);
  const avgMessages = totalSessions > 0 ? (totalMessages / totalSessions).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Chat Audit"
        description="Monitor, audit, and analyze chatbot interactions with portfolio visitors"
        showAction={false}
      />

      <AdminMessage
        text={message.text}
        type={message.type as "success" | "error" | ""}
        onDismiss={() => setMessage({ text: "", type: "" })}
      />

      {/* Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[520px]">
        {/* Sessions List Left Sidebar */}
        <div className="lg:col-span-1 rounded-3xl border border-zinc-900 bg-zinc-900/10 flex flex-col overflow-hidden backdrop-blur-md">
          {/* Header search */}
          <div className="p-3 border-b border-zinc-900/60 relative">
            <input
              type="text"
              placeholder="Search sessions, IPs, or text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-zinc-950 border border-zinc-850 px-3.5 py-2 pl-9 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition"
            />
            <FiSearch className="absolute left-7 top-[18px] text-zinc-500" size={13} />
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto max-h-[440px] divide-y divide-zinc-900/40">
            {filteredSessions.length === 0 ? (
              <div className="py-16 text-center text-zinc-550 italic text-xs">No chat sessions found</div>
            ) : (
              filteredSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setSelectedSessionId(session.id)}
                  className={`w-full text-left p-4 transition flex items-center justify-between ${
                    (selectedSessionId || filteredSessions[0]?.id) === session.id
                      ? "bg-zinc-900/40 border-l-2 border-emerald-500"
                      : "hover:bg-zinc-900/15"
                  }`}
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-200 text-xs truncate">
                        IP: {session.ipAddress || "anonymous"}
                      </span>
                      <span className="rounded-md bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 text-[9px] font-black text-zinc-400">
                        {session.messages.length} msgs
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-zinc-500 mt-1">
                      <FiMonitor size={10} />
                      <span className="truncate">
                        {getBrowserInfo(session.userAgent)} ({getOsInfo(session.userAgent)})
                      </span>
                    </div>
                    <div className="text-[9px] text-zinc-550 mt-1 flex items-center gap-1">
                      <FiClock size={10} />
                      <span>{new Date(session.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <FiChevronRight className="text-zinc-500 shrink-0" size={14} />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Transcript Panel Right Side */}
        <div className="lg:col-span-2 rounded-3xl border border-zinc-900 bg-zinc-900/10 p-6 flex flex-col justify-between backdrop-blur-md">
          {selectedSession ? (
            <div className="flex-1 flex flex-col justify-between h-full space-y-6">
              {/* Transcript header */}
              <div className="border-b border-zinc-900/60 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-zinc-150 text-sm flex items-center gap-2">
                    <FiMessageSquare className="text-emerald-450" />
                    Session Transcript Audit
                  </h3>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    ID: {selectedSession.id} • {getBrowserInfo(selectedSession.userAgent)} on {getOsInfo(selectedSession.userAgent)}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(selectedSession.id)}
                  disabled={loading}
                  className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/15 transition active:scale-95"
                  title="Delete Session"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>

              {/* Chat messages viewport */}
              <div className="flex-1 overflow-y-auto max-h-[340px] pr-2 space-y-4 py-2 min-h-[220px]">
                {selectedSession.messages.length === 0 ? (
                  <p className="text-zinc-500 italic text-center py-10 text-xs">Empty chat thread</p>
                ) : (
                  selectedSession.messages.map((msg) => {
                    const isUser = msg.role === "user";
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-3 max-w-[85%] ${
                          isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                        }`}
                      >
                        {/* Avatar */}
                        <div
                          className={`h-7.5 w-7.5 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                            isUser
                              ? "bg-zinc-800 text-zinc-350 border border-zinc-700"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          }`}
                        >
                          {isUser ? <FiUser size={13} /> : <FiCpu size={13} />}
                        </div>
                        {/* Message Bubble */}
                        <div className="space-y-1">
                          <div
                            className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed whitespace-pre-line shadow ${
                              isUser
                                ? "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tr-none"
                                : "bg-zinc-950 border border-zinc-900/60 text-zinc-300 rounded-tl-none"
                            }`}
                          >
                            {msg.content}
                          </div>
                          <span className="block text-[8px] text-zinc-650 text-right px-1">
                            {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer Audit Note */}
              <div className="border-t border-zinc-900/60 pt-4 flex items-center justify-between text-[9px] text-zinc-550">
                <span>Total Messages: {selectedSession.messages.length}</span>
                <span>Session started: {new Date(selectedSession.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ) : (
            /* Stats Dashboard placeholder (if no sessions selected) */
            <div className="flex-1 flex flex-col justify-center items-center space-y-6 py-10">
              <div className="text-center space-y-2">
                <FiActivity size={44} className="text-zinc-800 mx-auto" />
                <h3 className="font-bold text-zinc-300 text-base">Chatbot Audit Overview</h3>
                <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
                  Monitor conversations between visitors and your AI assistant to audit capabilities, filter inquiries, or clean logs.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                <div className="rounded-2xl border border-zinc-900 bg-zinc-950/20 p-4 text-center">
                  <span className="text-[10px] text-zinc-550 block font-semibold">Total Sessions</span>
                  <span className="text-xl font-black text-zinc-250 mt-1 block">{totalSessions}</span>
                </div>
                <div className="rounded-2xl border border-zinc-900 bg-zinc-950/20 p-4 text-center">
                  <span className="text-[10px] text-zinc-550 block font-semibold">Total Messages</span>
                  <span className="text-xl font-black text-zinc-250 mt-1 block">{totalMessages}</span>
                </div>
                <div className="rounded-2xl border border-zinc-900 bg-zinc-950/20 p-4 text-center">
                  <span className="text-[10px] text-zinc-550 block font-semibold">Avg / Session</span>
                  <span className="text-xl font-black text-zinc-250 mt-1 block">{avgMessages}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
