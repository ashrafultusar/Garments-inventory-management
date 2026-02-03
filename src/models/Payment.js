import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    // আগের ডাটার জন্য 'user' ফিল্ডটি রাখা হলো (Required সরিয়ে দেওয়া হয়েছে)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: false, 
    },
    
    // ✅ আপনার নতুন রিকোয়ারমেন্ট অনুযায়ী ডাইনামিক আইডি ফিল্ডসমূহ
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Customer",
      required: false 
    },
    dyeingId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Dyeing", // নিশ্চিত করুন আপনার Dyeing মডেলের নাম এটিই
      required: false 
    },
    calendarId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Calendar", // নিশ্চিত করুন আপনার Calendar মডেলের নাম এটিই
      required: false 
    },

    amount: { type: Number, required: true, min: 0 },
    method: { 
      type: String, 
      enum: ["cash", "bank", "bkash", "nagad", "other"], 
      default: "cash" 
    },
    description: { type: String, trim: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ইন্ডেক্স আপডেট (কুয়েরি ফাস্ট করার জন্য)
paymentSchema.index({ userId: 1, date: -1 });
paymentSchema.index({ dyeingId: 1, date: -1 });
paymentSchema.index({ calendarId: 1, date: -1 });

export default mongoose.models.Payment || mongoose.model("Payment", paymentSchema);