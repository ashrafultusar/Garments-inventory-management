import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import BillingSummary from "@/models/BillingSummary";
import Payment from "@/models/Payment";
import customers from "@/models/customers";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const { customerId } = resolvedParams;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return NextResponse.json({ success: false, message: "Invalid ID" }, { status: 400 });
    }

    const objId = new mongoose.Types.ObjectId(customerId);


    const [customer, billings, payments] = await Promise.all([
      customers.findById(objId),
      BillingSummary.find({ customerId: objId }).sort({ createdAt: 1 }),
      Payment.find({ userId: objId }).sort({ date: 1 }) 
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