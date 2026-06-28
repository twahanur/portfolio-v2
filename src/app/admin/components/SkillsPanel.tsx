"use client";

import { useState } from "react";
import { Skill, SkillCategory } from "../types";
import { adminRequest } from "@/lib/admin-api";
import { FiLoader, FiPlus, FiTrash2, FiMove, FiFolder, FiFolderPlus, FiCpu, FiEdit2 } from "react-icons/fi";
import FormField from "./ui/FormField";
import AdminMessage from "./ui/AdminMessage";

interface SkillsPanelProps {
  initialSkills: Skill[];
  initialCategories: SkillCategory[];
  onRefresh: () => void;
}

export default function SkillsPanel({
  initialSkills,
  initialCategories,
  onRefresh,
}: SkillsPanelProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [order, setOrder] = useState(0);
  const [color, setColor] = useState("");
  const [iconColor, setIconColor] = useState("");
  const [iconName, setIconName] = useState("");
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [draggedSkill, setDraggedSkill] = useState<Skill | null>(null);

  // Dynamic Category Form States
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);

  // Set default category when categories change
  useState(() => {
    if (initialCategories.length > 0 && !category) {
      setCategory(initialCategories[0].slug);
    }
  });

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setCategoryLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const slug = newCategoryName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
      await adminRequest("/api/skill-categories", "POST", {
        name: newCategoryName.trim(),
        slug,
        order: initialCategories.length,
      });
      setNewCategoryName("");
      showMessage("Category added successfully!", "success");
      onRefresh();
    } catch (err: any) {
      console.error(err);
      showMessage(err.message || "Failed to add category", "error");
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete the category "${name}"? Skills in this category will remain, but you will need to reclassify them.`
      )
    )
      return;
    setMessage({ text: "", type: "" });

    try {
      await adminRequest(`/api/skill-categories/${id}`, "DELETE");
      showMessage("Category deleted successfully!", "success");
      onRefresh();
    } catch (err: any) {
      console.error(err);
      showMessage(err.message || "Failed to delete category", "error");
    }
  };

  const handleSeedCategories = async () => {
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const defaults = [
        { name: "Backend & Authentication", slug: "backend", order: 0 },
        { name: "Frontend", slug: "frontend", order: 1 },
        { name: "Database", slug: "database", order: 2 },
        { name: "DevOps & Infrastructure", slug: "devops", order: 3 },
        { name: "Architecture & System Design", slug: "architecture", order: 4 },
        { name: "Performance & Realtime", slug: "performance", order: 5 },
        { name: "AI & Integrations & Payments", slug: "ai_payment", order: 6 },
      ];
      for (const cat of defaults) {
        await adminRequest("/api/skill-categories", "POST", cat);
      }
      showMessage("Default categories seeded successfully!", "success");
      onRefresh();
    } catch (err: any) {
      console.error(err);
      showMessage("Failed to seed default categories", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    const activeCategory = category || (initialCategories[0]?.slug ?? "");
    if (!activeCategory) {
      showMessage("Please select or add a category first.", "error");
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const payload = {
        name,
        category: activeCategory,
        order: Number(order),
        color: color.trim() || null,
        iconColor: iconColor.trim() || null,
        iconName: iconName.trim() || null,
      };

      if (editingSkill) {
        await adminRequest(`/api/skills/${editingSkill.id}`, "PUT", payload);
        showMessage("Skill updated successfully!", "success");
        setEditingSkill(null);
      } else {
        await adminRequest("/api/skills", "POST", payload);
        showMessage("Skill added successfully!", "success");
      }
      setName("");
      setOrder(0);
      setColor("");
      setIconColor("");
      setIconName("");
      onRefresh();
    } catch (err: any) {
      console.error(err);
      showMessage(err.message || `Failed to save skill`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setName(skill.name);
    setCategory(skill.category);
    setOrder(skill.order);
    setColor(skill.color || "");
    setIconColor(skill.iconColor || "");
    setIconName(skill.iconName || "");
  };

  const handleCancelEdit = () => {
    setEditingSkill(null);
    setName("");
    setOrder(0);
    setColor("");
    setIconColor("");
    setIconName("");
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    setMessage({ text: "", type: "" });

    try {
      await adminRequest(`/api/skills/${id}`, "DELETE");
      showMessage("Skill deleted successfully!", "success");
      onRefresh();
    } catch (err: any) {
      console.error(err);
      showMessage(err.message || "Failed to delete skill", "error");
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (skill: Skill) => {
    setDraggedSkill(skill);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropToCategory = async (targetCategory: string) => {
    if (!draggedSkill) return;
    if (draggedSkill.category === targetCategory) return;

    try {
      await adminRequest(`/api/skills/${draggedSkill.id}`, "PUT", {
        category: targetCategory,
        order: 999,
      });
      onRefresh();
    } catch (err: any) {
      console.error(err);
      showMessage("Failed to move skill category", "error");
    } finally {
      setDraggedSkill(null);
    }
  };

  const handleDrop = async (targetSkill: Skill, e: React.DragEvent) => {
    e.stopPropagation(); // Prevent bubbling to container drop handler
    if (!draggedSkill || draggedSkill.id === targetSkill.id) return;

    if (draggedSkill.category !== targetSkill.category) {
      try {
        await adminRequest(`/api/skills/${draggedSkill.id}`, "PUT", {
          category: targetSkill.category,
        });

        const catSkills = [
          ...initialSkills.filter(
            (s) => s.category === targetSkill.category && s.id !== draggedSkill.id
          ),
        ].sort((a, b) => a.order - b.order);

        const targetIndex = catSkills.findIndex((s) => s.id === targetSkill.id);
        catSkills.splice(targetIndex, 0, { ...draggedSkill, category: targetSkill.category });

        const promises = catSkills.map((skill, index) => {
          return adminRequest(`/api/skills/${skill.id}`, "PUT", { order: index });
        });
        await Promise.all(promises);
        onRefresh();
      } catch (err: any) {
        console.error(err);
        showMessage("Failed to move skill category and order", "error");
      } finally {
        setDraggedSkill(null);
      }
      return;
    }

    // Dragging within the same category
    const catSkills = initialSkills
      .filter((s) => s.category === draggedSkill.category)
      .sort((a, b) => a.order - b.order);

    const draggedIndex = catSkills.findIndex((s) => s.id === draggedSkill.id);
    const targetIndex = catSkills.findIndex((s) => s.id === targetSkill.id);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const updatedSkills = [...catSkills];
    updatedSkills.splice(draggedIndex, 1);
    updatedSkills.splice(targetIndex, 0, draggedSkill);

    try {
      const promises = updatedSkills.map((skill, index) => {
        const newOrder = index;
        if (skill.order !== newOrder) {
          return adminRequest(`/api/skills/${skill.id}`, "PUT", { order: newOrder });
        }
        return Promise.resolve();
      });
      await Promise.all(promises);
      onRefresh();
    } catch (err: any) {
      console.error("Failed to update skill order:", err);
      showMessage("Failed to update skill ordering", "error");
    } finally {
      setDraggedSkill(null);
    }
  };

  const skillsByCategory = initialCategories.reduce((acc, cat) => {
    acc[cat.slug] = initialSkills.filter((s) => s.category === cat.slug);
    return acc;
  }, {} as Record<string, Skill[]>);

  const categoryOptions = initialCategories.map((c) => ({
    value: c.slug,
    label: c.name,
  }));

  return (
    <div className="space-y-6">
      <AdminMessage
        text={message.text}
        type={message.type as "success" | "error" | ""}
        onDismiss={() => setMessage({ text: "", type: "" })}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Dynamic Category & Skill Forms Column */}
        <div className="space-y-6 lg:col-span-1">
          {/* Add Category Form */}
          <div className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <FiFolder className="text-emerald-400" size={18} />
              <h3 className="text-lg font-bold text-zinc-100">Add Category</h3>
            </div>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <FormField
                label="Category Name"
                required
                placeholder="e.g. Mobile Development, Cloud"
                value={newCategoryName}
                onChange={setNewCategoryName}
              />
              <button
                type="submit"
                disabled={categoryLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-800 border border-zinc-700 py-3 text-sm font-semibold text-zinc-200 shadow hover:bg-zinc-750 transition active:scale-[0.97] disabled:opacity-50"
              >
                {categoryLoading ? (
                  <FiLoader className="animate-spin text-zinc-400" size={18} />
                ) : (
                  <>
                    <FiFolderPlus size={18} />
                    Add Category
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Add / Edit Skill Form */}
          <div className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md h-fit">
            <div className="flex items-center gap-2">
              <FiCpu className="text-emerald-400" size={18} />
              <h3 className="text-lg font-bold text-zinc-100">
                {editingSkill ? "Edit Skill" : "Add Skill"}
              </h3>
            </div>

            <form onSubmit={handleSubmitSkill} className="space-y-4">
              <FormField
                label="Skill Name"
                required
                placeholder="e.g. Prisma ORM, Go, NestJS"
                value={name}
                onChange={setName}
              />

              <FormField
                label="Category"
                type="select"
                required
                options={categoryOptions}
                value={category || (initialCategories[0]?.slug ?? "")}
                onChange={setCategory}
              />

              <FormField
                label="Sorting Order"
                type="number"
                required
                value={order}
                onChange={(val) => setOrder(Number(val))}
              />

              <FormField
                label="Badge Color (Hex Color Code)"
                placeholder="e.g. #6366f1"
                value={color}
                onChange={setColor}
              />

              <FormField
                label="Icon Color (Hex Color Code)"
                placeholder="e.g. #a855f7"
                value={iconColor}
                onChange={setIconColor}
              />

              <FormField
                label="React Icon Name (Optional)"
                placeholder="e.g. FaNodeJs, DiPython"
                value={iconName}
                onChange={setIconName}
              />

              <div className="flex gap-3">
                {editingSkill && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 rounded-xl bg-zinc-800 border border-zinc-700 py-3 text-sm font-semibold text-zinc-300 shadow hover:bg-zinc-750 transition active:scale-[0.97]"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading || initialCategories.length === 0}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold shadow transition active:scale-[0.97] disabled:opacity-50 ${
                    editingSkill ? "bg-emerald-500 text-white hover:bg-emerald-400" : "bg-zinc-100 text-zinc-950 hover:bg-zinc-50"
                  }`}
                >
                  {loading ? (
                    <FiLoader className="animate-spin" size={18} />
                  ) : (
                    <>
                      {editingSkill ? <FiEdit2 size={18} /> : <FiPlus size={18} />}
                      {editingSkill ? "Update Skill" : "Add Skill"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Skills Listing */}
        <div className="space-y-6 lg:col-span-2">
          {initialCategories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-850 bg-zinc-900/5 p-10 text-center flex flex-col items-center justify-center">
              <FiFolder className="text-zinc-650 mb-3" size={32} />
              <p className="text-sm text-zinc-400 mb-4 font-semibold">
                No skill categories configured yet.
              </p>
              <button
                type="button"
                onClick={handleSeedCategories}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-100 px-5 py-2.5 text-sm font-bold text-zinc-950 shadow hover:bg-zinc-50 disabled:opacity-50 transition active:scale-95"
              >
                {loading ? (
                  <FiLoader className="animate-spin text-zinc-955" size={16} />
                ) : (
                  "Seed Default Categories"
                )}
              </button>
            </div>
          ) : (
            initialCategories.map((cat) => {
              const list = skillsByCategory[cat.slug] || [];
              return (
                <div
                  key={cat.id || cat.slug}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDropToCategory(cat.slug)}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/10 p-5 backdrop-blur-md hover:border-zinc-700/80 transition duration-300 min-h-[120px]"
                >
                  <div className="flex items-center justify-between border-b border-zinc-800/85 pb-3">
                    <h4 className="font-bold text-zinc-300">{cat.name}</h4>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="text-zinc-550 hover:text-red-400 transition active:scale-90"
                      title="Delete Category"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                  {list.length === 0 ? (
                    <p className="text-xs text-zinc-500 mt-4 italic">
                      No skills in this category. Drag a skill here.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2.5 mt-4">
                      {list
                        .sort((a, b) => a.order - b.order)
                        .map((skill) => (
                          <span
                            key={skill.id}
                            draggable
                            onDragStart={() => handleDragStart(skill)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(skill, e)}
                            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition cursor-grab active:cursor-grabbing ${
                              draggedSkill?.id === skill.id
                                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                                : editingSkill?.id === skill.id
                                  ? "border-amber-500 bg-amber-500/10 text-amber-400"
                                  : "border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:border-zinc-700"
                            }`}
                            style={{
                              borderColor: skill.color ? `${skill.color}50` : undefined,
                              color: skill.color ? skill.color : undefined,
                            }}
                          >
                            <FiMove size={11} className="text-zinc-500" />
                            {skill.name} ({skill.order})
                            <div className="flex items-center gap-1.5 ml-1 border-l border-zinc-850 pl-1.5">
                              <button
                                type="button"
                                onClick={() => handleEditSkill(skill)}
                                className="text-zinc-500 transition hover:text-amber-400 active:scale-90"
                                title="Edit Skill"
                              >
                                <FiEdit2 size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSkill(skill.id)}
                                className="text-zinc-500 transition hover:text-red-400 active:scale-90"
                                title="Delete Skill"
                              >
                                <FiTrash2 size={12} />
                              </button>
                            </div>
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
