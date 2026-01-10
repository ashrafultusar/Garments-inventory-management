
import connectDB from "@/lib/db";
import BillingSummary from "@/models/BillingSummary";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  await connectDB();

  const { orderId } = params;


  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return Response.json({ error: "Invalid orderId" }, { status: 400 });
  }

  try {
    const summaries = await BillingSummary.find({ orderId })
      .populate("customerId", "name")
      .populate("dyeingId", "name")
      .populate("calenderId", "name")
      .sort({ createdAt: -1 });

    return Response.json(summaries, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to load billing summaries" },
      { status: 500 }
    );
  }
}
