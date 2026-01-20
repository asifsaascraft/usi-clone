import express from "express";
import cookieParser from "cookie-parser";
import {
  getAdminSession,
  registerAdmin,
  loginAdmin,
  refreshAccessToken,
  logoutAdmin,
  forgotPassword,
  resetPassword,
} from "../controllers/adminController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Middleware to parse cookies
router.use(cookieParser());

// =======================
// Admin Routes
// =======================

//  GET CURRENT ADMIN SESSION (Protected)
router.get(
  "/me",
  protect,                // verifies access token
  authorizeRoles("admin"),
  getAdminSession 
);

// Signup - only via Postman
router.post("/register", registerAdmin);

// Login
router.post("/login", loginAdmin);

// Refresh access token (GET, using cookies)
router.post("/refresh-token", refreshAccessToken);

// Logout - Admin only
router.post("/logout", logoutAdmin);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Reset Password
router.post("/reset-password/:token", resetPassword);

export default router;
