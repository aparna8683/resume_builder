
import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  const authorization = req.headers.authorization;
  const secret = process.env.JWT_SECRET;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication token is required",
    });
  }

  if (!secret) {
    console.error("JWT_SECRET is not configured");
    return res.status(500).json({
      message: "Authentication is not configured",
    });
  }

  try {
    const token = authorization.slice(7).trim();

    if (!token) {
      return res.status(401).json({
        message: "Authentication token is required",
      });
    }

    const decoded = jwt.verify(token, secret);

    if (!decoded?.userId) {
      return res.status(401).json({
        message: "Invalid authentication token",
      });
    }

    req.userId = decoded.userId;
    return next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired authentication token",
    });
  }
};

export default protect;
