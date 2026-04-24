import React, { useEffect, useState } from "react";
import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloudIcon,
  XIcon,
  FilePenLineIcon,
  LoaderCircleIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../configs/api";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import pdfToText from "react-pdftotext";
import Loader from "../Components/Loader";

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"];
  const [isLoading, setIsLoading] = useState(false);

  const [allResumes, setAllResumes] = useState([]);
  const [showCreateResumes, setShowCreateResumes] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState(null);
  const [editResumeId, setEditResumeId] = useState(null);
  const navigate = useNavigate();

  const loadAllResumes = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await api.get("/api/resume", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAllResumes(data.resumes);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "all resume loading failed failed",
      );
    }
  };

  // Create new resume handler
  const createResume = async (event) => {
    event.preventDefault();
    if (!title.trim()) return;

    try {
      const token = localStorage.getItem("token");

      const { data } = await api.post(
        "/api/resume/create",
        { title },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setAllResumes([...allResumes, data.resume]);

      setShowCreateResumes(false);
      setTitle("");

      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Resume creation failed");
    }
  };

  // Upload resume handler
  const uploadResume = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (!resume || !title.trim()) {
      setIsLoading(false);
      return;
    }
    try {
      const resumeText = await pdfToText(resume);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("resumeText", resumeText);
      formData.append("resume", resume);

      const { data } = await api.post(
        "/api/ai/upload-resume",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setShowUploadResume(false);
      setTitle("");
      setResume(null);
      navigate(`/app/builder/${data.newResume._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Resume upload failed");
    }
    setIsLoading(false);
  };
  const editTitle = async (event) => {
    event.preventDefault();

    if (!title.trim()) return;
    try {
      const { data } = await api.put(
        `/api/resume/update`,
        { resumeId: editResumeId, resumeData: { title } },
        { headers: { Authorization: token } },
      );

      setAllResumes(
        allResumes.map((resume) =>
          resume._id === editResumeId ? { ...resume, title } : resume,
        ),
      );

      setEditResumeId(null);
      setTitle("");
      toast.success(data.message);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Resume title updation failed",
      );
    }
  };
  const deleteResume = async (resumeId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this resume?",
    );
    try {
      if (confirm) {
        const { data } = await api.delete(`/api/resume/delete/${resumeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllResumes(allResumes.filter((resume) => resume._id !== resumeId));
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error?.responsse?.data?.message || errro.message);
    }
  };

  useEffect(() => {
    loadAllResumes();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <p className="text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">
        Welcome! Node.js
      </p>

      <div className="flex gap-4 mx-20">
        <button
          onClick={() => setShowCreateResumes(true)}
          className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          <PlusIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full" />
          <p className="text-sm group-hover:text-indigo-600 transition-all duration-300">
            Create Resume
          </p>
        </button>

        {/* Upload Resume Button */}
        <button
          onClick={() => setShowUploadResume(true)}
          className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          <UploadCloudIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full" />
          <p className="text-sm group-hover:text-purple-600 transition-all duration-300">
            Upload Existing
          </p>
        </button>
      </div>

      <hr className="border-slate-300 my-6 sm:w-[305px]" />

      {/* Resume Cards */}
      <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
        {allResumes.map((resume, index) => {
          const baseColor = colors[index % colors.length];
          return (
            <button
              key={index}
              onClick={() => navigate(`/app/builder/${resume._id}`)}
              className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer"
              style={{
                background: `linear-gradient(0deg,${baseColor}10, ${baseColor}40)`,
                borderColor: baseColor + "40",
              }}
            >
              <FilePenLineIcon
                className="size-7 group-hover:scale-105  transition-all"
                style={{ color: baseColor }}
              />
              <p
                className="text-sm group-hover:scale-105 transition-all px-2 text-center"
                style={{ color: baseColor }}
              >
                {resume.title}
              </p>
              <p
                className="absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-all duration-300 px-2 text-center"
                style={{ color: baseColor + "90" }}
              >
                Updated On {new Date(resume.updatedAt).toLocaleDateString()}
              </p>
              <div
                onClick={(event) => {
                  event.stopPropagation();
                }}
                className="absolute top-1 right-1 group-hover:flex items-center hidden"
              >
                <TrashIcon
                  onClick={() => {
                    deleteResume(resume._id);
                  }}
                  className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                />
                <PencilIcon
                  onClick={() => {
                    setEditResumeId(resume._id);
                    setTitle(resume.title);
                  }}
                  className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Create Resume Modal */}
      {showCreateResumes && (
        <form
          onSubmit={createResume}
          onClick={() => setShowCreateResumes(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
          >
            <h2 className="text-xl font-bold mb-4">Create a Resume</h2>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter resume title"
              className="w-full px-4 py-2 mb-4 border border-slate-300 rounded focus:border-green-600 focus:outline-none"
              required
            />

            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Create Resume
            </button>

            <XIcon
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
              onClick={() => {
                setShowCreateResumes(false);
                setTitle("");
              }}
            />
          </div>
        </form>
      )}

      {/* Upload Resume Modal */}
      {showUploadResume && (
        <form
          onSubmit={uploadResume}
          onClick={() => setShowUploadResume(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
          >
            <h2 className="text-xl font-bold mb-4">Upload a Resume</h2>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter resume title"
              className="w-full px-4 py-2 mb-4 border border-slate-300 rounded focus:border-green-600 focus:outline-none"
              required
            />

            <label
              htmlFor="resume-input"
              className="block text-sm text-slate-700"
            >
              Select Resume File
              <div className="flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-green-500 hover:text-green-700 cursor-pointer transition-colors">
                {resume ? (
                  <p className="text-green-700">{resume.name}</p>
                ) : (
                  <>
                    <UploadCloudIcon className="size-14 stroke-1" />
                    <p>Upload resume</p>
                  </>
                )}
              </div>
            </label>

            <input
              type="file"
              id="resume-input"
              accept=".pdf"
              hidden
              onChange={(e) => setResume(e.target.files[0])}
            />

            <button
              disabled={isLoading}
              type="submit"
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              {isLoading && (
                <LoaderCircleIcon className="animate-spin size-4 text-white" />
              )}
              {isLoading ? "...uploading" : "Upload Resume"}
            </button>

            <XIcon
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
              onClick={() => {
                setShowUploadResume(false);
                setTitle("");
                setResume(null);
              }}
            />
          </div>
        </form>
      )}
      {editResumeId && (
        <form
          onSubmit={editTitle}
          onClick={() => setEditResumeId("")}
          className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
          >
            <h2 className="text-xl font-bold mb-4">Edit Resume Title</h2>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter resume title"
              className="w-full px-4 py-2 mb-4 border border-slate-300 rounded focus:border-green-600 focus:outline-none"
              required
            />

            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Update
            </button>

            <XIcon
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
              onClick={() => {
                setEditResumeId(null);
                setTitle("");
              }}
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default Dashboard;
