import connectDB from "@/lib/db";
import Process from "@/models/menu/Process";


export async function GET() {
  try {
    await connectDB();
    const processes = await Process.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(processes), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, price } = body;

    if (!name || price === undefined) {
      return new Response(
        JSON.stringify({ error: "Name and price are required" }),
        { status: 400 }
      );
    }

    const newProcess = await Process.create({ name, price });
    return new Response(JSON.stringify(newProcess), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to create" }), {
      status: 500,
    });
  }
}
