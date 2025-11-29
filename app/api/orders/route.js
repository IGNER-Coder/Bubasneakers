import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";
import { sendOrderEmails } from "@/lib/email"; // ⬅️ Import the emailer

export async function POST(request) {
  try {
    const body = await request.json();
    const { items, shippingAddress, userId, paymentMethod } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    await connectToDatabase();

    // Calculate total securely on server
    const calculatedTotal = items.reduce((sum, item) => {
      return sum + (Number(item.price) * Number(item.quantity));
    }, 0);

    // 1. Create Order
    const newOrder = await Order.create({
      userId: userId || undefined,
      items: items.map(item => ({
        productId: item.id || item._id,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        priceAtPurchase: item.price,
        image: item.images?.[0] || item.image || ""
      })),
      totalAmount: calculatedTotal,
      shippingAddress,
      paymentMethod: paymentMethod || 'WhatsApp',
      status: 'Processing'
    });

    console.log("✅ Order Created:", newOrder._id);

    // 2. 📧 SEND EMAILS (Fire and Forget)
    // We don't await this because we don't want to slow down the checkout redirect
    if (shippingAddress.email) {
        sendOrderEmails({ order: newOrder, customerEmail: shippingAddress.email })
            .catch(err => console.error("Email Error:", err));
    }

    return NextResponse.json({ 
      message: "Order Created", 
      orderId: newOrder._id 
    }, { status: 201 });

  } catch (error) {
    console.error("🔥 Order API Error:", error);
    return NextResponse.json({ message: error.message || "Failed to create order" }, { status: 500 });
  }
}