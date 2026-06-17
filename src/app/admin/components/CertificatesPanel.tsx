"use client";

import { useState } from "react";
import { Certificate } from "../types";
import { adminRequest, uploadImage } from "@/lib/admin-api";
import { FiLoader, FiPlus, FiTrash2, FiExternalLink, FiUploadCloud, FiMove } from "react-icons/fi";
import Image from "next/image";
import FormField from "./ui/FormField";
import AdminMessage from "./ui/AdminMessage";

interface CertificatesPanelProps {
  initialCertificates: Certificate[];
  onRefresh: () => void;
}

export default function CertificatesPanel({
  initialCertificates,
  onRefresh,
}: CertificatesPanelProps) {
  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [order, setOrder] = useState(0);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [draggedCert, setDraggedCert] = useState<Certificate | null>(null);

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
      showMessage("Certificate image uploaded successfully!", "success");
    } catch (err: any) {
      console.error(err);
      showMessage(err.message || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      showMessage("Please upload a certificate image.", "error");
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      await adminRequest("/api/certificates", "POST", {
        name,
        issuer,
        issueDate: issueDate || null,
        credentialId: credentialId || null,
        credentialUrl: credentialUrl || null,
        imageUrl,
        order: Number(order),
      });

      setName("");
      setIssuer("");
      setIssueDate("");
      setCredentialId("");
      setCredentialUrl("");
      setImageUrl("");
      setOrder(0);

      showMessage("Certificate added successfully!", "success");
      onRefresh();
    } catch (err: any) {
      console.error(err);
      showMessage(err.message || "Failed to add certificate", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;
    setMessage({ text: "", type: "" });

    try {
      await adminRequest(`/api/certificates/${id}`, "DELETE");
      showMessage("Certificate deleted successfully!", "success");
      onRefresh();
    } catch (err: any) {
      console.error(err);
      showMessage(err.message || "Failed to delete certificate", "error");
    }
  };

  // Drag and drop handlers
  const handleDragStart = (cert: Certificate) => {
    setDraggedCert(cert);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetCert: Certificate) => {
    if (!draggedCert || draggedCert.id === targetCert.id) return;

    const sortedCerts = [...initialCertificates].sort((a, b) => a.order - b.order);
    const draggedIndex = sortedCerts.findIndex((c) => c.id === draggedCert.id);
    const targetIndex = sortedCerts.findIndex((c) => c.id === targetCert.id);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const updatedCerts = [...sortedCerts];
    updatedCerts.splice(draggedIndex, 1);
    updatedCerts.splice(targetIndex, 0, draggedCert);

    try {
      const promises = updatedCerts.map((cert, index) => {
        const newOrder = index;
        if (cert.order !== newOrder) {
          return adminRequest(`/api/certificates/${cert.id}`, "PUT", { order: newOrder });
        }
        return Promise.resolve();
      });
      await Promise.all(promises);
      onRefresh();
    } catch (err: any) {
      console.error("Failed to update certificates order:", err);
      showMessage("Failed to update certificates ordering", "error");
    } finally {
      setDraggedCert(null);
    }
  };

  return (
    <div className="space-y-6">
      <AdminMessage
        text={message.text}
        type={message.type as "success" | "error" | ""}
        onDismiss={() => setMessage({ text: "", type: "" })}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Add Certificate Form */}
        <div className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md lg:col-span-1 h-fit">
          <div>
            <h3 className="text-xl font-bold text-zinc-100">Add Certificate</h3>
            <p className="text-sm text-zinc-400">Upload and save a new certification credential</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Certificate Name"
              required
              placeholder="e.g. Advanced Node.js & Microservices"
              value={name}
              onChange={setName}
            />

            <FormField
              label="Issuer / Provider"
              required
              placeholder="e.g. Coursera / Google"
              value={issuer}
              onChange={setIssuer}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Issue Date"
                placeholder="e.g. Feb 2026"
                value={issueDate}
                onChange={setIssueDate}
              />
              <FormField
                label="Sort Order"
                type="number"
                value={order}
                onChange={(val) => setOrder(Number(val))}
              />
            </div>

            <FormField
              label="Credential ID (Optional)"
              value={credentialId}
              onChange={setCredentialId}
            />

            <FormField
              label="Verification URL (Optional)"
              type="url"
              value={credentialUrl}
              onChange={setCredentialUrl}
            />

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-zinc-350">Certificate Image</label>
              {imageUrl ? (
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-zinc-850">
                  <Image src={imageUrl} alt="Uploaded badge preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="absolute right-2 top-2 rounded-lg bg-zinc-950/80 px-2 py-1 text-xs text-red-400 border border-zinc-800 transition hover:bg-zinc-900"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 bg-zinc-950/20 rounded-xl p-6 cursor-pointer hover:border-emerald-500/40 hover:bg-zinc-950/40 transition">
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
                      <span className="text-xs text-zinc-400 font-semibold text-center">Upload Certificate Image</span>
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
                  <FiPlus size={18} />
                  Add Certificate
                </>
              )}
            </button>
          </form>
        </div>

        {/* Certificates List */}
        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {initialCertificates
              .sort((a, b) => a.order - b.order)
              .map((cert) => (
                <div
                  key={cert.id}
                  draggable
                  onDragStart={() => handleDragStart(cert)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(cert)}
                  className={`group relative overflow-hidden rounded-2xl border p-4 backdrop-blur-md flex flex-col hover:border-zinc-700/80 transition duration-300 cursor-grab active:cursor-grabbing ${
                    draggedCert?.id === cert.id
                      ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                      : "border-zinc-800/80 bg-zinc-900/20"
                  }`}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-zinc-950">
                    <Image src={cert.imageUrl} alt={cert.name} fill className="object-cover group-hover:scale-103 transition duration-500" />
                    <div className="absolute left-2 top-2 rounded-lg bg-zinc-950/70 p-1.5 text-zinc-300 border border-zinc-800 pointer-events-none opacity-0 group-hover:opacity-100 transition duration-200">
                      <FiMove size={14} />
                    </div>
                  </div>
                  <div className="mt-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-zinc-200 line-clamp-1">{cert.name}</h4>
                      <p className="text-xs text-zinc-400 mt-1">{cert.issuer}</p>
                      {cert.issueDate && (
                        <p className="text-[10px] text-zinc-550 uppercase font-semibold tracking-wider mt-1">
                          Issued {cert.issueDate}
                        </p>
                      )}
                    </div>
                    <div>
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-350 mt-3.5 font-semibold transition"
                        >
                          Verify Credential <FiExternalLink size={12} />
                        </a>
                      )}
                      <div className="mt-4 border-t border-zinc-850 pt-3 flex justify-between items-center">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                          Order: {cert.order}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDelete(cert.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/15 transition active:scale-95"
                        >
                          <FiTrash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
