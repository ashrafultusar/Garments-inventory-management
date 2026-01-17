import connectDB from "@/lib/db";
import BillingSummary from "@/models/BillingSummary";
import { NextResponse } from "next/server";


export async function GET(req, { params }) {
  try {
    await connectDB();
    const { customerId } = await params;

    // Sudhu BillingSummary fetch kora hobe 
    // summaryType: "client" filter deya holo jate sudhu client-er bill gulo ase
    const summaries = await BillingSummary.find({ 
      customerId: customerId,
      summaryType: "client" 
    }).sort({ createdAt: 1 }); // Purono theke natun (Ascending)

    return NextResponse.json({
      success: true,
      data: summaries,
    });
  } catch (error) {
    console.error("Billing Summary Fetch Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}