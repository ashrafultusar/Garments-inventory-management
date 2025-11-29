import connectDB from "@/lib/db";
import Customer from "@/models/customers";

// Get single customer
export async function GET(req, { params }) {
  try {
    await connectDB();
    const customer = await Customer.findById(params.id);

    if (!customer) {
      return new Response(JSON.stringify({ error: "Customer not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(customer), { status: 200 });
  } catch (err) {
    console.error("GET Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// Update customer
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();

    // Convert employee list string -> array
    if (typeof body.employeeList === "string") {
      body.employeeList = body.employeeList
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(params.id, body, {
      new: true,
    });

    if (!updatedCustomer) {
      return new Response(JSON.stringify({ error: "Customer not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updatedCustomer), { status: 200 });
  } catch (err) {
    console.error("PUT Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// Delete customer
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const deletedCustomer = await Customer.findByIdAndDelete(params.id);

    if (!deletedCustomer) {
      return new Response(JSON.stringify({ error: "Customer not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: "Customer deleted" }), {
      status: 200,
    });
  } catch (err) {
    console.error("DELETE Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
