import connectDB from "@/lib/db";
import BillingSummary from "@/models/BillingSummary";
import { NextResponse } from "next/server";


export async function GET(req, { params }) {
  try {
    await connectDB();
    const { dyeingId } = params;

    const summaries = await BillingSummary.find({
      dyeingId,
      summaryType: "dyeing",
    }).sort({ createdAt: -1 });

    return NextResponse.json(summaries);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch dyeing summaries" },
      { status: 500 }
    );
  }
}
