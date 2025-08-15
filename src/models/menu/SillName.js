
import mongoose from "mongoose";

const SillNameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.SillName || mongoose.model("SillName", SillNameSchema);
