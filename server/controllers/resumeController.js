import fs from "fs";
import Resume from "../Models/resume.js";
import imagekit from "../configs/imageKit.js";
import mongoose from "mongoose";


    // Create Resume
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    const newResume = await Resume.create({
      userId,
      title: title || "Untitled Resume",
    });

    return res.status(201).json({
      message: "Resume created successfully",
      resume: newResume,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Resume creation failed",
    });
  }
};


// Delete Resume
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

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
    console.error(error);
    return res.status(500).json({
      message: "Resume deletion failed",
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
      { __v: 0, createdAt: 0, updatedAt: 0 }
    );

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    return res.status(200).json({ resume });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch resume",
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
        message: "Resume not found",
      });
    }

    return res.status(200).json({ resume });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch public resume",
    });
  }
};


// Update Resume
export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId, resumeData, removeBackground } = req.body;
    const image = req.file;

    let resumeDataCopy ;
    if( typeof resumeData==='string' )
      resumeDataCopy= await JSON.parse(JSON.stringify(resumeData));
    else{
      resumeDataCopy= structuredClone(resumeData)
    }

    // If image uploaded
    if (image) {
      const imageStream = fs.createReadStream(image.path);

      const response = await imagekit.files.upload({
        file: imageStream,
        fileName: "resume.png",
        folder: "user-resumes",
        transformation: {
          pre:
            "w-300,h-300,fo-face,z-0.75" +
            (removeBackground ? ",e-bgremove" : ""),
        },
      });

      resumeDataCopy.personal_info.image = response.url;

      // Delete temp file
      fs.unlinkSync(image.path);
    }

    const updatedResume = await Resume.findOneAndUpdate(
      { userId, _id: resumeId },
      resumeDataCopy,
      { new: true }
    );

    if (!updatedResume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      message: "Saved Successfully",
      resume: updatedResume,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Resume update failed",
    });
  }
};
export const getAllResumes = async (req, res)=>{
  try{ 
    const userId= req.userId;
    const resumes= await Resume.find({
      userId
    },
    { __v : 0}

  ).sort({updatedAt: -1})
  return res.status(200).json({resumes})

  } catch(error){
    console.log(error);
    return res.status(500).json({
      message:"Failed to fetch resumes",
    })
  }
}