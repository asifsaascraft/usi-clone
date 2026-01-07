// routes/hallRoutes.js
import express from "express";
import {
  createHall,
  getHallsByConference,
  getActiveHallsByConference,
  updateHall,
  deleteHall,
} from "../controllers/hallController.js";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// =======================
// Public Routes
// =======================
router.get(
  "/conferences/:conferenceId/halls",
  getHallsByConference
);

router.get(
  "/conferences/:conferenceId/halls/active",
  getActiveHallsByConference
);

// =======================
// Admin Routes
// =======================
router.post(
  "/admin/conferences/:conferenceId/halls",
  protect,
  authorizeRoles("admin"),
  createHall
);

router.put(
  "/admin/halls/:id",
  protect,
  authorizeRoles("admin"),
  updateHall
);

router.delete(
  "/admin/halls/:id",
  protect,
  authorizeRoles("admin"),
  deleteHall
);

export default router;
