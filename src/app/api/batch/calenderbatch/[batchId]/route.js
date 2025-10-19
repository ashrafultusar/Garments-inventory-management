import connectDB from "@/lib/db";
import Batch from "@/models/Batch"; // আপনার Batch মডেলটি ইম্পোর্ট করা নিশ্চিত করুন
import { NextResponse } from "next/server";

// GET ফাংশন: নির্দিষ্ট ব্যাচ ফেচ করা এবং স্ট্যাটাস চেক করা
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { batchId } = params;

    const batch = await Batch.findById(batchId);
    
    // স্ট্যাটাস চেক
    if (!batch || batch.status !== "calender") {
      return NextResponse.json(
        { error: "Batch not found or not a calendar batch" },
        { status: 404 }
      );
    }

    return NextResponse.json({ batch });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error while fetching batch" },
      { status: 500 }
    );
  }
}

// PATCH ফাংশন: শুধুমাত্র rows ডেটা আপডেট করা
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { batchId } = params;
    const { rows } = await req.json(); 

    const batch = await Batch.findById(batchId);
    
    // স্ট্যাটাস চেক
    if (!batch || batch.status !== "calender") {
      return NextResponse.json(
        { error: "Batch not found or not a calendar batch" },
        { status: 404 }
      );
    }

    // শুধুমাত্র rows ফিল্ডটি নতুন ডেটা দিয়ে আপডেট করা হচ্ছে
    batch.rows = rows; 
    await batch.save();

    return NextResponse.json({ message: "Batch updated successfully", batch });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error while updating batch" },
      { status: 500 }
    );
  }
}