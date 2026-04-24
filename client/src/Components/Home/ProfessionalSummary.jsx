import React, { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../../configs/api";

const ProfessionalSummary = ({ data, onChange }) => {
  const { token } = useSelector((state) => state.auth);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = async () => {
    try {
      setIsGenerating(true);

      const prompt = `Enhance my professional summary: "${data}"`;

      const response = await api.post(
        "/api/ai/enhance-pro-sum",
        { userContent: prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      onChange(response.data.enhancedContent);
      toast.success("Summary enhanced successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsGenerating(false);
    }
  };

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
          disabled={isGenerating}
          onClick={generateSummary}
          type="button"
          className="flex items-center gap-1 rounded bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors disabled:opacity-50 text-sm px-3 py-1"
        >
          {isGenerating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {isGenerating ? "...Enhancing" : "AI Enhance"}
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
