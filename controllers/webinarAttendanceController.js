// controllers/webinarAttendanceController.js
import Webinar from "../models/Webinar.js";
import WebinarRegistration from "../models/WebinarRegistration.js";
import moment from "moment-timezone";

export const captureWebinarAttendance = async (req, res) => {
  try {
    const userId = req.user._id;
    const { webinarId } = req.params;

    // 1 Check webinar
    const webinar = await Webinar.findById(webinarId);
    if (!webinar) {
      return res.status(404).json({ success: false, message: "Webinar not found" });
    }

    // 2 Check registration
    const registration = await WebinarRegistration.findOne({
      webinarId,
      userId,
    });

    if (!registration) {
      return res.status(403).json({
        success: false,
        message: "User not registered for this webinar",
      });
    }

    // 3 Time validation
    const tz = webinar.timeZone || "UTC";

    const start = moment.tz(
      `${webinar.startDate} ${webinar.startTime}`,
      "DD/MM/YYYY hh:mm A",
      tz
    ).subtract(15, "minutes");

    const end = moment.tz(
      `${webinar.endDate} ${webinar.endTime}`,
      "DD/MM/YYYY hh:mm A",
      tz
    );

    const now = moment.tz(tz);

    if (!now.isBetween(start, end, null, "[]")) {
      return res.status(403).json({
        success: false,
        message: "Attendance window not active",
      });
    }

    // 4 Mark attendance (only once)
    if (!registration.attended) {
      registration.attended = true;
      registration.attendedAt = new Date();
      await registration.save();
    }

    return res.json({
      success: true,
      message: "Attendance captured successfully",
    });
  } catch (error) {
    console.error("Attendance capture error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to capture attendance",
      error: error.message,
    });
  }
};
