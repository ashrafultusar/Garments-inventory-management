import mongoose from "mongoose";
// mongoose.models = {};
const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer", 
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
 
    method: { type: String, enum: ["cash", "bank", "bkash", "nagad", "other"], default: "cash" },
    description: { type: String, trim: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1, date: 1 });

export default mongoose.models.Payment || mongoose.model("Payment", paymentSchema);