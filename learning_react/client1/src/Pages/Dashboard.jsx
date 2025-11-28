import React, { useEffect, useState } from "react";
import { PlusIcon, UploadCloudIcon } from "lucide-react";
// import { dummyResumeData } from "../assets/assets/";
import { dummyResumeData } from "../../../../client/src/assets/assets.js";

const Dashboard = () => {
  const [allResumes, setAllResumes] = useState([]);
  const loadAllResumes = async () => {
    setAllResumes(dummyResumeData);
  };
  useEffect(() => {
    loadAllResumes();
  }, []);
  const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"];
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <p className="text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">
        Welcome:Aparna thakur
      </p>
      <div className="flex gap-4 mx-20">
        <button
          className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg
              duration-300

                transition-all     
 
        cursor-pointer "
        >
          <PlusIcon
            className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500
          text-white 
          rounded-full"
          />
          Create Resume
        </button>
        <button className="w-full bg-white sm:max-w-3 flex flex-col justify-center items-center gap-2 sm:max-w-36 border border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer">
          <UploadCloudIcon
            className="size-11 bg-gradient-to-br from-purple-500 to-purple-700
          text-white rounded-full p-2.5 
          "
          />
          Upload Resume
        </button>
      </div>
      <hr className="border-slate-300 my-6 sm:w-[305px]" />
      <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
        {allResumes.map((resume, index) => {
          const baseColor = colors[index % colors.length];
          return (
            <button
              key={index}
              onClick={() => navigate(`/app/builder/${resume._id}`)}
              className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer"
              style={{
                background: `linear-gradient(135deg,${baseColor}10, ${baseColor}40)`,
                borderColor: baseColor + "40",
              }}
            >
              <FilePenLineIcon
                className="size-7 group-hover:scale-105 transition-all"
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
              <div className="absolute top-1 right-1 group-hover:flex items-center hidden">
                <TrashIcon className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors" />
                <PencilIcon className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
