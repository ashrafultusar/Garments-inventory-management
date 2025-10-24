
import connectDB from "@/lib/db";
import Batch from "@/models/Batch";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { orderId } = params;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    // find the main Batch document
    const batchDoc = await Batch.findOne({ orderId });
    if (!batchDoc) {
      return NextResponse.json({ error: "Batch record not found" }, { status: 404 });
    }

    // filter batches with status 'billing'
    const billingBatches = batchDoc.batches.filter((b) => b.status === "billing");

    return NextResponse.json({ batches: billingBatches });
  } catch (err) {
    console.error("Fetch Billing Batches Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
