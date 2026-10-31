import React, { useState } from "react";
import { Loader2, Sparkles, Wand2, Lightbulb } from "lucide-react";
import toast from "react-hot-toast";
import api from "../configs/api";

const ProfessionalSummary = ({ data = "", onChange }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const wordCount = (data?.trim() ? data.trim().split(/\s+/).length : 0);

  const generateSummary = async () => {
    if (!data || !data.trim()) {
      toast.error("Please enter a rough draft or bullet points first before enhancing");
      return;
    }

    try {
      setIsGenerating(true);
      const response = await api.post("/api/ai/enhance-pro-sum", {
        userContent: data.trim(),
      });

      if (response.data?.enhancedContent) {
        onChange(response.data.enhancedContent);
        toast.success("Summary enhanced with AI!");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Enhancement failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInsertSample = () => {
    const sample =
      "Dynamic and results-driven Software Engineer with 4+ years of hands-on experience designing, developing, and deploying scalable web applications. Proficient in React, Node.js, and cloud architectures, with a track record of driving a 30% increase in platform performance.";
    onChange(sample);
    toast.success("Sample summary inserted");
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">Professional Summary</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            A 3-4 sentence elevator pitch highlighting your core achievements and strengths.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!data && (
            <button
              type="button"
              onClick={handleInsertSample}
              className="text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1.5 rounded-lg transition"
            >
              Insert Sample
            </button>
          )}

          <button
            type="button"
            disabled={isGenerating}
            onClick={generateSummary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition cursor-pointer"
          >
            {isGenerating ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Sparkles className="size-3.5" />
            )}
            <span>{isGenerating ? "Refining..." : "AI Enhance"}</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <textarea
          rows={6}
          value={data ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Innovative Software Developer with 3+ years of experience building responsive full-stack applications. Proven record of optimizing performance and collaborating in agile teams..."
          className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 leading-relaxed focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition resize-none"
        />

        <div className="flex items-center justify-between mt-1 px-1">
          <span className="text-[11px] text-slate-400">
            {wordCount} words {wordCount > 70 ? "(Consider keeping under 70 words)" : ""}
          </span>
          <span className="text-[11px] text-slate-400">
            {data?.length || 0} characters
          </span>
        </div>
      </div>

      <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl flex items-start gap-2 text-xs text-amber-900">
        <Lightbulb className="size-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Pro-tip:</strong> Focus on what you bring to the table. Mention your job title, years of experience, core technical stack, and your biggest career achievement.
        </p>
      </div>
    </div>
  );
};

export default ProfessionalSummary;
