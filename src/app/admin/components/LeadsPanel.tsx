"use client";

import { useState, useEffect } from "react";
import { Lead } from "../leads/page";
import { adminRequest } from "@/lib/admin-api";
import { FiMail, FiTrash2, FiCheckCircle, FiArchive, FiClock, FiSearch, FiBell, FiSave, FiX } from "react-icons/fi";
import PageHeader from "./ui/PageHeader";
import AdminMessage from "./ui/AdminMessage";

interface LeadsPanelProps {
  initialLeads: Lead[];
  onRefresh: () => void;
}

type TabType = "all" | "pending" | "contacted" | "archived";

export default function LeadsPanel({ initialLeads, onRefresh }: LeadsPanelProps) {
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(
    initialLeads.length > 0 ? initialLeads[0].id : null
  );
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Discord & Telegram Notification Config State
  const [showConfig, setShowConfig] = useState(false);
  const [discordWebhookUrl, setDiscordWebhookUrl] = useState("");
  const [isDiscordEnabled, setIsDiscordEnabled] = useState(false);
  const [telegramBotToken, setTelegramBotToken] = useState("");
  const [telegramChatId, setTelegramChatId] = useState("");
  const [isTelegramEnabled, setIsTelegramEnabled] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);

  useEffect(() => {
    const fetchNotifConfig = async () => {
      try {
        const res = await adminRequest("/api/notifications/config", "GET");
        if (res.success && res.data) {
          setDiscordWebhookUrl(res.data.discordWebhookUrl || "");
          setIsDiscordEnabled(res.data.isDiscordEnabled || false);
          setTelegramBotToken(res.data.telegramBotToken || "");
          setTelegramChatId(res.data.telegramChatId || "");
          setIsTelegramEnabled(res.data.isTelegramEnabled || false);
        }
      } catch (err) {
        console.error("Failed to load notification config", err);
      }
    };
    fetchNotifConfig();
  }, []);

  const handleSaveNotifConfig = async () => {
    setSavingConfig(true);
    try {
      await adminRequest("/api/notifications/config", "PUT", {
        discordWebhookUrl,
        isDiscordEnabled,
        telegramBotToken,
        telegramChatId,
        isTelegramEnabled,
      });
      showMessage("Notification webhooks updated successfully!", "success");
      setShowConfig(false);
    } catch (err: any) {
      console.error(err);
      showMessage(err.message || "Failed to update notification config", "error");
    } finally {
      setSavingConfig(false);
    }
  };

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
  };

  const handleStatusChange = async (id: string, newStatus: Lead["status"]) => {
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      await adminRequest(`/api/leads/${id}/status`, "PATCH", { status: newStatus });
      showMessage(`Lead marked as ${newStatus}!`, "success");
      onRefresh();
    } catch (err: any) {
      console.error(err);
      showMessage(err.message || "Failed to update lead status", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      await adminRequest(`/api/leads/${id}`, "DELETE");
      showMessage("Lead deleted successfully!", "success");
      if (selectedLeadId === id) {
        setSelectedLeadId(null);
      }
      onRefresh();
    } catch (err: any) {
      console.error(err);
      showMessage(err.message || "Failed to delete lead", "error");
    } finally {
      setLoading(false);
    }
  };

  // Filter leads based on tab and search query
  const filteredLeads = initialLeads.filter((lead) => {
    const matchesTab = activeTab === "all" || lead.status === activeTab;
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const selectedLead = initialLeads.find((l) => l.id === selectedLeadId) || filteredLeads[0];

  const getStatusBadge = (status: Lead["status"]) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "contacted":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "archived":
        return "bg-zinc-850 text-zinc-400 border border-zinc-800";
    }
  };

  const getTabCount = (tab: TabType) => {
    if (tab === "all") return initialLeads.length;
    return initialLeads.filter((l) => l.status === tab).length;
  };

  const formatLeadDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Contact Leads"
          description="Review and manage collaboration inquiries from your portfolio"
          showAction={false}
        />
        <button
          onClick={() => setShowConfig(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 font-bold text-xs transition"
        >
          <FiBell className="w-4 h-4 text-indigo-400" />
          <span>Notification Webhooks</span>
        </button>
      </div>

      {/* Notification Webhooks Config Modal */}
      {showConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-5 shadow-2xl text-xs text-zinc-200">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
              <h3 className="font-bold text-base text-zinc-100 flex items-center gap-2">
                <FiBell className="text-indigo-400" /> Discord & Telegram Notification Webhooks
              </h3>
              <button onClick={() => setShowConfig(false)} className="text-zinc-400 hover:text-zinc-100">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Discord Webhook */}
            <div className="space-y-2 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/80">
              <div className="flex items-center justify-between">
                <label className="font-bold text-zinc-200">Discord Push Alerts</label>
                <input
                  type="checkbox"
                  checked={isDiscordEnabled}
                  onChange={(e) => setIsDiscordEnabled(e.target.checked)}
                  className="w-4 h-4 rounded accent-indigo-500 cursor-pointer"
                />
              </div>
              <input
                type="text"
                value={discordWebhookUrl}
                onChange={(e) => setDiscordWebhookUrl(e.target.value)}
                placeholder="https://discord.com/api/webhooks/..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
              />
            </div>

            {/* Telegram Webhook */}
            <div className="space-y-2.5 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/80">
              <div className="flex items-center justify-between">
                <label className="font-bold text-zinc-200">Telegram Push Alerts</label>
                <input
                  type="checkbox"
                  checked={isTelegramEnabled}
                  onChange={(e) => setIsTelegramEnabled(e.target.checked)}
                  className="w-4 h-4 rounded accent-indigo-500 cursor-pointer"
                />
              </div>
              <input
                type="text"
                value={telegramBotToken}
                onChange={(e) => setTelegramBotToken(e.target.value)}
                placeholder="Telegram Bot Token (e.g. 123456789:ABC...)"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
              />
              <input
                type="text"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                placeholder="Telegram Chat ID (e.g. 987654321)"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfig(false)}
                className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotifConfig}
                disabled={savingConfig}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 shadow-lg disabled:opacity-50"
              >
                <FiSave className="w-4 h-4" />
                <span>{savingConfig ? "Saving..." : "Save Webhook Config"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminMessage
        text={message.text}
        type={message.type as "success" | "error" | ""}
        onDismiss={() => setMessage({ text: "", type: "" })}
      />

      {/* Main Mailbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
        {/* Inbox Left Sidebar */}
        <div className="lg:col-span-1 rounded-3xl border border-zinc-900 bg-zinc-900/10 flex flex-col overflow-hidden backdrop-blur-md">
          {/* Tabs header */}
          <div className="flex border-b border-zinc-900/60 p-2.5 gap-1">
            {(["all", "pending", "contacted", "archived"] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedLeadId(null);
                }}
                className={`flex-1 rounded-xl py-2 text-center text-xs font-bold capitalize transition ${
                  activeTab === tab
                    ? "bg-zinc-900 text-zinc-100 border border-zinc-800"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab}
                <span className="ml-1.5 text-[10px] text-zinc-550">({getTabCount(tab)})</span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="p-3 border-b border-zinc-900/60 relative">
            <input
              type="text"
              placeholder="Search in inbox..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-zinc-950 border border-zinc-850 px-3.5 py-2 pl-9 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition"
            />
            <FiSearch className="absolute left-7 top-[18px] text-zinc-500" size={13} />
          </div>

          {/* Inbox List */}
          <div className="flex-1 overflow-y-auto max-h-[420px] divide-y divide-zinc-900/40">
            {filteredLeads.length === 0 ? (
              <div className="py-16 text-center text-zinc-500 italic text-xs">No conversations found</div>
            ) : (
              filteredLeads.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => setSelectedLeadId(lead.id)}
                  className={`w-full text-left p-4 transition flex flex-col gap-1.5 ${
                    (selectedLeadId || filteredLeads[0]?.id) === lead.id
                      ? "bg-zinc-900/40 border-l-2 border-emerald-500"
                      : "hover:bg-zinc-900/15"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-zinc-200 text-xs truncate max-w-[120px]">
                      {lead.name}
                    </span>
                    <span className="text-[9px] text-zinc-500">
                      {formatLeadDate(lead.createdAt)}
                    </span>
                  </div>
                  <h4 className="text-zinc-300 font-semibold text-xs truncate w-full">
                    {lead.subject}
                  </h4>
                  <p className="text-zinc-500 text-[11px] line-clamp-1 w-full">
                    {lead.message}
                  </p>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider w-fit mt-1 ${getStatusBadge(lead.status)}`}>
                    {lead.status}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Message Viewer Right Panel */}
        <div className="lg:col-span-2 rounded-3xl border border-zinc-900 bg-zinc-900/10 p-6 flex flex-col justify-between backdrop-blur-md">
          {selectedLead ? (
            <div className="flex-1 flex flex-col justify-between h-full space-y-6">
              {/* Message Header */}
              <div className="border-b border-zinc-900/60 pb-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-zinc-100">{selectedLead.subject}</h2>
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                      <span className="text-zinc-400 font-semibold">From: {selectedLead.name}</span>
                      <span className="text-zinc-650">•</span>
                      <a
                        href={`mailto:${selectedLead.email}`}
                        className="text-emerald-400 hover:underline font-semibold"
                      >
                        {selectedLead.email}
                      </a>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${getStatusBadge(selectedLead.status)}`}>
                    {selectedLead.status}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mt-4 text-[10px] text-zinc-500 font-semibold">
                  <FiClock size={12} />
                  <span>Received {new Date(selectedLead.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Message Content */}
              <div className="flex-1 text-sm text-zinc-300 leading-relaxed whitespace-pre-line py-2 min-h-[160px] overflow-y-auto">
                {selectedLead.message}
              </div>

              {/* Message Actions */}
              <div className="border-t border-zinc-900/60 pt-5 flex flex-wrap items-center justify-between gap-3">
                {/* Status Toggle buttons */}
                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => handleStatusChange(selectedLead.id, "pending")}
                    disabled={loading || selectedLead.status === "pending"}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs font-bold text-zinc-300 hover:bg-zinc-800 transition active:scale-95 disabled:opacity-40"
                  >
                    Mark Pending
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedLead.id, "contacted")}
                    disabled={loading || selectedLead.status === "contacted"}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-450 hover:bg-emerald-500/20 transition active:scale-95 disabled:opacity-40"
                  >
                    <FiCheckCircle size={13} /> Mark Contacted
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedLead.id, "archived")}
                    disabled={loading || selectedLead.status === "archived"}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs font-bold text-zinc-400 hover:bg-zinc-900 transition active:scale-95 disabled:opacity-40"
                  >
                    <FiArchive size={13} /> Archive
                  </button>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(selectedLead.id)}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/15 transition active:scale-95"
                >
                  <FiTrash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 py-16">
              <FiMail size={40} className="text-zinc-800 mb-3" />
              <p className="text-sm italic">Select a contact message from the inbox to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
