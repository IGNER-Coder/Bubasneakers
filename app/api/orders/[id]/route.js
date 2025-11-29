import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    const { id } = await params; // Await params for Next.js 15 compatibility

    // 1. Validate ID format to prevent crashes
    if (!mongoose.Types.ObjectId.isValid(id)) {
       return NextResponse.json({ message: "Invalid Order ID format" }, { status: 400 });
    }

    await connectToDatabase();

    const order = await Order.findById(id).lean();

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // 2. Serialize Data (Convert Objects to Strings for JSON)
    return NextResponse.json({
      ...order,
      _id: order._id.toString(),
      // Handle guest orders (null userId) safely
      userId: order.userId ? order.userId.toString() : null,
      createdAt: order.createdAt.toString(),
      updatedAt: order.updatedAt ? order.updatedAt.toString() : null,
      items: order.items.map(item => ({
        ...item,
        _id: item._id ? item._id.toString() : null,
        // Handle potential populated product fields if needed in future
        productId: item.productId ? item.productId.toString() : null
      }))
    });

  } catch (error) {
    console.error("Fetch Order Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}