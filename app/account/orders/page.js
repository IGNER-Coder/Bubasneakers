import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import OrderHistoryClient from "../../../components/OrderHistoryClient"; 

async function getOrders(userId) {
  try {
    await connectToDatabase();
    
    // Find orders where userId matches the logged-in user
    const orders = await Order.find({ userId: userId }).sort({ createdAt: -1 }).lean();
    
    return orders.map(order => ({
      ...order,
      _id: order._id.toString(),
      userId: order.userId.toString(),
      createdAt: order.createdAt.toDateString(),
      items: order.items.map(item => ({
        ...item,
        _id: item._id ? item._id.toString() : null, // Handle item _id if present
      }))
    }));
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
}

export default async function OrderHistoryPage() {
  // NOTE: You must use the real getServerSession in a production environment.
  // MOCK SESSION (We use a mock here that grabs the ID from the URL for simplicity)
  
  // Replace this with your actual user ID you copied from MongoDB Atlas
  const REAL_USER_ID = "692465c39885b5056765a019"; 
  
  const session = { 
    user: { 
      id: REAL_USER_ID, 
      name: "Buba Test User" 
    },
    status: "authenticated" 
  };
  // END MOCK
  
  if (!session || !session.user.id) {
    // In production, use: redirect('/login');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Authentication Required.</p>
      </div>
    );
  }

  // 3. Fetch Orders using the REAL_USER_ID
  const orders = await getOrders(REAL_USER_ID);
  
  return <OrderHistoryClient orders={orders} />;
}