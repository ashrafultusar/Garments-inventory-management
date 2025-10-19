
import connectDB from "@/lib/db";
import Batch from "@/models/Batch";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { batchId } = params;
    const { parentId, newStatus } = await req.json();

    if (!parentId || !newStatus) {
      return NextResponse.json({ error: "Parent ID or new status missing" }, { status: 400 });
    }

    const updatedBatchDoc = await Batch.findOneAndUpdate(
      { _id: parentId, "batches._id": batchId },
      { $set: { "batches.$.status": newStatus } },
      { new: true }
    );

    if (!updatedBatchDoc) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, batchDoc: updatedBatchDoc });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error while updating batch status" }, { status: 500 });
  }
}
