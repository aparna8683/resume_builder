import React from "react";
import { Sparkles } from "lucide-react";

const ProfessionalSummary = ({ data, onChange, setResumeData }) => {
  return (
    <div className="space-y-4">
      <div className="flex  items-center justify-between">
        <div>
          <h3 className=" flex items-center gap-3 text-lg font-semibold text-gray-900">
            Professional Summary
          </h3>
         <p className=" text-gray-700">Add Summary for your Resume here</p>
        </div>
        <button className="flex items-center gap-1 rounded bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors disabled:opacity-50 text-sm">
          <Sparkles className="size-4" />
          AI Enhance
        </button>
      </div>
      <div className="mt-6">
        <textarea
          rows={7}
          value={data || " "}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-nonetransition-colors resize-none"
          name=""
          id=""
          placeholder="write a compelling professional summary that highlights your key strengths and career objectives..."
        ></textarea>
        <p className="p-2 text-xs font-medium text-gray-500 max-w-4/5 mx-auto text-center">
          {" "}
          Tip:Keep it concise (3-4 senyttences) and focus on your most relevant
          achievemnts and skills
        </p>
      </div>
    </div>
  );
};

export default ProfessionalSummary;
