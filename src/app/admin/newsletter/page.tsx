"use client";

import { useAdminData } from "../hooks/useAdminData";
import NewsletterPanel, { Subscriber } from "../components/NewsletterPanel";
import AdminPageLoader from "../components/ui/AdminPageLoader";
import AdminErrorState from "../components/ui/AdminErrorState";

export default function NewsletterPage() {
  const { data: subscribers, loading, error, refetch } = useAdminData<Subscriber[]>(
    (data) => (Array.isArray(data) ? data : data.subscribers || []),
    "Failed to load subscribers list",
    "/api/newsletter/subscribers"
  );

  if (loading) {
    return <AdminPageLoader variant="skills" />;
  }

  if (error || !subscribers) {
    return <AdminErrorState message={error || "Could not fetch subscribers"} onRetry={refetch} />;
  }

  return <NewsletterPanel initialSubscribers={subscribers} onRefresh={refetch} />;
}
