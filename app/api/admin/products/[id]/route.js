import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth"; // Uncomment for production security

export async function DELETE(request, { params }) {
  try {
    // 1. Security Check (Recommended for production)
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') return NextResponse.json({}, { status: 403 });

    const { id } = await params; // Next.js 15 await fix

    await connectToDatabase();

    // 2. Delete
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
    try {
      const { id } = await params;
      const body = await request.json();
  
      await connectToDatabase();
  
      const updatedProduct = await Product.findByIdAndUpdate(id, body, { new: true });
  
      if (!updatedProduct) {
        return NextResponse.json({ message: "Product not found" }, { status: 404 });
      }
  
      return NextResponse.json(updatedProduct);
    } catch (error) {
      return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
  }

  
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
  