"use client";

import { IconType } from "react-icons";
import { FiPlus } from "react-icons/fi";

interface PageHeaderProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionIcon?: IconType;
  onAction?: () => void;
  showAction?: boolean;
}

export default function PageHeader({
  title,
  description,
  actionLabel,
  actionIcon: ActionIcon = FiPlus,
  onAction,
  showAction = true,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-xl font-bold text-zinc-100">{title}</h3>
        <p className="text-sm text-zinc-400">{description}</p>
      </div>
      {showAction && actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2.5 text-sm font-bold text-zinc-950 hover:bg-zinc-50 shadow transition active:scale-[0.97]"
        >
          <ActionIcon size={18} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
