import React from "react";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const parts = dateStr.split("-");
    if (parts.length >= 2) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      return new Date(year, month).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};

const ClassicTemplate = ({ data = {}, accentColor = "#4F46E5" }) => {
  const {
    personal_info = {},
    professional_summary = "",
    experience = [],
    education = [],
    project = [],
    skills = [],
  } = data;

  return (
    <div className="p-8 sm:p-12 bg-white text-slate-800 text-[13px] leading-relaxed">
      {/* Header */}
      <header
        className="text-center mb-6 pb-5 border-b-2"
        style={{ borderColor: accentColor }}
      >
        <h1
          className="text-3xl font-extrabold uppercase tracking-tight mb-1"
          style={{ color: accentColor }}
        >
          {personal_info?.full_name || "Your Full Name"}
        </h1>

        {personal_info?.profession && (
          <p className="text-sm font-semibold text-slate-600 uppercase tracking-widest mb-3">
            {personal_info.profession}
          </p>
        )}

        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1.5 text-xs text-slate-600">
          {personal_info?.email && (
            <div className="flex items-center gap-1">
              <Mail className="size-3.5" style={{ color: accentColor }} />
              <span>{personal_info.email}</span>
            </div>
          )}
          {personal_info?.phone && (
            <div className="flex items-center gap-1">
              <Phone className="size-3.5" style={{ color: accentColor }} />
              <span>{personal_info.phone}</span>
            </div>
          )}
          {personal_info?.location && (
            <div className="flex items-center gap-1">
              <MapPin className="size-3.5" style={{ color: accentColor }} />
              <span>{personal_info.location}</span>
            </div>
          )}
          {personal_info?.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="size-3.5" style={{ color: accentColor }} />
              <span className="break-all">
                {personal_info.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
              </span>
            </div>
          )}
          {personal_info?.website && (
            <div className="flex items-center gap-1">
              <Globe className="size-3.5" style={{ color: accentColor }} />
              <span className="break-all">
                {personal_info.website.replace(/^https?:\/\/(www\.)?/, "")}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {professional_summary && (
        <section className="mb-6">
          <h2
            className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b"
            style={{ color: accentColor, borderColor: `${accentColor}30` }}
          >
            Professional Summary
          </h2>
          <p className="text-slate-700 leading-relaxed text-justify">
            {professional_summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-6">
          <h2
            className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b"
            style={{ color: accentColor, borderColor: `${accentColor}30` }}
          >
            Work Experience
          </h2>

          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div
                key={index}
                className="pl-3 border-l-2"
                style={{ borderColor: accentColor }}
              >
                <div className="flex flex-wrap justify-between items-baseline mb-1">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {exp.position || "Position"}
                    </h3>
                    <p className="font-semibold text-slate-700 text-xs">
                      {exp.company || "Company"}
                    </p>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {formatDate(exp.start_date)} –{" "}
                    {exp.is_current ? "Present" : formatDate(exp.end_date)}
                  </span>
                </div>

                {exp.description && (
                  <div className="text-slate-700 text-xs leading-relaxed whitespace-pre-line mt-1.5">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {project && project.length > 0 && (
        <section className="mb-6">
          <h2
            className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b"
            style={{ color: accentColor, borderColor: `${accentColor}30` }}
          >
            Projects
          </h2>

          <div className="space-y-3">
            {project.map((proj, index) => (
              <div key={index} className="pl-3 border-l-2 border-slate-200">
                <div className="flex flex-wrap justify-between items-baseline">
                  <h3 className="font-bold text-slate-900 text-xs">
                    {proj.name}
                  </h3>
                  {proj.type && (
                    <span className="text-[11px] text-slate-500 font-medium">
                      {proj.type}
                    </span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-6">
          <h2
            className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b"
            style={{ color: accentColor, borderColor: `${accentColor}30` }}
          >
            Education
          </h2>

          <div className="space-y-2.5">
            {education.map((edu, index) => (
              <div
                key={index}
                className="flex flex-wrap justify-between items-baseline"
              >
                <div>
                  <h3 className="font-bold text-slate-900 text-xs">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p className="text-slate-600 text-xs">{edu.institution}</p>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <p>{formatDate(edu.graduation_date)}</p>
                  {edu.gpa && <p className="font-medium">GPA: {edu.gpa}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section>
          <h2
            className="text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b"
            style={{ color: accentColor, borderColor: `${accentColor}30` }}
          >
            Skills & Competencies
          </h2>

          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ClassicTemplate;
