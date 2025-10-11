import connectDB from "@/lib/db";
import Batch from "@/models/Batch";
import { NextResponse } from "next/server";

// CREATE Batch
export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const {
      orderId,
      colour,
      sillName,
      finishingType,
      dyeing,
      calender,
      rows,
      selectedProcesses,
    } = body;

    // ✅ Required field validation
    if (
      !orderId ||
      !colour ||
      !sillName ||
      !finishingType ||
      !dyeing ||
      !rows?.length ||
      !selectedProcesses?.length
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Find existing batch doc by orderId
    let existing = await Batch.findOne({ orderId });

    // ✅ Prepare new batch object with default status
    const newBatch = {
      batchName: "Batch 1", // default, will update below
      status: "pending", // ✅ auto set
      colour,
      sillName,
      finishingType,
      dyeing,
      calender: calender || null,
      rows,
      selectedProcesses,
    };

    if (existing) {
      // ✅ Auto-increment batch number
      const lastBatchNumber =
        existing.batches.length > 0
          ? Math.max(
              ...existing.batches.map((b) =>
                parseInt(b.batchName.split(" ")[1] || 0)
              )
            )
          : 0;

      newBatch.batchName = `Batch ${lastBatchNumber + 1}`;

      existing.batches.push(newBatch);
      await existing.save();

      return NextResponse.json(existing, { status: 200 });
    } else {
      // ✅ First batch for this order
      const created = await Batch.create({
        orderId,
        batches: [newBatch],
      });
      return NextResponse.json(created, { status: 201 });
    }
  } catch (error) {
    console.error("Batch creation error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
 
// ✅ UPDATE (note, inputs, status change etc.)
export async function PATCH(req) {
  await connectDB();
  try {
    const { orderId, batchIndex, batchData } = await req.json();

    const batchDoc = await Batch.findOne({ orderId });
    if (!batchDoc) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // পুরনো batch এর reference বের করো
    const oldBatch = batchDoc.batches[batchIndex];

    if (!oldBatch) {
      return NextResponse.json({ message: "Batch not found" }, { status: 404 });
    }

    // ✅ Update করার সময় সব নতুন value set করে দিচ্ছি
    batchDoc.batches[batchIndex] = {
      ...oldBatch.toObject(),
      ...batchData,
      status: batchData.status || oldBatch.status, // ensure status update
    };

    await batchDoc.save();

    return NextResponse.json(batchDoc, { status: 200 });
  } catch (err) {
    console.error("PATCH error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}