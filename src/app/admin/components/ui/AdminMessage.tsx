"use client";

import { useEffect, useState } from "react";
import { FiCheckCircle, FiXCircle, FiX } from "react-icons/fi";

interface AdminMessageProps {
  text: string;
  type: "success" | "error" | "";
  /** Auto-dismiss after ms. 0 = no auto-dismiss. Default: 5000 */
  dismissAfter?: number;
  onDismiss?: () => void;
}

export default function AdminMessage({
  text,
  type,
  dismissAfter = 5000,
  onDismiss,
}: AdminMessageProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    if (dismissAfter > 0 && text) {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, dismissAfter);
      return () => clearTimeout(timer);
    }
  }, [text, dismissAfter, onDismiss]);

  if (!text || !type || !visible) return null;

  const isSuccess = type === "success";

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-4 text-sm font-medium animate-in slide-in-from-top-2 fade-in duration-300 ${
        isSuccess
          ? "border-emerald-500/20 bg-emerald-500/[0.07] text-emerald-400"
          : "border-red-500/20 bg-red-500/[0.07] text-red-400"
      }`}
    >
      {isSuccess ? (
        <FiCheckCircle size={18} className="shrink-0 text-emerald-400" />
      ) : (
        <FiXCircle size={18} className="shrink-0 text-red-400" />
      )}
      <span className="flex-1">{text}</span>
      {onDismiss && (
        <button
          onClick={() => {
            setVisible(false);
            onDismiss();
          }}
          className="shrink-0 text-zinc-500 hover:text-zinc-300 transition"
        >
          <FiX size={16} />
        </button>
      )}
    </div>
  );
}
