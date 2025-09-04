import mongoose from "mongoose";

const ProcessSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Process ||
  mongoose.model("Process", ProcessSchema);
