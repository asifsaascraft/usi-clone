import Webinar from "../models/Webinar.js";
import WebinarRegistration from "../models/WebinarRegistration.js";
import sendEmailWithTemplate from "../utils/sendEmail.js";

// ==========================================
// ADMIN: Send email to attended users
// ==========================================
export const sendEmailToAttendedUsers = async (req, res) => {
  try {
    const { webinarId } = req.params;
    const { surveyLink } = req.body;

    if (!surveyLink) {
      return res.status(400).json({
        message: "surveyLink is required",
      });
    }

    const webinar = await Webinar.findById(webinarId);
    if (!webinar) {
      return res.status(404).json({ message: "Webinar not found" });
    }

    //  BLOCK MULTIPLE SENDS
    if (webinar.attendedMailSent) {
      return res.status(400).json({
        message: "Attended users mail already sent for this webinar",
      })
    }

    const attendedUsers = await WebinarRegistration.find({
      webinarId,
      attended: true,
    }).populate("userId");

    for (const reg of attendedUsers) {
      await sendEmailWithTemplate({
        to: reg.userId.email,
        name: reg.userId.name,
        templateKey: "2518b.554b0da719bc314.k1.dd490c60-eec7-11f0-8e23-525400c92439.19bac2e2026",
        mergeInfo: {
          name: reg.userId.name,
          webinar_name: webinar.name,
          webinar_date: webinar.startDate,
          webinar_time: webinar.startTime,
          survey_link: surveyLink, //  dynamic per webinar
        },
      });
    }
    // MARK AS SENT
    webinar.attendedMailSent = true
    await webinar.save()

    return res.json({
      success: true,
      message: "Thank you email sent to all attended users",
      count: attendedUsers.length,
    });
  } catch (error) {
    console.error("Send attended email error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// ADMIN: Send email to NOT attended users
// ==========================================
export const sendEmailToNotAttendedUsers = async (req, res) => {
  try {
    const { webinarId } = req.params;

    const webinar = await Webinar.findById(webinarId);
    if (!webinar) {
      return res.status(404).json({ message: "Webinar not found" });
    }
    //  BLOCK MULTIPLE SENDS
    if (webinar.notAttendedMailSent) {
      return res.status(400).json({
        message: "Reminder email already sent for this webinar",
      })
    }
    const notAttendedUsers = await WebinarRegistration.find({
      webinarId,
      attended: false,
    }).populate("userId");

    for (const reg of notAttendedUsers) {
      await sendEmailWithTemplate({
        to: reg.userId.email,
        name: reg.userId.name,
        templateKey: "2518b.554b0da719bc314.k1.34297f10-eec8-11f0-8e23-525400c92439.19bac305981",
        mergeInfo: {
          name: reg.userId.name,
          webinar_name: webinar.name,
          webinar_date: webinar.startDate,
          webinar_time: webinar.startTime,
        },
      });
    }
    //  MARK AS SENT
    webinar.notAttendedMailSent = true
    await webinar.save()

    res.json({
      success: true,
      message: "Email sent to all not-attended users",
      count: notAttendedUsers.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// ADMIN: Send email to ONE attended user
// ==========================================
export const sendEmailToSingleAttendedUser = async (req, res) => {
  try {
    const { webinarId, userId } = req.params;
    const { surveyLink } = req.body;

    if (!surveyLink) {
      return res.status(400).json({ message: "surveyLink is required" });
    }

    const webinar = await Webinar.findById(webinarId);
    if (!webinar) {
      return res.status(404).json({ message: "Webinar not found" });
    }

    const registration = await WebinarRegistration.findOne({
      webinarId,
      userId,
      attended: true,
    }).populate("userId");

    if (!registration) {
      return res.status(404).json({
        message: "User not found or not marked as attended",
      });
    }

    await sendEmailWithTemplate({
      to: registration.userId.email,
      name: registration.userId.name,
      templateKey: "2518b.554b0da719bc314.k1.dd490c60-eec7-11f0-8e23-525400c92439.19bac2e2026",
      mergeInfo: {
        name: registration.userId.name,
        webinar_name: webinar.name,
        webinar_date: webinar.startDate,
        webinar_time: webinar.startTime,
        survey_link: surveyLink,
      },
    });

    return res.json({
      success: true,
      message: "Email sent to attended user successfully",
    });
  } catch (error) {
    console.error("Send single attended email error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// ADMIN: Send email to ONE not-attended user
// ==========================================
export const sendEmailToSingleNotAttendedUser = async (req, res) => {
  try {
    const { webinarId, userId } = req.params;

    const webinar = await Webinar.findById(webinarId);
    if (!webinar) {
      return res.status(404).json({ message: "Webinar not found" });
    }

    const registration = await WebinarRegistration.findOne({
      webinarId,
      userId,
      attended: false,
    }).populate("userId");

    if (!registration) {
      return res.status(404).json({
        message: "User not found or marked as attended",
      });
    }

    await sendEmailWithTemplate({
      to: registration.userId.email,
      name: registration.userId.name,
      templateKey: "2518b.554b0da719bc314.k1.34297f10-eec8-11f0-8e23-525400c92439.19bac305981",
      mergeInfo: {
        name: registration.userId.name,
        webinar_name: webinar.name,
        webinar_date: webinar.startDate,
        webinar_time: webinar.startTime,
      },
    });

    return res.json({
      success: true,
      message: "Email sent to not-attended user successfully",
    });
  } catch (error) {
    console.error("Send single not-attended email error:", error);
    res.status(500).json({ message: error.message });
  }
};
