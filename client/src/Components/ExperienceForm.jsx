import React, { useState } from "react";
import { Plus, Trash2, Sparkles, Briefcase, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import toast from "react-hot-toast";
import api from "../configs/api";

const ExperienceForm = ({ data = [], onChange }) => {
  const [generatingIndex, setGeneratingIndex] = useState(-1);

  const addExperience = () => {
    const newExperience = {
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
      is_current: false,
    };
    onChange([...data, newExperience]);
  };

  const removeExperience = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateExperience = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const moveExperience = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= data.length) return;
    const updated = [...data];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIndex, 0, moved);
    onChange(updated);
  };

  const generateDescription = async (index) => {
    const exp = data[index];
    if (!exp.position?.trim() && !exp.company?.trim() && !exp.description?.trim()) {
      toast.error("Please provide at least a job title or rough notes before enhancing");
      return;
    }

    setGeneratingIndex(index);
    try {
      const { data: res } = await api.post("/api/ai/enhance-job-desc", {
        userContent: exp.description?.trim() || `Worked as ${exp.position} at ${exp.company}`,
        position: exp.position,
        company: exp.company,
      });

      if (res?.enhancedContent) {
        updateExperience(index, "description", res.enhancedContent);
        toast.success("Job description optimized with AI!");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Enhancement failed");
    } finally {
      setGeneratingIndex(-1);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">Work Experience</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            List your relevant professional roles, internships, or freelance experience.
          </p>
        </div>

        <button
          type="button"
          onClick={addExperience}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus className="size-3.5" />
          Add Role
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 px-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl">
          <div className="size-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <Briefcase className="size-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">No experience added yet</h4>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Highlight your career milestones, job responsibilities, and quantified impacts.
          </p>
          <button
            type="button"
            onClick={addExperience}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-xs hover:bg-indigo-700 transition cursor-pointer"
          >
            <Plus className="size-3.5" />
            Add First Job
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {data.map((exp, index) => (
            <div
              key={index}
              className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-4 hover:border-slate-300 transition"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-6 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {exp.position || exp.company
                      ? `${exp.position || "Position"} ${exp.company ? `@ ${exp.company}` : ""}`
                      : `Role #${index + 1}`}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveExperience(index, -1)}
                    className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 rounded"
                    title="Move up"
                  >
                    <ArrowUp className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === data.length - 1}
                    onClick={() => moveExperience(index, 1)}
                    className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 rounded"
                    title="Move down"
                  >
                    <ArrowDown className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded ml-1 transition"
                    title="Delete role"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Grid Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Google, Acme Inc."
                    value={exp.company || ""}
                    onChange={(e) => updateExperience(index, "company", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Job Title / Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Frontend Developer"
                    value={exp.position || ""}
                    onChange={(e) => updateExperience(index, "position", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Start Date
                  </label>
                  <input
                    type="month"
                    value={exp.start_date || ""}
                    onChange={(e) => updateExperience(index, "start_date", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    End Date
                  </label>
                  <input
                    type="month"
                    value={exp.end_date || ""}
                    disabled={exp.is_current}
                    onChange={(e) => updateExperience(index, "end_date", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </div>
              </div>

              {/* Current Job checkbox */}
              <div className="flex items-center gap-2 pt-0.5">
                <input
                  type="checkbox"
                  id={`current-${index}`}
                  checked={exp.is_current || false}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const updated = [...data];
                    updated[index] = {
                      ...updated[index],
                      is_current: checked,
                      end_date: checked ? "" : updated[index].end_date,
                    };
                    onChange(updated);
                  }}
                  className="size-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
                <label
                  htmlFor={`current-${index}`}
                  className="text-xs font-medium text-slate-700 cursor-pointer"
                >
                  I currently work in this role
                </label>
              </div>

              {/* Job Description with AI Enhancer */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-600">
                    Key Achievements & Responsibilities
                  </label>
                  <button
                    type="button"
                    onClick={() => generateDescription(index)}
                    disabled={generatingIndex === index}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-semibold transition cursor-pointer disabled:opacity-50"
                  >
                    {generatingIndex === index ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : (
                      <Sparkles className="size-3 text-purple-600" />
                    )}
                    <span>{generatingIndex === index ? "Improving..." : "AI Bullets"}</span>
                  </button>
                </div>

                <textarea
                  rows={4}
                  value={exp.description || ""}
                  onChange={(e) => updateExperience(index, "description", e.target.value)}
                  placeholder="• Spearheaded the migration to React and TypeScript, boosting load speed by 35%&#10;• Mentored junior engineers and conducted peer code reviews&#10;• Collaborated with product designers to implement responsive UI"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition resize-none font-sans"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;
