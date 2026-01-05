import connectDB from "@/lib/db";
import Batch from "@/models/Batch"; // আপনার Batch মডেল
import Order from "@/models/Order"; // আপনার Order মডেল

export async function GET(req, { params }) {
  await connectDB();
  const { batchId: embeddedBatchId } = params;

  try {
    // 1️⃣ এই embeddedBatchId যে Batch ডকুমেন্টের ভেতরে আছে, সেই পুরো ডকুমেন্ট আনো
    const batchDocument = await Batch.findOne(
      { "batches._id": embeddedBatchId },
      { orderId: 1, batches: 1 } // ❗ এখানে আর $elemMatch ব্যবহার করছিনা, full batches দরকার
    ).lean();

    if (!batchDocument || !Array.isArray(batchDocument.batches)) {
      return new Response(JSON.stringify({ error: "Batch not found" }), {
        status: 404,
      });
    }

    // 2️⃣ ওই embedded batch টা বের করো
    const embeddedBatch = batchDocument.batches.find(
      (b) => String(b._id) === String(embeddedBatchId)
    );

    if (!embeddedBatch) {
      return new Response(
        JSON.stringify({ error: "Embedded batch not found" }),
        {
          status: 404,
        }
      );
    }

    const parentOrderId = batchDocument.orderId;

    // 3️⃣ সব batches থেকে used rollNo collect করো
    const usedRollNos = new Set();

    batchDocument.batches.forEach((b) => {
      (b.rows || []).forEach((r) => {
        if (r?.rollNo != null) {
          usedRollNos.add(r.rollNo);
        }
      });
    });

    // 4️⃣ Order থেকে সব tableData আনো
    const order = await Order.findById(parentOrderId).lean();

    let availableRows = [];
    if (order && Array.isArray(order.tableData)) {
      // ❗ যেসব rollNo কোনো batch-এই use হয়নি, শুধু সেগুলো available
      availableRows = order.tableData.filter(
        (row) => !usedRollNos.has(row.rollNo)
      );
    }

    // 5️⃣ ডেটা পাঠিয়ে দাও
    return new Response(
      JSON.stringify({
        embeddedBatch,
        availableRows,
        parentBatchDocId: batchDocument._id,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: err.message || "Server error" }),
      { status: 500 }
    );
  }
}

// ডেটা আপডেট করার জন্য (PATCH)
// export async function PATCH(req, { params }) {
//   await connectDB();
//   const { batchId: embeddedBatchId } = params;
//   const { embeddedBatchData } = await req.json();

//   try {
//     const updateResult = await Batch.updateOne(
//       { "batches._id": embeddedBatchId },
//       {
//         $set: {
//           "batches.$.note": embeddedBatchData.note,
//           "batches.$.rows": embeddedBatchData.rows,
//           "batches.$.colour": embeddedBatchData.colour,
//           "batches.$.finishingType": embeddedBatchData.finishingType,
//           "batches.$.sillName": embeddedBatchData.sillName,
//           "batches.$.dyeing": embeddedBatchData.dyeing,
//           "batches.$.selectedProcesses": embeddedBatchData.selectedProcesses,

//           // ✅ If "calender" exists in process list → keep, else → remove
//           "batches.$.calender": embeddedBatchData.selectedProcesses?.some(
//             (p) => p.name === "calender"
//           )
//             ? embeddedBatchData.calender
//             : null,
//         },
//       }
//     );

//     if (updateResult.matchedCount === 0) {
//       return new Response(JSON.stringify({ message: "Batch not found" }), {
//         status: 404,
//       });
//     }

//     return new Response(
//       JSON.stringify({ message: "Batch updated successfully" }),
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error(err);
//     return new Response(
//       JSON.stringify({ message: err.message || "Server error" }),
//       { status: 500 }
//     );
//   }
// }

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
          "batches.$.calender":
            embeddedBatchData.selectedProcesses?.some(
              (p) => p.name === "calender"
            )
              ? embeddedBatchData.calender
              : null,
        },
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