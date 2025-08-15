import connectDB from "@/lib/db";
import ClothType from "@/models/menu/ClothType";



export async function POST(req) {
  try {
    await connectDB();
    const { name } = await req.json();

    if (!name || !name.trim()) {
      return new Response(JSON.stringify({ error: "Name is required" }), {
        status: 400,
      });
    }

    const newType = await ClothType.create({ name });

    return new Response(JSON.stringify(newType), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Server Error" }), {
      status: 500,
    });
  }
}



export async function GET() {
    try {
      await connectDB();
      const types = await ClothType.find().sort({ createdAt: -1 });
      return new Response(JSON.stringify(types), { status: 200 });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: "Server Error" }), {
        status: 500,
      });
    }
  }