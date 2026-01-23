import React from "react";
import { Sparkles } from "lucide-react";

const ProfessionalSummary = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-3 text-lg font-semibold text-gray-900">
            Professional Summary
          </h3>
          <p className="text-gray-500 text-sm">
            Add summary for your resume here
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-1 rounded bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors disabled:opacity-50 text-sm px-3 py-1"
        >
          <Sparkles className="size-4" />
          AI Enhance
        </button>
      </div>

      <div className="mt-6">
        <textarea
          rows={7}
          value={data ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
          placeholder="Write a compelling professional summary that highlights your key strengths and career objectives..."
        />

        <p className="p-2 text-xs font-medium text-gray-500 max-w-[80%] mx-auto text-center">
          <strong>Tip:</strong> Keep it concise (3–4 sentences) and focus on
          your most relevant achievements and skills.
        </p>
      </div>
    </div>
  );
};

export default ProfessionalSummary;
