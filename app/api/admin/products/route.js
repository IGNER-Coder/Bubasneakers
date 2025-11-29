import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

// Helper to force input into a clean Array of Strings
const sanitizeImages = (input) => {
  if (!input) return [];
  
  let processed = input;

  // 1. If it's a string that looks like an array "[...]", try to parse it
  if (typeof input === 'string' && input.trim().startsWith('[')) {
    try {
      // Fix potential bad formatting (single quotes to double quotes)
      const jsonString = input.replace(/'/g, '"'); 
      processed = JSON.parse(jsonString);
    } catch (e) {
      console.log("Failed to parse stringified array, treating as single string");
    }
  }

  // 2. If it's still a string, wrap it
  if (typeof processed === 'string') {
    return [processed].filter(s => s.startsWith('http'));
  }

  // 3. If it's an array, flatten and clean it
  if (Array.isArray(processed)) {
    return processed
      .flat(Infinity)
      .filter(item => typeof item === 'string' && item.startsWith('http'));
  }

  return [];
};

export async function GET(request) {
  try {
    await connectToDatabase();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("📦 RAW BODY:", body); // Debugging

    const { name, brand, price, category, gender, images, description, storyLabel, curatorNote } = body;

    // 1. Validation
    if (!name || !brand || !price) {
      return NextResponse.json({ message: "Missing required fields (Name, Brand, Price)" }, { status: 400 });
    }

    // 2. NUCLEAR SANITIZATION ☢️
    // This fixes the "Cast to [string] failed" error by forcing it into a clean array
    const cleanImages = sanitizeImages(images);

    // Fallback: If array is empty, check for singular 'image' field
    if (cleanImages.length === 0 && body.image) {
      const cleanSingle = sanitizeImages(body.image);
      if (cleanSingle.length > 0) cleanImages.push(...cleanSingle);
    }

    if (cleanImages.length === 0) {
        return NextResponse.json({ message: "No valid images found. Please upload an image." }, { status: 400 });
    }

    await connectToDatabase();

    // 3. Create Product
    const newProduct = await Product.create({
      name,
      brand,
      price: Number(price),
      category,
      gender,
      description: description || "No description.",
      images: cleanImages, // ✅ Guaranteed to be [String]
      isFeatured: true,
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
    console.error("🔥 FINAL API ERROR:", error);
    return NextResponse.json({ message: error.message || "Database Error" }, { status: 500 });
  }
}