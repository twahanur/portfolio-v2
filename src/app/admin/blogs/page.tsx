"use client";

import { useAdminData } from "../hooks/useAdminData";
import BlogsPanel from "../components/BlogsPanel";
import AdminPageLoader from "../components/ui/AdminPageLoader";
import AdminErrorState from "../components/ui/AdminErrorState";
import { Blog } from "../types";

export default function BlogsPage() {
  const { data: blogs, loading, error, refetch } = useAdminData<Blog[]>(
    (data) => data.blogs || [],
    "Failed to load blogs list"
  );

  if (loading) {
    return <AdminPageLoader variant="skills" />;
  }

  if (error || !blogs) {
    return <AdminErrorState message={error || "Could not fetch blogs"} onRetry={refetch} />;
  }

  return <BlogsPanel initialBlogs={blogs} onRefresh={refetch} />;
}
