// routes/conferenceRoutes.js
import express from "express";
import {
  getConferences,
  getActiveConferences,
  getConferenceById,
  createConference,
  updateConference,
  deleteConference,
  getConferenceDateRange,
} from "../controllers/conferenceController.js";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { uploadConferenceImage } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Public
router.get("/conferences", getConferences);
router.get("/conferences/active", getActiveConferences);
router.get("/conferences/:id", getConferenceById);

// Admin
router.post(
  "/admin/conferences",
  protect,
  authorizeRoles("admin"),
  uploadConferenceImage.single("image"),
  createConference
);

router.put(
  "/admin/conferences/:id",
  protect,
  authorizeRoles("admin"),
  uploadConferenceImage.single("image"),
  updateConference
);

router.delete(
  "/admin/conferences/:id",
  protect,
  authorizeRoles("admin"),
  deleteConference
);

router.get(
  "/admin/conferences/:conferenceId/dates",
  protect,
  authorizeRoles("admin"),
  getConferenceDateRange
);

export default router;
