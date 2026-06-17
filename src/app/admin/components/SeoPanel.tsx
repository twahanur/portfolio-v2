"use client";

import { useState } from "react";
import { SeoConfig } from "../seo/page";
import { adminRequest, uploadImage } from "@/lib/admin-api";
import { FiGlobe, FiTrash2, FiEdit2, FiPlus, FiLoader, FiUploadCloud, FiEye, FiCheck } from "react-icons/fi";
import FormField from "./ui/FormField";
import FormActions from "./ui/FormActions";
import PageHeader from "./ui/PageHeader";
import AdminMessage from "./ui/AdminMessage";
import Image from "next/image";

interface SeoPanelProps {
  initialSeoList: SeoConfig[];
  onRefresh: () => void;
}

const PRESET_PAGES = [
  { value: "home", label: "Home Page" },
  { value: "about", label: "About Page" },
  { value: "projects", label: "Projects Page" },
  { value: "experience", label: "Experience Page" },
  { value: "contact", label: "Contact Page" },
];

type FormTab = "basic" | "opengraph" | "structured";

export default function SeoPanel({ initialSeoList, onRefresh }: SeoPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState<FormTab>("basic");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [page, setPage] = useState("home");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywordsInput, setKeywordsInput] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImageUrl, setOgImageUrl] = useState("");
  const [structuredDataInput, setStructuredDataInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
  };

  const resetForm = () => {
    setEditingId(null);
    setPage("home");
    setTitle("");
    setDescription("");
    setKeywordsInput("");
    setOgTitle("");
    setOgDescription("");
    setOgImageUrl("");
    setStructuredDataInput("");
    setShowForm(false);
    setActiveFormTab("basic");
  };

  const handleEdit = (seo: SeoConfig) => {
    setEditingId(seo.id);
    setPage(seo.page);
    setTitle(seo.title);
    setDescription(seo.description);
    setKeywordsInput(seo.keywords.join(", "));
    setOgTitle(seo.ogTitle || "");
    setOgDescription(seo.ogDescription || "");
    setOgImageUrl(seo.ogImage || "");
    setStructuredDataInput(
      seo.structuredData ? JSON.stringify(seo.structuredData, null, 2) : ""
    );
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage({ text: "", type: "" });
    try {
      const url = await uploadImage(file);
      setOgImageUrl(url);
      showMessage("OpenGraph share image uploaded!", "success");
    } catch (err: any) {
      console.error(err);
      showMessage(err.message || "Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    const keywords = keywordsInput
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    let structuredData = null;
    if (structuredDataInput.trim()) {
      try {
        structuredData = JSON.parse(structuredDataInput);
      } catch (err) {
        showMessage("Structured Data has invalid JSON format", "error");
        setLoading(false);
        return;
      }
    }

    const payload = {
      page,
      title,
      description,
      keywords,
      ogTitle: ogTitle || null,
      ogDescription: ogDescription || null,
      ogImage: ogImageUrl || null,
      structuredData,
    };

    try {
      // Upsert uses POST endpoint which updates if matching page is found
      await adminRequest("/api/seo", "POST", payload);
      showMessage(
        editingId ? "SEO tags updated successfully!" : "SEO configuration upserted successfully!",
        "success"
      );
      resetForm();
      onRefresh();
    } catch (err: any) {
      console.error(err);
      showMessage(err.message || "Failed to save SEO config", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this SEO configuration?")) return;
    setMessage({ text: "", type: "" });
    try {
      await adminRequest(`/api/seo/${id}`, "DELETE");
      showMessage("SEO settings deleted successfully!", "success");
      onRefresh();
    } catch (err: any) {
      console.error(err);
      showMessage(err.message || "Failed to delete SEO settings", "error");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="SEO Configurator"
        description="Optimize titles, keywords, OpenGraph meta properties, and JSON-LD structured data"
        actionLabel="Upsert SEO"
        actionIcon={FiPlus}
        onAction={() => setShowForm(true)}
        showAction={!showForm}
      />

      <AdminMessage
        text={message.text}
        type={message.type as "success" | "error" | ""}
        onDismiss={() => setMessage({ text: "", type: "" })}
      />

      {showForm ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-in fade-in duration-300">
          {/* SEO Input form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h4 className="font-bold text-zinc-200">
                {editingId ? "Modify SEO Metadata" : "Configure Page SEO"}
              </h4>
              <button
                type="button"
                onClick={resetForm}
                className="text-zinc-500 hover:text-zinc-300 font-semibold text-xs"
              >
                Close Editor
              </button>
            </div>

            {/* Tab buttons */}
            <div className="flex gap-2 border-b border-zinc-850 pb-2">
              {(["basic", "opengraph", "structured"] as FormTab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveFormTab(tab)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition ${
                    activeFormTab === tab
                      ? "bg-emerald-500/10 text-emerald-450 border border-emerald-500/20"
                      : "text-zinc-500 hover:text-zinc-350"
                  }`}
                >
                  {tab === "basic" && "Basic Tags"}
                  {tab === "opengraph" && "OpenGraph / Social"}
                  {tab === "structured" && "Structured Data"}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: Basic tags */}
            {activeFormTab === "basic" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <FormField
                  label="Target Website Page"
                  type="select"
                  required
                  options={PRESET_PAGES}
                  value={page}
                  onChange={setPage}
                  disabled={editingId !== null}
                />

                <FormField
                  label="Meta Title (recommended < 60 chars)"
                  required
                  placeholder="e.g. John Doe | Senior Back End Developer"
                  value={title}
                  onChange={setTitle}
                />

                <FormField
                  label="Meta Description (recommended 120-160 chars)"
                  type="textarea"
                  rows={3}
                  required
                  placeholder="e.g. Portfolio showcasing event platform backends, microservices design, and API optimization."
                  value={description}
                  onChange={setDescription}
                />

                <FormField
                  label="Meta Keywords (comma-separated)"
                  required
                  placeholder="backend developer, microservices, nodejs, postgresql"
                  value={keywordsInput}
                  onChange={setKeywordsInput}
                />
              </div>
            )}

            {/* TAB CONTENT: OpenGraph */}
            {activeFormTab === "opengraph" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <FormField
                  label="OpenGraph Title (default: Meta Title)"
                  placeholder="e.g. Specialized backend engineer portfolio"
                  value={ogTitle}
                  onChange={setOgTitle}
                />

                <FormField
                  label="OpenGraph Description (default: Meta Description)"
                  type="textarea"
                  rows={3}
                  placeholder="e.g. Check out my software case studies and system architectures."
                  value={ogDescription}
                  onChange={setOgDescription}
                />

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-zinc-350">OpenGraph Share Image URL</label>
                  {ogImageUrl ? (
                    <div className="relative aspect-[1.91/1] w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
                      <Image src={ogImageUrl} alt="OpenGraph Card preview" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => setOgImageUrl("")}
                        className="absolute right-2 top-2 rounded-lg bg-zinc-950/80 px-2 py-1 text-xs text-red-400 border border-zinc-800 transition hover:bg-zinc-900"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-850 bg-zinc-955/20 rounded-xl p-8 cursor-pointer hover:border-emerald-500/40 hover:bg-zinc-950/40 transition">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                      {uploading ? (
                        <FiLoader className="animate-spin text-emerald-450" size={24} />
                      ) : (
                        <>
                          <FiUploadCloud className="text-zinc-550 mb-2" size={24} />
                          <span className="text-xs text-zinc-400 font-semibold">Upload OG Share Graphic</span>
                          <span className="text-[10px] text-zinc-600 mt-1">1200x630 (landscape) recommended</span>
                        </>
                      )}
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: Structured data */}
            {activeFormTab === "structured" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <FormField
                  label="JSON-LD Structured Data Schema (paste raw JSON)"
                  type="textarea"
                  rows={10}
                  placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "Person",\n  "name": "Jane Doe"\n}`}
                  value={structuredDataInput}
                  onChange={setStructuredDataInput}
                />
                <p className="text-[10px] text-zinc-550 leading-relaxed">
                  Use structured data (JSON-LD schemas) to provide search engines like Google with rich snippets (e.g. Person, WebSite, ProfessionalService). Ensure valid JSON syntax.
                </p>
              </div>
            )}

            <FormActions
              loading={loading || uploading}
              submitLabel={editingId ? "Save SEO Changes" : "Upsert SEO Page"}
              onCancel={resetForm}
            />
          </form>

          {/* Real-time Previews Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <FiEye /> Real-time SEO Preview
            </h4>

            {/* Google Search Preview */}
            <div className="rounded-2xl border border-zinc-900 bg-zinc-900/10 p-5 space-y-2.5 shadow backdrop-blur-sm">
              <span className="text-[10px] font-black text-zinc-500 tracking-wide uppercase">Google snippet preview</span>
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                  https://myportfolio.com <span className="text-[8px] font-bold">› {page}</span>
                </span>
                <h4 className="text-blue-400 font-medium text-base hover:underline cursor-pointer line-clamp-1 leading-tight">
                  {title || "Please enter a meta title"}
                </h4>
                <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed">
                  {description || "Meta description snippet will display here to describe page contents."}
                </p>
              </div>
            </div>

            {/* Facebook Share Preview */}
            <div className="rounded-2xl border border-zinc-900 bg-zinc-900/10 overflow-hidden shadow backdrop-blur-sm">
              <div className="p-4 border-b border-zinc-900/40">
                <span className="text-[10px] font-black text-zinc-500 tracking-wide uppercase">Social card preview</span>
              </div>
              <div className="relative aspect-[1.91/1] w-full bg-zinc-950 border-b border-zinc-900 flex items-center justify-center text-zinc-650 overflow-hidden">
                {ogImageUrl ? (
                  <Image src={ogImageUrl} alt="Card preview" fill className="object-cover" />
                ) : (
                  <FiGlobe size={32} />
                )}
              </div>
              <div className="p-4 bg-zinc-900/30 space-y-1">
                <span className="text-[9px] text-zinc-550 uppercase tracking-widest font-bold">MYPORTFOLIO.COM</span>
                <h4 className="text-zinc-200 font-bold text-xs truncate">
                  {ogTitle || title || "Share Title"}
                </h4>
                <p className="text-zinc-500 text-[10px] line-clamp-2 leading-normal">
                  {ogDescription || description || "Detailed social sharing card description goes here."}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* LIST VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {initialSeoList.map((seo) => (
            <div
              key={seo.id}
              className="group rounded-2xl border border-zinc-800 bg-zinc-900/10 p-5 backdrop-blur-md hover:border-zinc-700/80 transition duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-zinc-850 pb-2.5 mb-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-450 capitalize">
                    <FiGlobe size={13} /> {seo.page} page
                  </span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(seo)}
                      className="rounded p-1.5 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200 transition"
                      title="Edit"
                    >
                      <FiEdit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(seo.id)}
                      className="rounded p-1.5 text-red-400 hover:bg-red-500/10 transition"
                      title="Delete"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                </div>
                <h4 className="font-bold text-zinc-200 text-sm line-clamp-1">{seo.title}</h4>
                <p className="text-xs text-zinc-450 mt-1.5 line-clamp-2 leading-relaxed">{seo.description}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {seo.keywords.slice(0, 4).map((kw) => (
                    <span
                      key={kw}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-850 text-zinc-500"
                    >
                      {kw}
                    </span>
                  ))}
                  {seo.keywords.length > 4 && (
                    <span className="text-[9px] text-zinc-550 pt-0.5 ml-0.5">+{seo.keywords.length - 4} more</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
