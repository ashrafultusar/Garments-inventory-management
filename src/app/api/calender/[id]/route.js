import connectDB from "@/lib/db";
import Calender from "@/models/Calender";
import { NextResponse } from "next/server";

// ✅ GET single calender
export async function GET(req, { params }) {
  try {
    await connectDB();
    const calender = await Calender.findById(params.id);
    if (!calender) {
      return NextResponse.json({ error: "Calender not found" }, { status: 404 });
    }
    return NextResponse.json(calender);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ UPDATE calender
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();
    const updated = await Calender.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    if (!updated) {
      return NextResponse.json({ error: "Calender not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ DELETE calender
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const deleted = await Calender.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ error: "Calender not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Calender deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
