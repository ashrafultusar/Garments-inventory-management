import connectDB from "@/lib/db";
import Order from "@/models/Order";


export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } =await params; 
    const order = await Order.findById(id);

    if (!order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(order), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
