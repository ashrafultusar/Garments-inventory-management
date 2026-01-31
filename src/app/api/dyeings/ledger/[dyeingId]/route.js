import connectDB from "@/lib/db";
import BillingSummary from "@/models/BillingSummary";
import Dyeing from "@/models/Dyeing";
import Payment from "@/models/Payment";
import { NextResponse } from "next/server";




export async function GET(req, { params }) {
  try {
    await connectDB();
    const { dyeingId } =await params;

    const dyeing = await Dyeing.findById(dyeingId);
    if (!dyeing) {
      return NextResponse.json({ success: false });
    }

    const billings = await BillingSummary.find({
      dyeingId,
      summaryType: "dyeing",
    });

    const payments = await Payment.find({
      dyeingId,
    });

    return NextResponse.json({
      success: true,
      data: {
        customer: dyeing,
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
