  "use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminRequest } from "@/lib/admin-api";
import { FiLock, FiMail, FiLoader } from "react-icons/fi";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      router.push("/admin");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await adminRequest("/api/auth/login", "POST", { email, password });
      if (res.success && res.data?.token) {
        localStorage.setItem("admin_token", res.data.token);
        router.push("/admin");
      } else {
        setError("Invalid response format from server");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_center,rgba(16,185,129,0.08),transparent)]" />

      <div className="relative w-full max-w-md space-y-8 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 shadow-2xl backdrop-blur-md">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
            <FiLock size={28} />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-zinc-100">
            Admin Dashboard
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Log in to manage your portfolio content
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                  <FiMail size={18} />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-zinc-800 bg-zinc-950/80 py-3 pl-10 pr-3 text-zinc-200 placeholder-zinc-500 shadow-inner outline-none transition focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                  <FiLock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-zinc-800 bg-zinc-950/80 py-3 pl-10 pr-3 text-zinc-200 placeholder-zinc-500 shadow-inner outline-none transition focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                  placeholder="Password"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-xl bg-zinc-100 py-3 text-sm font-bold text-zinc-950 shadow-md transition hover:bg-zinc-50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? (
                <FiLoader className="animate-spin text-zinc-950" size={20} />
              ) : (
                "Log In"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
