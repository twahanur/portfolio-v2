"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  FiLogOut,
  FiLayout,
  FiUser,
  FiBriefcase,
  FiAward,
  FiCheckSquare,
  FiSliders,
  FiLoader,
  FiActivity,
  FiExternalLink,
  FiMail,
  FiSearch,
  FiFileText,
  FiMessageSquare,
  FiBookOpen,
} from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { adminRequest } from "@/lib/admin-api";
import { Profile } from "./types";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token && pathname !== "/admin/login") {
      router.push("/admin/login");
    } else {
      setAuthorized(true);
      if (pathname !== "/admin/login") {
        fetchProfile();
      }
    }
  }, [router, pathname]);

  useEffect(() => {
    const checkApi = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
        const res = await fetch(`${apiUrl}/api/ai-context`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}`,
          },
        });
        setApiOnline(res.ok);
      } catch {
        setApiOnline(false);
      }
    };
    checkApi();
    const interval = setInterval(checkApi, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await adminRequest("/api/ai-context");
      if (res.success && res.data?.profile) {
        setProfile(res.data.profile);
      }
    } catch (err) {
      console.error("Failed to load layout profile", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-955">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  const menuItems = [
    { label: "Overview", href: "/admin", icon: FiLayout },
    { label: "Admin Profile", href: "/admin/profile", icon: FiUser },
    { label: "Projects", href: "/admin/projects", icon: FiBriefcase },
    { label: "Blogs", href: "/admin/blogs", icon: FiBookOpen },
    { label: "Activities", href: "/admin/activities", icon: FiActivity },
    { label: "Experiences", href: "/admin/experiences", icon: FiSliders },
    { label: "Education", href: "/admin/education", icon: FiFileText },
    { label: "Skills", href: "/admin/skills", icon: FiCheckSquare },
    { label: "Certificates", href: "/admin/certificates", icon: FiAward },
    { label: "Leads", href: "/admin/leads", icon: FiMail },
    { label: "SEO Settings", href: "/admin/seo", icon: FiSearch },
    { label: "Resume Manager", href: "/admin/resume", icon: FiFileText },
    { label: "AI Chat Audit", href: "/admin/audit", icon: FiMessageSquare },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 left-1/4 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[140px]" />
      </div>

      {/* Sidebar */}
      <aside className="relative z-10 w-72 border-r border-zinc-900/60 bg-zinc-950/50 backdrop-blur-xl px-6 py-8 flex flex-col justify-between shrink-0 shadow-2xl">
        <div className="space-y-8">
          {/* Logo & Header */}
          <div className="px-2 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent tracking-tight">
                PORTFOLIO CMS
              </span>
              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-450 border border-emerald-500/20">
                PRO
              </span>
            </div>
          </div>

          {/* Admin Profile Section */}
          {profile && (
            <div className="group relative mx-1 flex items-center gap-3.5 rounded-2xl border border-zinc-900 bg-zinc-900/20 p-3.5 shadow-lg backdrop-blur-lg transition hover:border-zinc-800/80">
              <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition duration-300" />
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-emerald-500/30 bg-zinc-950 shadow-md transition group-hover:border-emerald-500/60">
                {profile.profilePictureUrl ? (
                  <Image
                    src={profile.profilePictureUrl}
                    alt={profile.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-zinc-400 bg-zinc-900 text-sm font-bold">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-zinc-100 leading-none">{profile.name}</p>
                <p className="truncate text-[10px] text-zinc-500 mt-1">{profile.email}</p>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 shadow-sm shadow-emerald-500/5"
                      : "text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200 border border-transparent"
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 top-3.5 h-4 w-1 rounded-r bg-emerald-400 shadow-glow" />
                  )}
                  <Icon
                    size={18}
                    className={`transition-colors duration-200 ${
                      active ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-350"
                    }`}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer controls */}
        <div className="space-y-4 border-t border-zinc-900/60 pt-6">
          {/* API Status widget */}
          <div className="flex items-center justify-between rounded-xl bg-zinc-900/20 border border-zinc-900 px-3 py-2 text-[11px] font-semibold text-zinc-400">
            <span className="flex items-center gap-1.5">
              <FiActivity size={12} className="text-zinc-500" />
              API Server
            </span>
            <span className="flex items-center gap-1.5 font-bold">
              {apiOnline === null ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-600 animate-pulse" />
                  Checking
                </>
              ) : apiOnline ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  <span className="text-emerald-400">Online</span>
                </>
              ) : (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  <span className="text-rose-400">Offline</span>
                </>
              )}
            </span>
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 rounded-xl border border-zinc-900 bg-zinc-900/20 py-2.5 text-xs font-bold text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition"
          >
            <FiExternalLink size={13} />
            View Live Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition"
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="relative z-10 flex-1 overflow-y-auto px-8 py-10 lg:px-12">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}

