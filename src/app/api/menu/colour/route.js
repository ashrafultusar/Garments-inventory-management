// app/api/menu/colour/route.js

import connectDB from "@/lib/db";
import Colour from "@/models/menu/Colour";

export async function GET() {
  try {
    await connectDB();
    const colours = await Colour.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(colours), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Server Error" }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { name } = await req.json();

    if (!name || !name.trim()) {
      return new Response(JSON.stringify({ error: "Name is required" }), { status: 400 });
    }

    const newColour = await Colour.create({ name: name.trim() });
    return new Response(JSON.stringify(newColour), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Server Error" }), { status: 500 });
  }
}
