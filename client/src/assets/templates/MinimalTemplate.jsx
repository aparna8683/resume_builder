import React from "react";

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

const MinimalTemplate = ({ data = {}, accentColor = "#4F46E5" }) => {
  const {
    personal_info = {},
    professional_summary = "",
    experience = [],
    education = [],
    project = [],
    skills = [],
  } = data;

  return (
    <div className="p-8 sm:p-12 bg-white text-slate-800 text-[13px] leading-relaxed font-sans">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900 mb-1">
          {personal_info?.full_name || "Your Name"}
        </h1>

        {personal_info?.profession && (
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: accentColor }}
          >
            {personal_info.profession}
          </p>
        )}

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
          {personal_info?.email && <span>{personal_info.email}</span>}
          {personal_info?.phone && <span>{personal_info.phone}</span>}
          {personal_info?.location && <span>{personal_info.location}</span>}
          {personal_info?.linkedin && (
            <span className="break-all">
              {personal_info.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
            </span>
          )}
          {personal_info?.website && (
            <span className="break-all">
              {personal_info.website.replace(/^https?:\/\/(www\.)?/, "")}
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      {professional_summary && (
        <section className="mb-7">
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed text-justify">
            {professional_summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-7">
          <h2
            className="text-[11px] uppercase tracking-widest font-bold mb-4 pb-1 border-b"
            style={{ color: accentColor, borderColor: `${accentColor}30` }}
          >
            Experience
          </h2>

          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div key={index}>
                <div className="flex flex-wrap justify-between items-baseline mb-0.5">
                  <h3 className="font-bold text-slate-900 text-xs">
                    {exp.position} — <span className="font-semibold text-slate-600">{exp.company}</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {formatDate(exp.start_date)} –{" "}
                    {exp.is_current ? "Present" : formatDate(exp.end_date)}
                  </span>
                </div>

                {exp.description && (
                  <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line mt-1">
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
        <section className="mb-7">
          <h2
            className="text-[11px] uppercase tracking-widest font-bold mb-4 pb-1 border-b"
            style={{ color: accentColor, borderColor: `${accentColor}30` }}
          >
            Projects
          </h2>

          <div className="space-y-3">
            {project.map((proj, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-slate-900 text-xs">
                    {proj.name}
                  </h3>
                  {proj.type && (
                    <span className="text-[11px] text-slate-400">{proj.type}</span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
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
        <section className="mb-7">
          <h2
            className="text-[11px] uppercase tracking-widest font-bold mb-4 pb-1 border-b"
            style={{ color: accentColor, borderColor: `${accentColor}30` }}
          >
            Education
          </h2>

          <div className="space-y-2.5">
            {education.map((edu, index) => (
              <div key={index} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-bold text-slate-900 text-xs">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p className="text-slate-600 text-xs">{edu.institution}</p>
                </div>
                <div className="text-right text-[11px] text-slate-400">
                  <p>{formatDate(edu.graduation_date)}</p>
                  {edu.gpa && <p>GPA: {edu.gpa}</p>}
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
            className="text-[11px] uppercase tracking-widest font-bold mb-3 pb-1 border-b"
            style={{ color: accentColor, borderColor: `${accentColor}30` }}
          >
            Skills
          </h2>
          <div className="text-xs text-slate-700 leading-relaxed font-medium">
            {skills.join("  •  ")}
          </div>
        </section>
      )}
    </div>
  );
};

export default MinimalTemplate;
