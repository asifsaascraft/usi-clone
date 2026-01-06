// controllers/conferenceController.js
import Conference from "../models/Conference.js";

// =======================
// Get all conferences (public)
// =======================
export const getConferences = async (req, res) => {
  try {
    const conferences = await Conference.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: conferences.map((c) => c.toObject({ virtuals: true })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch conferences",
      error: error.message,
    });
  }
};

// =======================
// Get single conference by ID (public)
// =======================
export const getConferenceById = async (req, res) => {
  try {
    const { id } = req.params;

    const conference = await Conference.findById(id);
    if (!conference) {
      return res
        .status(404)
        .json({ success: false, message: "Conference not found" });
    }

    res.json({
      success: true,
      data: conference.toObject({ virtuals: true }),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch conference",
      error: error.message,
    });
  }
};

// =======================
// Create conference (admin only)
// =======================
export const createConference = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Conference image is required",
      });
    }

    const conferenceData = {
      ...req.body,
      image: req.file.location,
    };

    const newConference = await Conference.create(conferenceData);

    res.status(201).json({
      success: true,
      data: newConference.toObject({ virtuals: true }),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create conference",
      error: error.message,
    });
  }
};

// =======================
// Update conference (admin only)
// =======================
export const updateConference = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedData = { ...req.body };
    if (req.file) updatedData.image = req.file.location;

    const updatedConference = await Conference.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedConference) {
      return res
        .status(404)
        .json({ success: false, message: "Conference not found" });
    }

    res.json({
      success: true,
      data: updatedConference.toObject({ virtuals: true }),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update conference",
      error: error.message,
    });
  }
};

// =======================
// Delete conference (admin only)
// =======================
export const deleteConference = async (req, res) => {
  try {
    const { id } = req.params;

    const conference = await Conference.findByIdAndDelete(id);

    if (!conference) {
      return res
        .status(404)
        .json({ success: false, message: "Conference not found" });
    }

    res.json({
      success: true,
      message: "Conference deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete conference",
      error: error.message,
    });
  }
};
