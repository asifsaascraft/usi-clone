import express from "express";
import {
  sendEmailToAttendedUsers,
  sendEmailToNotAttendedUsers,
  sendEmailToSingleAttendedUser,
  sendEmailToSingleNotAttendedUser,
  sendJoinEmailToAllUsers,
  sendJoinEmailToSingleUser,
} from "../controllers/webinarEmailController.js";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/admin/webinar/:webinarId/email/attended",
  protect,
  authorizeRoles("admin"),
  sendEmailToAttendedUsers
);

router.post(
  "/admin/webinar/:webinarId/email/not-attended",
  protect,
  authorizeRoles("admin"),
  sendEmailToNotAttendedUsers
);

router.post(
  "/admin/webinar/:webinarId/email/attended/:userId",
  protect,
  authorizeRoles("admin"),
  sendEmailToSingleAttendedUser
);

router.post(
  "/admin/webinar/:webinarId/email/not-attended/:userId",
  protect,
  authorizeRoles("admin"),
  sendEmailToSingleNotAttendedUser
);

router.post(
  "/admin/webinar/:webinarId/send-join-webinar",
  sendJoinEmailToAllUsers
);

router.post(
  "/admin/webinar/:webinarId/send-join-webinar/:userId",
  sendJoinEmailToSingleUser
);


export default router;
