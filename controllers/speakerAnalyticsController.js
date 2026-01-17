import mongoose from "mongoose";
import Speaker from "../models/Speaker.js";
import Topic from "../models/Topic.js";
import AssignSpeaker from "../models/AssignSpeaker.js";
import Webinar from "../models/Webinar.js";


// =======================
// Gloabal Speaker Count
// =======================
export const getGlobalSpeakerStats = async (req, res) => {
  try {
    const speakers = await Speaker.find(); // full speaker docs

    // ---------- Topic counts
    const topicCounts = await Topic.aggregate([
      {
        $project: {
          speakers: {
            $setUnion: [
              { $ifNull: ["$speakerId", []] },
              { $cond: [{ $ifNull: ["$moderator", false] }, ["$moderator"], []] },
              { $ifNull: ["$panelist", []] },
              { $cond: [{ $ifNull: ["$quizMaster", false] }, ["$quizMaster"], []] },
              { $ifNull: ["$teamMember", []] },
            ],
          },
        },
      },
      { $unwind: "$speakers" },
      {
        $group: {
          _id: "$speakers",
          count: { $sum: 1 },
        },
      },
    ]);

    // ---------- Webinar counts
    const webinarCounts = await AssignSpeaker.aggregate([
      {
        $group: {
          _id: "$speakerId",
          count: { $sum: 1 },
        },
      },
    ]);

    // ---------- Maps
    const topicMap = {};
    topicCounts.forEach(t => {
      topicMap[t._id.toString()] = t.count;
    });

    const webinarMap = {};
    webinarCounts.forEach(w => {
      webinarMap[w._id.toString()] = w.count;
    });

    // ---------- Final response
    const results = speakers.map(speaker => {
      const id = speaker._id.toString();

      const topicVideos = topicMap[id] || 0;
      const webinarVideos = webinarMap[id] || 0;

      return {
        speaker, //  FULL SPEAKER DOCUMENT
        topicVideos,
        webinarVideos,
        totalVideos: topicVideos + webinarVideos,
      };
    });

    res.json({
      success: true,
      totalSpeakers: results.length,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch global speaker stats",
      error: error.message,
    });
  }
};


// =======================
// Get All Videos by a particular speaker 
// =======================
export const getSpeakerAllVideos = async (req, res) => {
  try {
    const { speakerId } = req.params;

    // ---------- Topics
    const topics = await Topic.find({
      $or: [
        { speakerId },
        { moderator: speakerId },
        { panelist: speakerId },
        { quizMaster: speakerId },
        { teamMember: speakerId },
      ],
    })
      .select("title topicType videoLink conferenceId sessionId startTime endTime")
      .populate("conferenceId") //  FULL CONFERENCE DATA
      .populate("sessionId", "sessionName startTime endTime");

    // ---------- Webinars
    const webinarAssignments = await AssignSpeaker.find({ speakerId })
      .populate({
        path: "webinarId",
        options: { virtuals: true }, // dynamicStatus
      });

    const webinars = webinarAssignments.map(w => w.webinarId);

    res.json({
      success: true,
      speakerId,
      topicVideos: topics,
      webinarVideos: webinars,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch speaker videos",
      error: error.message,
    });
  }
};
