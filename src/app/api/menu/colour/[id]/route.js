// app/api/menu/colour/[id]/route.js

import connectDB from "@/lib/db";
import Colour from "@/models/menu/Colour";

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const { name } = await req.json();

    if (!name || !name.trim()) {
      return new Response(JSON.stringify({ error: "Name is required" }), { status: 400 });
    }

    const updated = await Colour.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true }
    );

    if (!updated) {
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Server Error" }), { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const deleted = await Colour.findByIdAndDelete(id);

    if (!deleted) {
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Deleted" }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Server Error" }), { status: 500 });
  }
}
