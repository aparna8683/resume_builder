import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRouter.js";

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    // Permit local development when no allowlist is configured; production must configure one.
    if (
      !origin ||
      (process.env.NODE_ENV !== "production" && allowedOrigins.length === 0) ||
      allowedOrigins.includes(origin)
    ) {
      return callback(null, true);
    }

    const error = new Error("Origin is not allowed by CORS. Configure CLIENT_URL with your frontend origin.");
    error.status = 403;
    return callback(error);
  },
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/", (_req, res) => res.json({
  status: "ok",
  message: "Resume Builder API is active",
  timestamp: new Date().toISOString(),
}));
app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

app.use("/api/users", userRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/ai", aiRouter);

app.use((err, _req, res, next) => {
  console.error("Request error:", err);
  if (res.headersSent) return next(err);

  const status = err.status || (err.name === "MulterError" ? 400 : 500);
  return res.status(status).json({
    message: status >= 500 ? "Internal server error" : err.message,
  });
});

export const startServer = async () => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 characters.");
  }
  if (process.env.NODE_ENV === "production" && allowedOrigins.length === 0) {
    throw new Error("CLIENT_URL must be configured in production.");
  }

  await connectDB();
  return app.listen(PORT, "0.0.0.0", () => {
    console.log(`Resume Builder API listening on port ${PORT}`);
  });
};

if (process.env.NODE_ENV !== "test") {
  startServer().catch((error) => {
    console.error("Unable to start API:", error.message);
    process.exit(1);
  });
}

export default app;
