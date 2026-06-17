"use client";

import { useAdminFetch } from "../hooks/useAdminFetch";
import AuditPanel from "../components/AuditPanel";
import AdminPageLoader from "../components/ui/AdminPageLoader";
import AdminErrorState from "../components/ui/AdminErrorState";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  messages: ChatMessage[];
}

export default function AuditPage() {
  const { data: sessions, loading, error, refetch } = useAdminFetch<ChatSession[]>(
    "/api/audit/sessions",
    "Failed to load AI chat sessions"
  );

  if (loading) {
    return <AdminPageLoader variant="default" text="Loading chat sessions..." />;
  }

  if (error || !sessions) {
    return <AdminErrorState message={error || "Could not fetch chat sessions"} onRetry={refetch} />;
  }

  return <AuditPanel initialSessions={sessions} onRefresh={refetch} />;
}
