"use client";

import { useAdminData } from "../hooks/useAdminData";
import ExperiencesPanel from "../components/ExperiencesPanel";
import AdminPageLoader from "../components/ui/AdminPageLoader";
import AdminErrorState from "../components/ui/AdminErrorState";
import { Experience } from "../types";

export default function ExperiencesPage() {
  const { data: experiences, loading, error, refetch } = useAdminData<Experience[]>(
    (data) => data.experiences || [],
    "Failed to load experiences list"
  );

  if (loading) {
    return <AdminPageLoader variant="experiences" />;
  }

  if (error || !experiences) {
    return <AdminErrorState message={error || "Could not fetch experiences"} onRetry={refetch} />;
  }

  return <ExperiencesPanel initialExperiences={experiences} onRefresh={refetch} />;
}
