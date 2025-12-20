import User from "../models/User.js";
import { generateTokens } from "../utils/generateTokens.js";
import jwt from "jsonwebtoken";
// =======================
// User Signup (Public)
// =======================
export const registerUser = async (req, res) => {
  try {
    const {
      prefix,
      name,
      email,
      mobile,
      qualification,
      affiliation,
      country,
    } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    //  Check if mobile already exists
    const existingMobile = await User.findOne({ mobile });
    if (existingMobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile already exists",
      });
    }

    // Create user (role = 'user')
    const user = await User.create({
      prefix,
      name,
      email,
      mobile,
      qualification,
      affiliation,
      country,
      role: "user",
      status: "Pending",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Register user error:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// User Login
// =======================
export const loginUser = async (req, res) => {
  try {
    const { email, mobile, membershipNumber } = req.body;

    // Validate - atleast one field must be entered
    if (!email && !mobile && !membershipNumber) {
      return res.status(400).json({
        message: "Please enter email or mobile or membership number",
      });
    }

    let user;

    // CASE 1: Login using Email
    if (email) {
      user = await User.findOne({ email, role: "user" });
      if (!user) {
        return res.status(400).json({
          message: "Invalid email",
        });
      }
    }

    // CASE 2: Login using Mobile
    if (mobile) {
      user = await User.findOne({ mobile, role: "user" });
      if (!user) {
        return res.status(400).json({
          message: "Invalid mobile number",
        });
      }

      // Mobile format validation (optional)
      if (!/^\d{10}$/.test(mobile)) {
        return res.status(400).json({
          message: "Mobile number must be 10 digits",
        });
      }
    }

    // CASE 3: Login using Membership Number
    if (membershipNumber) {
      user = await User.findOne({ membershipNumber, role: "user" });
      if (!user) {
        return res.status(400).json({
          message: "Invalid membership number",
        });
      }
    }

    // STATUS CHECK
    if (user.status !== "Approved") {
      return res.status(403).json({
        message:
          "You have registered, but your account is pending approval. Contact admin.",
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    // Save refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Success
    return res.json({
      message: "User login successful",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        membershipNumber: user.membershipNumber,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Login user error:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};


// =======================
// Refresh Access Token
// =======================
export const refreshAccessTokenUser = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({ message: "Invalid refresh token" });
  }
};


// =======================
// Logout User
// =======================
export const logoutUser = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};
