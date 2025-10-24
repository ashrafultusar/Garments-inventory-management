import connectDB from "@/lib/db";
import Batch from "@/models/Batch";
import Invoice from "@/models/Invoice";
import { NextResponse } from "next/server";

function generateInvoiceNumber() {
  const timestamp = Date.now().toString().slice(-6);
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `INV-${timestamp}-${randomPart}`;
}

export async function POST(req) {
  try {
    await connectDB();
    const { orderId, batchIds } = await req.json();

    if (!orderId || !batchIds?.length) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    // ✅ find the main Batch document by orderId
    const batchDoc = await Batch.findOne({ orderId });
    if (!batchDoc)
      return NextResponse.json(
        { error: "Batch record not found" },
        { status: 404 }
      );

    // ✅ Generate unique invoice number
    const invoiceNumber = generateInvoiceNumber();

    // ✅ Loop through batches and update only selected ones
    batchDoc.batches.forEach((b) => {
      if (batchIds.includes(b._id.toString())) {
        b.status = "billing";
        b.invoiceNumber = invoiceNumber;
      }
    });

    // ✅ Mark as modified so Mongoose saves nested updates
    batchDoc.markModified("batches");
    await batchDoc.save();

    // ✅ Create a new invoice document
    const newInvoice = await Invoice.create({
      invoiceNumber,
      orderId,
      batchIds,
      totalAmount: 0, // later calculate dynamically
      status: "unpaid",
    });

    return NextResponse.json({
      success: true,
      invoiceNumber,
      invoice: newInvoice,
      message: `Invoice ${invoiceNumber} created successfully.`,
    });
  } catch (err) {
    console.error("Invoice Create Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
