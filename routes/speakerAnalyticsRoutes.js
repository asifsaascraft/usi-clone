
import express from "express";

import {
  getGlobalSpeakerStats,
  getSpeakerAllVideos,
} from "../controllers/speakerAnalyticsController.js";


const router = express.Router();

// Gloabal Speaker count
router.get("/speakers/global-stats", getGlobalSpeakerStats);

// Get All Videos by a particular speaker 
router.get("/speakers/:speakerId/videos", getSpeakerAllVideos);


export default router;