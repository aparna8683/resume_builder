import React, { useState, useRef, useEffect } from "react";
import { Layout, Check, Sparkles } from "lucide-react";

const TemplateSelector = ({ selectedTemplate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const templates = [
    {
      id: "classic",
      name: "Classic ATS",
      preview: "Clean, timeless, single-column format optimized for ATS scanners and corporate applications.",
      badge: "Most Popular",
    },
    {
      id: "modern",
      name: "Modern Accent",
      preview: "Bold header banner with crisp dividers and styled section headings for tech & creative roles.",
      badge: "Modern",
    },
    {
      id: "minimal",
      name: "Minimalist",
      preview: "Understated elegance with generous whitespace, refined typography, and high readability.",
      badge: "Clean",
    },
    {
      id: "minimal-image",
      name: "Executive Portrait",
      preview: "Two-column editorial design featuring profile picture and dedicated skills sidebar.",
      badge: "With Photo",
    },
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

  const activeTemplate = templates.find((t) => t.id === selectedTemplate) || templates[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100/80 border border-indigo-200/80 px-3 py-2 rounded-xl transition cursor-pointer shadow-2xs"
        aria-expanded={isOpen}
      >
        <Layout className="size-3.5" />
        <span>Template:</span>
        <span className="font-bold text-indigo-900">{activeTemplate.name}</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 space-y-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Choose Layout
            </span>
            <span className="text-[10px] text-slate-400">4 ATS-Ready styles</span>
          </div>

          <div className="space-y-1 max-h-80 overflow-y-auto p-1">
            {templates.map((template) => {
              const isSelected = selectedTemplate === template.id;
              return (
                <button
                  type="button"
                  key={template.id}
                  onClick={() => {
                    onChange(template.id);
                    setIsOpen(false);
                  }}
                  className={`relative w-full p-3 text-left rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-50/70 shadow-2xs"
                      : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">
                      {template.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {template.badge}
                      </span>
                      {isSelected && (
                        <div className="size-4 bg-indigo-600 rounded-full flex items-center justify-center">
                          <Check className="size-2.5 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                    {template.preview}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
