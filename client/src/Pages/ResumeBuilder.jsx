import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
import {
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  FileText,
  FolderIcon,
  GraduationCap,
  Minimize,
  Sparkle,
  Sparkles,
  User,
} from "lucide-react";
import PersonalIInfoForm from "../Components/PersonalIInfoForm";
import ResumePreview from "../Components/ResumePreview";
import TemplateSelector from "../Components/TemplateSelector";

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
    { id: "education", name: "education", icon: Briefcase },
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
              </div>
            </div>
          </div>
          {/* {Right Pannel} */}
          <div className="lg:col-span-7 max-lg:mt-6">
            <div>{/* {buttons} */}</div>
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
