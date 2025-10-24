import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, unique: true, required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    batchIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Batch.batches" }], 
    totalAmount: { type: Number, default: 0 },
    status: { type: String, default: "unpaid" }, 
  },
  { timestamps: true }
);

const Invoice =
  mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);

export default Invoice;
