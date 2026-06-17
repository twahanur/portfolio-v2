"use client";

import { useAdminData } from "../hooks/useAdminData";
import ProjectsPanel from "../components/ProjectsPanel";
import AdminPageLoader from "../components/ui/AdminPageLoader";
import AdminErrorState from "../components/ui/AdminErrorState";
import { Project } from "../types";

export default function ProjectsPage() {
  const { data: projects, loading, error, refetch } = useAdminData<Project[]>(
    (data) => data.projects || [],
    "Failed to load projects list"
  );

  if (loading) {
    return <AdminPageLoader variant="projects" />;
  }

  if (error || !projects) {
    return <AdminErrorState message={error || "Could not fetch projects"} onRetry={refetch} />;
  }

  return <ProjectsPanel initialProjects={projects} onRefresh={refetch} />;
}
