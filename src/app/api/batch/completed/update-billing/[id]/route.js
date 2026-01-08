import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import CompletedBatch from "@/components/Batch/CompletedBatch";


export async function PUT(req, { params }) {
  await connectDB();

  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Batch ID is required" }, { status: 400 });
    }

    const body = await req.json();
    let { price, total } = body;

    // Convert to number
    price = Number(price);
    total = Number(total);

    if (price === undefined || total === undefined || isNaN(price) || isNaN(total)) {
      return NextResponse.json(
        { error: "Price and Total must be valid numbers" },
        { status: 400 }
      );
    }

    const updatedBatch = await CompletedBatch.findByIdAndUpdate(
      id,
      { price, total },
      { new: true }
    );

    if (!updatedBatch) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBatch, { status: 200 });
  } catch (error) {
    console.error("PUT /update-billing error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update billing" },
      { status: 500 }
    );
  }
}
