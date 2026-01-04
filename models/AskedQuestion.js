import mongoose from "mongoose";

const AskedQuestionSchema = new mongoose.Schema(
  {
    webinarId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Webinar",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questionName: {
      type: String,
      required: [true, "Question is required"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.AskedQuestion ||
  mongoose.model("AskedQuestion", AskedQuestionSchema);
