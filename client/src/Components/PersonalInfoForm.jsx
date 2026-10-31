import React from "react";
import {
  User2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Linkedin,
  Globe,
  Github,
  Upload,
  Trash2,
  Sparkles,
} from "lucide-react";

const PersonalInfoForm = ({
  data = {},
  onChange,
  removeBackground,
  setRemoveBackground,
}) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const fields = [
    {
      key: "full_name",
      label: "Full Name",
      icon: User2,
      type: "text",
      placeholder: "e.g. Alex Morgan",
      required: true,
      colSpan: "col-span-2 sm:col-span-1",
    },
    {
      key: "profession",
      label: "Target Title / Profession",
      icon: Briefcase,
      type: "text",
      placeholder: "e.g. Senior Frontend Engineer",
      required: true,
      colSpan: "col-span-2 sm:col-span-1",
    },
    {
      key: "email",
      label: "Email Address",
      icon: Mail,
      type: "email",
      placeholder: "alex.morgan@example.com",
      required: true,
      colSpan: "col-span-2 sm:col-span-1",
    },
    {
      key: "phone",
      label: "Phone Number",
      icon: Phone,
      type: "tel",
      placeholder: "+1 (555) 019-2834",
      colSpan: "col-span-2 sm:col-span-1",
    },
    {
      key: "location",
      label: "Location",
      icon: MapPin,
      type: "text",
      placeholder: "San Francisco, CA, USA",
      colSpan: "col-span-2",
    },
    {
      key: "linkedin",
      label: "LinkedIn Profile",
      icon: Linkedin,
      type: "url",
      placeholder: "https://linkedin.com/in/alexmorgan",
      colSpan: "col-span-2 sm:col-span-1",
    },
    {
      key: "website",
      label: "Portfolio / Website",
      icon: Globe,
      type: "url",
      placeholder: "https://alexmorgan.dev",
      colSpan: "col-span-2 sm:col-span-1",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div>
        <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Recruiters use these details to contact and evaluate you.
        </p>
      </div>

      {/* Profile Image & Background Removal */}
      <div className="flex flex-wrap items-center gap-5 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
        <div className="relative">
          {data?.image ? (
            <div className="relative group size-20">
              <img
                src={
                  typeof data.image === "string"
                    ? data.image
                    : URL.createObjectURL(data.image)
                }
                alt="Profile"
                className="size-20 rounded-full object-cover border-2 border-indigo-400 shadow-sm"
              />
              <button
                type="button"
                onClick={() => handleChange("image", "")}
                title="Remove photo"
                className="absolute -top-1 -right-1 size-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-md transition"
              >
                <Trash2 className="size-3" />
              </button>
            </div>
          ) : (
            <label className="size-20 rounded-full border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-white flex flex-col items-center justify-center cursor-pointer transition group">
              <Upload className="size-5 text-slate-400 group-hover:text-indigo-600 transition" />
              <span className="text-[10px] font-semibold text-slate-500 group-hover:text-indigo-600 mt-1">
                Photo
              </span>
              <input
                type="file"
                accept="image/jpeg, image/png, image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleChange("image", e.target.files[0]);
                  }
                }}
              />
            </label>
          )}
        </div>

        <div className="flex-1 min-w-[200px]">
          <h4 className="text-xs font-bold text-slate-800">Profile Portrait</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Recommended for "Minimal Image" and modern executive templates.
          </p>

          {typeof data?.image === "object" && (
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200">
              <input
                type="checkbox"
                id="remove-bg"
                checked={removeBackground}
                onChange={(e) => setRemoveBackground(e.target.checked)}
                className="size-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
              />
              <label
                htmlFor="remove-bg"
                className="text-xs font-medium text-slate-700 cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="size-3 text-indigo-500" />
                Auto-remove background with AI
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Grid Inputs */}
      <div className="grid grid-cols-2 gap-4">
        {fields.map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.key} className={field.colSpan}>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                <Icon className="size-3.5 text-slate-400" />
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={field.type}
                value={data?.[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                required={field.required}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PersonalInfoForm;
