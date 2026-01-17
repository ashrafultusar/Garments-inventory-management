// import connectDB from "@/lib/db";
// import BillingSummary from "@/models/BillingSummary";
// import { NextResponse } from "next/server";


// export async function GET(req, { params }) {
//   try {
//     await connectDB();
//     const { customerId } = await params;

//     // Sudhu BillingSummary fetch kora hobe 
//     // summaryType: "client" filter deya holo jate sudhu client-er bill gulo ase
//     const summaries = await BillingSummary.find({ 
//       customerId: customerId,
//       summaryType: "client" 
//     }).sort({ createdAt: 1 }); // Purono theke natun (Ascending)

//     return NextResponse.json({
//       success: true,
//       data: summaries,
//     });
//   } catch (error) {
//     console.error("Billing Summary Fetch Error:", error);
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }





import { NextResponse } from "next/server";
import Payment from "@/models/Payment";
import customers from "@/models/customers";
import BillingSummary from "@/models/BillingSummary";
import connectDB from "@/lib/db";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { customerId } = await params;

    // ৩টি ডাটা একসাথে ফেচ করা হচ্ছে
    const [customer, billings, payments] = await Promise.all([
      customers.findById(customerId).lean(),
      BillingSummary.find({ customerId, summaryType: "client" }).sort({ createdAt: 1 }).lean(),
      Payment.find({ user: customerId }).sort({ date: 1 }).lean()
    ]);

    if (!customer) {
      return NextResponse.json({ success: false, message: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        customer,
        billings,
        payments
      }
    });
  } catch (error) {
    console.error("Ledger API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}