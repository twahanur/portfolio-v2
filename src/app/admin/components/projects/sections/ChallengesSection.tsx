"use client";

import { FiEdit3, FiLoader, FiCheck, FiPlus, FiX } from "react-icons/fi";
import { Project, ChallengeSolution } from "../../../types";
import FormField from "../../ui/FormField";

interface ChallengesSectionProps {
  formData: Partial<Project>;
  onChange: (fields: Partial<Project>) => void;
  isEditing: boolean;
  loading: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  isNewProject?: boolean;
}

export default function ChallengesSection({
  formData,
  onChange,
  isEditing,
  loading,
  onEdit,
  onSave,
  onCancel,
  isNewProject = false,
}: ChallengesSectionProps) {
  const showControls = !isNewProject;
  const challengeSolutions = formData.challengeSolutions || [];

  const updateChallengeSolution = (index: number, field: "challenge" | "solution", value: string) => {
    const updated = challengeSolutions.map((item: ChallengeSolution, idx: number) =>
      idx === index ? { ...item, [field]: value } : item
    );
    onChange({ challengeSolutions: updated });
  };

  const addChallenge = () => {
    onChange({ challengeSolutions: [...challengeSolutions, { challenge: "", solution: "" }] });
  };

  const removeChallenge = (index: number) => {
    onChange({ challengeSolutions: challengeSolutions.filter((_: any, idx: number) => idx !== index) });
  };

  return (
    <div className="rounded-2xl border border-zinc-900 bg-zinc-900/10 p-5 mb-6 hover:border-zinc-800/80 transition group relative">
      {showControls && (
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-emerald-400 text-sm tracking-wide uppercase">
            4. Challenges & Technical Solutions
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
          <div className="flex justify-between items-center">
            {isNewProject ? (
              <h4 className="font-bold text-emerald-400 text-xs tracking-wide uppercase">
                4. Challenges & Technical Solutions
              </h4>
            ) : (
              <span className="text-xs text-zinc-555 font-semibold">Challenges list</span>
            )}
            <button
              type="button"
              onClick={addChallenge}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-455 hover:text-emerald-350"
            >
              <FiPlus size={12} /> Add Challenge Card
            </button>
          </div>
          {challengeSolutions.map((item: ChallengeSolution, index: number) => (
            <div key={index} className="relative p-4 border border-zinc-850 bg-zinc-955/20 rounded-xl space-y-3">
              <button
                type="button"
                onClick={() => removeChallenge(index)}
                className="absolute right-2 top-2 text-zinc-500 hover:text-red-400 transition"
              >
                <FiX size={14} />
              </button>
              <FormField
                label={`Challenge #${index + 1}`}
                required
                value={item.challenge}
                onChange={(val) => updateChallengeSolution(index, "challenge", val)}
              />
              <FormField
                label={`Solution #${index + 1}`}
                type="textarea"
                rows={2}
                required
                value={item.solution}
                onChange={(val) => updateChallengeSolution(index, "solution", val)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3.5">
          {challengeSolutions.length === 0 ? (
            <p className="text-xs text-zinc-555 italic">No challenges defined for this project.</p>
          ) : (
            challengeSolutions.map((item: ChallengeSolution, index: number) => (
              <div key={index} className="p-3.5 border border-zinc-900 bg-zinc-955/20 rounded-xl space-y-2">
                <h5 className="text-xs font-bold text-rose-400">Bottleneck: {item.challenge}</h5>
                <p className="text-xs text-zinc-400 leading-relaxed">Solution: {item.solution}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
