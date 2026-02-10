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
      .populate(
        "webinarId",
        "name webinarType startDate endDate startTime endTime timeZone"
      )
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

/**
 * ==========================================
 * DELETE Question by Webinar (Admin Only)
 * ==========================================
 */
export const deleteQuestionByWebinar = async (req, res) => {
  try {
    const { webinarId, questionId } = req.params;

    // Check webinar exists
    const webinar = await Webinar.findById(webinarId);
    if (!webinar) {
      return res.status(404).json({
        success: false,
        message: "Webinar not found",
      });
    }

    // Find question under this webinar
    const question = await AskedQuestion.findOne({
      _id: questionId,
      webinarId: webinarId,
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found for this webinar",
      });
    }

    // Delete question
    await question.deleteOne();

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete question",
      error: error.message,
    });
  }
};
