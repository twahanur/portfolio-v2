"use client";

import { useAdminData } from "../hooks/useAdminData";
import TestimonialsPanel, { Testimonial } from "../components/TestimonialsPanel";
import AdminPageLoader from "../components/ui/AdminPageLoader";
import AdminErrorState from "../components/ui/AdminErrorState";

export default function TestimonialsPage() {
  const { data: testimonials, loading, error, refetch } = useAdminData<Testimonial[]>(
    (data) => (Array.isArray(data) ? data : data.testimonials || []),
    "Failed to load testimonials list",
    "/api/testimonials"
  );

  if (loading) {
    return <AdminPageLoader variant="skills" />;
  }

  if (error || !testimonials) {
    return <AdminErrorState message={error || "Could not fetch testimonials"} onRetry={refetch} />;
  }

  return <TestimonialsPanel initialTestimonials={testimonials} onRefresh={refetch} />;
}
