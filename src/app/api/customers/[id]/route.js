import connectDB from "@/lib/db";
import customers from "@/models/customers";

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();
    const updatedCustomer = await customers.findByIdAndUpdate(params.id, body, { new: true });
    return new Response(JSON.stringify(updatedCustomer), { status: 200 });
  } catch (err) {
    console.error("PUT Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    await customers.findByIdAndDelete(params.id);
    return new Response(JSON.stringify({ message: "Customer deleted" }), { status: 200 });
  } catch (err) {
    console.error("DELETE Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
