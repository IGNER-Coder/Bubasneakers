import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
// NOTE: In your local project, replace the following line with the correct path 
// to your auth options if you encounter an error.
const authOptions = {}; 

export async function GET(request) {
  // 1. Security Check: ONLY ADMINS can view this
  // In a real environment, you must import and use your actual authOptions:
  // const session = await getServerSession(authOptions); 
  
  // MOCK CHECK for Preview (Assume a successful check returns this structure)
  const session = { user: { role: 'admin' } }; 
  
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: "Access Denied: Admin required" }, { status: 403 });
  }

  try {
    await connectToDatabase();
    
    // 2. Fetch all orders, sort by newest first (descending creation date)
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(10) // Show the 10 most recent orders
      .lean();

    // 3. Serialization
    const serializedOrders = orders.map(order => ({
      ...order,
      _id: order._id.toString(),
      userId: order.userId.toString(),
      createdAt: order.createdAt.toLocaleString(),
    }));

    return NextResponse.json(serializedOrders);
  } catch (error) {
    console.error("Admin Order Fetch Error:", error);
    return NextResponse.json({ message: "Server error fetching orders." }, { status: 500 });
  }
}