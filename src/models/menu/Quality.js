
import mongoose from "mongoose";

const QualitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Quality || mongoose.model("Quality", QualitySchema);
