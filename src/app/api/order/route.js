import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    const order = new Order(data);
    const savedOrder = await order.save();
    return NextResponse.json(savedOrder, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}



export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    // Pagination
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;
    const skip = (page - 1) * limit;

    // Search term
    const searchRaw = searchParams.get("search")?.trim() || "";

    // Date filters
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";

    // Extra filters
    const status = searchParams.get("status") || "";
    const clotheTypes = searchParams.get("clotheTypes") || "";
    const finishingType = searchParams.get("finishingType") || "";
    const colour = searchParams.get("colour") || "";
    const sillName = searchParams.get("sillName") || "";
    const quality = searchParams.get("quality") || "";

    // Base query object
    let query = {};

    // Search filter
    if (searchRaw) {
      query.$or = [
        { companyName: { $regex: searchRaw, $options: "i" } },
        { orderId: { $regex: searchRaw, $options: "i" } },
      ];
    }

    // Date range filter
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      };
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Multi-select support for other filters
    if (clotheTypes) {
      const values = clotheTypes.split(",").map((v) => v.trim());
      query.clotheType = { $in: values };
    }
    if (finishingType) {
      const values = finishingType.split(",").map((v) => v.trim());
      query.finishingType = { $in: values };
    }
    if (colour) {
      const values = colour.split(",").map((v) => v.trim());
      query.colour = { $in: values };
    }
    if (sillName) {
      const values = sillName.split(",").map((v) => v.trim());
      query.sillName = { $in: values };
    }
    if (quality) {
      const values = quality.split(",").map((v) => v.trim());
      query.quality = { $in: values };
    }

    // Get total count
    const totalCount = await Order.countDocuments(query);

    // Fetch orders
    const orders = await Order.find(query)
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(limit);

    return NextResponse.json({ orders, totalCount });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

