import connectToDatabase from "../lib/db";
import Product from "../models/Product";

// NOTE: Replace with your actual production URL
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.bubasneakers.com";

export default async function sitemap() {
  try {
    await connectToDatabase();
    
    // Fetch all active products
    const products = await Product.find({}, "_id updatedAt").lean();
    
    const productUrls = products.map((product) => ({
      url: `${BASE_URL}/product/${product._id.toString()}`,
      lastModified: product.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // Define core static routes
    const staticRoutes = [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${BASE_URL}/shop`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
    ];

    return [...staticRoutes, ...productUrls];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Fallback if DB fails
    return [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      }
    ];
  }
}
