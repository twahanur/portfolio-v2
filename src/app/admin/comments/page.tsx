"use client";

import { useAdminData } from "../hooks/useAdminData";
import CommentsPanel, { BlogComment } from "../components/CommentsPanel";
import AdminPageLoader from "../components/ui/AdminPageLoader";
import AdminErrorState from "../components/ui/AdminErrorState";

export default function CommentsPage() {
  const { data: comments, loading, error, refetch } = useAdminData<BlogComment[]>(
    (data) => (Array.isArray(data) ? data : data.comments || []),
    "Failed to load comments list",
    "/api/comments"
  );

  if (loading) {
    return <AdminPageLoader variant="skills" />;
  }

  if (error || !comments) {
    return <AdminErrorState message={error || "Could not fetch comments"} onRetry={refetch} />;
  }

  return <CommentsPanel initialComments={comments} onRefresh={refetch} />;
}
