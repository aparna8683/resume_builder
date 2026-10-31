import React from "react";
import { Mail, Phone, MapPin, Linkedin, Globe, User2 } from "lucide-react";

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

const MinimalImageTemplate = ({ data = {}, accentColor = "#4F46E5" }) => {
  const {
    personal_info = {},
    professional_summary = "",
    experience = [],
    education = [],
    project = [],
    skills = [],
  } = data;

  const imageSrc =
    typeof personal_info?.image === "string"
      ? personal_info.image
      : personal_info?.image && typeof personal_info.image === "object"
      ? URL.createObjectURL(personal_info.image)
      : null;

  return (
    <div className="bg-white text-slate-800 text-[13px] leading-relaxed">
      <div className="grid grid-cols-12 min-h-[297mm]">
        {/* Left Column (Sidebar) */}
        <aside className="col-span-4 bg-slate-50 border-r border-slate-200 p-6 sm:p-7 flex flex-col gap-6">
          {/* Avatar */}
          <div className="text-center pt-2">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt="Profile"
                className="size-28 sm:size-32 rounded-full object-cover mx-auto shadow-md border-3"
                style={{ borderColor: accentColor }}
              />
            ) : (
              <div
                className="size-28 sm:size-32 rounded-full flex items-center justify-center mx-auto shadow-md text-white font-extrabold text-3xl"
                style={{ backgroundColor: accentColor }}
              >
                {personal_info?.full_name?.charAt(0) || "U"}
              </div>
            )}
          </div>

          {/* Contact Details */}
          <div>
            <h2
              className="text-[11px] font-bold uppercase tracking-widest mb-3 pb-1 border-b"
              style={{ color: accentColor, borderColor: `${accentColor}30` }}
            >
              Contact
            </h2>
            <div className="space-y-2 text-xs text-slate-600">
              {personal_info?.email && (
                <div className="flex items-start gap-1.5 break-all">
                  <Mail className="size-3.5 shrink-0 mt-0.5" style={{ color: accentColor }} />
                  <span>{personal_info.email}</span>
                </div>
              )}
              {personal_info?.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="size-3.5 shrink-0" style={{ color: accentColor }} />
                  <span>{personal_info.phone}</span>
                </div>
              )}
              {personal_info?.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 shrink-0" style={{ color: accentColor }} />
                  <span>{personal_info.location}</span>
                </div>
              )}
              {personal_info?.linkedin && (
                <div className="flex items-start gap-1.5 break-all">
                  <Linkedin className="size-3.5 shrink-0 mt-0.5" style={{ color: accentColor }} />
                  <span>{personal_info.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</span>
                </div>
              )}
              {personal_info?.website && (
                <div className="flex items-start gap-1.5 break-all">
                  <Globe className="size-3.5 shrink-0 mt-0.5" style={{ color: accentColor }} />
                  <span>{personal_info.website.replace(/^https?:\/\/(www\.)?/, "")}</span>
                </div>
              )}
            </div>
          </div>

          {/* Education */}
          {education && education.length > 0 && (
            <div>
              <h2
                className="text-[11px] font-bold uppercase tracking-widest mb-3 pb-1 border-b"
                style={{ color: accentColor, borderColor: `${accentColor}30` }}
              >
                Education
              </h2>
              <div className="space-y-3 text-xs">
                {education.map((edu, index) => (
                  <div key={index}>
                    <p className="font-bold text-slate-900">{edu.degree}</p>
                    {edu.field && (
                      <p className="text-[11px] text-slate-600">{edu.field}</p>
                    )}
                    <p className="text-[11px] text-slate-500">{edu.institution}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {formatDate(edu.graduation_date)}
                      {edu.gpa && ` • GPA ${edu.gpa}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div>
              <h2
                className="text-[11px] font-bold uppercase tracking-widest mb-3 pb-1 border-b"
                style={{ color: accentColor, borderColor: `${accentColor}30` }}
              >
                Skills
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 rounded text-[11px] font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Right Column (Main) */}
        <main className="col-span-8 p-6 sm:p-8 space-y-6">
          {/* Name & Title Header */}
          <header className="border-b border-slate-200 pb-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              {personal_info?.full_name || "Your Full Name"}
            </h1>
            <p
              className="text-xs font-bold uppercase tracking-widest mt-1"
              style={{ color: accentColor }}
            >
              {personal_info?.profession || "Target Profession"}
            </p>
          </header>

          {/* Summary */}
          {professional_summary && (
            <section>
              <h2
                className="text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: accentColor }}
              >
                About Me
              </h2>
              <p className="text-slate-700 text-xs leading-relaxed text-justify">
                {professional_summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <section>
              <h2
                className="text-xs font-bold uppercase tracking-wider mb-3"
                style={{ color: accentColor }}
              >
                Experience
              </h2>

              <div className="space-y-4">
                {experience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex flex-wrap justify-between items-baseline">
                      <h3 className="font-bold text-slate-900 text-xs">
                        {exp.position}
                      </h3>
                      <span className="text-[11px] text-slate-400">
                        {formatDate(exp.start_date)} –{" "}
                        {exp.is_current ? "Present" : formatDate(exp.end_date)}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 mb-1">
                      {exp.company}
                    </p>
                    {exp.description && (
                      <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
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
              <h2
                className="text-xs font-bold uppercase tracking-wider mb-3"
                style={{ color: accentColor }}
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
                        <span className="text-[11px] text-slate-400">
                          {proj.type}
                        </span>
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
        </main>
      </div>
    </div>
  );
};

export default MinimalImageTemplate;
