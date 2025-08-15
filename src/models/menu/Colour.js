// models/menu/Colour.js
import mongoose from "mongoose";

const ColourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Colour || mongoose.model("Colour", ColourSchema);
