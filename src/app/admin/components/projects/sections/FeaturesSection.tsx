"use client";

import { useEffect, useState } from "react";
import { FiEdit3, FiLoader, FiCheck } from "react-icons/fi";
import { Project } from "../../../types";
import FormField from "../../ui/FormField";

interface FeaturesSectionProps {
  formData: Partial<Project>;
  onChange: (fields: Partial<Project>) => void;
  isEditing: boolean;
  loading: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  isNewProject?: boolean;
}

export default function FeaturesSection({
  formData,
  onChange,
  isEditing,
  loading,
  onEdit,
  onSave,
  onCancel,
  isNewProject = false,
}: FeaturesSectionProps) {
  const showControls = !isNewProject;

  const [featuresText, setFeaturesText] = useState("");
  const [metricsText, setMetricsText] = useState("");
  const [devOpsText, setDevOpsText] = useState("");
  const [tagsText, setTagsText] = useState("");

  useEffect(() => {
    setFeaturesText(formData.features?.join("\n") || "");
    setMetricsText(formData.metrics?.join("\n") || "");
    setDevOpsText(formData.devOps?.join(", ") || "");
    setTagsText(formData.tags?.join(", ") || "");
  }, [formData.features, formData.metrics, formData.devOps, formData.tags]);

  const handleFieldChange = (field: "features" | "metrics" | "devOps" | "tags", value: string) => {
    if (field === "features") {
      setFeaturesText(value);
      onChange({ features: value.split("\n").map((t) => t.trim()).filter(Boolean) });
    } else if (field === "metrics") {
      setMetricsText(value);
      onChange({ metrics: value.split("\n").map((t) => t.trim()).filter(Boolean) });
    } else if (field === "devOps") {
      setDevOpsText(value);
      onChange({ devOps: value.split(",").map((t) => t.trim()).filter(Boolean) });
    } else if (field === "tags") {
      setTagsText(value);
      onChange({ tags: value.split(",").map((t) => t.trim()).filter(Boolean) });
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-900 bg-zinc-900/10 p-5 mb-6 hover:border-zinc-800/80 transition group relative">
      {showControls && (
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-emerald-400 text-xs tracking-wide uppercase">
            3. Features, Metrics & Tags
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
              3. Features, Metrics & Tags
            </h4>
          )}
          <FormField
            label="Key Features (one per line)"
            type="textarea"
            rows={3}
            required
            value={featuresText}
            onChange={(val) => handleFieldChange("features", val)}
          />
          <FormField
            label="Key Metrics (one per line)"
            type="textarea"
            rows={2}
            required
            value={metricsText}
            onChange={(val) => handleFieldChange("metrics", val)}
          />
          <FormField
            label="DevOps / Infra Tags (comma-separated)"
            required
            value={devOpsText}
            onChange={(val) => handleFieldChange("devOps", val)}
            placeholder="Docker, AWS, CI/CD"
          />
          <FormField
            label="General Tech Tags (comma-separated)"
            required
            value={tagsText}
            onChange={(val) => handleFieldChange("tags", val)}
            placeholder="React, Node.js, Postgres"
          />
        </div>
      ) : (
        <div className="space-y-4 text-xs text-zinc-400">
          <div>
            <h5 className="font-bold text-zinc-300 mb-1.5">Key Product Features</h5>
            <ul className="list-disc pl-4 space-y-1">
              {featuresText.split("\n").filter(Boolean).length > 0 ? (
                featuresText.split("\n").map((f, i) => <li key={i}>{f}</li>)
              ) : (
                <li>No features listed</li>
              )}
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-zinc-300 mb-1.5">Impact / Metrics</h5>
            <ul className="list-disc pl-4 space-y-1">
              {metricsText.split("\n").filter(Boolean).length > 0 ? (
                metricsText.split("\n").map((m, i) => <li key={i}>{m}</li>)
              ) : (
                <li>No metrics recorded</li>
              )}
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-zinc-300 mb-2">DevOps Stack</h5>
            <div className="flex flex-wrap gap-1.5">
              {devOpsText
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
                .map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-450 font-semibold"
                  >
                    {t}
                  </span>
                ))}
            </div>
          </div>
          <div>
            <h5 className="font-bold text-zinc-300 mb-2">Frontend & Backend Stack</h5>
            <div className="flex flex-wrap gap-1.5">
              {tagsText
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
                .map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded bg-emerald-500/5 border border-emerald-500/10 text-[10px] text-emerald-400 font-semibold"
                  >
                    {t}
                  </span>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
