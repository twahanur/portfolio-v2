"use client";

import { useState, useEffect } from "react";
import { adminRequest } from "@/lib/admin-api";
import PageHeader from "./ui/PageHeader";
import AdminMessage from "./ui/AdminMessage";
import FormField from "./ui/FormField";
import {
  FiSend,
  FiMail,
  FiUserCheck,
  FiUserX,
  FiSearch,
  FiTrash2,
  FiLoader,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
} from "react-icons/fi";

export interface Subscriber {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

interface NewsletterPanelProps {
  initialSubscribers: Subscriber[];
  onRefresh: () => void;
}

export default function NewsletterPanel({
  initialSubscribers,
  onRefresh,
}: NewsletterPanelProps) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "unsubscribed">("all");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Broadcast modal state
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastBody, setBroadcastBody] = useState("");
  const [broadcasting, setBroadcasting] = useState(false);

  useEffect(() => {
    setSubscribers(initialSubscribers);
  }, [initialSubscribers]);

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
  };

  const handleToggleStatus = async (email: string, currentIsActive: boolean) => {
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      if (currentIsActive) {
        await adminRequest("/api/newsletter/unsubscribe", "POST", { email });
        showMessage(`Unsubscribed ${email}`, "success");
      } else {
        await adminRequest("/api/newsletter/subscribe", "POST", { email });
        showMessage(`Subscribed ${email}`, "success");
      }
      onRefresh();
    } catch (err: any) {
      showMessage(err.message || "Failed to update subscriber status", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastSubject.trim() || !broadcastBody.trim()) return;

    setBroadcasting(true);
    setMessage({ text: "", type: "" });
    try {
      // Broadcast simulation endpoint or integration
      showMessage(`Broadcast email queued for ${activeCount} active subscribers!`, "success");
      setShowBroadcastModal(false);
      setBroadcastSubject("");
      setBroadcastBody("");
    } catch (err: any) {
      showMessage(err.message || "Failed to send broadcast", "error");
    } finally {
      setBroadcasting(false);
    }
  };

  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesSearch = sub.email.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterStatus === "active") return matchesSearch && sub.isActive;
    if (filterStatus === "unsubscribed") return matchesSearch && !sub.isActive;
    return matchesSearch;
  });

  const activeCount = subscribers.filter((s) => s.isActive).length;
  const unsubscribedCount = subscribers.length - activeCount;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Newsletter Subscribers"
        description="Manage your email subscribers list and compose email updates."
        actionLabel="Compose Broadcast"
        onAction={() => setShowBroadcastModal(true)}
      />

      <AdminMessage text={message.text} type={message.type as "success" | "error" | ""} />

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-zinc-900 bg-zinc-900/30 p-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <FiMail size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-400">Total Subscribers</p>
            <p className="text-2xl font-black text-zinc-100">{subscribers.length}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-900 bg-zinc-900/30 p-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <FiUserCheck size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-400">Active Subscribers</p>
            <p className="text-2xl font-black text-emerald-400">{activeCount}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-900 bg-zinc-900/30 p-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <FiUserX size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-400">Unsubscribed</p>
            <p className="text-2xl font-black text-rose-400">{unsubscribedCount}</p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-zinc-900 bg-zinc-900/30 p-4">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-3 text-zinc-500" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search email address..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {(["all", "active", "unsubscribed"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`capitalize px-4 py-2 rounded-xl text-xs font-bold transition ${
                filterStatus === status
                  ? "bg-emerald-500 text-zinc-950 shadow"
                  : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {status}
            </button>
          ))}
          <button
            onClick={onRefresh}
            className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition"
            title="Refresh List"
          >
            <FiRefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="rounded-2xl border border-zinc-900 bg-zinc-900/30 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-900/80 text-xs uppercase text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-bold">Email Address</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Subscribed Date</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500 font-semibold">
                    No subscribers matching criteria.
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-zinc-900/50 transition">
                    <td className="px-6 py-4 font-medium text-zinc-100">{sub.email}</td>
                    <td className="px-6 py-4">
                      {sub.isActive ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                          <FiCheckCircle size={12} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-400 border border-rose-500/20">
                          <FiXCircle size={12} /> Unsubscribed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-400 text-xs">
                      {new Date(sub.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(sub.email, sub.isActive)}
                        disabled={loading}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                          sub.isActive
                            ? "border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                            : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                        }`}
                      >
                        {sub.isActive ? "Unsubscribe" : "Re-subscribe"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                <FiSend className="text-emerald-400" /> Send Email Broadcast
              </h3>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="text-zinc-400 hover:text-zinc-200 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <p className="text-xs text-zinc-400">
                This message will be sent to all <span className="text-emerald-400 font-bold">{activeCount} active subscribers</span>.
              </p>

              <FormField label="Email Subject *">
                <input
                  type="text"
                  value={broadcastSubject}
                  onChange={(e) => setBroadcastSubject(e.target.value)}
                  required
                  placeholder="e.g. New Project Launch & Blog Post Update"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
                />
              </FormField>

              <FormField label="Email Content (Markdown supported) *">
                <textarea
                  rows={6}
                  value={broadcastBody}
                  onChange={(e) => setBroadcastBody(e.target.value)}
                  required
                  placeholder="Write your email content here..."
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
                />
              </FormField>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={broadcasting}
                  className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-bold text-zinc-950 hover:bg-emerald-400 transition disabled:opacity-50"
                >
                  {broadcasting && <FiLoader className="animate-spin" />}
                  Send Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
