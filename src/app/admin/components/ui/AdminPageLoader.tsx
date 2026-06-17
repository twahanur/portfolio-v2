"use client";

interface AdminPageLoaderProps {
  /** Which page skeleton to show */
  variant?: "overview" | "projects" | "experiences" | "skills" | "certificates" | "profile" | "default";
  /** Optional loading text */
  text?: string;
}

function Bone({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-zinc-800/60 ${className}`}
    />
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/20 p-4 space-y-4">
      <Bone className="aspect-video w-full rounded-xl" />
      <Bone className="h-5 w-3/4" />
      <Bone className="h-3 w-full" />
      <div className="flex gap-2">
        <Bone className="h-5 w-14 rounded-md" />
        <Bone className="h-5 w-16 rounded-md" />
        <Bone className="h-5 w-12 rounded-md" />
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-zinc-800/40">
        <Bone className="h-3 w-16" />
        <div className="flex gap-2">
          <Bone className="h-7 w-16 rounded-lg" />
          <Bone className="h-7 w-18 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function SkeletonExperienceItem() {
  return (
    <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/10 p-5 space-y-3">
      <Bone className="h-6 w-2/3" />
      <div className="flex gap-3">
        <Bone className="h-3 w-20" />
        <Bone className="h-3 w-16" />
        <Bone className="h-3 w-28" />
      </div>
      <Bone className="h-3 w-full" />
    </div>
  );
}

function SkeletonStatCard() {
  return (
    <div className="rounded-2xl border border-zinc-800/40 bg-zinc-900/10 p-5 space-y-4">
      <div className="flex justify-between items-center">
        <Bone className="h-8 w-10" />
        <Bone className="h-10 w-10 rounded-xl" />
      </div>
      <div>
        <Bone className="h-4 w-20" />
        <Bone className="h-2.5 w-28 mt-2" />
      </div>
    </div>
  );
}

function SkeletonFormField() {
  return (
    <div className="space-y-2">
      <Bone className="h-3.5 w-24" />
      <Bone className="h-10 w-full rounded-xl" />
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-10">
      {/* Hero banner */}
      <div className="rounded-3xl border border-zinc-800/40 bg-zinc-900/10 p-8 space-y-3">
        <Bone className="h-10 w-80" />
        <Bone className="h-4 w-full max-w-lg" />
      </div>
      {/* Stats grid */}
      <div>
        <Bone className="h-5 w-40 mb-5" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => <SkeletonStatCard key={i} />)}
        </div>
      </div>
      {/* Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-5">
          <Bone className="h-5 w-32" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-zinc-800/40 bg-zinc-900/10 p-4 flex gap-4">
                <Bone className="h-10 w-10 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Bone className="h-4 w-32" />
                  <Bone className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <Bone className="h-5 w-28" />
          <div className="rounded-2xl border border-zinc-800/40 bg-zinc-900/10 p-5 space-y-4">
            {[...Array(4)].map((_, i) => <Bone key={i} className="h-4 w-full" />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Bone className="h-6 w-28" />
          <Bone className="h-3.5 w-56" />
        </div>
        <Bone className="h-10 w-32 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  );
}

function ExperiencesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Bone className="h-6 w-36" />
          <Bone className="h-3.5 w-52" />
        </div>
        <Bone className="h-10 w-28 rounded-xl" />
      </div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => <SkeletonExperienceItem key={i} />)}
      </div>
    </div>
  );
}

function SkillsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form sidebar */}
      <div className="rounded-2xl border border-zinc-800/40 bg-zinc-900/10 p-6 space-y-4">
        <Bone className="h-6 w-24" />
        <Bone className="h-3.5 w-48" />
        {[...Array(3)].map((_, i) => <SkeletonFormField key={i} />)}
        <Bone className="h-11 w-full rounded-xl" />
      </div>
      {/* Category groups */}
      <div className="lg:col-span-2 space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-zinc-800/40 bg-zinc-900/10 p-5 space-y-4">
            <Bone className="h-5 w-40 border-b border-zinc-800/30 pb-3" />
            <div className="flex flex-wrap gap-2.5">
              {[...Array(5 + i)].map((_, j) => (
                <Bone key={j} className="h-8 w-20 rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CertificatesSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form sidebar */}
      <div className="rounded-2xl border border-zinc-800/40 bg-zinc-900/10 p-6 space-y-4">
        <Bone className="h-6 w-36" />
        <Bone className="h-3.5 w-56" />
        {[...Array(5)].map((_, i) => <SkeletonFormField key={i} />)}
        <Bone className="aspect-[4/3] w-full rounded-xl" />
        <Bone className="h-11 w-full rounded-xl" />
      </div>
      {/* Cert cards */}
      <div className="lg:col-span-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-zinc-800/40 bg-zinc-900/10 p-4 space-y-4">
              <Bone className="aspect-[4/3] w-full rounded-xl" />
              <Bone className="h-4 w-3/4" />
              <Bone className="h-3 w-1/2" />
              <Bone className="h-2.5 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-800/40 bg-zinc-900/10 p-6 space-y-8">
      <div className="space-y-2">
        <Bone className="h-6 w-32" />
        <Bone className="h-3.5 w-52" />
      </div>
      {/* Avatar + info */}
      <div className="flex gap-6 items-center">
        <Bone className="h-28 w-28 rounded-full shrink-0" />
        <div className="space-y-2 flex-1">
          <Bone className="h-4 w-28" />
          <Bone className="h-3 w-56" />
          <Bone className="h-8 w-28 rounded-lg mt-2" />
        </div>
      </div>
      {/* Form fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => <SkeletonFormField key={i} />)}
        <div className="md:col-span-2">
          <SkeletonFormField />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Bone className="h-3.5 w-32" />
          <Bone className="h-24 w-full rounded-xl" />
        </div>
      </div>
      <div className="flex justify-end">
        <Bone className="h-10 w-32 rounded-xl" />
      </div>
    </div>
  );
}

function DefaultSkeleton() {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500/20 border-t-emerald-500" />
        <div className="absolute inset-0 h-10 w-10 animate-ping rounded-full border-4 border-emerald-500/10 border-t-transparent opacity-30" />
      </div>
      <p className="text-sm text-zinc-400 font-semibold animate-pulse">Loading...</p>
    </div>
  );
}

const SKELETON_MAP: Record<string, React.FC> = {
  overview: OverviewSkeleton,
  projects: ProjectsSkeleton,
  experiences: ExperiencesSkeleton,
  skills: SkillsSkeleton,
  certificates: CertificatesSkeleton,
  profile: ProfileSkeleton,
  default: DefaultSkeleton,
};

export default function AdminPageLoader({ variant = "default", text }: AdminPageLoaderProps) {
  const Skeleton = SKELETON_MAP[variant] || DefaultSkeleton;

  return (
    <div className="animate-in fade-in duration-300">
      {text && (
        <p className="text-center text-xs text-zinc-500 font-semibold mb-6 animate-pulse">{text}</p>
      )}
      <Skeleton />
    </div>
  );
}
