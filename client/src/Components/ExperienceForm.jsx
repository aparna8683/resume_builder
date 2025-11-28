import { Plus, Trash2, Sparkles, Briefcase } from "lucide-react";
import React from "react";

const ExperienceForm = ({ data, onChange }) => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-3 text-lg font-semibold text-gray-900">
            Professional Experience
          </h3>
          <p className="text-gray-700 text-sm">Add your job experience</p>
        </div>

        <button
          onClick={addExperience}
          className="flex items-center gap-1 rounded bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors text-sm px-3 py-1"
        >
          <Plus className="size-4" />
          Add Experience
        </button>
      </div>

      {/* Empty state */}
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No Experience Added Yet</p>
          <p className="text-sm">Click "Add Experience" to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((exp, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              {/* Experience Heading */}
              <div className="flex justify-between items-start">
                <h4 className="font-semibold">Experience {index + 1}</h4>
                <button
                  onClick={() => removeExperience(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              {/* Form Fields */}
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Company Name"
                  value={exp.company}
                  onChange={(e) =>
                    updateExperience(index, "company", e.target.value)
                  }
                  className="px-3 py-2 text-sm rounded-lg border"
                />

                <input
                  type="text"
                  placeholder="Position/Role"
                  value={exp.position}
                  onChange={(e) =>
                    updateExperience(index, "position", e.target.value)
                  }
                  className="px-3 py-2 text-sm rounded-lg border"
                />

                <input
                  type="date"
                  value={exp.start_date}
                  onChange={(e) =>
                    updateExperience(index, "start_date", e.target.value)
                  }
                  className="px-3 py-2 text-sm rounded-lg border"
                />

                <input
                  type="date"
                  value={exp.end_date}
                  onChange={(e) =>
                    updateExperience(index, "end_date", e.target.value)
                  }
                  disabled={exp.is_current}
                  className="px-3 py-2 text-sm rounded-lg border disabled:bg-gray-100"
                />

                {/* Checkbox */}
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={exp.is_current}
                    onChange={(e) => {
                      updateExperience(index, "is_current", e.target.checked);
                      if (e.target.checked)
                        updateExperience(index, "end_date", "");
                    }}
                    className="rounded border-gray-300"
                  />
                  Currently Working Here
                </label>

                {/* Description */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Job Description
                    </label>
                    <button className="flex items-center gap-1 px-2 py-1 hover:bg-purple-200 rounded transition-colors">
                      <Sparkles className="w-3 h-3" /> Enhance with AI
                    </button>
                  </div>

                  <textarea
                    className="w-full text-sm px-3 py-2 rounded-lg resize-none border"
                    value={exp.description}
                    onChange={(e) =>
                      updateExperience(index, "description", e.target.value)
                    }
                    rows={4}
                    placeholder="Describe your key responsibilities and achievements..."
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

export default ExperienceForm;
