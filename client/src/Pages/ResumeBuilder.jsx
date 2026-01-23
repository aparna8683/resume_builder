import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
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
  Minimize,
  Share2,
  Sparkle,
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

const ResumeBuilder = () => {
  const { resumeId } = useParams();
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
    {
      id: "experience",
      name: "Experience",
      icon: GraduationCap,
    },
    { id: "education", name: "Education", icon: Briefcase },
    {
      id: "projects",
      name: "Projects",
      icon: FolderIcon,
    },
    {
      id: "skills",
      name: "Skills",
      icon: Sparkles,
    },
  ];
  const loadExistingResume = async () => {
    const resume = dummyResumeData.find((resume) => resume._id === resumeId);
    if (resume) {
      setResumeData(resume);
      document.title = resume.title;
    }
  };
  const [activeSectionIndex, setActiveIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);
  const activeSection = sections[activeSectionIndex];
  useEffect(() => {
    loadExistingResume();
  }, []);
  const changeResumeVisibility = async () => {
    {
      setResumeData({ ...resumeData, public: !resumeData.public });
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
  return (
    <div>
      <div className="max-w-7xl mx-auto  p-4 py-6 ">
        <Link
          className="inline-flex gap-1 items-center text-slate-500 hover:text-slate-700 transition-all"
          to={"/app"}
        >
          <ArrowLeftIcon className="size-4" /> Back to DashBoard
        </Link>
      </div>
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* {left Pannel} */}
          <div className="relative lg:col-span-5 rounded-lg overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm border-gray-200 p-6 pt-1">
              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />
              <hr
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-2000"
                style={{
                  width: `${
                    (activeSectionIndex * 100) / (sections.length - 1)
                  }%`,
                }}
              />
              {/* {section Navigation} */}
              <div className="flex jusitfy-between items-center mb-6 border-b border-gray-300 py-1">
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
                <div className="flex items-center gap-50">
                  {activeSectionIndex !== 0 && (
                    <button
                      onClick={() => {
                        setActiveIndex((previouIndex) => {
                          return Math.max(previouIndex - 1, 0);
                        });
                      }}
                      className="flex items-center gap-1 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all "
                      disabled={activeSectionIndex == 0}
                    >
                      {" "}
                      <ChevronLeft className="size-4" />
                      Previous
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setActiveIndex((previouIndex) => {
                        return Math.min(previouIndex + 1, sections.length - 1);
                      });
                    }}
                    className={`flex items-center gap-1 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${
                      activeSectionIndex === sections.length - 1 && "opacity-50"
                    }`}
                    disabled={activeSectionIndex == sections.length - 1}
                  >
                    {" "}
                    Next
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
              {/* {Form Content} */}
              <div className="space-y-6">
                {activeSection.id === "personal" && (
                  <PersonalIInfoForm
                    data={resumeData.personal_info}
                    onChange={(data) => {
                      setResumeData((prev) => ({
                        ...prev,
                        personal_info: data,
                      }));
                    }}
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}
                {activeSection.id === "summary" && (
                  <ProfessionalSummary
                    data={resumeData.professional_summary}
                    onChange={(data) => {
                      setResumeData((prev) => ({
                        ...prev,
                        professional_summary: data,
                      }));
                    }}
                  />
                )}
                {activeSection.id === "experience" && (
                  <ExperienceForm
                    data={resumeData.experience}
                    onChange={(data) => {
                      setResumeData((prev) => ({ ...prev, experience: data }));
                    }}
                  />
                )}
                {activeSection.id === "education" && (
                  <Education
                    data={resumeData.education}
                    onChange={(data) => {
                      setResumeData((prev) => ({ ...prev, education: data }));
                    }}
                  />
                )}
                {activeSection.id === "projects" && (
                  <Projects
                    data={resumeData.project}
                    onChange={(data) => {
                      setResumeData((prev) => ({ ...prev, project: data }));
                    }}
                  />
                )}
                {activeSection.id === "skills" && (
                  <Skills
                    data={resumeData.skills}
                    onChange={(data) => {
                      setResumeData((prev) => ({ ...prev, skills: data }));
                    }}
                  />
                )}
              </div>
              <button className="bg-gradient-to-br from-green-100 to-green-200 ring-green-300 text-green-600 ring hover:ring-green-400 transition-all rounded-all rounded-md px-6 py-2 mt-6 text-sm">
                Save Changes
              </button>
            </div>
          </div>
          {/* {Right Pannel} */}
          <div className="lg:col-span-7 max-lg:mt-6">
            <div className="relative w-full ">
              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-end gap-4">
                {resumeData.public && (
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1 p-2 px-4 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors"
                  >
                    <Share2 className="size-4" /> Share
                  </button>
                )}

                <button
                  onClick={changeResumeVisibility}
                  className="flex items-center gap-1 p-2 px-4 text-xs bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 rounded-lg ring-purple-300 hover:ring transition-colors"
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
                  className="flex items-center gap-1  px-6 text-xs bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-lg ring-green-300 hover:ring transition-colors py-2"
                >
                  <DownloadIcon className="size-4" />
                  Download
                </button>
              </div>
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
