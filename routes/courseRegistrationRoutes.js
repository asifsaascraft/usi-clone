import express from "express";
import {
  registerToCourse,
  getUserCourseRegistrations,
  getRegistrationsByCourse,
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

// Admin → all registrations in a course
router.get(
  "/admin/course/:courseId/registrations",
  protect,
  authorizeRoles("admin"),
  getRegistrationsByCourse
);

export default router;
