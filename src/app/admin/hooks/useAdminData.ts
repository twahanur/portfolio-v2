"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { adminRequest } from "@/lib/admin-api";

export function useAdminData<T>(
  extractor: (data: any) => T,
  errorMessage: string = "Failed to load dashboard data"
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Keep extractor in a ref to avoid infinite re-renders when inline functions are passed
  const extractorRef = useRef(extractor);
  useEffect(() => {
    extractorRef.current = extractor;
  }, [extractor]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await adminRequest("/api/ai-context");
      if (res.success && res.data) {
        setData(extractorRef.current(res.data));
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || errorMessage);
    } finally {
      setLoading(false);
    }
  }, [errorMessage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
