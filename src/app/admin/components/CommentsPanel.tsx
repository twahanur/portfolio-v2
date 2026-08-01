"use client";

import { useState, useEffect } from "react";
import { adminRequest } from "@/lib/admin-api";
import PageHeader from "./ui/PageHeader";
import AdminMessage from "./ui/AdminMessage";
import FormField from "./ui/FormField";
import {
  FiMessageCircle,
  FiTrash2,
  FiEdit2,
  FiSearch,
  FiUser,
  FiClock,
  FiLoader,
  FiX,
  FiCheck,
} from "react-icons/fi";
import Image from "next/image";

export interface BlogComment {
  id: string;
  userName: string;
  content: string;
  profileImage?: string | null;
  createdAt: string;
}

interface CommentsPanelProps {
  initialComments: BlogComment[];
  onRefresh: () => void;
}

export default function CommentsPanel({
  initialComments,
  onRefresh,
}: CommentsPanelProps) {
  const [comments, setComments] = useState<BlogComment[]>(initialComments);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Edit State
  const [editingComment, setEditingComment] = useState<BlogComment | null>(null);
  const [editUserName, setEditUserName] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
  };

  const handleStartEdit = (comment: BlogComment) => {
    setEditingComment(comment);
    setEditUserName(comment.userName);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComment) return;
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      await adminRequest(`/api/comments/${editingComment.id}`, "PUT", {
        userName: editUserName,
        content: editContent,
      });
      showMessage("Comment updated successfully!", "success");
      setEditingComment(null);
      onRefresh();
    } catch (err: any) {
      showMessage(err.message || "Failed to update comment", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      await adminRequest(`/api/comments/${id}`, "DELETE");
      showMessage("Comment deleted successfully!", "success");
      onRefresh();
    } catch (err: any) {
      showMessage(err.message || "Failed to delete comment", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredComments = comments.filter(
    (c) =>
      c.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Comment Moderation"
        description="Review, edit, and moderate user comments posted on your portfolio blog articles."
      />

      <AdminMessage text={message.text} type={message.type as "success" | "error" | ""} />

      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <FiSearch className="absolute left-3.5 top-3 text-zinc-500" size={16} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search comments by author or keyword..."
          className="w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
        />
      </div>

      {/* Edit Modal / Form */}
      {editingComment && (
        <form onSubmit={handleSaveEdit} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-base font-bold text-zinc-100">Edit User Comment</h3>
            <button
              type="button"
              onClick={() => setEditingComment(null)}
              className="text-zinc-400 hover:text-zinc-200"
            >
              <FiX size={18} />
            </button>
          </div>

          <FormField label="Author Name">
            <input
              type="text"
              value={editUserName}
              onChange={(e) => setEditUserName(e.target.value)}
              required
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
            />
          </FormField>

          <FormField label="Comment Body">
            <textarea
              rows={3}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              required
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditingComment(null)}
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-zinc-950 hover:bg-emerald-400 transition"
            >
              {loading && <FiLoader className="animate-spin" />} Save Comment
            </button>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {filteredComments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-800 p-12 text-center text-zinc-500">
            <FiMessageCircle size={40} className="mx-auto mb-3 text-zinc-600" />
            <p className="font-semibold">No comments found.</p>
          </div>
        ) : (
          filteredComments.map((comment) => (
            <div
              key={comment.id}
              className="group relative rounded-2xl border border-zinc-900 bg-zinc-900/30 p-6 hover:border-zinc-800 transition shadow-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center text-zinc-400 font-bold text-sm shrink-0">
                    {comment.profileImage ? (
                      <Image src={comment.profileImage} alt={comment.userName} fill className="object-cover" />
                    ) : (
                      comment.userName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-100 text-sm">{comment.userName}</h4>
                    <p className="text-[11px] text-zinc-500 flex items-center gap-1">
                      <FiClock size={11} />
                      {new Date(comment.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartEdit(comment)}
                    className="p-2 rounded-lg bg-zinc-800/60 text-zinc-300 hover:bg-zinc-700 hover:text-white transition"
                    title="Edit Comment"
                  >
                    <FiEdit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition"
                    title="Delete Comment"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-900 bg-zinc-955/60 p-4 text-sm text-zinc-300 leading-relaxed">
                &quot;{comment.content}&quot;
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
