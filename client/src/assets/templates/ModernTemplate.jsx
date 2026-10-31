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

const ModernTemplate = ({ data = {}, accentColor = "#4F46E5" }) => {
  const {
    personal_info = {},
    professional_summary = "",
    experience = [],
    education = [],
    project = [],
    skills = [],
  } = data;

  return (
    <div className="bg-white text-slate-800 text-[13px] leading-relaxed">
      {/* Header Banner */}
      <header
        className="p-8 sm:p-10 text-white"
        style={{ backgroundColor: accentColor }}
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-1">
          {personal_info?.full_name || "Your Name"}
        </h1>

        {personal_info?.profession && (
          <p className="text-sm font-medium tracking-wider uppercase opacity-90 mb-4">
            {personal_info.profession}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs opacity-95">
          {personal_info?.email && (
            <div className="flex items-center gap-1.5 truncate">
              <Mail className="size-3.5 shrink-0" />
              <span className="truncate">{personal_info.email}</span>
            </div>
          )}
          {personal_info?.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="size-3.5 shrink-0" />
              <span>{personal_info.phone}</span>
            </div>
          )}
          {personal_info?.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="size-3.5 shrink-0" />
              <span>{personal_info.location}</span>
            </div>
          )}
          {personal_info?.linkedin && (
            <div className="flex items-center gap-1.5 truncate">
              <Linkedin className="size-3.5 shrink-0" />
              <span className="truncate">
                {personal_info.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
              </span>
            </div>
          )}
          {personal_info?.website && (
            <div className="flex items-center gap-1.5 truncate">
              <Globe className="size-3.5 shrink-0" />
              <span className="truncate">
                {personal_info.website.replace(/^https?:\/\/(www\.)?/, "")}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Body */}
      <div className="p-8 sm:p-10 space-y-6">
        {/* Summary */}
        {professional_summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 pb-1.5 border-b border-slate-200">
              Professional Summary
            </h2>
            <p className="text-slate-700 leading-relaxed text-justify">
              {professional_summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4 pb-1.5 border-b border-slate-200">
              Work Experience
            </h2>

            <div className="space-y-5">
              {experience.map((exp, index) => (
                <div key={index} className="relative pl-4 border-l-2 border-slate-200">
                  <div className="flex flex-wrap justify-between items-baseline mb-1">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {exp.position}
                      </h3>
                      <p className="text-xs font-semibold" style={{ color: accentColor }}>
                        {exp.company}
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {formatDate(exp.start_date)} –{" "}
                      {exp.is_current ? "Present" : formatDate(exp.end_date)}
                    </span>
                  </div>

                  {exp.description && (
                    <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line mt-1.5">
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
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 pb-1.5 border-b border-slate-200">
              Projects
            </h2>

            <div className="space-y-3">
              {project.map((p, index) => (
                <div
                  key={index}
                  className="pl-4 border-l-2"
                  style={{ borderColor: accentColor }}
                >
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-xs font-bold text-slate-900">{p.name}</h3>
                    {p.type && (
                      <span className="text-[11px] text-slate-400 font-medium">
                        {p.type}
                      </span>
                    )}
                  </div>
                  {p.description && (
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {p.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Two-Column: Education & Skills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Education */}
          {education && education.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 pb-1.5 border-b border-slate-200">
                Education
              </h2>

              <div className="space-y-3">
                {education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="text-xs font-bold text-slate-900">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-xs font-medium" style={{ color: accentColor }}>
                      {edu.institution}
                    </p>
                    <div className="flex justify-between items-center text-[11px] text-slate-500 mt-0.5">
                      <span>{formatDate(edu.graduation_date)}</span>
                      {edu.gpa && <span>GPA: {edu.gpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills && skills.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 pb-1.5 border-b border-slate-200">
                Key Skills
              </h2>

              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 text-[11px] font-semibold text-white rounded-lg shadow-2xs"
                    style={{ backgroundColor: accentColor }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
