import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  try {
    // ⚠️ FIX FOR NEXT.JS 15: Await the params object
    const { id } = await params; 
    const { status } = await request.json();

    const validStatuses = ['Processing', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    await connectToDatabase();

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}