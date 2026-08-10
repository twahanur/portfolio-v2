"use client";

import { useState, useEffect } from "react";
import { Project } from "../types";
import { adminRequest } from "@/lib/admin-api";
import { FiPlus, FiMove, FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";
import Image from "next/image";
import ProjectDrawer from "./projects/ProjectDrawer";
import PageHeader from "./ui/PageHeader";
import AdminMessage from "./ui/AdminMessage";

interface ProjectsPanelProps {
  initialProjects: Project[];
  onRefresh: () => void;
}

export default function ProjectsPanel({ initialProjects, onRefresh }: ProjectsPanelProps) {
  const [projectsList, setProjectsList] = useState<Project[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [draggedProject, setDraggedProject] = useState<Project | null>(null);
  const [dragOverProjectId, setDragOverProjectId] = useState<string | null>(null);

  useEffect(() => {
    setProjectsList(initialProjects);
  }, [initialProjects]);

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
  };

  const handleLinkedInShare = (proj: Project) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const projectUrl = `${baseUrl}/project/${proj.id}`;
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(projectUrl)}`;
    window.open(shareUrl, "_blank", "width=600,height=600,noopener,noreferrer");
  };

  const handleEdit = (proj: Project) => {
    setSelectedProject(proj);
    setIsDrawerOpen(true);
  };

  const handleAdd = () => {
    setSelectedProject(null);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setMessage({ text: "", type: "" });

    try {
      await adminRequest(`/api/projects/${id}`, "DELETE");
      showMessage("Project deleted successfully!", "success");
      onRefresh();
    } catch (err: any) {
      console.error(err);
      showMessage(err.message || "Failed to delete project", "error");
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, proj: Project) => {
    setDraggedProject(proj);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", proj.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e: React.DragEvent, projId: string) => {
    e.preventDefault();
    if (draggedProject && draggedProject.id !== projId) {
      setDragOverProjectId(projId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, projId: string) => {
    e.preventDefault();
    if (dragOverProjectId === projId) {
      setDragOverProjectId(null);
    }
  };

  const handleDrop = async (e: React.DragEvent, targetProj: Project) => {
    e.preventDefault();
    setDragOverProjectId(null);

    if (!draggedProject || draggedProject.id === targetProj.id) return;

    const currentSorted = [...projectsList].sort((a, b) => a.order - b.order);
    const draggedIndex = currentSorted.findIndex((p) => p.id === draggedProject.id);
    const targetIndex = currentSorted.findIndex((p) => p.id === targetProj.id);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const updatedProjects = [...currentSorted];
    updatedProjects.splice(draggedIndex, 1);
    updatedProjects.splice(targetIndex, 0, draggedProject);

    const reordered = updatedProjects.map((proj, index) => ({
      ...proj,
      order: index,
    }));

    // Optimistic UI update
    setProjectsList(reordered);
    setDraggedProject(null);

    try {
      const payload = reordered.map((p) => ({ id: p.id, order: p.order }));
      await adminRequest("/api/projects/reorder", "PUT", { orders: payload });
      showMessage("Project order updated successfully!", "success");
      onRefresh();
    } catch (err: any) {
      console.error("Failed to update projects order:", err);
      showMessage(err.message || "Failed to update project ordering", "error");
      setProjectsList(initialProjects);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Manage your work portfolio case studies (Drag and drop items to reorder)"
        actionLabel="Add Project"
        actionIcon={FiPlus}
        onAction={handleAdd}
        showAction={true}
      />

      <AdminMessage
        text={message.text}
        type={message.type as "success" | "error" | ""}
        onDismiss={() => setMessage({ text: "", type: "" })}
      />

      <div className="flex flex-col gap-3.5">
        {[...projectsList]
          .sort((a, b) => a.order - b.order)
          .map((proj) => {
            const featuredImage = proj.images.find((img) => img.isFeatured) || proj.images[0];
            const isBeingDragged = draggedProject?.id === proj.id;
            const isDragOver = dragOverProjectId === proj.id;

            return (
              <div
                key={proj.id}
                draggable
                onDragStart={(e) => handleDragStart(e, proj)}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, proj.id)}
                onDragLeave={(e) => handleDragLeave(e, proj.id)}
                onDrop={(e) => handleDrop(e, proj)}
                className={`group rounded-2xl border p-4 bg-zinc-900/20 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 cursor-grab active:cursor-grabbing hover:border-purple-500/50 ${
                  isBeingDragged
                    ? "opacity-30 border-2 border-dashed border-purple-500/80 bg-purple-500/5 scale-[0.98]"
                    : isDragOver
                    ? "border-2 border-purple-500 bg-purple-500/15 shadow-[0_0_30px_rgba(168,85,247,0.35)] translate-x-2 ring-2 ring-purple-400/30"
                    : "border-zinc-800"
                }`}
              >
                <div className="flex items-center gap-4 flex-grow min-w-0">
                  <div className="flex items-center gap-2 text-zinc-500 group-hover:text-purple-400 transition shrink-0">
                    <FiMove size={18} className="animate-pulse" />
                    <span className="text-[10px] uppercase font-bold tracking-widest hidden sm:inline text-zinc-500 group-hover:text-purple-400">
                      Drag
                    </span>
                  </div>
                  {featuredImage ? (
                    <div className="relative h-12 w-20 overflow-hidden rounded-lg bg-zinc-950 shrink-0 border border-zinc-850">
                      <Image src={featuredImage.url} alt={proj.title} fill className="object-cover" unoptimized />
                    </div>
                  ) : (
                    <div className="h-12 w-20 bg-zinc-900 rounded-lg flex items-center justify-center text-[10px] text-zinc-500 font-bold shrink-0 border border-zinc-850">
                      NO IMAGE
                    </div>
                  )}
                  <div className="min-w-0">
                    <h4 className="font-bold text-zinc-100 text-base truncate">{proj.title}</h4>
                    <p className="text-xs text-zinc-400 mt-0.5 truncate">{proj.tagline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 justify-end shrink-0">
                  <span className="px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-[11px] text-purple-300 font-extrabold uppercase tracking-wider">
                    Order: {proj.order}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleLinkedInShare(proj)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/25 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-400 hover:bg-blue-500/20 transition active:scale-95"
                  >
                    <FaLinkedin size={13} /> Share
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEdit(proj)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 transition active:scale-95"
                  >
                    <FiEdit2 size={13} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(proj.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/15 transition active:scale-95"
                  >
                    <FiTrash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      <ProjectDrawer
        project={selectedProject}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onRefresh={onRefresh}
        onShowMessage={showMessage}
      />
    </div>
  );
}
