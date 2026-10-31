import Resume from "../Models/resume.js";
import User from "../Models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 characters.");
  }
  return jwt.sign({ userId: String(userId) }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const publicUser = (user) => {
  const result = user.toObject();
  delete result.password;
  return result;
};

export const registeredUser = async (req, res) => {
  try {
    const { name, email, password } = req.body ?? {};
    if (typeof name !== "string" || !name.trim() || typeof email !== "string" || !email.trim() || typeof password !== "string" || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return res.status(409).json({ message: "A user with this email already exists" });
    const newUser = await User.create({ name: name.trim(), email: normalizedEmail, password });
    return res.status(201).json({ message: "Account created successfully", token: generateToken(newUser._id), user: publicUser(newUser) });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    if (error?.code === 11000) return res.status(409).json({ message: "A user with this email already exists" });
    return res.status(500).json({ message: "Registration failed" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    if (typeof email !== "string" || !email.trim() || typeof password !== "string" || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: "Invalid email or password" });
    return res.status(200).json({ message: "Logged in successfully", token: generateToken(user._id), user: publicUser(user) });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Login failed" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ user });
  } catch (error) {
    console.error("GET USER ERROR:", error);
    return res.status(500).json({ message: "Failed to get user data" });
  }
};

export const getUserResume = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId }).sort({ updatedAt: -1 });
    return res.status(200).json({ resumes });
  } catch (error) {
    console.error("GET RESUMES ERROR:", error);
    return res.status(500).json({ message: "Failed to get resumes" });
  }
};
