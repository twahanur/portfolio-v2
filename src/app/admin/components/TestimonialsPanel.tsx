"use client";

import { useState, useEffect } from "react";
import { adminRequest, uploadImage } from "@/lib/admin-api";
import PageHeader from "./ui/PageHeader";
import AdminMessage from "./ui/AdminMessage";
import FormField from "./ui/FormField";
import {
  FiStar,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiX,
  FiUser,
  FiBriefcase,
  FiImage,
  FiLinkedin,
  FiLoader,
} from "react-icons/fi";
import Image from "next/image";

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string | null;
  avatar?: string | null;
  content: string;
  rating: number;
  linkedInUrl?: string | null;
  isFeatured: boolean;
  order: number;
  createdAt: string;
}

interface TestimonialsPanelProps {
  initialTestimonials: Testimonial[];
  onRefresh: () => void;
}

export default function TestimonialsPanel({
  initialTestimonials,
  onRefresh,
}: TestimonialsPanelProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [avatar, setAvatar] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [linkedInUrl, setLinkedInUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(true);
  const [order, setOrder] = useState(0);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    setTestimonials(initialTestimonials);
  }, [initialTestimonials]);

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
  };

  const handleCreateNew = () => {
    setCurrentTestimonial(null);
    setName("");
    setRole("");
    setCompany("");
    setAvatar("");
    setContent("");
    setRating(5);
    setLinkedInUrl("");
    setIsFeatured(true);
    setOrder(0);
    setIsEditing(true);
  };

  const handleEdit = (item: Testimonial) => {
    setCurrentTestimonial(item);
    setName(item.name || "");
    setRole(item.role || "");
    setCompany(item.company || "");
    setAvatar(item.avatar || "");
    setContent(item.content || "");
    setRating(item.rating || 5);
    setLinkedInUrl(item.linkedInUrl || "");
    setIsFeatured(item.isFeatured ?? true);
    setOrder(item.order || 0);
    setIsEditing(true);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadImage(file);
      setAvatar(url);
      showMessage("Avatar uploaded successfully!", "success");
    } catch (err: any) {
      showMessage(err.message || "Failed to upload avatar", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    const payload = {
      name,
      role,
      company: company || undefined,
      avatar: avatar || undefined,
      content,
      rating: Number(rating),
      linkedInUrl: linkedInUrl || undefined,
      isFeatured,
      order: Number(order),
    };

    try {
      if (currentTestimonial) {
        await adminRequest(`/api/testimonials/${currentTestimonial.id}`, "PUT", payload);
        showMessage("Testimonial updated successfully!", "success");
      } else {
        await adminRequest("/api/testimonials", "POST", payload);
        showMessage("Testimonial created successfully!", "success");
      }
      setIsEditing(false);
      onRefresh();
    } catch (err: any) {
      showMessage(err.message || "Failed to save testimonial", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    setLoading(true);
    try {
      await adminRequest(`/api/testimonials/${id}`, "DELETE");
      showMessage("Testimonial deleted successfully!", "success");
      onRefresh();
    } catch (err: any) {
      showMessage(err.message || "Failed to delete testimonial", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Testimonials Manager"
        description="Manage client recommendations, feedback, and peer reviews displayed on your portfolio."
        actionLabel={isEditing ? undefined : "Add Testimonial"}
        onAction={isEditing ? undefined : handleCreateNew}
      />

      <AdminMessage text={message.text} type={message.type as "success" | "error" | ""} />

      {isEditing ? (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-900 bg-zinc-900/30 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <h3 className="text-lg font-bold text-zinc-100">
              {currentTestimonial ? "Edit Testimonial" : "Create New Testimonial"}
            </h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-zinc-400 hover:text-zinc-200 text-sm flex items-center gap-1 font-semibold"
            >
              <FiX size={16} /> Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Full Name *">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
                placeholder="e.g. Sarah Jenkins"
              />
            </FormField>

            <FormField label="Role / Title *">
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
                placeholder="e.g. Senior Product Manager"
              />
            </FormField>

            <FormField label="Company Name">
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
                placeholder="e.g. Acme Corp"
              />
            </FormField>

            <FormField label="Rating (1 to 5 Stars)">
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
              >
                <option value={5}>5 Stars ⭐⭐⭐⭐⭐</option>
                <option value={4}>4 Stars ⭐⭐⭐⭐</option>
                <option value={3}>3 Stars ⭐⭐⭐</option>
                <option value={2}>2 Stars ⭐⭐</option>
                <option value={1}>1 Star ⭐</option>
              </select>
            </FormField>

            <FormField label="LinkedIn Profile URL">
              <input
                type="url"
                value={linkedInUrl}
                onChange={(e) => setLinkedInUrl(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
                placeholder="https://linkedin.com/in/username"
              />
            </FormField>

            <FormField label="Order Position">
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
                placeholder="0"
              />
            </FormField>
          </div>

          <FormField label="Avatar Image">
            <div className="flex items-center gap-4">
              {avatar && (
                <div className="relative h-14 w-14 overflow-hidden rounded-full border border-zinc-700 bg-zinc-900 shrink-0">
                  <Image src={avatar} alt="Avatar Preview" fill className="object-cover" />
                </div>
              )}
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
              />
              <label className="cursor-pointer rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-xs font-bold text-zinc-200 hover:bg-zinc-700 transition flex items-center gap-1.5 shrink-0">
                {uploading ? <FiLoader className="animate-spin" /> : <FiImage />} Upload
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>
          </FormField>

          <FormField label="Testimonial Content *">
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
              placeholder="Enter recommendation content..."
            />
          </FormField>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-800 bg-zinc-950 text-emerald-500 focus:ring-emerald-500"
            />
            <label htmlFor="isFeatured" className="text-sm font-semibold text-zinc-300">
              Featured on Homepage
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-bold text-zinc-950 hover:bg-emerald-400 transition disabled:opacity-50"
            >
              {loading && <FiLoader className="animate-spin" />}
              {currentTestimonial ? "Save Changes" : "Create Testimonial"}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-zinc-800 p-12 text-center text-zinc-500">
              <FiStar size={40} className="mx-auto mb-3 text-zinc-600" />
              <p className="font-semibold">No testimonials added yet.</p>
              <p className="text-xs mt-1 text-zinc-600">Click &quot;Add Testimonial&quot; to create your first entry.</p>
            </div>
          ) : (
            testimonials.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl border border-zinc-900 bg-zinc-900/30 p-6 space-y-4 hover:border-zinc-800 transition shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-emerald-500/30 bg-zinc-950">
                        {item.avatar ? (
                          <Image src={item.avatar} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-bold text-zinc-400">
                            {item.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-100 leading-tight">{item.name}</h4>
                        <p className="text-xs text-zinc-400">
                          {item.role} {item.company ? `at ${item.company}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-zinc-900/80 border border-zinc-800 rounded-lg px-2 py-1">
                      <div className="flex text-amber-400 text-xs">
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-zinc-300 italic line-clamp-4">&quot;{item.content}&quot;</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-900/80 text-xs mt-4">
                  <span className={`px-2.5 py-0.5 rounded font-medium ${item.isFeatured ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-zinc-800 text-zinc-400"}`}>
                    {item.isFeatured ? "Featured" : "Standard"}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 rounded-lg bg-zinc-800/60 text-zinc-300 hover:bg-zinc-700 hover:text-white transition"
                      title="Edit"
                    >
                      <FiEdit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition"
                      title="Delete"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
