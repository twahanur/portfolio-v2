"use client";

import { useState } from "react";
import { ResumeEntry } from "../resume/page";
import { adminRequest } from "@/lib/admin-api";
import { FiFileText, FiPlus, FiLoader, FiExternalLink, FiSettings } from "react-icons/fi";
import FormField from "./ui/FormField";
import PageHeader from "./ui/PageHeader";
import AdminMessage from "./ui/AdminMessage";

interface ResumePanelProps {
  initialResumes: ResumeEntry[];
  onRefresh: () => void;
}

export default function ResumePanel({ initialResumes, onRefresh }: ResumePanelProps) {
  const activeResume = initialResumes.find((r) => r.isActive) || initialResumes[0];

  const [url, setUrl] = useState(activeResume?.url || "");
  const [label, setLabel] = useState(activeResume?.label || "Resume");
  const [isActive, setIsActive] = useState(activeResume?.isActive !== undefined ? activeResume.isActive : true);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      await adminRequest("/api/resume", "POST", {
        url,
        label,
        isActive,
      });
      showMessage("Resume configuration saved successfully!", "success");
      onRefresh();
    } catch (err: any) {
      console.error(err);
      showMessage(err.message || "Failed to save resume details", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resume Manager"
        description="Configure your active professional resume / CV link for public downloads"
        showAction={false}
      />

      <AdminMessage
        text={message.text}
        type={message.type as "success" | "error" | ""}
        onDismiss={() => setMessage({ text: "", type: "" })}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Current Status */}
        <div className="lg:col-span-1 rounded-2xl border border-zinc-900 bg-zinc-900/10 p-5 shadow backdrop-blur-md space-y-4">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
            <FiFileText /> Active Resume Info
          </h3>

          {activeResume ? (
            <div className="space-y-4">
              <div className="rounded-xl bg-zinc-950/40 border border-zinc-900 p-4">
                <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">Document Label</span>
                <span className="text-sm font-bold text-zinc-200 mt-1 block">{activeResume.label}</span>
              </div>

              <div className="rounded-xl bg-zinc-950/40 border border-zinc-900 p-4">
                <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">Public Status</span>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-zinc-350">Active & Redirecting</span>
                </div>
              </div>

              <div className="rounded-xl bg-zinc-950/40 border border-zinc-900 p-4 break-all">
                <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">Resume URL</span>
                <a
                  href={activeResume.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-450 hover:underline mt-1.5 flex items-center gap-1 font-semibold"
                >
                  View Document <FiExternalLink size={12} />
                </a>
              </div>

              <div className="text-[10px] text-zinc-500">
                Last modified: {new Date(activeResume.updatedAt).toLocaleString()}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-zinc-500 italic text-xs">
              No active resume link configured yet.
            </div>
          )}
        </div>

        {/* Right Side: Update Form */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-900 bg-zinc-900/10 p-6 shadow backdrop-blur-md">
          <h3 className="text-base font-bold text-zinc-200 border-b border-zinc-900 pb-3 mb-5 flex items-center gap-2">
            <FiSettings /> Update Resume Configuration
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Resume Document URL (Google Drive, Dropbox, etc.)"
              type="url"
              required
              placeholder="https://drive.google.com/file/d/.../view"
              value={url}
              onChange={setUrl}
            />

            <FormField
              label="Display Label"
              required
              placeholder="e.g. Resume 2026, Backend CV"
              value={label}
              onChange={setLabel}
            />

            <div className="py-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-850 bg-zinc-950 accent-emerald-500"
                />
                <span className="text-xs font-semibold text-zinc-350">Make Active (automatically deactivates previous resume configs)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-zinc-100 px-6 py-2.5 text-xs font-bold text-zinc-955 shadow hover:bg-zinc-50 disabled:opacity-50 transition active:scale-[0.98]"
            >
              {loading && <FiLoader className="animate-spin" size={13} />}
              Save Configuration
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
