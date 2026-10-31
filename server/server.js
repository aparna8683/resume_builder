
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

// CORS configuration
app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        (process.env.NODE_ENV !== "production" &&
          allowedOrigins.length === 0) ||
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      const error = new Error(
        "Origin is not allowed by CORS. Configure CLIENT_URL with your frontend origin."
      );

      error.status = 403;
      return callback(error);
    },
    credentials: true,
  })
);

// Request body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// API request logging
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    console.info(`[API] ${req.method} ${req.originalUrl}`);
  }

  next();
});

// Root endpoint
app.get("/", (_req, res) => {
  return res.json({
    status: "ok",
    message: "Resume Builder API is active",
    timestamp: new Date().toISOString(),
  });
});

// Health check
app.get("/health", (_req, res) => {
  return res.status(200).json({
    status: "ok",
  });
});

// API routes
app.use("/api/users", userRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/ai", aiRouter);

// JSON 404 handler
app.use((req, res) => {
  console.warn(`[404] ${req.method} ${req.originalUrl}`);

  return res.status(404).json({
    message: "API route not found",
    method: req.method,
    path: req.originalUrl,
  });
});

// Centralized error handler
app.use((err, _req, res, next) => {
  console.error("Request error:", err);

  if (res.headersSent) {
    return next(err);
  }

  const status =
    err.status || (err.name === "MulterError" ? 400 : 500);

  return res.status(status).json({
    message:
      status >= 500
        ? "Internal server error"
        : err.message,
  });
});

// Start server
export const startServer = async () => {
  if (
    !process.env.JWT_SECRET ||
    process.env.JWT_SECRET.length < 32
  ) {
    throw new Error(
      "JWT_SECRET must be configured with at least 32 characters."
    );
  }

  if (
    process.env.NODE_ENV === "production" &&
    allowedOrigins.length === 0
  ) {
    throw new Error(
      "CLIENT_URL must be configured in production."
    );
  }

  await connectDB();

  return app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `Resume Builder API listening on port ${PORT}`
    );
  });
};

// Avoid automatic startup during tests
if (process.env.NODE_ENV !== "test") {
  startServer().catch((error) => {
    console.error("Unable to start API:", error.message);
    process.exit(1);
  });
}

export default app;
