import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.resolve(process.env.UPLOAD_DIR || "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const imageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const pdfTypes = new Set(["application/pdf"]);

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDir),
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: Number(process.env.MAX_UPLOAD_SIZE_BYTES) || 10 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    const allowed = file.fieldname === "image"
      ? imageTypes.has(file.mimetype)
      : file.fieldname === "resume"
        ? pdfTypes.has(file.mimetype)
        : false;

    if (!allowed) {
      const error = new Error(file.fieldname === "image"
        ? "Profile images must be JPEG, PNG, or WebP."
        : "Resume uploads must be PDF files.");
      error.status = 415;
      return callback(error);
    }
    callback(null, true);
  },
});

export default upload;
