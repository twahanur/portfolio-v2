"use client";

import { useAdminData } from "../hooks/useAdminData";
import CertificatesPanel from "../components/CertificatesPanel";
import AdminPageLoader from "../components/ui/AdminPageLoader";
import AdminErrorState from "../components/ui/AdminErrorState";
import { Certificate } from "../types";

export default function CertificatesPage() {
  const { data: certificates, loading, error, refetch } = useAdminData<Certificate[]>(
    (data) => data.certificates || [],
    "Failed to load certificates list"
  );

  if (loading) {
    return <AdminPageLoader variant="certificates" />;
  }

  if (error || !certificates) {
    return <AdminErrorState message={error || "Could not fetch certificates"} onRetry={refetch} />;
  }

  return <CertificatesPanel initialCertificates={certificates} onRefresh={refetch} />;
}
