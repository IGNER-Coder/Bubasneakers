import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, brand, price, category, gender, image, description, storyLabel, curatorNote } = body;

    if (!name || !brand || !price || !image) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();

    const newProduct = await Product.create({
      name,
      brand,
      price: Number(price),
      category,
      gender,
      description: description || "No description.",
      images: [image], 
      isFeatured: true,
      // 🆕 Save the new fields
      storyLabel: storyLabel || "Just Dropped",
      curatorNote: curatorNote || "Fresh heat for the streets.",
      sizes: [
        { size: 8, stock: 10 },
        { size: 9, stock: 10 },
        { size: 10, stock: 10 },
        { size: 11, stock: 10 },
      ]
    });

    return NextResponse.json({ message: "Product Created", productId: newProduct._id }, { status: 201 });

  } catch (error) {
    console.error("🔥 API Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}