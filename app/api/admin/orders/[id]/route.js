import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

// Handle PATCH requests (Updating data)
export async function PATCH(request, { params }) {
  try {
    const { id } = params; // Get Order ID from URL
    const { status } = await request.json(); // Get new status from body

    // Validate status
    const validStatuses = ['Processing', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    await connectToDatabase();

    // Find and Update
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: status },
      { new: true } // Return the updated document
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