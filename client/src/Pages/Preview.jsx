import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../configs/api";
import ResumePreview from "../Components/ResumePreview";
import {
  ArrowLeft,
  Download,
  Share2,
  Printer,
  Sparkles,
  Lock,
  Loader2,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import { preparePdfExport } from "../utils/pdfExport";

const Preview = () => {
  const { resumeId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [resumeData, setResumeData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const loadResume = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/api/resume/public/${resumeId}`);
      if (data?.resume) {
        setResumeData(data.resume);
        document.title = `${data.resume.title || "Resume"} | Public View`;
      }
    } catch (error) {
      console.warn("Public resume load error:", error?.response?.data?.message || error.message);
      setResumeData(null);
    } finally {
      setIsLoading(false);
    }
  }, [resumeId]);

  useEffect(() => {
    loadResume();
  }, [loadResume]);

  const handleDownload = async () => {
    if (isDownloading) return;
    const resumeElement = document.getElementById("resume-preview");
    if (!resumeElement) {
      toast.error("Preview is not ready");
      return;
    }

    let container = null;
    try {
      setIsDownloading(true);
      toast.loading("Preparing PDF...", { id: "pdf-pub" });

      await document.fonts?.ready;

      const { default: html2pdf } = await import("html2pdf.js");
      const exportElement = resumeElement.cloneNode(true);

      container = document.createElement("div");
      container.className = "resume-pdf-export-container";
      container.appendChild(exportElement);
      document.body.appendChild(container);

      preparePdfExport(exportElement);

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
      toast.success("Downloaded successfully!", { id: "pdf-pub" });
    } catch (error) {
      console.error(error);
      toast.error("Download failed", { id: "pdf-pub" });
    } finally {
      if (container?.parentNode) {
        container.parentNode.removeChild(container);
      }
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: resumeData?.title || "Resume",
          url: window.location.href,
        });
        return;
      }
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
        <Loader2 className="size-10 text-indigo-600 animate-spin mb-3" />
        <p className="text-sm font-semibold text-slate-700">Loading resume preview...</p>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
          <div className="size-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Lock className="size-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Resume is Private or Not Found</h2>
          <p className="text-xs text-slate-500 mt-2 mb-6 leading-relaxed">
            This resume may be set to private by its owner, or the link might be expired. If you are the owner, sign in and toggle it to Public.
          </p>

          <div className="flex flex-col gap-2">
            <Link
              to="/app"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
            >
              Sign In to Your Account
            </Link>
            <Link
              to="/"
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/90 pb-16">
      {/* Sticky Action Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 print:hidden">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition p-1.5 rounded-lg hover:bg-slate-100"
            >
              <ArrowLeft className="size-4" />
              <span className="max-sm:hidden">Home</span>
            </Link>

            <span className="text-slate-300">|</span>

            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-tight">
                {resumeData.personal_info?.full_name || resumeData.title || "Resume"}
              </h1>
              <span className="text-[10px] text-slate-400 font-medium">Public Candidate Profile</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl transition cursor-pointer shadow-2xs"
            >
              <Share2 className="size-3.5" />
              <span className="max-sm:hidden">Share</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl transition cursor-pointer shadow-2xs"
            >
              <Printer className="size-3.5" />
              <span className="max-sm:hidden">Print</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              {isDownloading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Download className="size-3.5" />
              )}
              <span>{isDownloading ? "Exporting..." : "Download PDF"}</span>
            </button>

            <Link
              to="/login?state=register"
              className="max-md:hidden flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-2 rounded-xl transition"
            >
              <Sparkles className="size-3.5" />
              Build Your Own Resume
            </Link>
          </div>
        </div>
      </header>

      {/* Main Resume Container */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ResumePreview
          data={resumeData}
          template={resumeData.template}
          accentColor={resumeData.accent_color}
        />
      </div>
    </div>
  );
};

export default Preview;
