import connectDB from "@/lib/db";
import Calender from "@/models/Calender";
import { NextResponse } from "next/server";

// ✅ GET all calenders
export async function GET() {
  try {
    await connectDB();
    const calenders = await Calender.find().sort({ createdAt: -1 });
    return NextResponse.json(calenders);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ CREATE calender
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const calender = await Calender.create(body);
    return NextResponse.json(calender, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
