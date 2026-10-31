import Resume from "../Models/resume.js";
import User from "../Models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "fallback_secret_key", {
    expiresIn: "7d",
  });
};

export const registeredUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "A user with this email already exists" });
    }

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    const token = generateToken(newUser._id);
    const userObj = newUser.toObject();
    delete userObj.password;

    return res.status(201).json({
      message: "Account created successfully",
      token,
      user: userObj,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ message: error.message || "Registration failed" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({
      message: "Logged in successfully",
      token,
      user: userObj,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: error.message || "Login failed" });
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
