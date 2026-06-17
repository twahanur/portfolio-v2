"use client";

import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

interface AdminErrorStateProps {
  /** Error message to display */
  message: string;
  /** Retry callback */
  onRetry?: () => void;
  /** Title text */
  title?: string;
}

export default function AdminErrorState({
  message,
  onRetry,
  title = "Connection Error",
}: AdminErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-500/15 bg-gradient-to-b from-red-500/[0.06] to-transparent p-10 text-center backdrop-blur-md">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 mb-5">
        <FiAlertTriangle size={26} className="text-red-400" />
      </div>
      <h4 className="font-bold text-red-400 text-lg">{title}</h4>
      <p className="text-sm text-zinc-400 mt-2 max-w-md leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-5 py-2.5 text-xs font-bold text-zinc-950 hover:bg-zinc-50 shadow-md transition active:scale-[0.97]"
        >
          <FiRefreshCw size={14} />
          Retry Connection
        </button>
      )}
    </div>
  );
}
