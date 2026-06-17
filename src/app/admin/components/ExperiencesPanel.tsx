"use client";

import { useState } from "react";
import { Experience } from "../types";
import { adminRequest } from "@/lib/admin-api";
import { FiPlus, FiTrash2, FiEdit2, FiX, FiMove } from "react-icons/fi";
import FormField from "./ui/FormField";
import FormActions from "./ui/FormActions";
import PageHeader from "./ui/PageHeader";
import AdminMessage from "./ui/AdminMessage";

interface ExperiencesPanelProps {
  initialExperiences: Experience[];
  onRefresh: () => void;
}

const EMPLOYMENT_TYPES = [
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
  { value: "Freelance", label: "Freelance" },
];

const WORK_MODES = [
  { value: "On-site", label: "On-site" },
  { value: "Remote", label: "Remote" },
  { value: "Hybrid", label: "Hybrid" },
];

export default function ExperiencesPanel({
  initialExperiences,
  onRefresh,
}: ExperiencesPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [period, setPeriod] = useState("");
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState("");
  const [workMode, setWorkMode] = useState("On-site");
  const [isCurrent, setIsCurrent] = useState(false);
  const [tagline, setTagline] = useState("");
  const [summary, setSummary] = useState("");
  const [highlightsInput, setHighlightsInput] = useState("");
  const [techStackInput, setTechStackInput] = useState("");
  const [architecture, setArchitecture] = useState("");
  const [order, setOrder] = useState(0);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [draggedExp, setDraggedExp] = useState<Experience | null>(null);

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
  };

  const resetForm = () => {
    setEditingId(null);
    setCompany("");
    setRole("");
    setEmploymentType("Full-time");
    setPeriod("");
    setDuration("");
    setLocation("");
    setWorkMode("On-site");
    setIsCurrent(false);
    setTagline("");
    setSummary("");
    setHighlightsInput("");
    setTechStackInput("");
    setArchitecture("");
    setOrder(0);
    setShowForm(false);
  };

  const handleEdit = (exp: Experience) => {
    setEditingId(exp.id);
    setCompany(exp.company);
    setRole(exp.role);
    setEmploymentType(exp.employmentType);
    setPeriod(exp.period);
    setDuration(exp.duration);
    setLocation(exp.location);
    setWorkMode(exp.workMode);
    setIsCurrent(exp.isCurrent || false);
    setTagline(exp.tagline);
    setSummary(exp.summary);
    setHighlightsInput(exp.highlights.join("\n"));
    setTechStackInput(exp.techStack.join(", "));
    setArchitecture(exp.architecture || "");
    setOrder(exp.order);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    const highlights = highlightsInput
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const techStack = techStackInput
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const payload = {
      company,
      role,
      employmentType,
      period,
      duration,
      location,
      workMode,
      isCurrent,
      tagline,
      summary,
      highlights,
      techStack,
      architecture: architecture || null,
      order: Number(order),
    };

    try {
      if (editingId) {
        await adminRequest(`/api/experiences/${editingId}`, "PUT", payload);
        showMessage("Experience updated successfully!", "success");
      } else {
        await adminRequest("/api/experiences", "POST", payload);
        showMessage("Experience added successfully!", "success");
      }
      resetForm();
      onRefresh();
    } catch (err: any) {
      console.error(err);
      showMessage(err.message || "Operation failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;
    setMessage({ text: "", type: "" });

    try {
      await adminRequest(`/api/experiences/${id}`, "DELETE");
      showMessage("Experience deleted successfully!", "success");
      onRefresh();
    } catch (err: any) {
      console.error(err);
      showMessage(err.message || "Failed to delete experience", "error");
    }
  };

  // Drag and drop handlers
  const handleDragStart = (exp: Experience) => {
    setDraggedExp(exp);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetExp: Experience) => {
    if (!draggedExp || draggedExp.id === targetExp.id) return;

    const sortedExps = [...initialExperiences].sort((a, b) => a.order - b.order);
    const draggedIndex = sortedExps.findIndex((e) => e.id === draggedExp.id);
    const targetIndex = sortedExps.findIndex((e) => e.id === targetExp.id);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const updatedExps = [...sortedExps];
    updatedExps.splice(draggedIndex, 1);
    updatedExps.splice(targetIndex, 0, draggedExp);

    try {
      const promises = updatedExps.map((exp, index) => {
        const newOrder = index;
        if (exp.order !== newOrder) {
          return adminRequest(`/api/experiences/${exp.id}`, "PUT", { order: newOrder });
        }
        return Promise.resolve();
      });
      await Promise.all(promises);
      onRefresh();
    } catch (err: any) {
      console.error("Failed to update experiences order:", err);
      showMessage("Failed to update experience ordering", "error");
    } finally {
      setDraggedExp(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Work Experience"
        description="Manage your career history timeline"
        actionLabel="Add Role"
        actionIcon={FiPlus}
        onAction={() => setShowForm(true)}
        showAction={!showForm}
      />

      <AdminMessage
        text={message.text}
        type={message.type as "success" | "error" | ""}
        onDismiss={() => setMessage({ text: "", type: "" })}
      />

      {showForm ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md animate-in fade-in duration-300"
        >
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h4 className="font-bold text-zinc-200">
              {editingId ? "Edit Experience" : "Add New Experience"}
            </h4>
            <button
              type="button"
              onClick={resetForm}
              className="text-zinc-400 transition hover:text-zinc-200"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              label="Company Name"
              required
              value={company}
              onChange={setCompany}
            />

            <FormField
              label="Job Role / Title"
              required
              value={role}
              onChange={setRole}
            />

            <FormField
              label="Employment Type"
              type="select"
              required
              options={EMPLOYMENT_TYPES}
              value={employmentType}
              onChange={setEmploymentType}
            />

            <FormField
              label="Work Mode"
              type="select"
              required
              options={WORK_MODES}
              value={workMode}
              onChange={setWorkMode}
            />

            <FormField
              label="Period (e.g. Jan 2026 – Present)"
              required
              value={period}
              onChange={setPeriod}
            />

            <FormField
              label="Duration (e.g. 5 mos)"
              required
              value={duration}
              onChange={setDuration}
            />

            <FormField
              label="Location"
              required
              value={location}
              onChange={setLocation}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 flex items-center h-full pt-6">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isCurrent}
                    onChange={(e) => setIsCurrent(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-800 bg-zinc-950 accent-emerald-500"
                  />
                  <span className="text-sm font-semibold text-zinc-300">Current Job</span>
                </label>
              </div>
              <FormField
                label="Order"
                type="number"
                required
                value={order}
                onChange={(val) => setOrder(Number(val))}
              />
            </div>

            <FormField
              label="Tagline"
              required
              fullWidth
              value={tagline}
              onChange={setTagline}
            />

            <FormField
              label="Summary / Responsibilities"
              type="textarea"
              rows={3}
              required
              fullWidth
              value={summary}
              onChange={setSummary}
            />

            <FormField
              label="Highlights (one per line)"
              type="textarea"
              rows={4}
              required
              fullWidth
              value={highlightsInput}
              onChange={setHighlightsInput}
              placeholder="Developed REST APIs&#10;Optimized database queries"
            />

            <FormField
              label="Tech Stack (comma-separated values)"
              required
              fullWidth
              value={techStackInput}
              onChange={setTechStackInput}
              placeholder="Node.js, Express, PostgreSQL"
            />

            <FormField
              label="Architecture (Optional)"
              type="textarea"
              rows={3}
              fullWidth
              value={architecture}
              onChange={setArchitecture}
            />
          </div>

          <FormActions
            loading={loading}
            submitLabel={editingId ? "Save Changes" : "Create Experience"}
            onCancel={resetForm}
          />
        </form>
      ) : (
        <div className="space-y-4">
          {initialExperiences
            .sort((a, b) => a.order - b.order)
            .map((exp) => (
              <div
                key={exp.id}
                draggable
                onDragStart={() => handleDragStart(exp)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(exp)}
                className={`group rounded-2xl border p-5 backdrop-blur-md flex flex-col md:flex-row md:items-start md:justify-between gap-4 hover:border-zinc-700/80 transition duration-300 cursor-grab active:cursor-grabbing ${
                  draggedExp?.id === exp.id
                    ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                    : "border-zinc-800 bg-zinc-900/10"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="mt-1 text-zinc-500 opacity-60 group-hover:opacity-100 transition duration-200">
                    <FiMove size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-100 text-lg">
                      {exp.role} <span className="text-zinc-500 font-medium">at</span> {exp.company}
                    </h4>
                    <div className="flex flex-wrap gap-2 text-xs text-zinc-400 mt-1.5 uppercase font-semibold tracking-wider">
                      <span>{exp.employmentType}</span>
                      <span>•</span>
                      <span>{exp.workMode}</span>
                      <span>•</span>
                      <span>{exp.period}</span>
                      <span>•</span>
                      <span className="text-emerald-500">Order: {exp.order}</span>
                    </div>
                    <p className="text-sm text-zinc-400 mt-2">{exp.tagline}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 self-end md:self-start">
                  <button
                    type="button"
                    onClick={() => handleEdit(exp)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 transition active:scale-95"
                  >
                    <FiEdit2 size={13} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(exp.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/15 transition active:scale-95"
                  >
                    <FiTrash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
