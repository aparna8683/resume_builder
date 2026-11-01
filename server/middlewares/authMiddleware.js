import jwt from "jsonwebtoken";
import User from "../Models/User.js";

const readCookie = (cookieHeader, name) => {
  for (const part of (cookieHeader || "").split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0) continue;
    if (part.slice(0, separator).trim() === name) {
      return decodeURIComponent(part.slice(separator + 1).trim());
    }
  }
  return null;
};

const protect = async (req, res, next) => {
  const authorization = req.headers.authorization;
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    console.error("JWT_SECRET is missing or too short");
    return res.status(500).json({ message: "Authentication is not configured" });
  }

  try {
    const token = readCookie(req.headers.cookie, "resumify_session") ||
      (authorization?.startsWith("Bearer ") ? authorization.slice(7).trim() : null);
    if (!token) {
      return res.status(401).json({ message: "Authentication token is required" });
    }

    const decoded = jwt.verify(token, secret);
    if (!decoded?.userId) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    const user = await User.findById(decoded.userId).select("+authVersion");
    if (!user || (decoded.authVersion ?? 0) !== (user.authVersion ?? 0)) {
      return res.status(401).json({ message: "Invalid or expired authentication token" });
    }

    req.userId = decoded.userId;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired authentication token" });
  }
};

export default protect;
