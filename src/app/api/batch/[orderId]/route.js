import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Batch from "@/models/Batch";


export async function GET(req, { params }) {
  try {
  
    await connectDB();
    const { orderId } = params;

    // 3️⃣ Find batch document based on orderId
    const batchDoc = await Batch.findOne({ orderId });

    // 4️⃣ If no batch found, send 404
    if (!batchDoc) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(batchDoc, { status: 200 });

  } catch (err) {
    console.error("❌ Error fetching batches:", err);
    return NextResponse.json(
      { error: "Failed to fetch batches." },
      { status: 500 }
    );
  }
}
