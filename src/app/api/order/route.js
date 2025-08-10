import connectDB from "@/lib/db";
import Order from "@/models/Order";


export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    const order = new Order(data);
    const savedOrder = await order.save();
    return Response.json(savedOrder, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find();
    return Response.json(orders);
  } catch (error) {
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
