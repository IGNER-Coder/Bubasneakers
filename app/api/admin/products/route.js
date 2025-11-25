import connectToDatabase from "../../../../lib/db";
import Product from "../../../../models/Product";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // 1. Log entry
    console.log("API HIT: /api/admin/products");

    const body = await request.json();
    const { name, brand, price, category, gender, image, description } = body;

    // 2. Validate
    if (!name || !brand || !price || !image) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();

    // 3. Create Data Object
    const newProduct = {
      name,
      brand,
      price: Number(price),
      category,
      gender,
      description: description || "No description.",
      images: [image], 
      isFeatured: true,
      sizes: [
        { size: 8, stock: 10 },
        { size: 9, stock: 10 },
        { size: 10, stock: 10 },
        { size: 11, stock: 10 },
      ]
    };

    // 4. Save to Mongo
    const savedProduct = await Product.create(newProduct);
    console.log("✅ Product Saved:", savedProduct._id);

    // 5. Return JSON (CRITICAL STEP)
    return NextResponse.json(
      { message: "Product Created", productId: savedProduct._id }, 
      { status: 201 }
    );

  } catch (error) {
    console.error("🔥 API Error:", error);
    // Return JSON even on error so client doesn't crash
    return NextResponse.json(
      { message: error.message || "Internal Server Error" }, 
      { status: 500 }
    );
  }
}