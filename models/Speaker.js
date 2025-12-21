import mongoose from "mongoose";

const SpeakerSchema = new mongoose.Schema(
  {
    speakerName: {
      type: String,
      required: [true, "Speaker Name is required"],
    },
    speakerProfilePicture: {
      type: String,
      required: [true, "Speaker Image is required"],
    },
    affiliation: {
      type: String,
      required: [true, "Affiliation is required"],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Speaker ||
  mongoose.model("Speaker", SpeakerSchema);
