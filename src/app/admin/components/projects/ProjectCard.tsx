"use client";

import Image from "next/image";
import { Project } from "../../types";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

interface ProjectCardProps {
  project: Project;
  onEdit: (proj: Project) => void;
  onDelete: (id: string) => void;
}

export default function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const featuredImage = project.images.find((img) => img.isFeatured) || project.images[0];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/20 p-4 backdrop-blur-md flex flex-col justify-between hover:border-zinc-700/80 transition duration-300">
      <div>
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-950">
          {featuredImage ? (
            <Image
              src={featuredImage.url}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-105 transition duration-500"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-zinc-650 font-medium text-sm">
              No Cover Image
            </div>
          )}
        </div>
        <div className="mt-4">
          <h4 className="font-bold text-zinc-100 text-lg line-clamp-1">{project.title}</h4>
          <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">{project.tagline}</p>
          <div className="flex flex-wrap gap-1.5 mt-3.5">
            {project.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 px-2.5 py-0.5 text-[10px] text-zinc-400 font-medium"
              >
                {t}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="text-[10px] text-zinc-550 flex items-center font-semibold">
                +{project.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-zinc-850 pt-3.5 flex justify-between items-center">
        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
          Order: {project.order}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(project)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 transition active:scale-95"
          >
            <FiEdit2 size={13} /> Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(project.id)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/15 transition active:scale-95"
          >
            <FiTrash2 size={13} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
