import mongoose from "mongoose";

const ClothTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.ClothType ||
  mongoose.model("ClothType", ClothTypeSchema);
