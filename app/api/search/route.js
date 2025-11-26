import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    await connectToDatabase();

    // Perform a case-insensitive search on Name, Brand, or Category
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { gender: { $regex: query, $options: "i" } }
      ]
    })
    .limit(5) // Limit results for the dropdown
    .select("name brand price images") // Only fetch needed fields
    .lean();

    // Format for frontend
    const results = products.map(p => ({
      id: p._id.toString(),
      name: p.name,
      brand: p.brand,
      price: p.price,
      image: p.images?.[0] || ""
    }));

    return NextResponse.json(results);

  } catch (error) {
    console.error("Search Error:", error);
    return NextResponse.json({ message: "Search failed" }, { status: 500 });
  }
}