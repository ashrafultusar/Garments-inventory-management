import mongoose, { Schema } from "mongoose";

const calenderSchema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Calender ||
  mongoose.model("Calender", calenderSchema);
