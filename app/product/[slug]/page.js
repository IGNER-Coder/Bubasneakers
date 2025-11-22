import connectToDatabase from "../../../lib/db";
import Product from "../../../models/Product";
import ProductView from "../../../components/ProductView"; 

// Fetch data on the server
async function getProduct(id) {
  try {
    await connectToDatabase();
    
    // Validate if ID is a valid MongoDB ObjectId to prevent crashes
    if (!id || id.length !== 24) return null;

    const product = await Product.findById(id).lean();
    
    if (!product) return null;

    // Convert MongoDB _id and dates to strings for React
    return {
      ...product,
      id: product._id.toString(),
      _id: product._id.toString(),
      createdAt: product.createdAt?.toString(),
      updatedAt: product.updatedAt?.toString(),
      // Handle sizes if they have _ids inside them
      sizes: product.sizes.map(s => ({
        ...s,
        _id: s._id ? s._id.toString() : null
      }))
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default async function ProductPage({ params }) {
  // ⚠️ CRITICAL FIX FOR NEXT.JS 15+: params is now a Promise
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black">
        <h1 className="font-oswald text-4xl mb-4">Product Not Found</h1>
        <p className="text-concrete mb-8">The shoe you are looking for has moved or sold out.</p>
        <a href="/" className="bg-black text-white px-6 py-3 rounded-full font-bold uppercase tracking-wider">
          Back to Shop
        </a>
      </div>
    );
  }

  // Pass data to the Client Component
  return <ProductView product={product} />;
}