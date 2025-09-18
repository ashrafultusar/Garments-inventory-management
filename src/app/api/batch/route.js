import connectDB from "@/lib/db";
import Batch from "@/models/Batch";
import { NextResponse } from "next/server";

// ✅ Create or Update batch
export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const { orderId, ...batchData } = body;

    if (!orderId) {
      return NextResponse.json({ message: "Missing orderId" }, { status: 400 });
    }

    // check if order already has batch doc
    let existing = await Batch.findOne({ orderId });

    if (existing) {
      existing.batches.push(batchData);
      await existing.save();
      return NextResponse.json(existing, { status: 200 });
    } else {
      const newBatch = await Batch.create({
        orderId,
        batches: [batchData],
      });
      return NextResponse.json(newBatch, { status: 201 });
    }
  } catch (error) {
    console.error("Batch creation error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// ✅ Get batches for specific order
export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json({ message: "Missing orderId" }, { status: 400 });
    }

    // যেহেতু Batch schema তে orderId = Order._id (ObjectId হিসেবে save আছে)
    const batches = await Batch.find({ orderId: orderId });

    return NextResponse.json(batches, { status: 200 });
  } catch (error) {
    console.error("❌ Fetch batches error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}


export async function PATCH(req) {
  await connectDB();
  try {
    const body = await req.json();
    const { orderId, batchIndex, batchData } = body;

    if (!orderId) {
      return NextResponse.json({ message: "Missing orderId" }, { status: 400 });
    }

    const batchDoc = await Batch.findOne({ orderId });
    if (!batchDoc) {
      return NextResponse.json({ message: "Batch not found" }, { status: 404 });
    }

    // update specific batch
    batchDoc.batches[batchIndex] = batchData;
    await batchDoc.save();

    return NextResponse.json(batchDoc, { status: 200 });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
