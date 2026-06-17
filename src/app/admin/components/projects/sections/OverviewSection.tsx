"use client";

import { FiEdit3, FiLoader, FiCheck, FiExternalLink, FiGithub } from "react-icons/fi";
import { Project } from "../../../types";
import FormField from "../../ui/FormField";

interface OverviewSectionProps {
  formData: Partial<Project>;
  onChange: (fields: Partial<Project>) => void;
  isEditing: boolean;
  loading: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  isNewProject?: boolean;
}

export default function OverviewSection({
  formData,
  onChange,
  isEditing,
  loading,
  onEdit,
  onSave,
  onCancel,
  isNewProject = false,
}: OverviewSectionProps) {
  const showControls = !isNewProject;

  const {
    title = "",
    tagline = "",
    description = "",
    live = "",
    code = "",
    sourceNote = "",
    order = 0,
  } = formData;

  return (
    <div className="rounded-2xl border border-zinc-900 bg-zinc-900/10 p-5 mb-6 hover:border-zinc-800/80 transition group relative">
      {showControls && (
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-emerald-400 text-xs tracking-wide uppercase">
            1. Project Overview
          </h4>
          {!isEditing ? (
            <button
              type="button"
              onClick={onEdit}
              className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-emerald-450 transition duration-200"
            >
              <FiEdit3 size={13} /> Edit Section
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onSave}
                disabled={loading}
                className="flex items-center gap-1 text-xs font-bold text-emerald-455 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition"
              >
                {loading ? <FiLoader className="animate-spin" size={12} /> : <FiCheck size={13} />}
                Save
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="text-xs font-semibold text-zinc-500 hover:text-zinc-300"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {isEditing || isNewProject ? (
        <div className="space-y-4 animate-in fade-in duration-200">
          {isNewProject && (
            <h4 className="font-bold text-emerald-400 text-xs tracking-wide uppercase mb-2">
              1. Project Overview
            </h4>
          )}
          <FormField
            label="Project Title"
            required
            value={title}
            onChange={(val) => onChange({ title: val })}
          />
          <FormField
            label="Tagline / Subtitle"
            required
            value={tagline}
            onChange={(val) => onChange({ tagline: val })}
          />
          <FormField
            label="Short Description"
            type="textarea"
            required
            value={description}
            onChange={(val) => onChange({ description: val })}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Live Demo URL"
              type="url"
              required
              value={live}
              onChange={(val) => onChange({ live: val })}
            />
            <FormField
              label="GitHub Repo URL"
              type="url"
              required
              value={code}
              onChange={(val) => onChange({ code: val })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Source Note (Optional)"
              value={sourceNote || ""}
              onChange={(val) => onChange({ sourceNote: val || null })}
              placeholder="e.g. Private repo"
            />
            <FormField
              label="Sort Order"
              type="number"
              required
              value={order}
              onChange={(val) => onChange({ order: Number(val) })}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3.5 text-zinc-300 text-sm">
          <div className="border-b border-zinc-900 pb-2">
            <h2 className="text-lg font-bold text-zinc-100">{title || "Untitled Project"}</h2>
            <p className="text-xs text-zinc-400 mt-1 italic">{tagline || "No tagline added"}</p>
          </div>
          <p className="leading-relaxed text-zinc-455 text-xs">
            {description || "No description provided."}
          </p>
          <div className="flex gap-4 pt-2 text-xs text-zinc-450">
            {live && (
              <a href={live} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-emerald-450 hover:underline">
                <FiExternalLink size={12} /> Live Site
              </a>
            )}
            {code && (
              <a href={code} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-zinc-300 hover:underline">
                <FiGithub size={12} /> GitHub
              </a>
            )}
            {sourceNote && <span className="text-zinc-550">Note: {sourceNote}</span>}
            <span className="text-zinc-600 ml-auto">Order weight: {order}</span>
          </div>
        </div>
      )}
    </div>
  );
}
