import mongoose from "mongoose";

const FinishingTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.FinishingType ||
  mongoose.model("FinishingType", FinishingTypeSchema);
