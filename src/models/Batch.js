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

        clotheType: { type: mongoose.Schema.Types.ObjectId, ref: "ClotheType", required: true },
        colour: { type: mongoose.Schema.Types.ObjectId, ref: "Colour", required: true },
        sillName: { type: mongoose.Schema.Types.ObjectId, ref: "SillName", required: true },
        finishingType: { type: mongoose.Schema.Types.ObjectId, ref: "FinishingType", required: true },
        dyeing: { type: mongoose.Schema.Types.ObjectId, ref: "Dyeing", required: true },
        calender: { type: mongoose.Schema.Types.ObjectId, ref: "Calender", required: false },
      },
    ],
  },
  { timestamps: true }
);

const Batch = mongoose.models.Batch || mongoose.model("Batch", batchSchema);
export default Batch;
