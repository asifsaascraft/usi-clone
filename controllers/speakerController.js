// controllers/speakerController.js
import Speaker from "../models/Speaker.js";

// =======================
// Get all speakers (public)
// =======================
export const getSpeakers = async (req, res) => {
  try {
    const speakers = await Speaker.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: speakers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch speakers",
      error: error.message,
    });
  }
};

// =======================
// Create Speaker (admin)
// =======================
export const createSpeaker = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Speaker profile image is required",
      });
    }

    const speakerData = {
      ...req.body,
      speakerProfilePicture: req.file.location,
    };

    const newSpeaker = await Speaker.create(speakerData);

    res.status(201).json({
      success: true,
      data: newSpeaker,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create speaker",
      error: error.message,
    });
  }
};

// =======================
// Update Speaker (admin)
// =======================
export const updateSpeaker = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedData = { ...req.body };
    if (req.file) {
      updatedData.speakerProfilePicture = req.file.location;
    }

    const updatedSpeaker = await Speaker.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedSpeaker) {
      return res.status(404).json({
        success: false,
        message: "Speaker not found",
      });
    }

    res.json({
      success: true,
      data: updatedSpeaker,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update speaker",
      error: error.message,
    });
  }
};

// =======================
// Delete Speaker (admin)
// =======================
export const deleteSpeaker = async (req, res) => {
  try {
    const { id } = req.params;

    const speaker = await Speaker.findByIdAndDelete(id);

    if (!speaker) {
      return res.status(404).json({
        success: false,
        message: "Speaker not found",
      });
    }

    res.json({
      success: true,
      message: "Speaker deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete speaker",
      error: error.message,
    });
  }
};
