"use client";

import { useState } from "react";
import { Activity } from "../types";
import { adminRequest, uploadImage } from "@/lib/admin-api";
import { FiLoader, FiPlus, FiTrash2, FiExternalLink, FiUploadCloud, FiCalendar, FiActivity } from "react-icons/fi";
import Image from "next/image";
import FormField from "./ui/FormField";
import AdminMessage from "./ui/AdminMessage";

interface ActivitiesPanelProps {
  initialActivities: Activity[];
  onRefresh: () => void;
}

export default function ActivitiesPanel({
  initialActivities,
  onRefresh,
}: ActivitiesPanelProps) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage({ text: "", type: "" });

    try {
      const url = await uploadImage(file);
      setImageUrl(url);
      showMessage("Activity picture uploaded successfully!", "success");
    } catch (err: any) {
      console.error(err);
      showMessage(err.message || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!status.trim()) {
      showMessage("Please write a status description.", "error");
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      await adminRequest("/api/activities", "POST", {
        title: title || null,
        status,
        image: imageUrl || null,
        link: link || null,
        date: date ? new Date(date).toISOString() : new Date().toISOString(),
      });

      setTitle("");
      setStatus("");
      setImageUrl("");
      setLink("");
      setDate(new Date().toISOString().split("T")[0]);

      showMessage("Activity post created successfully!", "success");
      onRefresh();
    } catch (err: any) {
      console.error(err);
      showMessage(err.message || "Failed to add activity post", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this activity post?")) return;
    setMessage({ text: "", type: "" });

    try {
      await adminRequest(`/api/activities/${id}`, "DELETE");
      showMessage("Activity post deleted successfully!", "success");
      onRefresh();
    } catch (err: any) {
      console.error(err);
      showMessage(err.message || "Failed to delete activity post", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Activities Manager
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Post updates on conferences, achievements, travel, workshops, and general status updates.
          </p>
        </div>
      </div>

      <AdminMessage
        text={message.text}
        type={message.type as "success" | "error" | ""}
        onDismiss={() => setMessage({ text: "", type: "" })}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Creation Form */}
        <div className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md lg:col-span-1 h-fit">
          <div>
            <h3 className="text-lg font-bold text-zinc-150 flex items-center gap-2">
              <FiPlus className="text-emerald-400" /> Post New Activity
            </h3>
            <p className="text-[11px] text-zinc-500 mt-1">Create a micro-post with optional image and link</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Activity Title (Optional)"
              placeholder="e.g. Attending Google I/O Extended"
              value={title}
              onChange={setTitle}
            />

            <FormField
              label="Status Description"
              type="textarea"
              required
              rows={4}
              placeholder="What did you do? Describe the event or status update..."
              value={status}
              onChange={setStatus}
            />

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-zinc-350">Event Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="block w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-zinc-200 outline-none transition focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 placeholder:text-zinc-600 text-sm"
              />
            </div>

            <FormField
              label="External Link / Reference URL (Optional)"
              type="url"
              placeholder="e.g. https://conference-website.com"
              value={link}
              onChange={setLink}
            />

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-zinc-350">Activity Image (Optional)</label>
              {imageUrl ? (
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-zinc-850">
                  <Image src={imageUrl} alt="Activity preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="absolute right-2 top-2 rounded-lg bg-zinc-950/80 px-2 py-1 text-xs text-red-400 border border-zinc-800 transition hover:bg-zinc-900"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 bg-zinc-950/20 rounded-xl p-5 cursor-pointer hover:border-emerald-500/40 hover:bg-zinc-950/40 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  {uploading ? (
                    <FiLoader className="animate-spin text-emerald-400" size={24} />
                  ) : (
                    <>
                      <FiUploadCloud className="text-zinc-500 mb-2" size={24} />
                      <span className="text-xs text-zinc-400 font-semibold text-center">Upload Event Photo</span>
                      <span className="text-[10px] text-zinc-650 mt-1 text-center">PNG, JPG, WEBP</span>
                    </>
                  )}
                </label>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || uploading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-100 py-3 text-sm font-bold text-zinc-950 shadow hover:bg-zinc-50 disabled:opacity-50 transition active:scale-[0.97]"
            >
              {loading ? (
                <FiLoader className="animate-spin text-zinc-950" size={18} />
              ) : (
                <>
                  <FiActivity size={18} />
                  Publish Activity
                </>
              )}
            </button>
          </form>
        </div>

        {/* Activities List */}
        <div className="space-y-6 lg:col-span-2">
          {initialActivities.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-850 p-12 text-center text-zinc-500 italic">
              No activity updates posted yet. Create your first post using the form.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {initialActivities
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((act) => (
                  <div
                    key={act.id}
                    className="group relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/20 p-4 backdrop-blur-md flex flex-col justify-between hover:border-zinc-700/80 transition duration-300 shadow-md"
                  >
                    <div>
                      {act.image && (
                        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-zinc-950 mb-3.5">
                          <Image
                            src={act.image}
                            alt={act.title || "Activity image"}
                            fill
                            className="object-cover group-hover:scale-[1.02] transition duration-500"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-2">
                        <FiCalendar size={12} className="text-emerald-450" />
                        <span>
                          {new Date(act.date).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      {act.title && (
                        <h4 className="font-bold text-zinc-200 text-base leading-snug mb-1.5">
                          {act.title}
                        </h4>
                      )}

                      <p className="text-zinc-400 text-xs leading-relaxed whitespace-pre-wrap">
                        {act.status}
                      </p>
                    </div>

                    <div className="mt-4 pt-3.5 border-t border-zinc-850/65 flex items-center justify-between">
                      {act.link ? (
                        <a
                          href={act.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-emerald-450 hover:text-emerald-400 font-bold transition"
                        >
                          Visit Link <FiExternalLink size={12} />
                        </a>
                      ) : (
                        <span />
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(act.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/15 transition active:scale-95"
                      >
                        <FiTrash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
