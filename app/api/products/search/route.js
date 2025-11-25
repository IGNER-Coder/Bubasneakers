import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET(request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ message: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } },
      ],
    }).limit(10); // Limit results for performance

    return NextResponse.json(products);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
