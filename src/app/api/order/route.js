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
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}



// export async function GET(req) {
//   try {
//     await connectDB();
//     const { searchParams } = new URL(req.url);
//     const page = parseInt(searchParams.get('page')) || 1;
//     const limit = parseInt(searchParams.get('limit')) || 12;

//     const skip = (page - 1) * limit;

//     const totalCount = await Order.countDocuments();

//     const orders = await Order.find()
//       .sort({ createdAt: -1 })  
//       .skip(skip)
//       .limit(limit);

//     return NextResponse.json({ orders, totalCount });
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
//   }
// }



export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;
    const searchRaw = searchParams.get("search")?.trim() || "";

    const skip = (page - 1) * limit;

    const isNumber = !isNaN(searchRaw) && searchRaw !== "";

    const query = searchRaw
      ? {
          $or: [
            { companyName: { $regex: searchRaw, $options: "i" } },
            { orderId: { $regex: searchRaw, $options: "i" } },
            { colour: { $regex: searchRaw, $options: "i" } },
            { dyeingName: { $regex: searchRaw, $options: "i" } },
            { transporterName: { $regex: searchRaw, $options: "i" } },
            { clotheType: { $regex: searchRaw, $options: "i" } },
            
            ...(isNumber
              ? [
                  { finishingWidth: Number(searchRaw) },
                  { totalGoj: Number(searchRaw) },
                  { totalBundle: Number(searchRaw) },
                  { quality: Number(searchRaw) },
                ]
              : []),
          ],
        }
      : {};

    const totalCount = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
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

