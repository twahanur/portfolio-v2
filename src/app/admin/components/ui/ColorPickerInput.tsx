"use client";

import React from "react";

interface ColorPickerInputProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  placeholder?: string;
}

const PRESET_COLORS = [
  "#6366f1", // Indigo
  "#a855f7", // Purple
  "#06b6d4", // Cyan
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#f43f5e", // Rose
  "#3b82f6", // Blue
  "#ec4899", // Pink
  "#8b5cf6", // Violet
  "#14b8a6", // Teal
];

export default function ColorPickerInput({
  label,
  value = "",
  onChange,
  placeholder = "e.g. #6366f1",
}: ColorPickerInputProps) {
  // Ensure valid hex for input[type="color"] (needs #rrggbb format)
  const validHexForPicker =
    /^#([A-Fa-f0-9]{6})$/.test(value)
      ? value
      : /^#([A-Fa-f0-9]{3})$/.test(value)
      ? `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`
      : "#6366f1";

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-zinc-350 flex items-center justify-between">
        <span>{label}</span>
        {value && (
          <span
            className="h-3.5 w-3.5 rounded-full border border-zinc-700 shadow-sm transition-all"
            style={{ backgroundColor: value }}
          />
        )}
      </label>

      <div className="flex items-center gap-2">
        {/* Color Swatch Picker */}
        <div className="relative shrink-0 h-10 w-12 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 p-1 flex items-center justify-center cursor-pointer hover:border-purple-500/50 transition">
          <input
            type="color"
            value={validHexForPicker}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -top-4 -left-4 w-20 h-20 cursor-pointer opacity-0"
            title="Pick a color"
          />
          <div
            className="w-full h-full rounded-lg border border-zinc-700/50 shadow-inner"
            style={{ backgroundColor: value || validHexForPicker }}
          />
        </div>

        {/* Text Hex Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="block w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-zinc-200 text-sm font-mono outline-none transition focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 placeholder:text-zinc-600"
        />
      </div>

      {/* Preset Swatches Palette */}
      <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
        <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mr-1">Presets:</span>
        {PRESET_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            className={`h-5 w-5 rounded-full border transition-all hover:scale-125 shrink-0 ${
              value?.toLowerCase() === c.toLowerCase()
                ? "ring-2 ring-purple-400 border-white scale-110"
                : "border-zinc-700 hover:border-zinc-400"
            }`}
            style={{ backgroundColor: c }}
            title={c}
          />
        ))}
      </div>
    </div>
  );
}
