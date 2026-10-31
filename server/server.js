import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRouter.js";

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, process.env.UPLOAD_DIR || "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const allowedOrigins = (process.env.CLIENT_URL || "").split(",").map((origin) => origin.trim()).filter(Boolean);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS"));
  },
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/", (_req, res) => res.json({ status: "ok", message: "Resume Builder API is active", timestamp: new Date().toISOString() }));
app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

app.use("/api/users", userRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/ai", aiRouter);

app.use((err, _req, res, _next) => {
  console.error("Request error:", err);
  const status = err.status || (err.name === "MulterError" ? 400 : 500);
  return res.status(status).json({ message: status >= 500 ? "Internal server error" : err.message });
});

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => console.log(`Resume Builder API listening on port ${PORT}`));
    const shutdown = (signal) => {
      console.log(`${signal} received; shutting down gracefully`);
      server.close(() => process.exit(0));
    };
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error("Unable to start API:", error.message);
    process.exitCode = 1;
  }
};

if (process.env.NODE_ENV !== "test") startServer();

export default app;
