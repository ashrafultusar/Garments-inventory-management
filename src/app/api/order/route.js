import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    console.log("Received data for new order:", data); // <-- Add this line for debugging

    const order = new Order(data);
    const savedOrder = await order.save();
    return Response.json(savedOrder, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error); // <-- This will give you more details on the error
    return Response.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find();
    return Response.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error); // <-- Also good to have for GET
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
