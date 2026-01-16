import connectDB from "@/lib/db";
import BillingSummary from "@/models/BillingSummary";



export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

  
    const summaries = await BillingSummary.find({ 
      customerId: id,
      summaryType: "client"
    }).sort({ createdAt: -1 });

    return new Response(JSON.stringify(summaries), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}