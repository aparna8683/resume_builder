import React, { useEffect, useState, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../configs/api";
import {
  ArrowLeft,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  FileText,
  FolderGit2,
  GraduationCap,
  Loader2,
  Share2,
  Sparkles,
  User,
  Save,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

import PersonalInfoForm from "../Components/PersonalInfoForm";
import ResumePreview from "../Components/ResumePreview";
import Education from "../Components/Education";
import TemplateSelector from "../Components/TemplateSelector";
import ColorPicker from "../Components/ColorPicker";
import ProfessionalSummary from "../Components/ProfessionalSummary";
import ExperienceForm from "../Components/ExperienceForm";
import Projects from "../Components/Projects";
import Skills from "../Components/Skills";
import { dummyResumeData } from "../assets/assets";
import toast from "react-hot-toast";

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "Untitled Resume",
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#4F46E5",
    public: false,
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isChangingVisibility, setIsChangingVisibility] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    { id: "personal", name: "Personal", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderGit2 },
    { id: "skills", name: "Skills", icon: Sparkles },
  ];

  const activeSection = sections[activeSectionIndex];

  // Load existing resume from backend
  const loadExistingResume = useCallback(async () => {
    if (!resumeId) return;
    try {
      setLoading(true);
      const { data } = await api.get(`/api/resume/${resumeId}`);
      if (data?.resume) {
        setResumeData(data.resume);
        document.title = `${data.resume.title || "Resume"} | Builder`;
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load resume");
      navigate("/app");
    } finally {
      setLoading(false);
    }
  }, [resumeId, navigate]);

  useEffect(() => {
    loadExistingResume();
  }, [loadExistingResume]);

  // Save Resume Function
  const saveResume = async (silent = false) => {
    if (!resumeId) return;
    try {
      setIsSaving(true);
      const updatedResumeData = structuredClone(resumeData);

      // Handle raw file image if attached
      const isFileImage = typeof resumeData.personal_info?.image === "object";
      if (isFileImage) {
        delete updatedResumeData.personal_info.image;
      }

      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append("resumeData", JSON.stringify(updatedResumeData));

      if (removeBackground) formData.append("removeBackground", "yes");
      if (isFileImage && resumeData.personal_info.image) {
        formData.append("image", resumeData.personal_info.image);
      }

      const { data } = await api.put("/api/resume/update", formData);
      if (data?.resume) {
        setResumeData(data.resume);
      }
      if (!silent) {
        toast.success(data?.message || "Saved successfully!");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  // Keyboard shortcut Ctrl+S or Cmd+S to save
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveResume();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [resumeData]);

  // Toggle Visibility (Public / Private)
  const changeResumeVisibility = async () => {
    if (!resumeId || isChangingVisibility) return;
    const nextPublicState = !resumeData.public;

    try {
      setIsChangingVisibility(true);
      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append(
        "resumeData",
        JSON.stringify({ public: nextPublicState })
      );

      const { data } = await api.put("/api/resume/update", formData);
      setResumeData((prev) => ({ ...prev, public: nextPublicState }));
      toast.success(
        nextPublicState
          ? "Resume is now Public! Anyone with link can view."
          : "Resume is now Private."
      );
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update visibility");
    } finally {
      setIsChangingVisibility(false);
    }
  };

  // Share Public Link
  const handleShare = async () => {
    const resumeURL = `${window.location.origin}/view/${resumeId}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: resumeData.title || "My Resume",
          text: `Check out my resume - ${resumeData.title}`,
          url: resumeURL,
        });
        return;
      }
      await navigator.clipboard.writeText(resumeURL);
      toast.success("Public link copied to clipboard!");
    } catch (err) {
      if (err?.name !== "AbortError") {
        await navigator.clipboard.writeText(resumeURL);
        toast.success("Link copied!");
      }
    }
  };

  // PDF Export
  const downloadResume = async () => {
    if (isDownloading) return;
    const resumeElement = document.getElementById("resume-preview");
    if (!resumeElement) {
      toast.error("Preview is not ready");
      return;
    }

    let container = null;
    try {
      setIsDownloading(true);
      toast.loading("Preparing high-quality PDF...", { id: "pdf" });

      await document.fonts?.ready;

      const { default: html2pdf } = await import("html2pdf.js");
      const exportElement = resumeElement.cloneNode(true);
      exportElement.classList.add("resume-pdf-export");

      container = document.createElement("div");
      container.className = "resume-pdf-export-container";
      container.appendChild(exportElement);
      document.body.appendChild(container);

      const name = resumeData.personal_info?.full_name?.trim() || "Resume";
      const cleanFileName = `${name.replace(/\s+/g, "_")}_Resume.pdf`.replace(
        /[\\/:*?"<>|]+/g,
        ""
      );

      const options = {
        margin: 0,
        filename: cleanFileName,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2.5,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
          compress: true,
        },
        pagebreak: {
          mode: ["css", "legacy"],
          avoid: ["section", "header", ".avoid-page-break"],
        },
      };

      await html2pdf().set(options).from(exportElement).save();
      toast.success("Downloaded successfully!", { id: "pdf" });
    } catch (error) {
      console.error(error);
      toast.error("Download failed. You can also print with Ctrl+P", { id: "pdf" });
    } finally {
      if (container?.parentNode) {
        container.parentNode.removeChild(container);
      }
      setIsDownloading(false);
    }
  };

  // Prefill with Sample Data for rapid preview
  const handleLoadSampleData = () => {
    const sample = dummyResumeData[0];
    setResumeData((prev) => ({
      ...prev,
      personal_info: sample.personal_info,
      professional_summary: sample.professional_summary,
      experience: sample.experience,
      education: sample.education,
      project: sample.project,
      skills: sample.skills,
    }));
    toast.success("Loaded sample details into editor!");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Loader2 className="size-10 text-indigo-600 animate-spin mb-3" />
        <p className="text-sm font-semibold text-slate-700">Loading your resume...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16">
      {/* Top Action Bar */}
      <div className="sticky top-14 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Back & Title */}
          <div className="flex items-center gap-3">
            <Link
              to="/app"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition p-1.5 rounded-lg hover:bg-slate-100"
            >
              <ArrowLeft className="size-4" />
              <span className="max-md:hidden">Dashboard</span>
            </Link>

            <span className="text-slate-300">|</span>

            {/* Editable Title */}
            <input
              type="text"
              value={resumeData.title || ""}
              onChange={(e) =>
                setResumeData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Resume Title"
              className="text-sm font-bold text-slate-800 bg-transparent hover:bg-slate-100 focus:bg-white px-2 py-1 rounded-lg border border-transparent hover:border-slate-200 focus:border-indigo-400 outline-none transition max-w-[180px] sm:max-w-xs truncate"
              title="Click to rename resume"
            />
          </div>

          {/* Right: Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Template Selector */}
            <TemplateSelector
              selectedTemplate={resumeData.template}
              onChange={(template) =>
                setResumeData((prev) => ({ ...prev, template }))
              }
            />

            {/* Color Picker */}
            <ColorPicker
              selectedColor={resumeData.accent_color}
              onChange={(color) =>
                setResumeData((prev) => ({ ...prev, accent_color: color }))
              }
            />

            {/* Public/Private Toggle */}
            <button
              type="button"
              onClick={changeResumeVisibility}
              disabled={isChangingVisibility}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition cursor-pointer border ${
                resumeData.public
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                  : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
              }`}
              title="Toggle Public / Private"
            >
              {resumeData.public ? (
                <Eye className="size-3.5" />
              ) : (
                <EyeOff className="size-3.5" />
              )}
              <span className="max-sm:hidden">
                {resumeData.public ? "Public" : "Private"}
              </span>
            </button>

            {/* Share (if public) */}
            {resumeData.public && (
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1.5 text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 px-3 py-2 rounded-xl transition cursor-pointer"
                title="Share public link"
              >
                <Share2 className="size-3.5" />
                <span className="max-sm:hidden">Share</span>
              </button>
            )}

            {/* Download PDF */}
            <button
              type="button"
              onClick={downloadResume}
              disabled={isDownloading}
              className="flex items-center gap-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
              title="Export to PDF"
            >
              {isDownloading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Download className="size-3.5" />
              )}
              <span>{isDownloading ? "Exporting..." : "PDF"}</span>
            </button>

            {/* Save Button */}
            <button
              type="button"
              onClick={() => saveResume(false)}
              disabled={isSaving}
              className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-4 py-2 rounded-xl shadow-md shadow-indigo-200 transition cursor-pointer"
            >
              {isSaving ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Save className="size-3.5" />
              )}
              <span>{isSaving ? "Saving..." : "Save"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Split Screen */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Editor Panel (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden sticky top-28">
            {/* Step Wizard Progress Bar */}
            <div className="relative h-1.5 bg-slate-100 w-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                style={{
                  width: `${
                    ((activeSectionIndex + 1) / sections.length) * 100
                  }%`,
                }}
              />
            </div>

            {/* Section Tabs Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1">
                {sections.map((sec, idx) => {
                  const Icon = sec.icon;
                  const isActive = activeSectionIndex === idx;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setActiveSectionIndex(idx)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700 shadow-2xs border border-indigo-200"
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className="size-3.5" />
                      <span className="hidden sm:inline">{sec.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Sample loader */}
              <button
                type="button"
                onClick={handleLoadSampleData}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100/70 px-2 py-1 rounded-lg shrink-0 transition"
                title="Fill with sample data"
              >
                Sample Data
              </button>
            </div>

            {/* Section Form Content */}
            <div className="p-5 sm:p-6 max-h-[calc(100vh-280px)] overflow-y-auto">
              {activeSection.id === "personal" && (
                <PersonalInfoForm
                  data={resumeData.personal_info}
                  onChange={(info) =>
                    setResumeData((prev) => ({ ...prev, personal_info: info }))
                  }
                  removeBackground={removeBackground}
                  setRemoveBackground={setRemoveBackground}
                />
              )}

              {activeSection.id === "summary" && (
                <ProfessionalSummary
                  data={resumeData.professional_summary}
                  onChange={(summary) =>
                    setResumeData((prev) => ({
                      ...prev,
                      professional_summary: summary,
                    }))
                  }
                />
              )}

              {activeSection.id === "experience" && (
                <ExperienceForm
                  data={resumeData.experience}
                  onChange={(exp) =>
                    setResumeData((prev) => ({ ...prev, experience: exp }))
                  }
                />
              )}

              {activeSection.id === "education" && (
                <Education
                  data={resumeData.education}
                  onChange={(edu) =>
                    setResumeData((prev) => ({ ...prev, education: edu }))
                  }
                />
              )}

              {activeSection.id === "projects" && (
                <Projects
                  data={resumeData.project}
                  onChange={(proj) =>
                    setResumeData((prev) => ({ ...prev, project: proj }))
                  }
                />
              )}

              {activeSection.id === "skills" && (
                <Skills
                  data={resumeData.skills}
                  onChange={(sk) =>
                    setResumeData((prev) => ({ ...prev, skills: sk }))
                  }
                />
              )}
            </div>

            {/* Step Navigation Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() =>
                  setActiveSectionIndex((prev) => Math.max(0, prev - 1))
                }
                disabled={activeSectionIndex === 0}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs transition"
              >
                <ChevronLeft className="size-4" />
                Previous
              </button>

              <span className="text-[11px] font-semibold text-slate-400">
                Step {activeSectionIndex + 1} of {sections.length}
              </span>

              {activeSectionIndex < sections.length - 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setActiveSectionIndex((prev) =>
                      Math.min(sections.length - 1, prev + 1)
                    )
                  }
                  className="flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition"
                >
                  Next
                  <ChevronRight className="size-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => saveResume(false)}
                  className="flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition"
                >
                  <CheckCircle className="size-3.5" />
                  Save & Finish
                </button>
              )}
            </div>
          </div>

          {/* RIGHT: Live A4 Preview (7 cols) */}
          <div className="lg:col-span-7">
            <ResumePreview
              data={resumeData}
              template={resumeData.template}
              accentColor={resumeData.accent_color}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
