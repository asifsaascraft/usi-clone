import express from "express";
import cookieParser from "cookie-parser";
import {
  registerUser,
  loginUser,
  refreshAccessTokenUser,
  logoutUser,
} from "../controllers/userController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();


// Middleware to parse cookies
router.use(cookieParser());

// =======================
// User Routes
// =======================

// Public signup
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Refresh access token (GET, using cookies)
router.get("/refresh-token", refreshAccessTokenUser);

// Logout - User only
router.post(
  "/logout",
  protect, // ensures user is logged in
  authorizeRoles("user"), // user-only
  logoutUser
);


export default router;
