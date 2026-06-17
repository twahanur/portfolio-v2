"use client";

import { useAdminFetch } from "../hooks/useAdminFetch";
import ResumePanel from "../components/ResumePanel";
import AdminPageLoader from "../components/ui/AdminPageLoader";
import AdminErrorState from "../components/ui/AdminErrorState";

export interface ResumeEntry {
  id: string;
  url: string;
  label: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ResumePage() {
  const { data: resumes, loading, error, refetch } = useAdminFetch<ResumeEntry[]>(
    "/api/resume",
    "Failed to load resume archives"
  );

  if (loading) {
    return <AdminPageLoader variant="default" text="Loading resumes list..." />;
  }

  if (error || !resumes) {
    return <AdminErrorState message={error || "Could not fetch resumes"} onRetry={refetch} />;
  }

  return <ResumePanel initialResumes={resumes} onRefresh={refetch} />;
}
