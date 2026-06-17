// hooks/useFetchCV.js
import { useEffect, useState } from "react";

const useFetchCV = () => {
  const [cv, setCv] = useState(null);

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
        const res = await fetch(`${apiUrl}/api/resume/active`);
        if (res.ok) {
          const payload = await res.json();
          if (payload.success && payload.data) {
            setCv({ Link: payload.data.url });
          }
        }
      } catch (error) {
        console.error("Failed to fetch CV:", error);
      }
    };

    fetchCV();
  }, []);

  return cv;
};

export default useFetchCV;
