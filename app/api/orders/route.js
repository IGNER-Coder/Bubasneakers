import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("📦 Order Attempt:", body); // Debug Log

    // We don't need to trust 'totalAmount' from the client anymore
    const { items, shippingAddress, userId, paymentMethod } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    await connectToDatabase();

    // 🛡️ SECURITY FIX: Calculate total on the server
    // This ensures the total matches the items and prevents the "missing total" error
    const calculatedTotal = items.reduce((sum, item) => {
      return sum + (Number(item.price) * Number(item.quantity));
    }, 0);

    // Create the Order
    const newOrder = await Order.create({
      userId: userId || undefined, // undefined tells Mongo "skip this field" instead of null
      items: items.map(item => ({
        productId: item.id || item._id, // Handle both ID formats
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        priceAtPurchase: item.price,
        image: item.images?.[0] || item.image || ""
      })),
      totalAmount: calculatedTotal, // ⬅️ Use the safe, calculated total
      shippingAddress,
      paymentMethod: paymentMethod || 'WhatsApp',
      status: 'Processing'
    });

    console.log("✅ Order Created:", newOrder._id);

    return NextResponse.json({ 
      message: "Order Created", 
      orderId: newOrder._id 
    }, { status: 201 });

  } catch (error) {
    console.error("🔥 Order API Error:", error); // This will show in your VS Code Terminal
    return NextResponse.json({ message: error.message || "Failed to create order" }, { status: 500 });
  }
}