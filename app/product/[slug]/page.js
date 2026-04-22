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

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The shoe you are looking for has moved or sold out."
    };
  }

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.bubasneakers.com";
  const imageUrl = product.images?.[0] || `${BASE_URL}/favicon.ico`;

  return {
    title: product.name,
    description: product.description || `Buy ${product.name} at BUBASNEAKERS. Premium streetwear in Nairobi.`,
    openGraph: {
      title: product.name,
      description: product.description || `Buy ${product.name} at BUBASNEAKERS.`,
      url: `${BASE_URL}/product/${product._id}`,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description || `Buy ${product.name} at BUBASNEAKERS.`,
      images: [imageUrl],
    },
  };
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

  // JSON-LD Schema for Google Rich Snippets
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.bubasneakers.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images?.[0] || `${BASE_URL}/favicon.ico`,
    description: product.description || `Buy ${product.name} at BUBASNEAKERS.`,
    brand: {
      "@type": "Brand",
      name: product.brand || "BUBASNEAKERS",
    },
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/product/${product._id}`,
      priceCurrency: "KES",
      price: product.price,
      availability: "https://schema.org/InStock",
    },
  };

  // Pass data to the Client Component
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductView product={product} />
    </>
  );
}