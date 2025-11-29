import connectDB from "@/lib/db";
import Customer from "@/models/customers";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    console.log("Received Body:", body); // Debug (optional)

    // Convert employee list to array
    if (typeof body.employeeList === "string") {
      body.employeeList = body.employeeList
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);
    }

    const customer = await Customer.create({
      ...body,
      searchText: body.searchText || "",
    });

    return new Response(
      JSON.stringify({ message: "Customer created", customer }),
      { status: 201 }
    );

  } catch (error) {
    console.error("POST Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();

    const customers = await Customer.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(customers), { status: 200 });

  } catch (error) {
    console.error("GET Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
