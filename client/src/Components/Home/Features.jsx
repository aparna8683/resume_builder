import React from "react";
import Title from "./Title";
import { Zap, FileText, WandSparkles, Download } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: FileText,
      title: "Smart Resume Builder",
      desc: "Create a clean, professional resume with guided sections and ready-to-use templates.",
      color: "violet",
    },
    {
      icon: WandSparkles,
      title: "AI Content Suggestions",
      desc: "Improve your summary, experience, and skills with AI-powered writing assistance.",
      color: "green",
    },
    {
      icon: Download,
      title: "Download & Share",
      desc: "Export your resume and share a public preview link whenever you need.",
      color: "orange",
    },
  ];

  const colorClasses = {
    violet: "hover:bg-violet-100 hover:border-violet-300 text-violet-600",
    green: "hover:bg-green-100 hover:border-green-300 text-green-600",
    orange: "hover:bg-orange-100 hover:border-orange-300 text-orange-600",
  };

  return (
    <div
      id="features"
      className="flex flex-col items-center my-16 scroll-mt-12 px-4"
    >
      <div className="flex items-center gap-2 rounded-full px-6 py-1.5 bg-indigo-100 text-sm text-indigo-600">
        <Zap width={14} />
        <span className="font-medium">Features</span>
      </div>

      <Title
        title="Build your resume faster"
        description="Create, improve, preview, and share your professional resume with simple AI-powered tools."
      />

      <div className="flex flex-col md:flex-row items-center gap-10 xl:mt-10 max-w-6xl w-full">
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl border border-zinc-100 p-6">
            <div className="h-4 w-28 rounded-full bg-zinc-200 mb-5" />
            <div className="h-3 w-full rounded-full bg-zinc-100 mb-3" />
            <div className="h-3 w-5/6 rounded-full bg-zinc-100 mb-6" />

            <div className="space-y-4">
              <div className="rounded-2xl border border-zinc-100 p-4">
                <div className="h-3 w-24 rounded-full bg-indigo-200 mb-3" />
                <div className="h-2 w-full rounded-full bg-zinc-100 mb-2" />
                <div className="h-2 w-4/5 rounded-full bg-zinc-100" />
              </div>

              <div className="rounded-2xl border border-zinc-100 p-4">
                <div className="h-3 w-28 rounded-full bg-green-200 mb-3" />
                <div className="h-2 w-full rounded-full bg-zinc-100 mb-2" />
                <div className="h-2 w-3/4 rounded-full bg-zinc-100" />
              </div>

              <div className="rounded-2xl border border-zinc-100 p-4">
                <div className="h-3 w-20 rounded-full bg-orange-200 mb-3" />
                <div className="h-2 w-full rounded-full bg-zinc-100 mb-2" />
                <div className="h-2 w-2/3 rounded-full bg-zinc-100" />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="bg-white p-6 rounded-3xl shadow-2xl border border-zinc-100 w-full max-w-md transition hover:scale-[1.02]">
            {/* Header */}
            <div className="mb-4">
              <h2 className="text-xl font-bold text-zinc-800">John Doe</h2>
              <p className="text-sm text-zinc-500">Software Engineer</p>
            </div>

            {/* Divider */}
            <div className="h-px bg-zinc-200 my-3" />

            {/* Experience */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-indigo-600 mb-1">
                Experience
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Built scalable web applications using React, Node.js, and
                MongoDB. Worked on real-time dashboards and optimized
                performance.
              </p>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-sm font-semibold text-green-600 mb-1">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-zinc-100 px-2 py-1 rounded-md">
                  React
                </span>
                <span className="text-xs bg-zinc-100 px-2 py-1 rounded-md">
                  Node.js
                </span>
                <span className="text-xs bg-zinc-100 px-2 py-1 rounded-md">
                  MongoDB
                </span>
                <span className="text-xs bg-zinc-100 px-2 py-1 rounded-md">
                  Express
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
