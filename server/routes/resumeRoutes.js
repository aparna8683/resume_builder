import express from 'express'
import protect from '../middlewares/authMiddleware.js';
import { createResume, deleteResume, getPublicResumeById, getResumeById, updateResume, getAllResumes } from '../controllers/resumeController.js';
import upload from '../configs/multer.js';
const resumeRouter=express.Router();

resumeRouter.get("/", protect, getAllResumes)
resumeRouter.post('/create', protect,upload.single("resume"), createResume)
resumeRouter.put('/update',  upload.single('image'), protect,updateResume)
resumeRouter.delete('/delete/:resumeId', protect, deleteResume)
resumeRouter.get('/public/:resumeId', getPublicResumeById)
resumeRouter.get('/:resumeId', protect, getResumeById)

export default resumeRouter
