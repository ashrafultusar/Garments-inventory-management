import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Batch from "@/models/Batch";



export async function GET(req, { params }) {
  const { orderId } = params;

  try {
    await connectDB();

    // ✅ একটাই Batch document থাকে orderId অনুযায়ী
    const batchDoc = await Batch.findOne({ orderId });

    if (!batchDoc) {
      return NextResponse.json(
        { error: "No batches found for this order" },
        { status: 404 }
      );
    }

    // ✅ শুধু ভিতরের batches array ফেরত দেব
    return NextResponse.json({ batches: batchDoc.batches });
  } catch (err) {
    console.error("Error fetching batches:", err);
    return NextResponse.json(
      { error: "Failed to fetch batches" },
      { status: 500 }
    );
  }
}
