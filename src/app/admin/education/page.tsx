"use client";

import { useAdminData } from "../hooks/useAdminData";
import EducationPanel from "../components/EducationPanel";
import AdminPageLoader from "../components/ui/AdminPageLoader";
import AdminErrorState from "../components/ui/AdminErrorState";
import { Education } from "../types";

export default function EducationPage() {
  const { data: educations, loading, error, refetch } = useAdminData<Education[]>(
    (data) => data.educations || [],
    "Failed to load education list"
  );

  if (loading) {
    return <AdminPageLoader variant="certificates" />;
  }

  if (error || !educations) {
    return <AdminErrorState message={error || "Could not fetch education data"} onRetry={refetch} />;
  }

  return <EducationPanel initialEducations={educations} onRefresh={refetch} />;
}
