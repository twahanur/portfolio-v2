"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useRef, useEffect } from "react";
import { Blog } from "../types";
import { adminRequest, uploadImage } from "@/lib/admin-api";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiArrowLeft,
  FiImage,
  FiLoader,
  FiEye,
  FiEdit,
  FiBold,
  FiItalic,
  FiCode,
  FiLink,
  FiList,
  FiBookOpen,
} from "react-icons/fi";
import Image from "next/image";
import PageHeader from "./ui/PageHeader";
import AdminMessage from "./ui/AdminMessage";
import FormField from "./ui/FormField";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";


interface BlogsPanelProps {
  initialBlogs: Blog[];
  onRefresh: () => void;
}

export default function BlogsPanel({ initialBlogs, onRefresh }: BlogsPanelProps) {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [author, setAuthor] = useState("Admin");
  const [keywordsText, setKeywordsText] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    setBlogs(initialBlogs);
  }, [initialBlogs]);

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
  };

  const handleEdit = (blog: Blog) => {
    setCurrentBlog(blog);
    setTitle(blog.title);
    setDescription(blog.description);
    setImage(blog.image);
    setAuthor(blog.author || "Admin");
    setKeywordsText(blog.keywords?.join(", ") || "");
    setIsEditing(true);
    setActiveTab("edit");
  };

  const handleAdd = () => {
    setCurrentBlog(null);
    setTitle("");
    setDescription("");
    setImage("");
    setAuthor("Admin");
    setKeywordsText("");
    setIsEditing(true);
    setActiveTab("edit");
  };

  const handleBack = () => {
    setIsEditing(false);
    setCurrentBlog(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    setMessage({ text: "", type: "" });

    try {
      await adminRequest(`/api/blogs/${id}`, "DELETE");
      showMessage("Blog deleted successfully!", "success");
      onRefresh();
    } catch (err: any) {
      console.error(err);
      showMessage(err.message || "Failed to delete blog", "error");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage({ text: "", type: "" });

    try {
      const url = await uploadImage(file);
      setImage(url);
      showMessage("Cover image uploaded successfully!", "success");
    } catch (err: any) {
      console.error(err);
      showMessage(err.message || "Failed to upload image", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    const keywords = keywordsText
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const payload = {
      title,
      description,
      image,
      author,
      keywords,
      publishedAt: currentBlog ? currentBlog.publishedAt : new Date().toISOString(),
    };

    try {
      if (currentBlog) {
        await adminRequest(`/api/blogs/${currentBlog.id}`, "PUT", payload);
        showMessage("Blog updated successfully!", "success");
      } else {
        await adminRequest("/api/blogs", "POST", payload);
        showMessage("Blog created successfully!", "success");
      }
      setIsEditing(false);
      onRefresh();
    } catch (err: any) {
      console.error(err);
      showMessage(err.message || "Failed to save blog", "error");
    } finally {
      setLoading(false);
    }
  };

  // Markdown Helper functions
  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = document.getElementById("blog-content-area") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;
    const selected = currentText.substring(start, end);
    const replacement = before + selected + after;

    const newText =
      currentText.substring(0, start) + replacement + currentText.substring(end);
    setDescription(newText);

    // Reposition cursor after DOM update
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selected.length
      );
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Top message banner */}
      <AdminMessage
        text={message.text}
        type={message.type as "success" | "error" | ""}
        onDismiss={() => setMessage({ text: "", type: "" })}
      />

      {!isEditing ? (
        // --- 1. LISTING VIEW ---
        <div className="space-y-6 animate-in fade-in duration-300">
          <PageHeader
            title="Blogs"
            description="Write and publish professional articles, tutorials, and insights"
            actionLabel="Add Blog"
            actionIcon={FiPlus}
            onAction={handleAdd}
            showAction={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="group rounded-2xl border border-zinc-900 bg-zinc-900/10 hover:border-zinc-800 transition duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Card Image */}
                  <div className="relative h-44 w-full bg-zinc-950 overflow-hidden border-b border-zinc-900">
                    {blog.image ? (
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-zinc-500 text-xs font-bold">
                        NO COVER IMAGE
                      </div>
                    )}
                  </div>
                  {/* Card Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {blog.keywords?.slice(0, 3).map((kw, i) => (
                        <span
                          key={i}
                          className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20"
                        >
                          #{kw}
                        </span>
                      ))}
                    </div>
                    <h4 className="font-bold text-zinc-100 text-base leading-snug group-hover:text-emerald-400 transition truncate-2-lines">
                      {blog.title}
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-3">
                      {blog.description.replace(/[#*`]/g, "")}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-5 border-t border-zinc-900/60 bg-zinc-900/5 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 font-semibold">
                    {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(blog)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/40 px-2.5 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 transition active:scale-95"
                    >
                      <FiEdit2 size={12} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(blog.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/15 transition active:scale-95"
                    >
                      <FiTrash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {blogs.length === 0 && (
              <div className="col-span-full border border-dashed border-zinc-800 rounded-3xl p-12 text-center text-zinc-500">
                <FiBookOpen size={40} className="mx-auto mb-4 text-zinc-600" />
                <h5 className="font-bold text-zinc-400 text-base">No Blog Posts Yet</h5>
                <p className="text-xs mt-1">Click Add Blog to write your first professional article.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // --- 2. EDITING / CREATION VIEW ---
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="rounded-xl border border-zinc-900 hover:border-zinc-800 bg-zinc-950 p-2 text-zinc-400 hover:text-zinc-200 transition"
              >
                <FiArrowLeft size={16} />
              </button>
              <div>
                <h3 className="text-xl font-bold text-zinc-100">
                  {currentBlog ? "Edit Blog Post" : "Create Blog Post"}
                </h3>
                <p className="text-xs text-zinc-400">
                  Design a professional post formatted with markdown and formulas
                </p>
              </div>
            </div>
            {/* View/Edit Toggle */}
            <div className="flex rounded-xl bg-zinc-950 p-1 border border-zinc-900">
              <button
                type="button"
                onClick={() => setActiveTab("edit")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === "edit"
                    ? "bg-zinc-900 text-emerald-450 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <FiEdit size={13} /> Edit Content
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === "preview"
                    ? "bg-zinc-900 text-emerald-450 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <FiEye size={13} /> Live Preview
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === "edit" ? (
              // --- FORM EDITING COLUMNS ---
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Meta Inputs (Left 1 Col) */}
                <div className="space-y-6 lg:col-span-1">
                  <div className="space-y-4 rounded-2xl border border-zinc-900 bg-zinc-900/10 p-5">
                    <h4 className="text-xs font-black text-zinc-450 uppercase tracking-wider">
                      Post Metadata
                    </h4>

                    <FormField
                      label="Blog Title"
                      required
                      value={title}
                      onChange={setTitle}
                      placeholder="e.g. Building Scalable Web APIs"
                    />

                    <FormField
                      label="Author Name"
                      required
                      value={author}
                      onChange={setAuthor}
                    />

                    <div className="space-y-1">
                      <FormField
                        label="Keywords / Tags"
                        value={keywordsText}
                        onChange={setKeywordsText}
                        placeholder="e.g. Next.js, Node.js, Prisma"
                      />
                      <p className="text-[10px] text-zinc-500 font-semibold px-1">Separate tags with commas</p>
                    </div>

                    {/* Image Uploader */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400">Cover Image</label>
                      <div className="relative h-40 w-full overflow-hidden rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-center group">
                        {image ? (
                          <>
                            <Image src={image} alt="Cover Preview" fill className="object-cover" />
                            <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                disabled={uploading}
                              />
                              {uploading ? (
                                <FiLoader className="animate-spin text-zinc-200" size={20} />
                              ) : (
                                <FiImage className="text-zinc-200" size={24} />
                              )}
                            </label>
                          </>
                        ) : (
                          <label className="flex flex-col items-center gap-2 cursor-pointer text-zinc-600 hover:text-zinc-400 transition p-4 text-center">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              disabled={uploading}
                            />
                            {uploading ? (
                              <FiLoader className="animate-spin text-zinc-400" size={24} />
                            ) : (
                              <FiImage size={24} />
                            )}
                            <span className="text-[11px] font-bold">
                              {uploading ? "Uploading Image..." : "Upload Cover Image"}
                            </span>
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Editor Content Area (Right 2 Cols) */}
                <div className="lg:col-span-2 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-t-xl border-b-0">
                    <div className="flex flex-wrap items-center gap-1">
                      {/* Markdown helper buttons */}
                      <button
                        type="button"
                        onClick={() => insertMarkdown("# ", "\n")}
                        className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 text-xs font-black"
                        title="Heading 1"
                      >
                        H1
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown("## ", "\n")}
                        className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 text-xs font-black"
                        title="Heading 2"
                      >
                        H2
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown("### ", "\n")}
                        className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 text-xs font-black"
                        title="Heading 3"
                      >
                        H3
                      </button>
                      <div className="w-[1px] h-4 bg-zinc-800 mx-1" />
                      <button
                        type="button"
                        onClick={() => insertMarkdown("**", "**")}
                        className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                        title="Bold"
                      >
                        <FiBold size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown("*", "*")}
                        className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                        title="Italic"
                      >
                        <FiItalic size={13} />
                      </button>
                      <div className="w-[1px] h-4 bg-zinc-800 mx-1" />
                      <button
                        type="button"
                        onClick={() => insertMarkdown("\n```javascript\n", "\n```\n")}
                        className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                        title="Code Block"
                      >
                        <FiCode size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown("\n$$\n", "\n$$\n")}
                        className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 text-xs font-bold"
                        title="Math Equation Block (LaTeX)"
                      >
                        $$
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown("$", "$")}
                        className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 text-xs font-bold"
                        title="Inline Math Equation"
                      >
                        $
                      </button>
                      <div className="w-[1px] h-4 bg-zinc-800 mx-1" />
                      <button
                        type="button"
                        onClick={() => insertMarkdown("[", "](url)")}
                        className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                        title="Add Link"
                      >
                        <FiLink size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown("![alt](", ")")}
                        className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                        title="Add Image"
                      >
                        <FiImage size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown("- ", "\n")}
                        className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                        title="List Item"
                      >
                        <FiList size={13} />
                      </button>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-medium">
                      Markdown & Math Enabled
                    </span>
                  </div>

                  <textarea
                    id="blog-content-area"
                    required
                    rows={20}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write your blog post here using Markdown... For formulas use LaTeX: $ \lambda $ or $$ E = mc^2 $$"
                    className="w-full rounded-b-xl border border-zinc-900 bg-zinc-950 p-4 text-sm text-zinc-100 placeholder-zinc-650 focus:border-zinc-850 focus:outline-none font-mono leading-relaxed"
                  />
                </div>
              </div>
            ) : (
              // --- LIVE PREVIEW COLUMN PANEL ---
              <div className="rounded-3xl border border-zinc-900 bg-[#030014] p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
                    {title || "Untitled Blog Post"}
                  </h2>
                  <div className="text-xs text-gray-400 flex items-center gap-4">
                    <span>Published: {new Date().toLocaleDateString()}</span>
                    <span>&bull;</span>
                    <span>Author: {author}</span>
                  </div>
                  <div className="relative h-[2px] w-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                </div>

                {image && (
                  <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-white/5">
                    <img src={image} alt={title} className="w-full h-full object-cover rounded-2xl" />
                  </div>
                )}

                {/* Professional Blog Layout Typography Rendering */}
                <div className="prose prose-invert max-w-full text-slate-350 leading-relaxed font-sans text-base md:text-lg">
                  <div className="dark:prose-invert prose-img:rounded-lg prose-headings:text-zinc-100 prose-headings:font-bold prose-a:text-emerald-450 prose-code:text-[#3CBFEE] prose-code:bg-zinc-900/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                      {description || "*No content written yet. Switch to the 'Edit Content' tab to start writing.*"}
                    </ReactMarkdown>
                  </div>
                </div>

                {keywordsText && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-900">
                    {keywordsText.split(",").map((k, i) => {
                      const tag = k.trim();
                      return tag ? (
                        <span key={i} className="bg-blue-500/10 text-blue-400 py-1 rounded-xl px-3 text-xs md:text-sm">
                          #{tag}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Bottom Actions Form Bar */}
            <div className="flex justify-end gap-3 pt-6 border-t border-zinc-900">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 px-5 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-900 transition active:scale-[0.97]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploading}
                className="flex items-center justify-center gap-2 rounded-xl bg-zinc-100 px-6 py-2.5 text-xs font-black text-zinc-950 shadow hover:bg-zinc-50 disabled:opacity-50 transition active:scale-[0.97]"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin text-zinc-950" size={14} />
                    <span>Publishing...</span>
                  </>
                ) : (
                  "Publish Article"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
