import fs from "fs";
import mongoose from "mongoose";
import Resume from "../Models/resume.js";
import imagekit from "../configs/imageKit.js";

// Helper to convert local file to base64 Data URI fallback
const fileToBase64DataUri = (filePath, mimetype) => {
  const fileData = fs.readFileSync(filePath);
  const base64 = fileData.toString("base64");
  return `data:${mimetype || "image/png"};base64,${base64}`;
};

// Create Resume
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    const newResume = await Resume.create({
      userId,
      title: title?.trim() || "Untitled Resume",
    });

    return res.status(201).json({
      message: "Resume created successfully",
      resume: newResume,
    });
  } catch (error) {
    console.error("createResume error:", error);
    return res.status(500).json({
      message: error.message || "Resume creation failed",
    });
  }
};

// Duplicate Resume
export const duplicateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({ message: "Invalid resume ID" });
    }

    const existingResume = await Resume.findOne({ userId, _id: resumeId });
    if (!existingResume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const resumeObj = existingResume.toObject();
    delete resumeObj._id;
    delete resumeObj.createdAt;
    delete resumeObj.updatedAt;
    resumeObj.title = `${existingResume.title} (Copy)`;

    const duplicatedResume = await Resume.create(resumeObj);

    return res.status(201).json({
      message: "Resume duplicated successfully",
      resume: duplicatedResume,
    });
  } catch (error) {
    console.error("duplicateResume error:", error);
    return res.status(500).json({
      message: error.message || "Failed to duplicate resume",
    });
  }
};

// Delete Resume
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({ message: "Invalid resume ID" });
    }

    const deleted = await Resume.findOneAndDelete({
      userId,
      _id: resumeId,
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("deleteResume error:", error);
    return res.status(500).json({
      message: error.message || "Resume deletion failed",
    });
  }
};

// Get Resume By ID (Private)
export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({ message: "Invalid resume ID" });
    }

    const resume = await Resume.findOne(
      { userId, _id: resumeId },
      { __v: 0 }
    );

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    console.error("getResumeById error:", error);
    return res.status(500).json({
      message: error.message || "Failed to fetch resume",
    });
  }
};

// Get Resume By ID (Public)
export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({ message: "Invalid resume ID" });
    }

    const resume = await Resume.findOne({
      public: true,
      _id: resumeId,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found or is set to private",
      });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    console.error("getPublicResumeById error:", error);
    return res.status(500).json({
      message: error.message || "Failed to fetch public resume",
    });
  }
};

// Update Resume
export const updateResume = async (req, res) => {
  const image = req.file;
  try {
    const userId = req.userId;
    const { resumeId, resumeData, removeBackground } = req.body;

    if (!resumeId || !mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({ message: "Invalid or missing resume ID" });
    }

    let resumeDataCopy = {};
    if (typeof resumeData === "string") {
      try {
        resumeDataCopy = JSON.parse(resumeData);
      } catch (e) {
        console.error("JSON parse error for resumeData:", e);
        resumeDataCopy = {};
      }
    } else if (resumeData && typeof resumeData === "object") {
      resumeDataCopy = structuredClone(resumeData);
    }

    // Process image upload if provided
    if (image) {
      let imageUrl = null;
      try {
        // Attempt ImageKit upload if keys are present
        if (process.env.IMAGEKIT_PRIVATE_KEY && imagekit?.files?.upload) {
          const imageStream = fs.createReadStream(image.path);
          const response = await imagekit.files.upload({
            file: imageStream,
            fileName: `resume_${Date.now()}.png`,
            folder: "user-resumes",
            transformation: {
              pre:
                "w-300,h-300,fo-face,z-0.75" +
                (removeBackground ? ",e-bgremove" : ""),
            },
          });
          if (response?.url) {
            imageUrl = response.url;
          }
        }
      } catch (imgKitErr) {
        console.warn("ImageKit upload error, falling back to data URI:", imgKitErr.message);
      }

      // Fallback: If ImageKit fails or is not fully configured, embed as Data URI
      if (!imageUrl && fs.existsSync(image.path)) {
        imageUrl = fileToBase64DataUri(image.path, image.mimetype);
      }

      if (imageUrl) {
        if (!resumeDataCopy.personal_info) {
          resumeDataCopy.personal_info = {};
        }
        resumeDataCopy.personal_info.image = imageUrl;
      }
    }

    const updatedResume = await Resume.findOneAndUpdate(
      { userId, _id: resumeId },
      { $set: resumeDataCopy },
      { new: true, runValidators: true }
    );

    if (!updatedResume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      message: "Saved successfully",
      resume: updatedResume,
    });
  } catch (error) {
    console.error("updateResume error:", error);
    return res.status(500).json({
      message: error.message || "Resume update failed",
    });
  } finally {
    // Always clean up temp uploaded file
    if (image?.path && fs.existsSync(image.path)) {
      try {
        fs.unlinkSync(image.path);
      } catch (err) {
        console.error("Error deleting temp file:", err);
      }
    }
  }
};

export const getAllResumes = async (req, res) => {
  try {
    const userId = req.userId;
    const resumes = await Resume.find({ userId }, { __v: 0 }).sort({
      updatedAt: -1,
    });
    return res.status(200).json({ resumes });
  } catch (error) {
    console.error("getAllResumes error:", error);
    return res.status(500).json({
      message: error.message || "Failed to fetch resumes",
    });
  }
};
