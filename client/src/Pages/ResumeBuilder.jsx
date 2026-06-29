import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../configs/api";

import {
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FileText,
  FolderIcon,
  GraduationCap,
  Loader2,
  Share2,
  Sparkles,
  User,
} from "lucide-react";

import PersonalIInfoForm from "../Components/PersonalIInfoForm";
import ResumePreview from "../Components/ResumePreview";
import Education from "../Components/Education";
import TemplateSelector from "../Components/TemplateSelector";
import ColorPicker from "../Components/ColorPicker";
import ProfessionalSummary from "../Components/Home/ProfessionalSummary";
import ExperienceForm from "../Components/ExperienceForm";
import Projects from "../Components/Projects";
import Skills from "../Components/Skills";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
  });

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: GraduationCap },
    { id: "education", name: "Education", icon: Briefcase },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
  ];

  const [activeSectionIndex, setActiveIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [isChangingVisibility, setIsChangingVisibility] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const activeSection = sections[activeSectionIndex];

  const loadExistingResume = async () => {
    try {
      console.log("Resume ID:", resumeId);
      const { data } = await api.get(`/api/resume/${resumeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.resume) {
        setResumeData(data.resume);
        document.title = data.resume.title || "Resume Builder";
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Error loading resume:", error);
    }
  };

  useEffect(() => {
    if (resumeId) loadExistingResume();
  }, [resumeId]);

  // useEffect(() => {
  //   loadExistingResume();
  // }, [resumeId]);

  const changeResumeVisibility = async () => {
    if (!resumeId || isChangingVisibility) return;

    const nextPublicState = !resumeData.public;

    try {
      setIsChangingVisibility(true);
      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append(
        "resumeData",
        JSON.stringify({ public: nextPublicState }),
      );
      const { data } = await api.put("/api/resume/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResumeData(
        (prev) => data.resume || { ...prev, public: nextPublicState },
      );
      toast.success(data.message);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsChangingVisibility(false);
    }
  };

  const handleShare = async () => {
    if (!resumeId) return;

    const resumeURL = `${window.location.origin}/view/${resumeId}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: resumeData.title || "My Resume",
          text: "My Resume",
          url: resumeURL,
        });
        return;
      }

      await navigator.clipboard.writeText(resumeURL);
      toast.success("Resume link copied");
    } catch (shareError) {
      if (shareError?.name !== "AbortError") {
        toast.error("Unable to share resume");
      }
    }
  };

  const getResumeFileName = () => {
    const fullName = resumeData.personal_info?.full_name?.trim();
    const nameParts = fullName ? fullName.split(/\s+/) : [];
    const firstName = nameParts[0] || "Resume";
    const lastName =
      nameParts.length > 1 ? nameParts[nameParts.length - 1] : "Builder";

    return `${firstName}_${lastName}_Resume.pdf`.replace(/[\\/:*?"<>|]+/g, "");
  };

  const waitForPreviewImages = async (element) => {
    const images = Array.from(element.querySelectorAll("img"));

    await Promise.all(
      images.map(
        (image) =>
          new Promise((resolve) => {
            if (image.complete) {
              resolve();
              return;
            }

            image.onload = resolve;
            image.onerror = resolve;
          }),
      ),
    );
  };

  const DownloadResume = async () => {
    if (isDownloading) return;

    const resumeElement = document.getElementById("resume-preview");
    if (!resumeElement) {
      toast.error("Resume preview is not ready");
      return;
    }

    let container;

    try {
      setIsDownloading(true);
      await document.fonts?.ready;
      await waitForPreviewImages(resumeElement);

      const { default: html2pdf } = await import("html2pdf.js");
      const exportElement = resumeElement.cloneNode(true);
      exportElement.classList.add("resume-pdf-export");

      container = document.createElement("div");
      container.className = "resume-pdf-export-container";
      container.appendChild(exportElement);
      document.body.appendChild(container);

      const options = {
        margin: 0,
        filename: getResumeFileName(),
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: Math.min(3, window.devicePixelRatio || 2),
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
      toast.success("Resume downloaded");
    } catch (error) {
      console.error(error);
      toast.error("Unable to download resume");
    } finally {
      if (container?.parentNode) {
        container.parentNode.removeChild(container);
      }
      setIsDownloading(false);
    }
  };
  const saveResume = async () => {
    try {
      let updatedResumeData = structuredClone(resumeData);
      if (typeof resumeData.personal_info.image === "object") {
        delete updatedResumeData.personal_info.image;
      }
      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append("resumeData", JSON.stringify(updatedResumeData));
      removeBackground && formData.append("removeBackground", "yes");
      typeof resumeData.personal_info.image == "object" &&
        formData.append("image", resumeData.personal_info.image);
      const { data } = await api.put("/api/resume/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResumeData(data.resume);
      toast.success(data.message);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div>
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto p-4 py-6">
        <Link
          to="/app"
          className="inline-flex gap-1 items-center text-slate-500 hover:text-slate-700 transition-all"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Panel */}
          <div className="relative lg:col-span-5 rounded-lg overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 pt-1 sm:p-6 sm:pt-1">
              {/* Progress Bar */}
              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />
              <hr
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-200"
                style={{
                  width: `${
                    (activeSectionIndex * 100) / (sections.length - 1)
                  }%`,
                }}
              />

              {/* Navigation */}
              <div className="flex flex-wrap justify-between items-center gap-3 mb-6 border-b border-gray-300 py-2">
                <div className="flex items-center gap-2">
                  <TemplateSelector
                    selectedTemplate={resumeData.template}
                    onChange={(template) =>
                      setResumeData((prev) => ({ ...prev, template }))
                    }
                  />

                  <ColorPicker
                    selectedColor={resumeData.accent_color}
                    onChange={(color) =>
                      setResumeData((prev) => ({
                        ...prev,
                        accent_color: color,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                  {activeSectionIndex !== 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveIndex((prev) => Math.max(prev - 1, 0))
                      }
                      className="flex min-h-10 items-center gap-1 rounded-md px-2 py-2 text-sm text-gray-600 hover:bg-gray-100"
                    >
                      <ChevronLeft className="size-4" />
                      Previous
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setActiveIndex((prev) =>
                        Math.min(prev + 1, sections.length - 1),
                      )
                    }
                    disabled={activeSectionIndex === sections.length - 1}
                    className="flex min-h-10 items-center gap-1 rounded-md px-2 py-2 text-sm text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className="space-y-6">
                {activeSection.id === "personal" && (
                  <PersonalIInfoForm
                    data={resumeData.personal_info}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        personal_info: data,
                      }))
                    }
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}

                {activeSection.id === "summary" && (
                  <ProfessionalSummary
                    data={resumeData.professional_summary}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        professional_summary: data,
                      }))
                    }
                  />
                )}

                {activeSection.id === "experience" && (
                  <ExperienceForm
                    data={resumeData.experience}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        experience: data,
                      }))
                    }
                  />
                )}

                {activeSection.id === "education" && (
                  <Education
                    data={resumeData.education}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        education: data,
                      }))
                    }
                  />
                )}

                {activeSection.id === "projects" && (
                  <Projects
                    data={resumeData.project}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        project: data,
                      }))
                    }
                  />
                )}

                {activeSection.id === "skills" && (
                  <Skills
                    data={resumeData.skills}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        skills: data,
                      }))
                    }
                  />
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  toast.promise(saveResume(), { loading: "Saving..." });
                }}
                className="mt-6 w-full rounded-md bg-green-100 px-6 py-2.5 text-sm font-medium text-green-700 hover:bg-green-200 sm:w-auto"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Right Panel */}
          <div className="relative lg:col-span-7 max-lg:mt-6">
            <div className="mb-3 flex flex-wrap justify-end gap-2 sm:gap-3 print:hidden">
              {resumeData.public && (
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex min-h-10 items-center gap-1 rounded-lg bg-blue-100 px-4 py-2 text-xs font-medium text-blue-700 hover:bg-blue-200"
                  aria-label="Share public resume"
                >
                  <Share2 className="size-4" />
                  Share
                </button>
              )}

              <button
                type="button"
                onClick={changeResumeVisibility}
                disabled={isChangingVisibility}
                aria-pressed={resumeData.public}
                className="flex min-h-10 items-center gap-1 rounded-lg bg-purple-100 px-4 py-2 text-xs font-medium text-purple-700 hover:bg-purple-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {resumeData.public ? (
                  <EyeIcon className="size-4" />
                ) : (
                  <EyeOffIcon className="size-4" />
                )}
                {resumeData.public ? "Public" : "Private"}
              </button>

              <button
                type="button"
                onClick={DownloadResume}
                disabled={isDownloading}
                className="flex min-h-10 items-center gap-1 rounded-lg bg-green-100 px-4 py-2 text-xs font-medium text-green-700 hover:bg-green-200 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Download resume"
              >
                {isDownloading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <DownloadIcon className="size-4" />
                )}
                {isDownloading ? "Downloading" : "Download"}
              </button>
            </div>

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
