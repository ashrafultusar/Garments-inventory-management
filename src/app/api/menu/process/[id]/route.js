import connectDB from "@/lib/db";
import Process from "@/models/menu/Process";
import mongoose from "mongoose";

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const body = await req.json();
    const { name, price } = body;

    if (!name || price === undefined) {
      return new Response(
        JSON.stringify({ error: "Name and price are required" }),
        { status: 400 }
      );
    }

    const updated = await Process.findByIdAndUpdate(
      id,
      { name, price },
      { new: true }
    );

    if (!updated) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to update" }), {
      status: 500,
    });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const deleted = await Process.findByIdAndDelete(id);

    if (!deleted) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: "Deleted successfully" }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to delete" }), {
      status: 500,
    });
  }
}
