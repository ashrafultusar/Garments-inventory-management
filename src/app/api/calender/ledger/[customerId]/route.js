import { NextResponse } from "next/server";

import mongoose from "mongoose";
import connectDB from "@/lib/db";
import customers from "@/models/customers";
import BillingSummary from "@/models/BillingSummary";
import Payment from "@/models/Payment";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { customerId } = await params;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return NextResponse.json({ success: false, message: "Invalid ID" }, { status: 400 });
    }

    const objId = new mongoose.Types.ObjectId(customerId);

    const [customer, billings, payments] = await Promise.all([
      customers.findById(objId).lean(),
   
      BillingSummary.find({ customerId: objId, summaryType: "calender" }).sort({ createdAt: 1 }).lean(),
      Payment.find({ user: objId }).sort({ date: 1 }).lean() 
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