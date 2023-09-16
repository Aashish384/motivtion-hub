import mongoose from "mongoose";

const expertApplicationSchema = new mongoose.Schema(
  {
    appliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      default: "pending",
    },
    message: {
      type: String,
    },
    files: [
      {
        url: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const ExpertApplication = mongoose.model("ExpertApplication", expertApplicationSchema);

export default ExpertApplication;
