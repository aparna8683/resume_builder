const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;
const requestTimesByIp = new Map();

const resetRateLimit = (req, res, next) => {
  const now = Date.now();
  const key = req.ip || req.socket.remoteAddress || "unknown";
  const recentRequests = (requestTimesByIp.get(key) || []).filter(
    (timestamp) => now - timestamp < WINDOW_MS
  );

  if (recentRequests.length >= MAX_REQUESTS) {
    return res.status(429).json({ message: "Too many reset requests. Please try again later." });
  }

  recentRequests.push(now);
  requestTimesByIp.set(key, recentRequests);

  if (requestTimesByIp.size > 2000) {
    for (const [ip, timestamps] of requestTimesByIp) {
      if (!timestamps.some((timestamp) => now - timestamp < WINDOW_MS)) {
        requestTimesByIp.delete(ip);
      }
    }
  }

  return next();
};

export default resetRateLimit;
