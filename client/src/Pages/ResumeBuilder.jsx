import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../configs/api";
import {
  ArrowLeft, Briefcase, ChevronLeft, ChevronRight, Download, Eye, EyeOff,
  FileText, FolderGit2, GraduationCap, Loader2, Share2, Sparkles, User,
  Save, CheckCircle, ExternalLink,
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
    _id: "", title: "Untitled Resume", personal_info: {}, professional_summary: "",
    experience: [], education: [], project: [], skills: [], template: "classic",
    accent_color: "#4F46E5", public: false,
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isChangingVisibility, setIsChangingVisibility] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);
  const resumeDataRef = useRef(resumeData);
  const saveInFlightRef = useRef(false);
  const saveQueuedRef = useRef(false);

  useEffect(() => { resumeDataRef.current = resumeData; }, [resumeData]);

  const sections = [
    { id: "personal", name: "Personal", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderGit2 },
    { id: "skills", name: "Skills", icon: Sparkles },
  ];
  const activeSection = sections[activeSectionIndex];

  const loadExistingResume = useCallback(async () => {
    if (!resumeId) return;
    try {
      setLoading(true);
      const { data } = await api.get(`/api/resume/${resumeId}`);
      if (data?.resume) {
        resumeDataRef.current = data.resume;
        setResumeData(data.resume);
        document.title = `${data.resume.title || "Resume"} | Builder`;
      } else {
        throw new Error("Resume was not found.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Failed to load resume");
      navigate("/app", { replace: true });
    } finally {
      setLoading(false);
    }
  }, [resumeId, navigate]);

  useEffect(() => { loadExistingResume(); }, [loadExistingResume]);

  const saveResume = useCallback(async (silent = false) => {
    if (!resumeId) return;
    if (saveInFlightRef.current) {
      saveQueuedRef.current = true;
      return;
    }

    saveInFlightRef.current = true;
    setIsSaving(true);
    try {
      do {
        saveQueuedRef.current = false;
        const snapshot = resumeDataRef.current;
        const updated = structuredClone(snapshot);
        const imageValue = snapshot.personal_info?.image;
        const isFileImage = typeof File !== "undefined" && imageValue instanceof File;

        if (isFileImage) {
          updated.personal_info = { ...updated.personal_info };
          delete updated.personal_info.image;
        }

        const formData = new FormData();
        formData.append("resumeId", resumeId);
        formData.append("resumeData", JSON.stringify(updated));
        if (removeBackground) formData.append("removeBackground", "yes");
        if (isFileImage) formData.append("image", imageValue);

        const { data } = await api.put("/api/resume/update", formData);
        if (data?.resume) {
          if (resumeDataRef.current === snapshot) {
            resumeDataRef.current = data.resume;
            setResumeData(data.resume);
          } else {
            // An edit landed while this request was saving. Persist the newer snapshot too.
            saveQueuedRef.current = true;
          }
        }
        if (!silent) toast.success(data?.message || "Saved successfully!");
      } while (saveQueuedRef.current);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save changes");
    } finally {
      saveInFlightRef.current = false;
      setIsSaving(false);
    }
  }, [resumeId, removeBackground]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        saveResume();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [saveResume]);

  const changeResumeVisibility = async () => {
    if (!resumeId || isChangingVisibility || isSaving) return;
    const nextPublicState = !resumeData.public;
    try {
      setIsChangingVisibility(true);
      const { data } = await api.put("/api/resume/update", {
        resumeId,
        resumeData: { public: nextPublicState },
      });
      const updated = data?.resume || { ...resumeDataRef.current, public: nextPublicState };
      resumeDataRef.current = { ...resumeDataRef.current, ...updated };
      setResumeData((prev) => ({ ...prev, ...updated }));
      toast.success(nextPublicState ? "Resume is now public." : "Resume is now private.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update visibility");
    } finally {
      setIsChangingVisibility(false);
    }
  };

  const handleShare = async () => {
    const resumeURL = `${window.location.origin}/view/${resumeId}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: resumeData.title || "My Resume", text: `Check out my resume - ${resumeData.title}`, url: resumeURL });
        return;
      }
      await navigator.clipboard.writeText(resumeURL);
      toast.success("Public link copied to clipboard!");
    } catch (error) {
      if (error?.name !== "AbortError") toast.error("Could not share the link. Please copy it from the address bar.");
    }
  };

  const downloadResume = async () => {
    if (isDownloading) return;
    const resumeElement = document.getElementById("resume-preview");
    if (!resumeElement) return toast.error("Preview is not ready");
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
      const cleanFileName = `${name.replace(/\s+/g, "_")}_Resume.pdf`.replace(/[\\/:*?"<>|]+/g, "");
      const options = {
        margin: 0,
        filename: cleanFileName,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: "#ffffff",
          logging: false,
          scrollX: 0,
          scrollY: 0,
          onclone: (clonedDocument) => {
            // The live export node is transparent and out of the way.
            // Make only the html2canvas clone visible at the viewport origin.
            const clonedContainer = clonedDocument.querySelector(".resume-pdf-export-container");
            if (clonedContainer) {
              clonedContainer.style.left = "0";
              clonedContainer.style.top = "0";
              clonedContainer.style.opacity = "1";
              clonedContainer.style.visibility = "visible";
              clonedContainer.style.zIndex = "99999";
            }
          },
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait", compress: true },
        pagebreak: { mode: ["css", "legacy"], avoid: ["section", "header", ".avoid-page-break"] },
      };
      await html2pdf().set(options).from(exportElement).save();
      toast.success("Downloaded successfully!", { id: "pdf" });
    } catch (error) {
      console.error("PDF export failed:", error);
      toast.error("Download failed. You can also print with Ctrl+P.", { id: "pdf" });
    } finally {
      if (container?.parentNode) container.parentNode.removeChild(container);
      setIsDownloading(false);
    }
  };

  const handleLoadSampleData = () => {
    const sample = dummyResumeData[0];
    const next = {
      ...resumeDataRef.current, personal_info: sample.personal_info,
      professional_summary: sample.professional_summary, experience: sample.experience,
      education: sample.education, project: sample.project, skills: sample.skills,
    };
    resumeDataRef.current = next;
    setResumeData(next);
    toast.success("Loaded sample details into editor!");
  };

  if (loading) {
    return <div className="flex flex-col items-center justify-center min-h-[80vh]"><Loader2 className="size-10 text-indigo-600 animate-spin mb-3" /><p className="text-sm font-semibold text-slate-700">Loading your resume...</p></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16">
      <div className="sticky top-14 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link to="/app" className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition p-1.5 rounded-lg hover:bg-slate-100"><ArrowLeft className="size-4" /><span className="max-md:hidden">Dashboard</span></Link>
            <span className="text-slate-300">|</span>
            <input type="text" value={resumeData.title || ""} onChange={(e) => setResumeData((prev) => ({ ...prev, title: e.target.value }))} placeholder="Resume Title" className="text-sm font-bold text-slate-800 bg-transparent hover:bg-slate-100 focus:bg-white px-2 py-1 rounded-lg border border-transparent hover:border-slate-200 focus:border-indigo-400 outline-none transition max-w-[180px] sm:max-w-xs truncate" title="Click to rename resume" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <TemplateSelector selectedTemplate={resumeData.template} onChange={(template) => setResumeData((prev) => ({ ...prev, template }))} />
            <ColorPicker selectedColor={resumeData.accent_color} onChange={(color) => setResumeData((prev) => ({ ...prev, accent_color: color }))} />
            <button type="button" onClick={changeResumeVisibility} disabled={isChangingVisibility || isSaving} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition cursor-pointer border ${resumeData.public ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"}`} title="Toggle Public / Private">{resumeData.public ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}<span className="max-sm:hidden">{resumeData.public ? "Public" : "Private"}</span></button>
            {resumeData.public && <button type="button" onClick={handleShare} className="flex items-center gap-1.5 text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 px-3 py-2 rounded-xl transition cursor-pointer" title="Share public link"><Share2 className="size-3.5" /><span className="max-sm:hidden">Share</span></button>}
            <button type="button" onClick={downloadResume} disabled={isDownloading} className="flex items-center gap-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50" title="Export to PDF">{isDownloading ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}<span>{isDownloading ? "Exporting..." : "PDF"}</span></button>
            <button type="button" onClick={() => saveResume(false)} disabled={isSaving} className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-4 py-2 rounded-xl shadow-md shadow-indigo-200 transition cursor-pointer">{isSaving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}<span>{isSaving ? "Saving..." : "Save"}</span></button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden sticky top-28">
            <div className="relative h-1.5 bg-slate-100 w-full overflow-hidden"><div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300" style={{ width: `${((activeSectionIndex + 1) / sections.length) * 100}%` }} /></div>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1">{sections.map((sec, idx) => { const Icon = sec.icon; const isActive = activeSectionIndex === idx; return <button key={sec.id} type="button" onClick={() => setActiveSectionIndex(idx)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${isActive ? "bg-indigo-50 text-indigo-700 shadow-2xs border border-indigo-200" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}><Icon className="size-3.5" /><span className="hidden sm:inline">{sec.name}</span></button>; })}</div>
              <button type="button" onClick={handleLoadSampleData} className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100/70 px-2 py-1 rounded-lg shrink-0 transition" title="Fill with sample data">Sample Data</button>
            </div>
            <div className="p-5 sm:p-6 max-h-[calc(100vh-280px)] overflow-y-auto">
              {activeSection.id === "personal" && <PersonalInfoForm data={resumeData.personal_info} onChange={(info) => setResumeData((prev) => ({ ...prev, personal_info: info }))} removeBackground={removeBackground} setRemoveBackground={setRemoveBackground} />}
              {activeSection.id === "summary" && <ProfessionalSummary data={resumeData.professional_summary} onChange={(summary) => setResumeData((prev) => ({ ...prev, professional_summary: summary }))} />}
              {activeSection.id === "experience" && <ExperienceForm data={resumeData.experience} onChange={(exp) => setResumeData((prev) => ({ ...prev, experience: exp }))} />}
              {activeSection.id === "education" && <Education data={resumeData.education} onChange={(edu) => setResumeData((prev) => ({ ...prev, education: edu }))} />}
              {activeSection.id === "projects" && <Projects data={resumeData.project} onChange={(proj) => setResumeData((prev) => ({ ...prev, project: proj }))} />}
              {activeSection.id === "skills" && <Skills data={resumeData.skills} onChange={(sk) => setResumeData((prev) => ({ ...prev, skills: sk }))} />}
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button type="button" onClick={() => setActiveSectionIndex((prev) => Math.max(0, prev - 1))} disabled={activeSectionIndex === 0} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs transition"><ChevronLeft className="size-4" />Previous</button>
              <span className="text-[11px] font-semibold text-slate-400">Step {activeSectionIndex + 1} of {sections.length}</span>
              {activeSectionIndex < sections.length - 1 ? <button type="button" onClick={() => setActiveSectionIndex((prev) => Math.min(sections.length - 1, prev + 1))} className="flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition">Next<ChevronRight className="size-4" /></button> : <button type="button" onClick={() => saveResume(false)} disabled={isSaving} className="flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition disabled:opacity-50"><CheckCircle className="size-3.5" />Save & Finish</button>}
            </div>
          </div>
          <div className="lg:col-span-7"><ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} /></div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
