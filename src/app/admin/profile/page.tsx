"use client";

import { useAdminData } from "../hooks/useAdminData";
import ProfilePanel from "../components/ProfilePanel";
import AdminPageLoader from "../components/ui/AdminPageLoader";
import AdminErrorState from "../components/ui/AdminErrorState";
import { Profile } from "../types";

export default function ProfilePage() {
  const { data: profile, loading, error, refetch } = useAdminData<Profile | null>(
    (data) => data.profile || null,
    "Failed to load profile details"
  );

  if (loading) {
    return <AdminPageLoader variant="profile" />;
  }

  if (error) {
    return <AdminErrorState message={error} onRetry={refetch} />;
  }

  return <ProfilePanel initialProfile={profile} onRefresh={refetch} />;
}
