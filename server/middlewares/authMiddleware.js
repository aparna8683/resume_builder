import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }
  const token = authorization.slice(7).trim();
  if (!token || !process.env.JWT_SECRET) {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.userId) return res.status(401).json({ message: "Invalid session token" });
    req.userId = decoded.userId;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
};

export default protect;
