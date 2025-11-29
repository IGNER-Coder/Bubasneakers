import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

// 1. GET: Fetch array of Wishlisted IDs for the logged-in user
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) return NextResponse.json([], { status: 200 });

    await connectToDatabase();
    const user = await User.findOne({ email }).select("wishlist");

    if (!user) return NextResponse.json([], { status: 200 });

    // Ensure we return strings, not Mongo ObjectIds
    const wishlistStrings = user.wishlist.map(id => id.toString());
    
    return NextResponse.json(wishlistStrings);
  } catch (error) {
    console.error("Wishlist GET Error:", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

// 2. POST: Toggle Item (Add/Remove)
export async function POST(request) {
  try {
    const { productId, email } = await request.json();

    if (!productId || !email) {
        return NextResponse.json({ message: "Missing data" }, { status: 400 });
    }

    await connectToDatabase();
    
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    // Ensure wishlist is initialized
    if (!user.wishlist) user.wishlist = [];

    // Convert IDs to strings for safe comparison
    const wishlistStrings = user.wishlist.map(id => id.toString());
    const index = wishlistStrings.indexOf(productId);

    let action = "";

    if (index === -1) {
      // Add to wishlist
      user.wishlist.push(productId);
      action = "added";
    } else {
      // Remove from wishlist
      user.wishlist.splice(index, 1);
      action = "removed";
    }

    await user.save();

    return NextResponse.json({ 
      message: `Item ${action}`,
      wishlist: user.wishlist 
    });

  } catch (error) {
    console.error("Wishlist POST Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}