"use client";

import { useEffect, useState, useCallback } from "react";
import { adminRequest } from "@/lib/admin-api";

export function useAdminFetch<T>(
  endpoint: string,
  errorMessage: string = "Failed to load data"
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await adminRequest(endpoint);
      if (res.success && res.data !== undefined) {
        setData(res.value || res.data);
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || errorMessage);
    } finally {
      setLoading(false);
    }
  }, [endpoint, errorMessage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
