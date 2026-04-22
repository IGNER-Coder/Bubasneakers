import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

/**
 * GET /api/admin/orders
 * Returns all orders, sorted by most recent first.
 * Supports optional ?status= query param for filtering.
 * Admin-only route.
 */
export async function GET(request) {
  try {
    // 🔒 Admin Auth Guard
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");

    await connectToDatabase();

    const query = statusFilter ? { status: statusFilter } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 }).lean();

    // Serialize MongoDB ObjectIds to strings for safe JSON transport
    const serializedOrders = orders.map(order => ({
      ...order,
      _id: order._id.toString(),
      userId: order.userId ? order.userId.toString() : null,
      createdAt: order.createdAt.toString(),
      updatedAt: order.updatedAt ? order.updatedAt.toString() : null,
      items: order.items.map(item => ({
        ...item,
        _id: item._id ? item._id.toString() : null,
        productId: item.productId ? item.productId.toString() : null,
      })),
    }));

    return NextResponse.json(serializedOrders);

  } catch (error) {
    console.error("Admin Orders Fetch Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
