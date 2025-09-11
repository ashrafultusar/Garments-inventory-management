import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Batch from "@/models/Batch";

// ✅ Create new batch
export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const newBatch = await Batch.create(body);
    return NextResponse.json(newBatch, { status: 201 });
  } catch (error) {
    console.error("Batch creation error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// ✅ Get all batches for a specific order
export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    if (!orderId)
      return NextResponse.json({ message: "Missing orderId" }, { status: 400 });

    const batches = await Batch.find({ orderId });
    return NextResponse.json(batches, { status: 200 });
  } catch (error) {
    console.error("Fetch batches error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
