import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, default: "Untitled Resume", trim: true, maxlength: 120 },
    public: { type: Boolean, default: false, index: true },
    template: {
      type: String,
      enum: ["classic", "modern", "minimal", "minimal-image"],
      default: "classic",
    },
    accent_color: {
      type: String,
      default: "#3B82F6",
      match: [/^#[0-9A-Fa-f]{6}$/, "Accent color must be a valid hex color"],
    },
    professional_summary: { type: String, default: "", maxlength: 5000 },
    skills: [{ type: String, trim: true, maxlength: 100 }],
    personal_info: {
      image: { type: String, default: "" },
      full_name: { type: String, default: "", maxlength: 120 },
      profession: { type: String, default: "", maxlength: 160 },
      email: { type: String, default: "", maxlength: 254 },
      phone: { type: String, default: "", maxlength: 40 },
      location: { type: String, default: "", maxlength: 160 },
      linkedin: { type: String, default: "", maxlength: 500 },
      website: { type: String, default: "", maxlength: 500 },
    },
    experience: [{
      company: { type: String, default: "", maxlength: 160 },
      position: { type: String, default: "", maxlength: 160 },
      start_date: { type: String, default: "", maxlength: 80 },
      end_date: { type: String, default: "", maxlength: 80 },
      description: { type: String, default: "", maxlength: 8000 },
      is_current: { type: Boolean, default: false },
    }],
    project: [{
      name: { type: String, default: "", maxlength: 160 },
      type: { type: String, default: "", maxlength: 120 },
      description: { type: String, default: "", maxlength: 8000 },
    }],
    education: [{
      institution: { type: String, default: "", maxlength: 200 },
      degree: { type: String, default: "", maxlength: 160 },
      field: { type: String, default: "", maxlength: 160 },
      gpa: { type: String, default: "", maxlength: 40 },
      graduation_date: { type: String, default: "", maxlength: 80 },
    }],
  },
  { timestamps: true, minimize: false, strict: "throw" }
);

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;
