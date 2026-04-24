import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      default: "Untitled Resume",
      trim: true,
    },

    public: {
      type: Boolean,
      default: false, 
      index: true,
    },

    template: {
      type: String,
      enum: ["classic", "modern", "minimal", "minimal-image"],
      default: "classic",
    },

    accent_color: {
      type: String,
      default: "#3B82F6",
    },

    professional_summary: {
      type: String,
      default: "",
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    personal_info: {
      image: { type: String, default: "" },
      full_name: { type: String, default: "" },
      profession: { type: String, default: "" },
      email: { type: String, default: "" },
      location: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      website: { type: String, default: "" },
    },

    experience: [
      {
        company: { type: String, default: "" },
        position: { type: String, default: "" },
        start_date: { type: String, default: "" },
        end_date: { type: String, default: "" },
        description: { type: String, default: "" },
        is_current: { type: Boolean, default: false },
      },
    ],

    project: [
      {
        name: { type: String, default: "" },
        type: { type: String, default: "" },
        description: { type: String, default: "" },
      },
    ],

    education: [
      {
        institution: { type: String, default: "" },
        degree: { type: String, default: "" },
        field: { type: String, default: "" },
        gpa: { type: String, default: "" }, // fixed casing
        graduation_date: { type: String, default: "" },
      },
    ],
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;