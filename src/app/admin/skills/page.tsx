"use client";

import { useAdminData } from "../hooks/useAdminData";
import SkillsPanel from "../components/SkillsPanel";
import AdminPageLoader from "../components/ui/AdminPageLoader";
import AdminErrorState from "../components/ui/AdminErrorState";
import { Skill, SkillCategory } from "../types";

export default function SkillsPage() {
  const { data, loading, error, refetch } = useAdminData<{
    skills: Skill[];
    skillCategories: SkillCategory[];
  }>(
    (payload) => ({
      skills: payload.skills || [],
      skillCategories: payload.skillCategories || [],
    }),
    "Failed to load skills list"
  );

  if (loading) {
    return <AdminPageLoader variant="skills" />;
  }

  if (error || !data) {
    return <AdminErrorState message={error || "Could not fetch skills"} onRetry={refetch} />;
  }

  return (
    <SkillsPanel
      initialSkills={data.skills}
      initialCategories={data.skillCategories}
      onRefresh={refetch}
    />
  );
}
