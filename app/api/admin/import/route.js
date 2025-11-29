import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { products } = body; // Expecting an array of product objects

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ message: "No products found in file" }, { status: 400 });
    }

    await connectToDatabase();

    // Process each row to match our Schema
    const formattedProducts = products.map(row => {
      // Handle split for images if they are comma-separated in one cell
      // e.g. "url1,url2" -> ["url1", "url2"]
      const imageArray = row.images ? row.images.split(',').map(s => s.trim()) : [];
      
      // Handle sizes (Defaulting to standard run if not specified)
      const defaultSizes = [
        { size: 40, stock: 10 }, { size: 41, stock: 10 }, { size: 42, stock: 10 },
        { size: 43, stock: 10 }, { size: 44, stock: 10 }
      ];

      return {
        name: row.name,
        brand: row.brand,
        price: Number(row.price),
        category: row.category || "Lifestyle",
        gender: row.gender || "Men",
        description: row.description || "Imported product.",
        images: imageArray.length > 0 ? imageArray : ["https://via.placeholder.com/500"], // Fallback
        isFeatured: row.isFeatured === 'true' || row.isFeatured === true,
        storyLabel: row.storyLabel || "JUST LANDED",
        curatorNote: row.curatorNote || "Fresh stock.",
        sizes: defaultSizes
      };
    });

    // Bulk Insert
    await Product.insertMany(formattedProducts);

    return NextResponse.json({ 
      message: `Successfully imported ${formattedProducts.length} products`,
      count: formattedProducts.length
    });

  } catch (error) {
    console.error("Import Error:", error);
    return NextResponse.json({ message: "Server Error: " + error.message }, { status: 500 });
  }
}