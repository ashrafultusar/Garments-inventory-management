
import connectDB from "@/lib/db";
import Batch from "@/models/Batch";
import Invoice from "@/models/Invoice";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { invoiceNumber } = params;

    if (!invoiceNumber) {
      return NextResponse.json(
        { error: "Invoice number is required" },
        { status: 400 }
      );
    }

    // 🧾 Find the invoice
    const invoice = await Invoice.findOne({ invoiceNumber });
    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    // 🔹 Find related Batch doc
    const batchDoc = await Batch.findOne({ orderId: invoice.orderId });
    if (!batchDoc) {
      return NextResponse.json(
        { error: "Batch record not found" },
        { status: 404 }
      );
    }

    // ✅ For each batch that was moved to billing, revert status to "Delivered"
    const updatedBatches = batchDoc.batches.map((b) => {
      if (invoice.batchIds.some((id) => id.toString() === b._id.toString())) {
        return {
          ...b.toObject(),
          status: "delivered", 
          updatedAt: new Date(),
        };
      }
      return b;
    });

    batchDoc.batches = updatedBatches;
    await batchDoc.save();

    // 🗑️ Delete the invoice from database
    await Invoice.deleteOne({ invoiceNumber });

    return NextResponse.json({
      success: true,
      message: "Invoice deleted and batches reverted to Delivered.",
    });
  } catch (err) {
    console.error("Invoice Delete Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
