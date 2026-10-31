import React, { useEffect, useState, useMemo } from "react";
import {
  Plus,
  UploadCloud,
  FileText,
  Trash2,
  Edit3,
  Copy,
  ExternalLink,
  Search,
  Sparkles,
  Calendar,
  X,
  Loader2,
  FileCheck,
  Globe,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../configs/api";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import pdfToText from "react-pdftotext";
import { dummyResumeData } from "../assets/assets";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [allResumes, setAllResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editResumeId, setEditResumeId] = useState(null);

  // Form states
  const [title, setTitle] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadAllResumes = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/resume");
      setAllResumes(data?.resumes || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllResumes();
  }, []);

  // Filtered resumes based on search query
  const filteredResumes = useMemo(() => {
    if (!searchQuery.trim()) return allResumes;
    return allResumes.filter((r) =>
      r.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allResumes, searchQuery]);

  // Create Resume Handler
  const handleCreateResume = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a resume title");
      return;
    }

    try {
      setIsSubmitting(true);
      const { data } = await api.post("/api/resume/create", { title: title.trim() });
      toast.success("Resume created!");
      setShowCreateModal(false);
      setTitle("");
      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create resume");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Upload Resume Handler
  const handleUploadResume = async (e) => {
    e.preventDefault();
    if (!pdfFile) {
      toast.error("Please select a PDF file");
      return;
    }
    if (!title.trim()) {
      toast.error("Please provide a title for this resume");
      return;
    }

    try {
      setIsSubmitting(true);
      const resumeText = await pdfToText(pdfFile);

      if (!resumeText?.trim()) {
        toast.error("Could not extract readable text from this PDF");
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("resumeText", resumeText);
      formData.append("resume", pdfFile);

      const { data } = await api.post("/api/ai/upload-resume", formData);

      toast.success(data?.message || "Resume extracted and imported!");
      setShowUploadModal(false);
      setTitle("");
      setPdfFile(null);

      if (data?.newResume?._id) {
        navigate(`/app/builder/${data.newResume._id}`);
      } else {
        loadAllResumes();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Upload and parsing failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rename Resume
  const handleRenameResume = async (e) => {
    e.preventDefault();
    if (!title.trim() || !editResumeId) return;

    try {
      setIsSubmitting(true);
      const { data } = await api.put("/api/resume/update", {
        resumeId: editResumeId,
        resumeData: { title: title.trim() },
      });

      setAllResumes((prev) =>
        prev.map((r) => (r._id === editResumeId ? { ...r, title: title.trim() } : r))
      );
      toast.success(data?.message || "Title updated");
      setShowEditModal(false);
      setEditResumeId(null);
      setTitle("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to rename resume");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Duplicate Resume
  const handleDuplicateResume = async (resumeId) => {
    try {
      toast.loading("Duplicating resume...", { id: "dup" });
      const { data } = await api.post(`/api/resume/duplicate/${resumeId}`);
      toast.success("Resume duplicated!", { id: "dup" });
      setAllResumes((prev) => [data.resume, ...prev]);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to duplicate", { id: "dup" });
    }
  };

  // Delete Resume
  const handleDeleteResume = async (resumeId) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;

    try {
      toast.loading("Deleting...", { id: "del" });
      await api.delete(`/api/resume/delete/${resumeId}`);
      setAllResumes((prev) => prev.filter((r) => r._id !== resumeId));
      toast.success("Resume deleted", { id: "del" });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete", { id: "del" });
    }
  };

  // Import Sample Template (Quick Start)
  const handleImportSample = async () => {
    try {
      setIsSubmitting(true);
      const sample = dummyResumeData[0];
      const { data } = await api.post("/api/resume/create", {
        title: "Alex Smith - Full Stack Dev",
      });

      if (data?.resume?._id) {
        await api.put("/api/resume/update", {
          resumeId: data.resume._id,
          resumeData: {
            ...sample,
            title: "Alex Smith - Full Stack Dev",
          },
        });
        toast.success("Sample resume created!");
        navigate(`/app/builder/${data.resume._id}`);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Sample creation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Top Banner / Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="size-4" />
            Resume Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Welcome back, {user?.name || "Creator"} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, manage, and optimize your job-winning resumes with AI intelligence.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setTitle("");
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold shadow-md shadow-indigo-200 transition cursor-pointer"
          >
            <Plus className="size-4" />
            Create Resume
          </button>

          <button
            onClick={() => {
              setTitle("");
              setPdfFile(null);
              setShowUploadModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 active:scale-95 text-purple-700 text-sm font-semibold transition cursor-pointer"
          >
            <UploadCloud className="size-4" />
            AI Import PDF
          </button>
        </div>
      </div>

      {/* Search and Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search your resumes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium self-end sm:self-auto">
          <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg">
            Total Resumes: <strong className="text-slate-800">{allResumes.length}</strong>
          </span>
          <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg">
            Public: <strong className="text-slate-800">{allResumes.filter((r) => r.public).length}</strong>
          </span>
        </div>
      </div>

      {/* Resumes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-white border border-slate-200 p-6 flex flex-col justify-between animate-pulse"
            >
              <div className="space-y-3">
                <div className="size-10 rounded-xl bg-slate-100" />
                <div className="h-4 w-3/4 bg-slate-100 rounded" />
                <div className="h-3 w-1/2 bg-slate-100 rounded" />
              </div>
              <div className="h-8 bg-slate-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredResumes.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-slate-300 rounded-3xl p-8 my-4">
          <div className="size-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-4">
            <FileText className="size-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            {searchQuery ? "No matching resumes found" : "No resumes created yet"}
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            {searchQuery
              ? `No resume matches "${searchQuery}". Try a different search keyword.`
              : "Start by creating a fresh resume from scratch or import a pre-built sample template."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setTitle("");
                setShowCreateModal(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-100 transition cursor-pointer"
            >
              <Plus className="size-4" />
              Create Resume
            </button>
            <button
              onClick={handleImportSample}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition cursor-pointer"
            >
              <Sparkles className="size-4 text-amber-500" />
              Load Sample Template
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Quick Create Card */}
          <button
            onClick={() => {
              setTitle("");
              setShowCreateModal(true);
            }}
            className="group flex flex-col items-center justify-center h-64 p-6 bg-white border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20 rounded-2xl transition-all cursor-pointer shadow-2xs hover:shadow-md"
          >
            <div className="size-12 rounded-2xl bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center transition-colors mb-3">
              <Plus className="size-6 transition-transform group-hover:rotate-90" />
            </div>
            <span className="font-semibold text-sm text-slate-800 group-hover:text-indigo-600 transition-colors">
              New Resume
            </span>
            <span className="text-xs text-slate-400 mt-1 text-center">
              Create a custom resume from scratch
            </span>
          </button>

          {/* Resume Cards */}
          {filteredResumes.map((resume) => {
            const templateLabel =
              resume.template === "minimal-image"
                ? "Minimal Image"
                : resume.template
                ? resume.template.charAt(0).toUpperCase() + resume.template.slice(1)
                : "Classic";

            return (
              <div
                key={resume._id}
                onClick={() => navigate(`/app/builder/${resume._id}`)}
                className="group relative flex flex-col justify-between h-64 p-5 bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl transition-all duration-200 shadow-xs hover:shadow-xl hover:-translate-y-1 cursor-pointer"
              >
                {/* Top Section */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div
                      className="size-10 rounded-xl flex items-center justify-center shadow-xs text-white"
                      style={{ backgroundColor: resume.accent_color || "#4F46E5" }}
                    >
                      <FileText className="size-5" />
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Visibility Pill */}
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          resume.public
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {resume.public ? <Globe className="size-3" /> : <Lock className="size-3" />}
                        {resume.public ? "Public" : "Private"}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-800 text-base line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {resume.title || "Untitled Resume"}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <span className="font-medium text-slate-600">{templateLabel} Template</span>
                    <span>•</span>
                    <span
                      className="size-2 rounded-full inline-block"
                      style={{ backgroundColor: resume.accent_color || "#3B82F6" }}
                    />
                  </p>
                </div>

                {/* Footer and Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="size-3" />
                    {new Date(resume.updatedAt || Date.now()).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>

                  {/* Action Icon Buttons */}
                  <div
                    className="flex items-center gap-1 opacity-90 group-hover:opacity-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      title="Duplicate"
                      onClick={() => handleDuplicateResume(resume._id)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                    >
                      <Copy className="size-4" />
                    </button>

                    <button
                      type="button"
                      title="Rename"
                      onClick={() => {
                        setEditResumeId(resume._id);
                        setTitle(resume.title || "");
                        setShowEditModal(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                    >
                      <Edit3 className="size-4" />
                    </button>

                    <button
                      type="button"
                      title="Delete"
                      onClick={() => handleDeleteResume(resume._id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="size-4" />
                    </button>

                    {resume.public && (
                      <button
                        type="button"
                        title="View Public Link"
                        onClick={() => window.open(`/view/${resume._id}`, "_blank")}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                      >
                        <ExternalLink className="size-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE RESUME MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full transition"
            >
              <X className="size-5" />
            </button>

            <div className="size-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Plus className="size-6" />
            </div>

            <h2 className="text-xl font-bold text-slate-900">Create New Resume</h2>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Give your resume a descriptive title (e.g., "Full Stack Developer - Google").
            </p>

            <form onSubmit={handleCreateResume} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Resume Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Software Engineer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                  autoFocus
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl text-sm hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm shadow-md shadow-indigo-200 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Continue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD PDF MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => {
                setShowUploadModal(false);
                setPdfFile(null);
                setTitle("");
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full transition"
            >
              <X className="size-5" />
            </button>

            <div className="size-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <UploadCloud className="size-6" />
            </div>

            <h2 className="text-xl font-bold text-slate-900">AI Resume Importer</h2>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Upload your existing PDF resume. Our AI parser will extract your info, experience, and skills automatically!
            </p>

            <form onSubmit={handleUploadResume} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Resume Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Imported Software Resume"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select PDF File
                </label>
                <label
                  htmlFor="pdf-upload"
                  className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl transition cursor-pointer ${
                    pdfFile
                      ? "border-emerald-400 bg-emerald-50/40 text-emerald-700"
                      : "border-slate-300 hover:border-purple-400 hover:bg-purple-50/20 text-slate-500"
                  }`}
                >
                  {pdfFile ? (
                    <div className="flex items-center gap-2">
                      <FileCheck className="size-6 text-emerald-600" />
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-800">{pdfFile.name}</p>
                        <p className="text-[10px] text-slate-400">
                          {(pdfFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="size-8 text-slate-400 mb-2" />
                      <span className="text-xs font-semibold text-slate-700">
                        Click to browse or drop PDF
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        PDF format up to 10MB
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    id="pdf-upload"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setPdfFile(file);
                        if (!title) {
                          setTitle(file.name.replace(/\.pdf$/i, ""));
                        }
                      }
                    }}
                  />
                </label>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setPdfFile(null);
                    setTitle("");
                  }}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl text-sm hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !pdfFile}
                  className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl text-sm shadow-md shadow-purple-200 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Extracting AI Data...</span>
                    </>
                  ) : (
                    "Upload & Parse"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RENAME MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full transition"
            >
              <X className="size-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900">Rename Resume</h2>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Update the title for this resume.
            </p>

            <form onSubmit={handleRenameResume} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Resume Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                  autoFocus
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl text-sm hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm shadow-md shadow-indigo-200 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
