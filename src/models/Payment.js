// models/Payment.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const paymentSchema = new Schema(
  {
    // কোন user এর হিসাব
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // কত টাকা
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // credit = টাকা কোম্পানির কাছে আসছে
    // debit  = টাকা কোম্পানি দিচ্ছে
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },

    // পেমেন্ট কিভাবে হলো
    method: {
      type: String,
      enum: ["cash", "bank", "bkash", "nagad", "other"],
      default: "cash",
    },

    // ছোট description / memo
    description: {
      type: String,
      trim: true,
    },

    // effective তারিখ (report এর জন্য দরকার হবে)
    date: {
      type: Date,
      default: Date.now,
    },

    // future proof field: jodi kono invoice / order er sathe link korte chao
    referenceType: {
      type: String, // e.g. "order", "invoice", "salary" etc.
    },
    referenceId: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Fast query er jonno index (user + date diye report ber korbe)
paymentSchema.index({ user: 1, date: 1 });

const Payment =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default Payment;
