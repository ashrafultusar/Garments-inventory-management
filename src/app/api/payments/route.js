// app/api/payments/route.js

import connectDB from "@/lib/db";
import Payment from "@/models/Payment";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const payments = await Payment.find({ user: userId }).sort({ date: 1 });
  return Response.json({ payments });
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const { userId, amount, type, method, description, date } = body;

  const payment = await Payment.create({
    user: userId,
    amount,
    type,
    method,
    description,
    date: date || Date.now(),
  });

  return Response.json({ payment }, { status: 201 });
}
