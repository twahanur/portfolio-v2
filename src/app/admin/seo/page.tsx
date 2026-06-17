"use client";

import { useAdminFetch } from "../hooks/useAdminFetch";
import SeoPanel from "../components/SeoPanel";
import AdminPageLoader from "../components/ui/AdminPageLoader";
import AdminErrorState from "../components/ui/AdminErrorState";

export interface SeoConfig {
  id: string;
  page: string;
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  structuredData: any | null;
  createdAt: string;
  updatedAt: string;
}

export default function SeoPage() {
  const { data: seoList, loading, error, refetch } = useAdminFetch<SeoConfig[]>(
    "/api/seo",
    "Failed to load SEO configuration list"
  );

  if (loading) {
    return <AdminPageLoader variant="default" text="Loading SEO settings..." />;
  }

  if (error || !seoList) {
    return <AdminErrorState message={error || "Could not fetch SEO configs"} onRetry={refetch} />;
  }

  return <SeoPanel initialSeoList={seoList} onRefresh={refetch} />;
}
