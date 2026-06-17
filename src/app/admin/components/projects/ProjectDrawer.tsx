"use client";

import { useState, useEffect } from "react";
import { Project } from "../../types";
import { adminRequest } from "@/lib/admin-api";
import { FiX, FiLoader } from "react-icons/fi";

// Import structured section components
import OverviewSection from "./sections/OverviewSection";
import CaseStudySection from "./sections/CaseStudySection";
import FeaturesSection from "./sections/FeaturesSection";
import ChallengesSection from "./sections/ChallengesSection";
import ImagesSection from "./sections/ImagesSection";

interface ProjectDrawerProps {
  project: Project | null; // Null means creating a new project
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  onShowMessage: (text: string, type: "success" | "error") => void;
}

type EditSection = "overview" | "caseStudy" | "featuresMetrics" | "challenges" | "images" | null;

const DEFAULT_FORM_STATE: Partial<Project> = {
  title: "",
  tagline: "",
  description: "",
  live: "",
  code: "",
  sourceNote: "",
  order: 0,
  problem: "",
  architecture: "",
  futureEnhancements: "",
  features: [],
  metrics: [],
  devOps: [],
  tags: [],
  challengeSolutions: [],
  images: [],
};

export default function ProjectDrawer({
  project,
  isOpen,
  onClose,
  onRefresh,
  onShowMessage,
}: ProjectDrawerProps) {
  const [activeSection, setActiveSection] = useState<EditSection>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>(DEFAULT_FORM_STATE);

  const isNewProject = project === null;

  // Initialize value from project prop when drawer opens
  useEffect(() => {
    if (project) {
      setFormData(project);
    } else {
      setFormData(DEFAULT_FORM_STATE);
    }
    setActiveSection(null);
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleFormChange = (fields: Partial<Project>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleSaveSection = async (section: EditSection) => {
    if (!project?.id) {
      onShowMessage("Project ID not found. Cannot update project.", "error");
      return;
    }

    setLoading(true);

    // Filter payload to only what's changed/defined in current state to prevent validation issues,
    // or build the full payload combining existing project details with updated section details.
    const payload = {
      title: section === "overview" ? formData.title : project.title,
      tagline: section === "overview" ? formData.tagline : project.tagline,
      description: section === "overview" ? formData.description : project.description,
      live: section === "overview" ? formData.live : project.live,
      code: section === "overview" ? formData.code : project.code,
      sourceNote: section === "overview" ? formData.sourceNote : project.sourceNote,
      order: section === "overview" ? Number(formData.order) : project.order,

      problem: section === "caseStudy" ? formData.problem : project.problem,
      architecture: section === "caseStudy" ? formData.architecture : project.architecture,
      futureEnhancements: section === "caseStudy" ? formData.futureEnhancements : project.futureEnhancements,

      features: section === "featuresMetrics" ? formData.features : project.features,
      metrics: section === "featuresMetrics" ? formData.metrics : project.metrics,
      devOps: section === "featuresMetrics" ? formData.devOps : project.devOps,
      tags: section === "featuresMetrics" ? formData.tags : project.tags,

      challengeSolutions: section === "challenges" ? formData.challengeSolutions : project.challengeSolutions,
      images: section === "images" ? formData.images : project.images,
    };

    try {
      await adminRequest(`/api/projects/${project.id}`, "PUT", payload);
      onShowMessage("Section updated successfully!", "success");
      setActiveSection(null);
      onRefresh();
    } catch (err: any) {
      console.error(err);
      onShowMessage(err.message || "Failed to save project data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.images || formData.images.length === 0) {
      onShowMessage("Please upload at least one image before saving.", "error");
      return;
    }

    setLoading(true);

    try {
      await adminRequest("/api/projects", "POST", formData);
      onShowMessage("Project created successfully!", "success");
      onClose();
      onRefresh();
    } catch (err: any) {
      console.error(err);
      onShowMessage(err.message || "Failed to create project", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-zinc-955/65 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl border-l border-zinc-900 bg-zinc-950 px-6 py-6 shadow-2xl transition-transform duration-300 ease-out overflow-y-auto animate-in slide-in-from-right">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-zinc-100">
              {isNewProject ? "Create New Project" : "Project Details"}
            </h3>
            <p className="text-xs text-zinc-455 mt-1">
              {isNewProject ? "Fill out all details to publish" : "Click any section to edit inline"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition"
          >
            <FiX size={20} />
          </button>
        </div>

        {isNewProject ? (
          /* FULL CREATE FORM */
          <form onSubmit={handleCreateNewProject} className="space-y-6 animate-in fade-in duration-200">
            <OverviewSection
              formData={formData}
              onChange={handleFormChange}
              isEditing={true}
              loading={loading}
              onEdit={() => {}}
              onSave={() => {}}
              onCancel={() => {}}
              isNewProject={true}
            />

            <CaseStudySection
              formData={formData}
              onChange={handleFormChange}
              isEditing={true}
              loading={loading}
              onEdit={() => {}}
              onSave={() => {}}
              onCancel={() => {}}
              isNewProject={true}
            />

            <FeaturesSection
              formData={formData}
              onChange={handleFormChange}
              isEditing={true}
              loading={loading}
              onEdit={() => {}}
              onSave={() => {}}
              onCancel={() => {}}
              isNewProject={true}
            />

            <ChallengesSection
              formData={formData}
              onChange={handleFormChange}
              isEditing={true}
              loading={loading}
              onEdit={() => {}}
              onSave={() => {}}
              onCancel={() => {}}
              isNewProject={true}
            />

            <ImagesSection
              formData={formData}
              onChange={handleFormChange}
              isEditing={true}
              loading={loading}
              onEdit={() => {}}
              onSave={() => {}}
              onCancel={() => {}}
              onShowMessage={onShowMessage}
              isNewProject={true}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-zinc-800 bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-zinc-455 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-zinc-100 px-6 py-2.5 text-sm font-bold text-zinc-955 shadow hover:bg-zinc-50 disabled:opacity-50"
              >
                {loading && <FiLoader className="animate-spin" size={14} />}
                Create Project
              </button>
            </div>
          </form>
        ) : (
          /* READ-ONLY VIEW WITH INLINE EDITING SECTIONS */
          <div className="space-y-6 animate-in fade-in duration-200">
            <OverviewSection
              formData={formData}
              onChange={handleFormChange}
              isEditing={activeSection === "overview"}
              loading={loading}
              onEdit={() => setActiveSection("overview")}
              onSave={() => handleSaveSection("overview")}
              onCancel={() => {
                setActiveSection(null);
                setFormData(project); // Reset section edits on cancel
              }}
            />

            <CaseStudySection
              formData={formData}
              onChange={handleFormChange}
              isEditing={activeSection === "caseStudy"}
              loading={loading}
              onEdit={() => setActiveSection("caseStudy")}
              onSave={() => handleSaveSection("caseStudy")}
              onCancel={() => {
                setActiveSection(null);
                setFormData(project);
              }}
            />

            <FeaturesSection
              formData={formData}
              onChange={handleFormChange}
              isEditing={activeSection === "featuresMetrics"}
              loading={loading}
              onEdit={() => setActiveSection("featuresMetrics")}
              onSave={() => handleSaveSection("featuresMetrics")}
              onCancel={() => {
                setActiveSection(null);
                setFormData(project);
              }}
            />

            <ChallengesSection
              formData={formData}
              onChange={handleFormChange}
              isEditing={activeSection === "challenges"}
              loading={loading}
              onEdit={() => setActiveSection("challenges")}
              onSave={() => handleSaveSection("challenges")}
              onCancel={() => {
                setActiveSection(null);
                setFormData(project);
              }}
            />

            <ImagesSection
              formData={formData}
              onChange={handleFormChange}
              isEditing={activeSection === "images"}
              loading={loading}
              onEdit={() => setActiveSection("images")}
              onSave={() => handleSaveSection("images")}
              onCancel={() => {
                setActiveSection(null);
                setFormData(project);
              }}
              onShowMessage={onShowMessage}
            />
          </div>
        )}
      </div>
    </>
  );
}
