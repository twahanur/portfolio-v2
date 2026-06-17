"use client";

import { FiEdit3, FiLoader, FiCheck } from "react-icons/fi";
import { Project } from "../../../types";
import FormField from "../../ui/FormField";

interface CaseStudySectionProps {
  formData: Partial<Project>;
  onChange: (fields: Partial<Project>) => void;
  isEditing: boolean;
  loading: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  isNewProject?: boolean;
}

export default function CaseStudySection({
  formData,
  onChange,
  isEditing,
  loading,
  onEdit,
  onSave,
  onCancel,
  isNewProject = false,
}: CaseStudySectionProps) {
  const showControls = !isNewProject;

  const {
    problem = "",
    architecture = "",
    futureEnhancements = "",
  } = formData;

  return (
    <div className="rounded-2xl border border-zinc-900 bg-zinc-900/10 p-5 mb-6 hover:border-zinc-800/80 transition group relative">
      {showControls && (
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-emerald-400 text-xs tracking-wide uppercase">
            2. Case Study Details
          </h4>
          {!isEditing ? (
            <button
              type="button"
              onClick={onEdit}
              className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-emerald-455 transition duration-200"
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
              2. Case Study Details
            </h4>
          )}
          <FormField
            label="The Problem"
            type="textarea"
            rows={3}
            required
            value={problem}
            onChange={(val) => onChange({ problem: val })}
          />
          <FormField
            label="Technical Architecture"
            type="textarea"
            rows={3}
            required
            value={architecture}
            onChange={(val) => onChange({ architecture: val })}
          />
          <FormField
            label="Future Enhancements"
            type="textarea"
            rows={2}
            required
            value={futureEnhancements}
            onChange={(val) => onChange({ futureEnhancements: val })}
          />
        </div>
      ) : (
        <div className="space-y-4 text-xs text-zinc-400">
          <div>
            <h5 className="font-bold text-zinc-300 mb-1">The Problem Statement</h5>
            <p className="leading-relaxed">{problem || "Define the business problem..."}</p>
          </div>
          <div>
            <h5 className="font-bold text-zinc-300 mb-1">Architecture & Tech Decisions</h5>
            <p className="leading-relaxed">{architecture || "Explain why technologies were chosen..."}</p>
          </div>
          <div>
            <h5 className="font-bold text-zinc-300 mb-1">Future Scope</h5>
            <p className="leading-relaxed">{futureEnhancements || "What features are planned next..."}</p>
          </div>
        </div>
      )}
    </div>
  );
}
