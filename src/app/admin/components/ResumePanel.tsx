"use client";

import { useState } from "react";
import { ResumeEntry } from "../resume/page";
import { adminRequest } from "@/lib/admin-api";
import {
  FiFileText,
  FiPlus,
  FiLoader,
  FiExternalLink,
  FiCheckCircle,
  FiEdit3,
  FiTrash2,
  FiXCircle,
  FiStar,
} from "react-icons/fi";
import FormField from "./ui/FormField";
import PageHeader from "./ui/PageHeader";
import AdminMessage from "./ui/AdminMessage";

interface ResumePanelProps {
  initialResumes: ResumeEntry[];
  onRefresh: () => void;
}

export default function ResumePanel({ initialResumes, onRefresh }: ResumePanelProps) {
  const activeResume = initialResumes.find((r) => r.isActive) || initialResumes[0];

  const [editingId, setEditingId] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");
  const [isActive, setIsActive] = useState(false);

  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
  };

  const resetForm = () => {
    setEditingId(null);
    setUrl("");
    setLabel("");
    setIsActive(false);
  };

  const handleStartEdit = (resume: ResumeEntry) => {
    setEditingId(resume.id);
    setUrl(resume.url);
    setLabel(resume.label);
    setIsActive(resume.isActive);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      if (editingId) {
        await adminRequest(`/api/resume/${editingId}`, "PUT", {
          url,
          label,
          isActive,
        });
        showMessage("Resume updated successfully!", "success");
      } else {
        await adminRequest("/api/resume", "POST", {
          url,
          label,
          isActive,
        });
        showMessage("New resume added successfully!", "success");
      }
      resetForm();
      onRefresh();
    } catch (err: any) {
      console.error(err);
      showMessage(err.message || "Failed to save resume details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (id: string) => {
    setActionLoadingId(id);
    setMessage({ text: "", type: "" });
    try {
      await adminRequest(`/api/resume/${id}/activate`, "PATCH");
      showMessage("Resume activated successfully! It is now live for public downloads.", "success");
      onRefresh();
    } catch (err: any) {
      console.error(err);
      showMessage(err.message || "Failed to activate resume", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string, resumeLabel: string) => {
    if (!confirm(`Are you sure you want to delete "${resumeLabel}"?`)) return;
    setActionLoadingId(id);
    setMessage({ text: "", type: "" });
    try {
      await adminRequest(`/api/resume/${id}`, "DELETE");
      showMessage("Resume deleted successfully!", "success");
      if (editingId === id) resetForm();
      onRefresh();
    } catch (err: any) {
      console.error(err);
      showMessage(err.message || "Failed to delete resume", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resume Manager"
        description="Manage your stored resume versions, activate public CVs, and preview links."
        showAction={false}
      />

      <AdminMessage
        text={message.text}
        type={message.type as "success" | "error" | ""}
        onDismiss={() => setMessage({ text: "", type: "" })}
      />

      {/* Overview Top Card */}
      {activeResume && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 shadow backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FiStar size={20} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block">
                Currently Active Public Resume
              </span>
              <h3 className="text-base font-bold text-zinc-100">{activeResume.label}</h3>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <a
              href={activeResume.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/20 transition flex items-center gap-1.5"
            >
              <FiExternalLink size={14} /> View Active Document
            </a>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Resume List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-zinc-900 bg-zinc-900/10 p-6 shadow backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                <FiFileText /> System Resumes ({initialResumes.length})
              </h3>
              {editingId && (
                <button
                  onClick={resetForm}
                  className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1"
                >
                  <FiXCircle /> Clear Selection
                </button>
              )}
            </div>

            {initialResumes.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 text-xs">
                No resumes stored in system yet. Use the form to add your first resume.
              </div>
            ) : (
              <div className="space-y-3">
                {initialResumes.map((resume) => (
                  <div
                    key={resume.id}
                    className={`rounded-xl border p-4 transition-all ${
                      resume.isActive
                        ? "border-emerald-500/40 bg-emerald-950/20"
                        : editingId === resume.id
                        ? "border-purple-500/40 bg-purple-950/20"
                        : "border-zinc-900 bg-zinc-950/40 hover:border-zinc-800"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-zinc-200">{resume.label}</span>
                          {resume.isActive ? (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-zinc-800/50 border border-zinc-700/30 text-zinc-400 text-[10px] font-medium uppercase">
                              Inactive
                            </span>
                          )}
                        </div>

                        <a
                          href={resume.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-zinc-400 hover:text-emerald-400 flex items-center gap-1 truncate max-w-md transition"
                        >
                          <FiExternalLink size={12} className="shrink-0" />
                          <span className="truncate">{resume.url}</span>
                        </a>

                        <div className="text-[10px] text-zinc-500">
                          Added: {new Date(resume.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                        {!resume.isActive && (
                          <button
                            onClick={() => handleActivate(resume.id)}
                            disabled={actionLoadingId === resume.id}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition flex items-center gap-1.5 disabled:opacity-50"
                            title="Set as active public resume"
                          >
                            {actionLoadingId === resume.id ? (
                              <FiLoader className="animate-spin" size={13} />
                            ) : (
                              <FiCheckCircle size={13} />
                            )}
                            Activate
                          </button>
                        )}

                        <a
                          href={resume.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-semibold hover:bg-zinc-700 transition flex items-center gap-1.5"
                          title="Open and preview document in a new tab"
                        >
                          <FiExternalLink size={13} /> View
                        </a>

                        <button
                          onClick={() => handleStartEdit(resume)}
                          className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition"
                          title="Edit Resume"
                        >
                          <FiEdit3 size={13} />
                        </button>

                        <button
                          onClick={() => handleDelete(resume.id, resume.label)}
                          disabled={actionLoadingId === resume.id}
                          className="p-2 rounded-lg bg-red-950/30 border border-red-900/40 text-red-400 hover:bg-red-900/40 hover:text-red-300 transition disabled:opacity-50"
                          title="Delete Resume"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Add / Edit Form */}
        <div className="lg:col-span-1 rounded-2xl border border-zinc-900 bg-zinc-900/10 p-6 shadow backdrop-blur-md space-y-4">
          <h3 className="text-base font-bold text-zinc-200 border-b border-zinc-900 pb-3 flex items-center gap-2">
            {editingId ? <FiEdit3 className="text-purple-400" /> : <FiPlus className="text-emerald-400" />}
            {editingId ? "Edit Resume" : "Add New Resume"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Document Label"
              required
              placeholder="e.g. Software Engineer 2026, Backend CV"
              value={label}
              onChange={setLabel}
            />

            <FormField
              label="Resume URL (Google Drive / Dropbox / Direct Link)"
              type="url"
              required
              placeholder="https://drive.google.com/file/d/.../view"
              value={url}
              onChange={setUrl}
            />

            <div className="py-1">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-850 bg-zinc-950 accent-emerald-500"
                />
                <span className="text-xs font-semibold text-zinc-350">
                  Set as Active Resume immediately
                </span>
              </label>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-zinc-100 px-4 py-2.5 text-xs font-bold text-zinc-955 shadow hover:bg-zinc-50 disabled:opacity-50 transition active:scale-[0.98]"
              >
                {loading && <FiLoader className="animate-spin" size={13} />}
                {editingId ? "Update Resume" : "Add Resume"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-xs font-semibold text-zinc-300 hover:bg-zinc-850 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

