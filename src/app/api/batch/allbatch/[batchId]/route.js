import connectDB from "@/lib/db";
import Batch from "@/models/Batch"; // আপনার Batch মডেল
import Order from "@/models/Order"; // আপনার Order মডেল


export async function GET(req, { params }) {
  await connectDB();
  // এই batchId টি হলো Embedded Batch-এর _id, পুরো Batch Document-এর নয়
  const { batchId: embeddedBatchId } = params;

  try {
    // 1. সেই Batch ডকুমেন্টটি খুঁজে বের করুন যার batches অ্যারের মধ্যে এই embeddedBatchId টি আছে
    const batchDocument = await Batch.findOne(
      { "batches._id": embeddedBatchId },
      // শুধু প্রয়োজনীয় ফিল্ডগুলো প্রজেক্ট করুন
      { orderId: 1, batches: { $elemMatch: { _id: embeddedBatchId } } }
    ).lean();

    if (
      !batchDocument ||
      !batchDocument.batches ||
      batchDocument.batches.length === 0
    ) {
      return new Response(JSON.stringify({ error: "Batch not found" }), {
        status: 404,
      });
    }

    // 2. Embedded Batch এবং Parent Order ID এক্সট্রাক্ট করুন
    const embeddedBatch = batchDocument.batches[0];
    const parentOrderId = batchDocument.orderId;

    // 3. Parent Order থেকে সমস্ত tableData (rows) খুঁজে বের করুন
    const order = await Order.findById(parentOrderId).lean();

    let availableRows = [];
    if (order && Array.isArray(order.tableData)) {
      // এই Embedded Batch-এ ইতিমধ্যেই থাকা rollNo সংগ্রহ করা (rollNo Unique ধরে নেওয়া হলো)
      const batchRollNos = new Set(embeddedBatch.rows.map((row) => row.rollNo));

      // 4. Order-এর tableData থেকে যেগুলো এই ব্যাচে নেই, সেগুলোকে filtering করা
      availableRows = order.tableData.filter(
        (row) => !batchRollNos.has(row.rollNo)
      );
    }

    // 5. Embedded Batch ডেটা এবং যোগ করার জন্য উপলব্ধ row গুলি একসাথে পাঠানো
    return new Response(
      JSON.stringify({
        embeddedBatch,
        availableRows,
        // সুবিধার জন্য পুরো Batch Document-এর _id ও পাঠিয়ে দেওয়া হলো
        parentBatchDocId: batchDocument._id,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: err.message || "Server error" }),
      {
        status: 500,
      }
    );
  }
}

// ডেটা আপডেট করার জন্য (PATCH)
export async function PATCH(req, { params }) {
  await connectDB();
  const { batchId: embeddedBatchId } = params;
  const { embeddedBatchData } = await req.json();

  try {
    const updateResult = await Batch.updateOne(
      { "batches._id": embeddedBatchId },
      {
        $set: {
          "batches.$.note": embeddedBatchData.note,
          "batches.$.rows": embeddedBatchData.rows,
          "batches.$.colour": embeddedBatchData.colour,
          "batches.$.finishingType": embeddedBatchData.finishingType,
          "batches.$.sillName": embeddedBatchData.sillName,
          "batches.$.dyeing": embeddedBatchData.dyeing,
          "batches.$.selectedProcesses": embeddedBatchData.selectedProcesses,
      
          // ✅ If "calender" exists in process list → keep, else → remove
          "batches.$.calender": embeddedBatchData.selectedProcesses?.some(p => p.name === "calender")
              ? embeddedBatchData.calender
              : null,
      }
      
      }
    );

    if (updateResult.matchedCount === 0) {
      return new Response(JSON.stringify({ message: "Batch not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Batch updated successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ message: err.message || "Server error" }),
      { status: 500 }
    );
  }
}
