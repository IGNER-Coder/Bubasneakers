import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

/**
 * PATCH /api/admin/orders/[id]
 * Update order status and/or tracking number.
 * Admin-only route.
 */
export async function PATCH(request, { params }) {
  try {
    // 🔒 Admin Auth Guard
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ⚠️ FIX FOR NEXT.JS 15: Await the params object
    const { id } = await params; 
    const body = await request.json();
    const { status, trackingNumber } = body;

    const updateFields = {};

    if (status) {
      const validStatuses = ['Processing', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ message: "Invalid status value" }, { status: 400 });
      }
      updateFields.status = status;
    }

    if (trackingNumber !== undefined) {
      updateFields.trackingNumber = trackingNumber;
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ message: "No valid fields to update" }, { status: 400 });
    }

    await connectToDatabase();

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Admin Order Update Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}