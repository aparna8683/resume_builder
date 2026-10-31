import fs from "fs";
import mongoose from "mongoose";
import Resume from "../Models/resume.js";
import imagekit from "../configs/imageKit.js";

const fileToBase64DataUri = (filePath, mimetype) => {
  const fileData = fs.readFileSync(filePath);
  return `data:${mimetype || "image/png"};base64,${fileData.toString("base64")}`;
};

const fieldSets = {
  personal_info: new Set(["image", "full_name", "profession", "email", "phone", "location", "linkedin", "website"]),
  experience: new Set(["company", "position", "start_date", "end_date", "description", "is_current"]),
  project: new Set(["name", "type", "description"]),
  education: new Set(["institution", "degree", "field", "gpa", "graduation_date"]),
};

const sanitizeObject = (value, allowedFields, label) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`);
  }
  const result = {};
  for (const [key, fieldValue] of Object.entries(value)) {
    if (allowedFields.has(key) && !key.startsWith("$") && !key.includes(".")) {
      result[key] = fieldValue;
    }
  }
  return result;
};

export const sanitizeResumeUpdate = (input) => {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Resume data must be a JSON object.");
  }

  const allowedFields = new Set([
    "title", "public", "template", "accent_color", "professional_summary",
    "skills", "personal_info", "experience", "project", "education",
  ]);
  const update = {};

  for (const [key, value] of Object.entries(input)) {
    if (!allowedFields.has(key) || key.startsWith("$") || key.includes(".")) continue;

    if (key === "personal_info") {
      update[key] = sanitizeObject(value, fieldSets.personal_info, "personal_info");
    } else if (["experience", "project", "education"].includes(key)) {
      if (!Array.isArray(value)) throw new Error(`${key} must be an array.`);
      update[key] = value.map((item, index) =>
        sanitizeObject(item, fieldSets[key], `${key}[${index}]`)
      );
    } else if (key === "skills") {
      if (!Array.isArray(value) || value.some((skill) => typeof skill !== "string")) {
        throw new Error("skills must be an array of strings.");
      }
      update[key] = value.map((skill) => skill.trim()).filter(Boolean);
    } else {
      update[key] = value;
    }
  }

  if (Object.keys(update).length === 0) {
    throw new Error("No supported resume fields were provided.");
  }
  return update;
};

// Create Resume
export const createResume = async (req, res) => {
  try {
    const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";
    const resume = await Resume.create({ userId: req.userId, title: title || "Untitled Resume" });
    return res.status(201).json({ message: "Resume created successfully", resume });
  } catch (error) {
    console.error("createResume error:", error);
    return res.status(500).json({ message: "Resume creation failed" });
  }
};

// Duplicate Resume
export const duplicateResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(resumeId)) return res.status(400).json({ message: "Invalid resume ID" });
    const existing = await Resume.findOne({ userId: req.userId, _id: resumeId });
    if (!existing) return res.status(404).json({ message: "Resume not found" });

    const copy = existing.toObject();
    delete copy._id;
    delete copy.createdAt;
    delete copy.updatedAt;
    delete copy.__v;
    copy.title = `${existing.title} (Copy)`;
    copy.public = false;
    const resume = await Resume.create(copy);
    return res.status(201).json({ message: "Resume duplicated successfully", resume });
  } catch (error) {
    console.error("duplicateResume error:", error);
    return res.status(500).json({ message: "Failed to duplicate resume" });
  }
};

// Delete Resume
export const deleteResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(resumeId)) return res.status(400).json({ message: "Invalid resume ID" });
    const deleted = await Resume.findOneAndDelete({ userId: req.userId, _id: resumeId });
    if (!deleted) return res.status(404).json({ message: "Resume not found" });
    return res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("deleteResume error:", error);
    return res.status(500).json({ message: "Resume deletion failed" });
  }
};

// Get Resume By ID (Private)
export const getResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(resumeId)) return res.status(400).json({ message: "Invalid resume ID" });
    const resume = await Resume.findOne({ userId: req.userId, _id: resumeId }).select("-__v");
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    return res.status(200).json({ resume });
  } catch (error) {
    console.error("getResumeById error:", error);
    return res.status(500).json({ message: "Failed to fetch resume" });
  }
};

// Get Resume By ID (Public)
export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(resumeId)) return res.status(400).json({ message: "Invalid resume ID" });
    const resume = await Resume.findOne({ public: true, _id: resumeId }).select("-__v -userId");
    if (!resume) return res.status(404).json({ message: "Resume not found or is set to private" });
    return res.status(200).json({ resume });
  } catch (error) {
    console.error("getPublicResumeById error:", error);
    return res.status(500).json({ message: "Failed to fetch public resume" });
  }
};

// Update Resume
export const updateResume = async (req, res) => {
  const image = req.file;
  try {
    const { resumeId } = req.body ?? {};
    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({ message: "Invalid or missing resume ID" });
    }

    let parsedData = req.body?.resumeData;
    if (typeof parsedData === "string") {
      try { parsedData = JSON.parse(parsedData); }
      catch { return res.status(400).json({ message: "resumeData contains invalid JSON." }); }
    }

    let update;
    try { update = sanitizeResumeUpdate(parsedData); }
    catch (error) { return res.status(400).json({ message: error.message }); }

    if (image) {
      let imageUrl;
      try {
        if (process.env.IMAGEKIT_PRIVATE_KEY && imagekit?.files?.upload) {
          const stream = fs.createReadStream(image.path);
          const uploaded = await imagekit.files.upload({
            file: stream,
            fileName: image.filename || `resume_${Date.now()}`,
            folder: "user-resumes",
            transformation: { pre: `w-300,h-300,fo-face,z-0.75${req.body?.removeBackground === "yes" ? ",e-bgremove" : ""}` },
          });
          imageUrl = uploaded?.url;
        }
      } catch (error) {
        console.warn("ImageKit upload failed; using local data URI fallback:", error.message);
      }

      if (!imageUrl && fs.existsSync(image.path)) imageUrl = fileToBase64DataUri(image.path, image.mimetype);
      if (imageUrl) {
        update.personal_info = {
          ...(update.personal_info || {}),
          image: imageUrl,
        };
      }
    }

    const resume = await Resume.findOneAndUpdate(
      { userId: req.userId, _id: resumeId },
      { $set: update },
      { new: true, runValidators: true, context: "query" }
    );
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    return res.status(200).json({ message: "Saved successfully", resume });
  } catch (error) {
    console.error("updateResume error:", error);
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Resume update failed" });
  } finally {
    if (image?.path && fs.existsSync(image.path)) {
      try { fs.unlinkSync(image.path); } catch (error) { console.error("Temp upload cleanup failed:", error.message); }
    }
  }
};

export const getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId }).select("-__v").sort({ updatedAt: -1 });
    return res.status(200).json({ resumes });
  } catch (error) {
    console.error("getAllResumes error:", error);
    return res.status(500).json({ message: "Failed to fetch resumes" });
  }
};
