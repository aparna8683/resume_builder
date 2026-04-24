import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
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
    try {
      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append(
        "resumeData",
        JSON.stringify({ public: !resumeData.public }),
      );
      const { data } = await api.put("/api/resume/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResumeData((prev) => ({
        ...prev,
        public: !prev.public,
      }));
      toast.success(data.message);
    } catch (error) {
      console.error();
      toast.error(error.message);
    }
  };

  const handleShare = () => {
    const frontendURL = window.location.href.split("/app/")[0];
    const resumeURL = frontendURL + "/view/" + resumeId;

    if (navigator.share) {
      navigator.share({ url: resumeURL, text: "My Resume" });
    } else {
      alert("Share not supported on this browser.");
    }
  };

  const DownloadResume = () => {
    window.print();
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
      console.error();
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
            <div className="bg-white rounded-lg shadow-sm border-gray-200 p-6 pt-1">
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
              <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">
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

                <div className="flex items-center gap-6">
                  {activeSectionIndex !== 0 && (
                    <button
                      onClick={() =>
                        setActiveIndex((prev) => Math.max(prev - 1, 0))
                      }
                      className="flex items-center gap-1 py-3 text-sm text-gray-600"
                    >
                      <ChevronLeft className="size-4" />
                      Previous
                    </button>
                  )}

                  <button
                    onClick={() =>
                      setActiveIndex((prev) =>
                        Math.min(prev + 1, sections.length - 1),
                      )
                    }
                    disabled={activeSectionIndex === sections.length - 1}
                    className="flex items-center gap-1 p-3 text-sm text-gray-600"
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
                onClick={() => {
                  toast.promise(saveResume, { loading: "Saving..." });
                }}
                className="mt-6 px-6 py-2 text-sm bg-green-100 text-green-600 rounded-md"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-7 max-lg:mt-6 relative">
            <div className="absolute top-2  right-0 flex gap-4 z-10">
              {resumeData.public && (
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1 px-4 py-2 text-xs bg-blue-100 text-blue-600 rounded-lg"
                >
                  <Share2 className="size-4" />
                  Share
                </button>
              )}

              <button
                onClick={changeResumeVisibility}
                className="flex items-center gap-1 px-4 py-2 text-xs bg-purple-100 text-purple-600 rounded-lg"
              >
                {resumeData.public ? (
                  <EyeIcon className="size-4" />
                ) : (
                  <EyeOffIcon className="size-4" />
                )}
                {resumeData.public ? "Public" : "Private"}
              </button>

              <button
                onClick={DownloadResume}
                className="flex items-center gap-1 px-4 py-2 text-xs bg-green-100 text-green-600 rounded-lg"
              >
                <DownloadIcon className="size-4" />
                Download
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
