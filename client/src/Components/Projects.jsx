import React from "react";
import { Plus, Trash2, FolderGit2 } from "lucide-react";

const Projects = ({ data = [], onChange }) => {
  const addProject = () => {
    const newProject = {
      name: "",
      type: "",
      description: "",
    };
    onChange([...data, newProject]);
  };

  const removeProject = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateProject = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">Featured Projects</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Demonstrate your hands-on ability with real applications, tools, or open-source work.
          </p>
        </div>

        <button
          type="button"
          onClick={addProject}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus className="size-3.5" />
          Add Project
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 px-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl">
          <div className="size-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <FolderGit2 className="size-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">No projects added yet</h4>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Showcase personal or team projects, technologies used, and practical results.
          </p>
          <button
            type="button"
            onClick={addProject}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-xs hover:bg-indigo-700 transition cursor-pointer"
          >
            <Plus className="size-3.5" />
            Add Project
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((project, index) => (
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
                    {project.name || `Project #${index + 1}`}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => removeProject(index)}
                  className="p-1 text-slate-400 hover:text-red-600 rounded transition"
                  title="Remove project"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={project.name || ""}
                    onChange={(e) => updateProject(index, "name", e.target.value)}
                    placeholder="e.g. AI Workflow Automation Engine"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Category / Tech Stack
                  </label>
                  <input
                    type="text"
                    value={project.type || ""}
                    onChange={(e) => updateProject(index, "type", e.target.value)}
                    placeholder="e.g. React, Node.js, Tailwind, MongoDB"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Project Description & Highlights
                  </label>
                  <textarea
                    rows={3}
                    value={project.description || ""}
                    onChange={(e) => updateProject(index, "description", e.target.value)}
                    placeholder="Built a real-time collaborative platform with end-to-end encryption. Scaled to 10k monthly active users."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition resize-none leading-relaxed"
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

export default Projects;
