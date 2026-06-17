"use client";

import { useAdminFetch } from "../hooks/useAdminFetch";
import LeadsPanel from "../components/LeadsPanel";
import AdminPageLoader from "../components/ui/AdminPageLoader";
import AdminErrorState from "../components/ui/AdminErrorState";

export interface Lead {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "pending" | "contacted" | "archived";
  createdAt: string;
}

export default function LeadsPage() {
  const { data: leads, loading, error, refetch } = useAdminFetch<Lead[]>(
    "/api/leads",
    "Failed to load contact leads list"
  );

  if (loading) {
    return <AdminPageLoader variant="default" text="Loading contact submissions..." />;
  }

  if (error || !leads) {
    return <AdminErrorState message={error || "Could not fetch leads"} onRetry={refetch} />;
  }

  return <LeadsPanel initialLeads={leads} onRefresh={refetch} />;
}
