import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      // required: [true, "Password is required"],
    },
    role: {
      type: String,
      default: "admin",  // ডিফল্ট ভ্যালু admin
      enum: ["admin", "user", "moderator"], // ইচ্ছেমতো রোল গুলোর লিস্ট (ঐচ্ছিক)
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
