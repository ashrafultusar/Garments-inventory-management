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
        rows: [
          {
            rollNo: Number,
            goj: Number,
            idx: Number, 
          },
        ],
        selectedProcesses: [
          {
            name: String,
            price: Number,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Batch = mongoose.models.Batch || mongoose.model("Batch", batchSchema);
export default Batch;
