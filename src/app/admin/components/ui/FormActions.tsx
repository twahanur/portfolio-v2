"use client";

import { FiLoader } from "react-icons/fi";

interface FormActionsProps {
  loading?: boolean;
  disabled?: boolean;
  submitLabel?: string;
  onCancel: () => void;
}

export default function FormActions({
  loading = false,
  disabled = false,
  submitLabel = "Save Changes",
  onCancel,
}: FormActionsProps) {
  return (
    <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-xl border border-zinc-800 bg-zinc-950/50 px-5 py-2.5 text-sm font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 transition"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading || disabled}
        className="flex items-center justify-center gap-2 rounded-xl bg-zinc-100 px-6 py-2.5 text-sm font-bold text-zinc-950 shadow hover:bg-zinc-50 disabled:opacity-50 transition active:scale-[0.97]"
      >
        {loading ? (
          <>
            <FiLoader className="animate-spin text-zinc-950" size={16} />
            <span>Saving...</span>
          </>
        ) : (
          submitLabel
        )}
      </button>
    </div>
  );
}
