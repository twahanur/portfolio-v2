"use client";

import { useAdminData } from "../hooks/useAdminData";
import AnalyticsPanel, { DetailedAnalyticsData } from "../components/AnalyticsPanel";
import AdminPageLoader from "../components/ui/AdminPageLoader";
import AdminErrorState from "../components/ui/AdminErrorState";

export default function AnalyticsPage() {
  const { data: analyticsData, loading, error, refetch } = useAdminData<DetailedAnalyticsData>(
    (data) => data,
    "Failed to load analytics details",
    "/api/analytics/admin-details"
  );

  if (loading) {
    return <AdminPageLoader variant="overview" />;
  }

  if (error || !analyticsData) {
    return <AdminErrorState message={error || "Could not fetch analytics"} onRetry={refetch} />;
  }

  return <AnalyticsPanel initialData={analyticsData} onRefresh={refetch} />;
}
