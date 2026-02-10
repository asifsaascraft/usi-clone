import mongoose from "mongoose";

/**
 * Participant Answer
 */
const ParticipantAnswerSchema = new mongoose.Schema(
  {
    label: { type: String, default: "" },
    answer: { type: mongoose.Schema.Types.Mixed },
  },
  { _id: false }
);

/**
 * Question Answer
 */
const FeedbackAnswerItemSchema = new mongoose.Schema(
  {
    feedbackName: { type: String, default: "" },
    answer: { type: mongoose.Schema.Types.Mixed },
  },
  { _id: false }
);

/**
 * Label Answer
 */
const FeedbackAnswerLabelSchema = new mongoose.Schema(
  {
    feedbackLabelName: { type: String, default: "" },

    answers: {
      type: [FeedbackAnswerItemSchema],
      default: [],
    },
  },
  { _id: false }
);

/**
 * Open Ended Answer
 */
const OpenEndedAnswerSchema = new mongoose.Schema(
  {
    label: { type: String, default: "" },
    answer: { type: String, default: "" },
  },
  { _id: false }
);

/**
 * Main
 */
const SubmitPublicFeedbackSchema = new mongoose.Schema(
  {
    webinarId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Webinar",
      required: true,
    },

    participantAnswers: {
      type: [ParticipantAnswerSchema],
      default: [],
    },

    //  UPDATED
    sendFeedbacks: {
      type: [FeedbackAnswerLabelSchema],
      default: [],
    },

    openEndedAnswers: {
      type: [OpenEndedAnswerSchema],
      default: [],
    },

    sendOtherFeedback: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.SubmitPublicFeedback ||
  mongoose.model("SubmitPublicFeedback", SubmitPublicFeedbackSchema);
