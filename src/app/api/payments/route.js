import connectDB from "@/lib/db";
import Payment from "@/models/Payment";


export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID missing" }), { status: 400 });
    }

    // নির্দিষ্ট কাস্টমারের সব পেমেন্ট লিস্ট
    const payments = await Payment.find({ user: userId }).sort({ date: -1 });
    return new Response(JSON.stringify(payments), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    console.log("Incoming Data:", body); // এটি চেক করুন আপনার টার্মিনালে

    // ডাটা যদি না আসে তবে body.userId চেক করুন
    if (!body.userId || !body.amount) {
       return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    const payment = await Payment.create({
      user: body.userId,
      amount: body.amount,
      method: body.method,
      description: body.description,
      date: body.date || new Date(),
    });

    return new Response(JSON.stringify(payment), { status: 201 });
  } catch (error) {
    console.error("POST Error:", error); // এররটি এখানে দেখতে পাবেন
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}



export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) return new Response(JSON.stringify({ error: "ID missing" }), { status: 400 });

    const updatedPayment = await Payment.findByIdAndUpdate(id, updateData, { new: true });
    return new Response(JSON.stringify(updatedPayment), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return new Response(JSON.stringify({ error: "ID missing" }), { status: 400 });

    await Payment.findByIdAndDelete(id);
    return new Response(JSON.stringify({ message: "Deleted" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}