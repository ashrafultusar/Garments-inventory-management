import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import BillingSummary from "@/models/BillingSummary"; // Adjust path if needed
import Payment from "@/models/Payment";
import customers from "@/models/customers";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { customerId } = await params;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return NextResponse.json({ success: false, message: "Invalid ID" }, { status: 400 });
    }

    const objId = new mongoose.Types.ObjectId(customerId);

    const [customer, billings, payments] = await Promise.all([
      customers.findById(objId),
      // শুধুমাত্র 'dying' টাইপ বিলিং ফিল্টার করা হচ্ছে
      BillingSummary.find({ customerId: objId, summaryType: "dying" }).sort({ createdAt: 1 }),
      Payment.find({ user: objId }).sort({ date: 1 }) 
    ]);

    if (!customer) {
      return NextResponse.json({ success: false, message: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { customer, billings, payments }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}