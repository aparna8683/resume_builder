import Resume from "../Models/resume.js";
import User from "../Models/User.js";
import jwt from "jsonwebtoken";
import { createHash, randomBytes } from "node:crypto";

const SESSION_COOKIE = "resumify_session";
const REMEMBERED_SESSION_DAYS = 30;

const generateToken = (user, rememberMe = false) => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 characters.");
  }
  return jwt.sign(
    { userId: user._id, authVersion: user.authVersion || 0 },
    secret,
    { expiresIn: rememberMe ? "30d" : "12h" }
  );
};

const cookieOptions = (rememberMe = false) => {
  const production = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    sameSite: process.env.COOKIE_SAME_SITE || "lax",
    secure: production || process.env.COOKIE_SAME_SITE === "none",
    path: "/",
    ...(rememberMe ? { maxAge: REMEMBERED_SESSION_DAYS * 24 * 60 * 60 * 1000 } : {}),
  };
};

const setSessionCookie = (res, user, rememberMe = false) => {
  res.cookie(SESSION_COOKIE, generateToken(user, rememberMe), cookieOptions(rememberMe));
};

const publicUser = (user) => {
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.resetPasswordTokenHash;
  delete userObj.resetPasswordExpires;
  delete userObj.authVersion;
  return userObj;
};

export const registeredUser = async (req, res) => {
  try {
    const { name, email, password } = req.body ?? {};

    if (
      typeof name !== "string" || !name.trim() || name.trim().length > 100 ||
      typeof email !== "string" || !email.trim() || typeof password !== "string" || !password.trim()
    ) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (password.length < 8 || password.length > 128) {
      return res.status(400).json({ message: "Password must be between 8 and 128 characters" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "A user with this email already exists" });
    }

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      authVersion: 0,
    });

    setSessionCookie(res, newUser, true);

    return res.status(201).json({
      message: "Account created successfully",
      user: publicUser(newUser),
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    if (error?.code === 11000) {
      return res.status(409).json({ message: "A user with this email already exists" });
    }
    return res.status(500).json({ message: error.message || "Registration failed" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, rememberMe = false } = req.body ?? {};

    if (typeof email !== "string" || !email.trim() || typeof password !== "string" || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select("+password +authVersion");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const keepSession = rememberMe === true || rememberMe === "true";
    setSessionCookie(res, user, keepSession);

    return res.status(200).json({
      message: "Logged in successfully",
      user: publicUser(user),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: error.message || "Login failed" });
  }
};

export const logoutUser = (_req, res) => {
  res.clearCookie(SESSION_COOKIE, cookieOptions(false));
  // A remembered cookie has a max-age. Clearing with maxAge omitted still
  // removes it because the cookie name, path, domain, and security flags match.
  return res.status(200).json({ message: "Logged out successfully" });
};

export const requestPasswordReset = async (req, res) => {
  try {
    const rawEmail = req.body?.email;
    if (typeof rawEmail !== "string" || !rawEmail.trim()) return res.status(400).json({ message: "Email is required" });
    const email = rawEmail.trim().toLowerCase();

    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const isProduction = process.env.NODE_ENV === "production";
    if (isProduction && (!resendKey || !fromEmail || !process.env.CLIENT_URL)) {
      return res.status(503).json({ message: "Password reset email is not configured. Contact the site administrator." });
    }

    const configuredClientUrl = (process.env.CLIENT_URL || req.get("origin") || "http://localhost:5173")
      .split(",")[0]
      .trim();
    const clientOrigin = new URL(configuredClientUrl).origin;
    if (isProduction && new URL(clientOrigin).protocol !== "https:") {
      return res.status(503).json({ message: "Password reset requires a secure site URL. Contact the site administrator." });
    }

    const user = await User.findOne({ email }).select("+resetPasswordTokenHash +resetPasswordExpires");
    if (!user) {
      return res.status(200).json({ message: "If an account exists for that email, reset instructions have been sent." });
    }

    const resetToken = randomBytes(32).toString("hex");
    user.resetPasswordTokenHash = createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    const resetUrl = `${clientOrigin}/login?state=reset&token=${encodeURIComponent(resetToken)}`;

    if (resendKey && fromEmail) {
      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [user.email],
            subject: "Reset your Resumify.ai password",
            text: `Use this link within 30 minutes to reset your password: ${resetUrl}`,
            html: `<p>We received a request to reset your password.</p><p><a href="${resetUrl}">Reset your password</a></p><p>This link expires in 30 minutes. If you did not request this, you can ignore this email.</p>`,
          }),
        });
        if (!emailResponse.ok) {
          console.error("Password reset email delivery failed:", await emailResponse.text());
          throw new Error("Email provider rejected the reset email");
        }
      } catch (error) {
        user.resetPasswordTokenHash = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        console.error("Password reset email delivery failed:", error.message);
        return res.status(502).json({ message: "Could not send reset email. Please try again later." });
      }
    }

    return res.status(200).json({
      message: "If an account exists for that email, reset instructions have been sent.",
      ...(!isProduction && (!resendKey || !fromEmail) ? { developmentResetUrl: resetUrl } : {}),
    });
  } catch (error) {
    console.error("PASSWORD RESET REQUEST ERROR:", error);
    return res.status(500).json({ message: "Could not start password reset. Please try again." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body ?? {};
    if (typeof token !== "string" || !token || typeof password !== "string" || !password) {
      return res.status(400).json({ message: "Reset token and new password are required" });
    }
    if (password.length < 8 || password.length > 128) {
      return res.status(400).json({ message: "Password must be between 8 and 128 characters" });
    }

    const tokenHash = createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+resetPasswordTokenHash +resetPasswordExpires +authVersion");

    if (!user) {
      return res.status(400).json({ message: "This reset link is invalid or expired. Request a new one." });
    }

    user.password = password;
    user.authVersion = (user.authVersion || 0) + 1;
    user.resetPasswordTokenHash = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.clearCookie(SESSION_COOKIE, cookieOptions(false));
    return res.status(200).json({ message: "Password reset successfully. Sign in with your new password." });
  } catch (error) {
    console.error("PASSWORD RESET ERROR:", error);
    return res.status(500).json({ message: "Could not reset password. Please try again." });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("GET USER ERROR:", error);
    return res.status(500).json({ message: error.message || "Failed to get user data" });
  }
};

export const getUserResume = async (req, res) => {
  try {
    const userId = req.userId;
    const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 });

    return res.status(200).json({ resumes });
  } catch (error) {
    console.error("GET RESUMES ERROR:", error);
    return res.status(500).json({ message: error.message || "Failed to get resumes" });
  }
};
