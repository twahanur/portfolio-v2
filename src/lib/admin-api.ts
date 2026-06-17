const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

function getHeaders(token?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem("admin_token") : null);
  if (activeToken) {
    headers["Authorization"] = `Bearer ${activeToken}`;
  }
  return headers;
}

export async function adminRequest(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
  body?: any,
  token?: string
) {
  const headers = getHeaders(token);
  const config: RequestInit = {
    method,
    headers,
  };
  if (body) {
    config.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${endpoint}`, config);
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
      window.location.href = "/admin/login";
    }
    throw new Error("Unauthorized");
  }

  const payload = await res.json();
  if (!res.ok) {
    throw new Error(payload.message || `API error: ${res.statusText}`);
  }
  return payload;
}

export async function uploadImage(file: File): Promise<string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_URL}/api/upload`, {
    method: "POST",
    headers,
    body: formData,
  });

  const payload = await res.json();
  if (!res.ok) {
    throw new Error(payload.message || "Upload failed");
  }
  return payload.data.url;
}
