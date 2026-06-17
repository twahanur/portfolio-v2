"use client";

import { useState } from "react";
import { Education } from "../types";
import { adminRequest } from "@/lib/admin-api";
import { FiPlus, FiTrash2, FiEdit2, FiX, FiMove } from "react-icons/fi";
import FormField from "./ui/FormField";
import FormActions from "./ui/FormActions";
import PageHeader from "./ui/PageHeader";
import AdminMessage from "./ui/AdminMessage";

interface EducationPanelProps {
  initialEducations: Education[];
  onRefresh: () => void;
}

export default function EducationPanel({
  initialEducations,
  onRefresh,
}: EducationPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [examTitle, setExamTitle] = useState("");
  const [major, setMajor] = useState("");
  const [institute, setInstitute] = useState("");
  const [result, setResult] = useState("");
  const [passingYear, setPassingYear] = useState<number>(new Date().getFullYear());
  const [duration, setDuration] = useState("");
  const [order, setOrder] = useState(0);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [draggedEdu, setDraggedEdu] = useState<Education | null>(null);

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
  };

  const resetForm = () => {
    setEditingId(null);
    setExamTitle("");
    setMajor("");
    setInstitute("");
    setResult("");
    setPassingYear(new Date().getFullYear());
    setDuration("");
    setOrder(0);
    setShowForm(false);
  };

  const handleEdit = (edu: Education) => {
    setEditingId(edu.id);
    setExamTitle(edu.examTitle);
    setMajor(edu.major);
    setInstitute(edu.institute);
    setResult(edu.result);
    setPassingYear(edu.passingYear);
    setDuration(edu.duration);
    setOrder(edu.order);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    const payload = {
      examTitle,
      major,
      institute,
      result,
      passingYear: Number(passingYear),
      duration,
      order: Number(order),
    };

    try {
      if (editingId) {
        await adminRequest(`/api/educations/${editingId}`, "PUT", payload);
        showMessage("Education qualification updated successfully!", "success");
      } else {
        await adminRequest("/api/educations", "POST", payload);
        showMessage("Education qualification added successfully!", "success");
      }
      resetForm();
      onRefresh();
    } catch (err: any) {
      console.error(err);
      showMessage(err.message || "Operation failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education entry?")) return;
    setMessage({ text: "", type: "" });

    try {
      await adminRequest(`/api/educations/${id}`, "DELETE");
      showMessage("Education entry deleted successfully!", "success");
      onRefresh();
    } catch (err: any) {
      console.error(err);
      showMessage(err.message || "Failed to delete education", "error");
    }
  };

  // Drag and drop ordering
  const handleDragStart = (edu: Education) => {
    setDraggedEdu(edu);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetEdu: Education) => {
    if (!draggedEdu || draggedEdu.id === targetEdu.id) return;

    const sortedEdus = [...initialEducations].sort((a, b) => a.order - b.order);
    const draggedIndex = sortedEdus.findIndex((e) => e.id === draggedEdu.id);
    const targetIndex = sortedEdus.findIndex((e) => e.id === targetEdu.id);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const updatedEdus = [...sortedEdus];
    updatedEdus.splice(draggedIndex, 1);
    updatedEdus.splice(targetIndex, 0, draggedEdu);

    try {
      const promises = updatedEdus.map((edu, index) => {
        const newOrder = index;
        if (edu.order !== newOrder) {
          return adminRequest(`/api/educations/${edu.id}`, "PUT", { order: newOrder });
        }
        return Promise.resolve();
      });
      await Promise.all(promises);
      onRefresh();
    } catch (err: any) {
      console.error("Failed to update education order:", err);
      showMessage("Failed to update education ordering", "error");
    } finally {
      setDraggedEdu(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Education Details"
        description="Manage your academic qualifications and certifications timeline"
        actionLabel="Add Academic Entry"
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
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md animate-in fade-in duration-300"
        >
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h4 className="font-bold text-zinc-200">
              {editingId ? "Edit Education Entry" : "Add New Education Entry"}
            </h4>
            <button
              type="button"
              onClick={resetForm}
              className="text-zinc-400 transition hover:text-zinc-200"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              label="Degree / Exam Title (e.g. BSc, HSC)"
              required
              value={examTitle}
              onChange={setExamTitle}
              placeholder="Bachelor of Science (BSc)"
            />

            <FormField
              label="Major / Field of Study"
              required
              value={major}
              onChange={setMajor}
              placeholder="Computer Science & Engineering"
            />

            <FormField
              label="Institute Name"
              required
              value={institute}
              onChange={setInstitute}
              placeholder="University Name"
            />

            <FormField
              label="Result / Grade (e.g. Enrolled, CGPA 4.0)"
              required
              value={result}
              onChange={setResult}
              placeholder="CGPA: 3.90 or Enrolled"
            />

            <FormField
              label="Passing Year / Expected Graduation"
              type="number"
              required
              value={passingYear}
              onChange={(val) => setPassingYear(Number(val))}
            />

            <FormField
              label="Duration (e.g. 4 years, 2 years)"
              required
              value={duration}
              onChange={setDuration}
              placeholder="4 years"
            />

            <FormField
              label="Display Order"
              type="number"
              required
              value={order}
              onChange={(val) => setOrder(Number(val))}
            />
          </div>

          <FormActions
            loading={loading}
            submitLabel={editingId ? "Save Entry" : "Create Entry"}
            onCancel={resetForm}
          />
        </form>
      ) : (
        <div className="space-y-4">
          {initialEducations.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 border-dashed p-10 text-center">
              <p className="text-zinc-500">No education qualifications configured. Database falls back to static profile defaults.</p>
            </div>
          ) : (
            initialEducations
              .sort((a, b) => a.order - b.order)
              .map((edu) => (
                <div
                  key={edu.id}
                  draggable
                  onDragStart={() => handleDragStart(edu)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(edu)}
                  className={`group rounded-2xl border p-5 backdrop-blur-md flex flex-col md:flex-row md:items-start md:justify-between gap-4 hover:border-zinc-700/80 transition duration-300 cursor-grab active:cursor-grabbing ${
                    draggedEdu?.id === edu.id
                      ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                      : "border-zinc-800 bg-zinc-900/10"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="mt-1 text-zinc-500 opacity-60 group-hover:opacity-100 transition duration-200">
                      <FiMove size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-100 text-lg">
                        {edu.examTitle} in <span className="text-emerald-400 font-semibold">{edu.major}</span>
                      </h4>
                      <p className="text-zinc-350 text-sm mt-1">{edu.institute}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-zinc-400 mt-2 uppercase font-semibold tracking-wider">
                        <span>{edu.duration}</span>
                        <span>•</span>
                        <span>Year: {edu.passingYear}</span>
                        <span>•</span>
                        <span className="text-emerald-500">{edu.result}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 self-end md:self-start">
                    <button
                      type="button"
                      onClick={() => handleEdit(edu)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 transition active:scale-95"
                    >
                      <FiEdit2 size={13} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(edu.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/15 transition active:scale-95"
                    >
                      <FiTrash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
}
