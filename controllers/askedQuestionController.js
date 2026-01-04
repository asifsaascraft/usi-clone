// controllers/askedQuestionController.js
import AskedQuestion from "../models/AskedQuestion.js";
import Webinar from "../models/Webinar.js";

/**
 * =================================
 * POST Question (Authorized User)
 * =================================
 */
export const addQuestion = async (req, res) => {
  try {
    const { webinarId } = req.params;
    const { userId, questionName } = req.body;

    // Validate webinar
    const webinar = await Webinar.findById(webinarId);
    if (!webinar) {
      return res.status(404).json({
        success: false,
        message: "Webinar not found",
      });
    }

    // Create question
    const question = await AskedQuestion.create({
      webinarId,
      userId,
      questionName,
    });

    res.status(201).json({
      success: true,
      message: "Question asked successfully",
      data: question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to ask question",
      error: error.message,
    });
  }
};

/**
 * =====================================
 * GET All Questions by Webinar (Public)
 * =====================================
 */
export const getQuestionsByWebinar = async (req, res) => {
  try {
    const { webinarId } = req.params;

    const questions = await AskedQuestion.find({ webinarId })
      .populate("userId", "name email profilePicture")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total: questions.length,
      data: questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch questions",
      error: error.message,
    });
  }
};
