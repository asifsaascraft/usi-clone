// routes/askedQuestionRoutes.js
import express from "express";
import {
  addQuestion,
  getQuestionsByWebinar,
} from "../controllers/askedQuestionController.js";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public: Get all questions of a webinar
router.get(
  "/webinars/:webinarId/questions",
  getQuestionsByWebinar
);

// Authorized user: Ask a question
router.post(
  "/webinars/:webinarId/questions",
  protect,
  authorizeRoles("user"),
  addQuestion
);

export default router;
