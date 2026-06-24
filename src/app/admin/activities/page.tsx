"use client";

import { useAdminData } from "../hooks/useAdminData";
import ActivitiesPanel from "../components/ActivitiesPanel";
import AdminPageLoader from "../components/ui/AdminPageLoader";
import AdminErrorState from "../components/ui/AdminErrorState";
import { Activity } from "../types";

export default function ActivitiesPage() {
  const { data: activities, loading, error, refetch } = useAdminData<Activity[]>(
    (data) => data.activities || [],
    "Failed to load activities list"
  );

  if (loading) {
    return <AdminPageLoader variant="projects" />;
  }

  if (error || !activities) {
    return <AdminErrorState message={error || "Could not fetch activities"} onRetry={refetch} />;
  }

  return <ActivitiesPanel initialActivities={activities} onRefresh={refetch} />;
}
