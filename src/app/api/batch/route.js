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
 

// UPDATE a specific batch
export async function PATCH(req) {
  await connectDB();
  try {
    const body = await req.json();
    const { orderId, batchIndex, batchData } = body;

    if (!orderId) return NextResponse.json({ message: "Missing orderId" }, { status: 400 });

    const batchDoc = await Batch.findOne({ orderId });
    if (!batchDoc) return NextResponse.json({ message: "Batch not found" }, { status: 404 });

    // ✅ Replace batch data (including extraInputs)
    batchDoc.batches[batchIndex] = batchData;
    await batchDoc.save();

    return NextResponse.json(batchDoc, { status: 200 });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// DELETE a batch
export async function DELETE(req) {
  await connectDB();
  try {
    const { pathname } = new URL(req.url);
    const batchId = pathname.split("/").pop();

    const batchDoc = await Batch.findOne({ "batches._id": batchId });
    if (!batchDoc) return NextResponse.json({ message: "Batch not found" }, { status: 404 });

    batchDoc.batches = batchDoc.batches.filter((b) => b._id.toString() !== batchId);
    await batchDoc.save();

    return NextResponse.json({ batches: batchDoc.batches }, { status: 200 });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
