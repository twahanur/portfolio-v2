"use client";

import { useState } from "react";
import { FiEdit3, FiLoader, FiCheck, FiUploadCloud } from "react-icons/fi";
import { Project, ProjectImage } from "../../../types";
import { uploadImage } from "@/lib/admin-api";
import Image from "next/image";

interface ImagesSectionProps {
  formData: Partial<Project>;
  onChange: (fields: Partial<Project>) => void;
  isEditing: boolean;
  loading: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onShowMessage: (text: string, type: "success" | "error") => void;
  isNewProject?: boolean;
}

export default function ImagesSection({
  formData,
  onChange,
  isEditing,
  loading,
  onEdit,
  onSave,
  onCancel,
  onShowMessage,
  isNewProject = false,
}: ImagesSectionProps) {
  const [uploading, setUploading] = useState(false);
  const showControls = !isNewProject;
  const images = formData.images || [];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newImages: ProjectImage[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadImage(files[i]);
        newImages.push({
          url,
          alt: files[i].name.replace(/\.[^/.]+$/, ""),
          isFeatured: images.length === 0 && newImages.length === 0,
        });
      }
      onChange({ images: [...images, ...newImages] });
      onShowMessage("Images uploaded successfully!", "success");
    } catch (err: any) {
      console.error(err);
      onShowMessage(err.message || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateImageAlt = (index: number, alt: string) => {
    const updated = images.map((img: ProjectImage, idx: number) => (idx === index ? { ...img, alt } : img));
    onChange({ images: updated });
  };

  const handleSetFeatured = (index: number) => {
    const updated = images.map((img: ProjectImage, idx: number) => ({ ...img, isFeatured: idx === index }));
    onChange({ images: updated });
  };

  const handleRemoveImage = (index: number) => {
    onChange({ images: images.filter((_: any, idx: number) => idx !== index) });
  };

  return (
    <div className="rounded-2xl border border-zinc-900 bg-zinc-900/10 p-5 mb-6 hover:border-zinc-800/80 transition group relative">
      {showControls && (
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-emerald-400 text-sm tracking-wide uppercase">
            5. Screenshots & Images
          </h4>
          {!isEditing ? (
            <button
              type="button"
              onClick={onEdit}
              className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-emerald-455 transition duration-200"
            >
              <FiEdit3 size={13} /> Edit Section
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onSave}
                disabled={loading}
                className="flex items-center gap-1 text-xs font-bold text-emerald-455 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition"
              >
                {loading ? <FiLoader className="animate-spin" size={12} /> : <FiCheck size={13} />}
                Save
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="text-xs font-semibold text-zinc-500 hover:text-zinc-300"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {isEditing || isNewProject ? (
        <div className="space-y-4 animate-in fade-in duration-200">
          {isNewProject && (
            <h4 className="font-bold text-emerald-400 text-xs tracking-wide uppercase mb-2">
              5. Screenshots & Images
            </h4>
          )}
          <div className="grid grid-cols-2 gap-4">
            {images.map((img: ProjectImage, index: number) => (
              <div
                key={index}
                className={`relative p-3 border rounded-xl flex flex-col ${
                  img.isFeatured ? "border-emerald-500/50 bg-emerald-500/[0.02]" : "border-zinc-855 bg-zinc-955/40"
                }`}
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image src={img.url} alt={img.alt || ""} fill className="object-cover" />
                </div>
                <div className="mt-2.5 space-y-2">
                  <input
                    type="text"
                    value={img.alt || ""}
                    onChange={(e) => handleUpdateImageAlt(index, e.target.value)}
                    className="w-full bg-zinc-955 text-[10px] text-zinc-300 border border-zinc-850 rounded px-1.5 py-0.5 outline-none focus:border-emerald-500/35"
                    placeholder="Alt tag description"
                  />
                  <div className="flex justify-between items-center">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="drawer-featured"
                        checked={img.isFeatured}
                        onChange={() => handleSetFeatured(index)}
                        className="h-2.5 w-2.5 accent-emerald-555"
                      />
                      <span className="text-[9px] font-bold text-zinc-400">Featured</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="text-[9px] font-bold text-red-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <label className="flex flex-col items-center justify-center border border-dashed border-zinc-800 bg-zinc-950/10 rounded-xl p-4 cursor-pointer hover:border-emerald-500/30 transition min-h-[120px]">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
              {uploading ? (
                <FiLoader className="animate-spin text-emerald-450" size={18} />
              ) : (
                <>
                  <FiUploadCloud size={20} className="text-zinc-500 mb-1" />
                  <span className="text-[10px] text-zinc-405 font-bold">Upload Image</span>
                </>
              )}
            </label>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {images.length === 0 ? (
            <p className="text-xs text-zinc-555 italic col-span-2">No screenshots uploaded.</p>
          ) : (
            images.map((img: ProjectImage, index: number) => (
              <div
                key={index}
                className={`relative aspect-video rounded-xl overflow-hidden border ${
                  img.isFeatured ? "border-emerald-500/30" : "border-zinc-900"
                }`}
              >
                <Image src={img.url} alt={img.alt || ""} fill className="object-cover" />
                {img.isFeatured && (
                  <span className="absolute top-2 left-2 bg-emerald-555 text-zinc-950 font-bold text-[9px] px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow">
                    Cover Image
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
