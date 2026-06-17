"use client";

import { useState } from "react";
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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [draggedProject, setDraggedProject] = useState<Project | null>(null);

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
  const handleDragStart = (proj: Project) => {
    setDraggedProject(proj);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetProj: Project) => {
    if (!draggedProject || draggedProject.id === targetProj.id) return;

    const sortedProjects = [...initialProjects].sort((a, b) => a.order - b.order);
    const draggedIndex = sortedProjects.findIndex((p) => p.id === draggedProject.id);
    const targetIndex = sortedProjects.findIndex((p) => p.id === targetProj.id);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const updatedProjects = [...sortedProjects];
    updatedProjects.splice(draggedIndex, 1);
    updatedProjects.splice(targetIndex, 0, draggedProject);

    try {
      const promises = updatedProjects.map((proj, index) => {
        const newOrder = index;
        if (proj.order !== newOrder) {
          return adminRequest(`/api/projects/${proj.id}`, "PUT", { order: newOrder });
        }
        return Promise.resolve();
      });
      await Promise.all(promises);
      onRefresh();
    } catch (err: any) {
      console.error("Failed to update projects order:", err);
      showMessage("Failed to update project ordering", "error");
    } finally {
      setDraggedProject(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Manage your work portfolio case studies"
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

      <div className="flex flex-col gap-4">
        {initialProjects
          .sort((a, b) => a.order - b.order)
          .map((proj) => {
            const featuredImage = proj.images.find((img) => img.isFeatured) || proj.images[0];
            return (
              <div
                key={proj.id}
                draggable
                onDragStart={() => handleDragStart(proj)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(proj)}
                className={`group rounded-2xl border p-4 bg-zinc-900/20 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition duration-300 cursor-grab active:cursor-grabbing hover:border-zinc-700/80 ${
                  draggedProject?.id === proj.id
                    ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                    : "border-zinc-800"
                }`}
              >
                <div className="flex items-center gap-4 flex-grow min-w-0">
                  <FiMove className="text-zinc-500 group-hover:text-zinc-350 transition shrink-0" size={18} />
                  {featuredImage ? (
                    <div className="relative h-12 w-20 overflow-hidden rounded-lg bg-zinc-950 shrink-0 border border-zinc-850">
                      <Image src={featuredImage.url} alt={proj.title} fill className="object-cover" />
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
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
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
