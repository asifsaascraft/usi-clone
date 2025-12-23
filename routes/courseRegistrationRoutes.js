import express from "express";
import {
  registerToCourse,
  getUserCourseRegistrations,
} from "../controllers/courseRegistrationController.js";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Register user to course
router.post(
  "/course/register",
  protect,
  authorizeRoles("user"),
  registerToCourse
);

// Get registrations for one user
router.get(
  "/course/registrations/:userId",
  protect,
  authorizeRoles("user"),
  getUserCourseRegistrations
);

export default router;
