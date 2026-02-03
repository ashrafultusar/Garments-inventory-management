import connectDB from "@/lib/db";
import BillingSummary from "@/models/BillingSummary";
import Payment from "@/models/Payment";
import Calender from "@/models/Calender";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { calenderId } =await params;

    const calender = await Calender.findById(calenderId);
    if (!calender) {
      return NextResponse.json({ success: false });
    }

    const billings = await BillingSummary.find({
      calenderId: calenderId,
      summaryType: "calender",
    });

    const payments = await Payment.find({
      calenderId: calenderId,
    });

    return NextResponse.json({
      success: true,
      data: {
        calender: calender,
        billings,
        payments,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Ledger fetch failed" },
      { status: 500 }
    );
  }
}
