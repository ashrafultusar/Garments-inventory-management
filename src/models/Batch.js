import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    batches: [
      {
        batchName: { type: String, required: true },
        status: { type: String, default: "pending" }, // ✅ pending, inprocess, delivered
        rows: [
          {
            rollNo: Number,
            goj: Number,
            idx: Number,
            extraInputs: [String], // multiple extra inputs
          },
        ],
        selectedProcesses: [
          {
            name: String,
            price: Number,
          },
        ],
        colour: { type: String, required: true },
        sillName: { type: String, required: true },
        finishingType: { type: String, required: true },
        dyeing: { type: String, required: true },
        calender: { type: String, required: false }, // optional
        note: { type: String, default: "" }, // optional note
      },
    ],
    
  },
  { timestamps: true }
);

const Batch = mongoose.models.Batch || mongoose.model("Batch", batchSchema);
export default Batch;
