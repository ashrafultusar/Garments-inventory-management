import connectDB from "@/lib/db";
import Batch from "@/models/Batch";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const {
      orderId,
      clotheType,
      colour,
      sillName,
      finishingType,
      dyeing,
      calender,
      rows,
      selectedProcesses
    } = body;

    // ✅ Validate required fields
    if (!orderId || !clotheType || !colour || !sillName || !finishingType || !dyeing || !rows || !selectedProcesses) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    let existing = await Batch.findOne({ orderId });

    const newBatch = {
      batchName: "Batch 1", // temporary, will update if existing
      clotheType,
      colour,
      sillName,
      finishingType,
      dyeing,
      calender: calender || null, // optional
      rows,
      selectedProcesses,
    };

    if (existing) {
      // Determine last batch number
      const lastBatchNumber =
        existing.batches.length > 0
          ? Math.max(...existing.batches.map((b) => parseInt(b.batchName.split(" ")[1] || 0)))
          : 0;

      newBatch.batchName = `Batch ${lastBatchNumber + 1}`;
      existing.batches.push(newBatch);
      await existing.save();
      return NextResponse.json(existing, { status: 200 });
    } else {
      newBatch.batchName = "Batch 1";
      const created = await Batch.create({ orderId, batches: [newBatch] });
      return NextResponse.json(created, { status: 201 });
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

    const batches = await Batch.find({ orderId: orderId });
    return NextResponse.json(batches, { status: 200 });
  } catch (error) {
    console.error("❌ Fetch batches error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// ✅ Update a specific batch
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

    batchDoc.batches[batchIndex] = batchData;
    await batchDoc.save();

    return NextResponse.json(batchDoc, { status: 200 });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
