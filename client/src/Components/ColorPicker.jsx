import React, { useState, useRef, useEffect } from "react";
import { Check, Palette } from "lucide-react";

const ColorPicker = ({ selectedColor, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const colors = [
    { name: "Indigo", value: "#4F46E5" },
    { name: "Royal Blue", value: "#2563EB" },
    { name: "Cyan Teal", value: "#0D9488" },
    { name: "Emerald", value: "#059669" },
    { name: "Amber", value: "#D97706" },
    { name: "Rose", value: "#E11D48" },
    { name: "Purple", value: "#7C3AED" },
    { name: "Slate", value: "#475569" },
    { name: "Charcoal", value: "#1E293B" },
    { name: "Crimson", value: "#991B1B" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl transition cursor-pointer shadow-2xs"
        aria-expanded={isOpen}
      >
        <span
          className="size-3.5 rounded-full border border-black/10 shrink-0"
          style={{ backgroundColor: selectedColor || "#4F46E5" }}
        />
        <Palette className="size-3 text-slate-400" />
        <span className="max-sm:hidden">Theme</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-3.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="mb-2.5 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Accent Color
            </span>
            <span className="text-[11px] font-mono text-slate-400">{selectedColor}</span>
          </div>

          <div className="grid grid-cols-5 gap-2.5 mb-3">
            {colors.map((c) => {
              const isSelected = selectedColor?.toLowerCase() === c.value.toLowerCase();
              return (
                <button
                  type="button"
                  key={c.value}
                  title={c.name}
                  onClick={() => {
                    onChange(c.value);
                    setIsOpen(false);
                  }}
                  className={`size-9 rounded-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer shadow-2xs ${
                    isSelected ? "ring-2 ring-offset-2 ring-indigo-500 scale-105" : ""
                  }`}
                  style={{ backgroundColor: c.value }}
                >
                  {isSelected && <Check className="size-4 text-white stroke-[3]" />}
                </button>
              );
            })}
          </div>

          {/* Custom Hex input */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Custom:</span>
            <input
              type="color"
              value={selectedColor || "#4F46E5"}
              onChange={(e) => onChange(e.target.value)}
              className="size-7 rounded-lg border border-slate-200 cursor-pointer p-0.5"
            />
            <input
              type="text"
              value={selectedColor || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#4F46E5"
              className="flex-1 text-xs px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg font-mono uppercase text-slate-700"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
