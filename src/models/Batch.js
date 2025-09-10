import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
  {
    orderId: {
      type: String, // ✅ Must be string
      required: true,
    },
    batchName: { type: String, required: true },
    sillBatchName: { type: String, required: true },
    rows: [
      {
        rollNo: Number,
        goj: Number,
        inputValue: Number,
      },
    ],
    selectedProcesses: [String],
    status: {
      type: String,
      enum: ["In Process", "Completed Process", "Delivered", "Billing", "Completed"],
      default: "In Process",
    },
  },
  { timestamps: true }
);

const Batch = mongoose.models.Batch || mongoose.model("Batch", batchSchema);

export default Batch;
