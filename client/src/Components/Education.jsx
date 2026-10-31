import React from "react";
import { Plus, Trash2, GraduationCap } from "lucide-react";

const Education = ({ data = [], onChange }) => {
  const addEducation = () => {
    const newEducation = {
      institution: "",
      degree: "",
      field: "",
      graduation_date: "",
      gpa: "",
    };
    onChange([...data, newEducation]);
  };

  const removeEducation = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateEducation = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">Education Background</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Add degrees, certifications, diplomas, or ongoing education.
          </p>
        </div>

        <button
          type="button"
          onClick={addEducation}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus className="size-3.5" />
          Add Education
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 px-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl">
          <div className="size-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <GraduationCap className="size-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">No education entries yet</h4>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Showcase your degree, university or college, and academic achievements.
          </p>
          <button
            type="button"
            onClick={addEducation}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-xs hover:bg-indigo-700 transition cursor-pointer"
          >
            <Plus className="size-3.5" />
            Add Education
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((edu, index) => (
            <div
              key={index}
              className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-4 hover:border-slate-300 transition"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-6 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {edu.degree || edu.institution
                      ? `${edu.degree || "Degree"} at ${edu.institution || "Institution"}`
                      : `Education #${index + 1}`}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="p-1 text-slate-400 hover:text-red-600 rounded transition"
                  title="Remove education"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    College / University / School
                  </label>
                  <input
                    type="text"
                    value={edu.institution || ""}
                    onChange={(e) => updateEducation(index, "institution", e.target.value)}
                    placeholder="e.g. Stanford University"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Degree
                  </label>
                  <input
                    type="text"
                    value={edu.degree || ""}
                    onChange={(e) => updateEducation(index, "degree", e.target.value)}
                    placeholder="e.g. Bachelor of Science"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Field of Study / Major
                  </label>
                  <input
                    type="text"
                    value={edu.field || ""}
                    onChange={(e) => updateEducation(index, "field", e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Graduation Date
                  </label>
                  <input
                    type="month"
                    value={edu.graduation_date || ""}
                    onChange={(e) => updateEducation(index, "graduation_date", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    GPA / Score (Optional)
                  </label>
                  <input
                    type="text"
                    value={edu.gpa || ""}
                    onChange={(e) => updateEducation(index, "gpa", e.target.value)}
                    placeholder="e.g. 3.8 / 4.0 or 8.5 CGPA"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Education;
