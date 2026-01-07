// controllers/hallController.js
import Hall from "../models/Hall.js";
import Conference from "../models/Conference.js";

// =======================
// Create Hall (admin)
// =======================
export const createHall = async (req, res) => {
  try {
    const { conferenceId } = req.params;
    const { hallName, status } = req.body;

    // Validate conference
    const conference = await Conference.findById(conferenceId);
    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    const hall = await Hall.create({
      conferenceId,
      hallName,
      status,
    });

    res.status(201).json({
      success: true,
      data: hall,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create hall",
      error: error.message,
    });
  }
};

// =======================
// Get all halls of a conference (public)
// =======================
export const getHallsByConference = async (req, res) => {
  try {
    const { conferenceId } = req.params;

    const halls = await Hall.find({ conferenceId })
      .populate("conferenceId")
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      total: halls.length,
      data: halls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch halls",
      error: error.message,
    });
  }
};

// =======================
// Get active halls of a conference (public)
// =======================
export const getActiveHallsByConference = async (req, res) => {
  try {
    const { conferenceId } = req.params;

    const halls = await Hall.find({
      conferenceId,
      status: "Active",
    })
      .populate("conferenceId")
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      total: halls.length,
      data: halls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch active halls",
      error: error.message,
    });
  }
};

// =======================
// Update hall (admin)
// =======================
export const updateHall = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedHall = await Hall.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedHall) {
      return res.status(404).json({
        success: false,
        message: "Hall not found",
      });
    }

    res.json({
      success: true,
      data: updatedHall,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update hall",
      error: error.message,
    });
  }
};

// =======================
// Delete hall (admin)
// =======================
export const deleteHall = async (req, res) => {
  try {
    const { id } = req.params;

    const hall = await Hall.findByIdAndDelete(id);

    if (!hall) {
      return res.status(404).json({
        success: false,
        message: "Hall not found",
      });
    }

    res.json({
      success: true,
      message: "Hall deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete hall",
      error: error.message,
    });
  }
};
