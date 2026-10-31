import React, { useState } from "react";
import { Plus, X, Sparkles, Lightbulb } from "lucide-react";

const Skills = ({ data = [], onChange }) => {
  const [newSkill, setNewSkill] = useState("");

  const popularSkills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "Express.js",
    "MongoDB",
    "PostgreSQL",
    "Tailwind CSS",
    "Next.js",
    "Git & GitHub",
    "Docker",
    "REST APIs",
    "GraphQL",
    "Agile / Scrum",
  ];

  const addSkill = (skillToAdd) => {
    const trimmed = (skillToAdd || newSkill).trim();
    if (trimmed && !data.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      onChange([...data, trimmed]);
      setNewSkill("");
    }
  };

  const removeSkill = (indexToRemove) => {
    onChange(data.filter((_, i) => i !== indexToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div>
        <h3 className="text-base font-bold text-slate-900">Key Skills</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Add technical tools, frameworks, languages, and core competencies.
        </p>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="e.g. JavaScript, Docker, Leadership (press Enter or comma)"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
        />
        <button
          type="button"
          onClick={() => addSkill()}
          disabled={!newSkill.trim()}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus className="size-4" />
          Add
        </button>
      </div>

      {/* Quick Add Suggestions */}
      <div>
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
          Suggested in Tech:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {popularSkills
            .filter((s) => !data.some((existing) => existing.toLowerCase() === s.toLowerCase()))
            .slice(0, 10)
            .map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => addSkill(s)}
                className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-lg border border-slate-200/80 transition cursor-pointer flex items-center gap-1"
              >
                <Plus className="size-3 text-slate-400" />
                {s}
              </button>
            ))}
        </div>
      </div>

      {/* Selected Skills Chips */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700">
            Selected Skills ({data.length})
          </span>
          {data.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-[11px] text-red-500 hover:text-red-700 font-medium"
            >
              Clear all
            </button>
          )}
        </div>

        {data.length > 0 ? (
          <div className="flex flex-wrap gap-2 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl min-h-[70px]">
            {data.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 bg-white text-slate-800 border border-slate-200/90 rounded-full text-xs font-medium shadow-2xs hover:border-slate-300 transition"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="size-4 rounded-full hover:bg-slate-100 text-slate-400 hover:text-red-500 flex items-center justify-center transition"
                  title={`Remove ${skill}`}
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs">
            <Sparkles className="size-6 text-slate-300 mx-auto mb-2" />
            No skills added yet. Type a skill above or click from suggestions.
          </div>
        )}
      </div>

      <div className="p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl flex items-start gap-2 text-xs text-blue-900">
        <Lightbulb className="size-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Tip for ATS:</strong> Aim for 8–15 relevant skills. Include both hard skills (e.g. Python, AWS, Docker) and methodologies (e.g. System Design, CI/CD, Agile).
        </p>
      </div>
    </div>
  );
};

export default Skills;
