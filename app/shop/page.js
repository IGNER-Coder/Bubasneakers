import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import ProductCard from "../../components/ProductCard";
import connectToDatabase from "../../lib/db";
import Product from "../../models/Product";
import Link from "next/link";

// --- 1. SERVER SIDE DATA FETCHING ---
async function getProducts(resolvedSearchParams) {
  await connectToDatabase();

  const filter = {};
  const sort = {};

  // A. Filter Logic (Using the awaited params)
  if (resolvedSearchParams.brand && resolvedSearchParams.brand !== "All") {
    filter.brand = resolvedSearchParams.brand;
  }
  
  // Handle "gender" or "category" query params
  if (resolvedSearchParams.gender) {
    filter.gender = { $regex: new RegExp(resolvedSearchParams.gender, "i") }; // Case insensitive
  }
  
  if (resolvedSearchParams.tag) {
    // Mapping simple tags to DB fields
    if (resolvedSearchParams.tag === "new") filter.isFeatured = true;
    else if (resolvedSearchParams.tag === "sale") filter.price = { $lt: 150 }; // Mock sale logic
    else filter.category = { $regex: new RegExp(resolvedSearchParams.tag, "i") };
  }

  // B. Sorting Logic
  if (resolvedSearchParams.sort === "price-asc") {
    sort.price = 1; // Low to High
  } else if (resolvedSearchParams.sort === "price-desc") {
    sort.price = -1; // High to Low
  } else {
    sort.createdAt = -1; // Newest first (Default)
  }

  // C. The Query
  const products = await Product.find(filter).sort(sort).lean();

  // D. Serialization (Convert _id to string for React)
  return products.map(p => ({
    ...p,
    id: p._id.toString(),
    _id: p._id.toString()
  }));
}

export default async function ShopPage({ searchParams }) {
  // ⚠️ CRITICAL FIX: Await the searchParams promise for Next.js 15+
  const resolvedSearchParams = await searchParams;
  const products = await getProducts(resolvedSearchParams);
  
  // Helper to create filter links
  const activeBrand = resolvedSearchParams.brand || "All";
  const activeSort = resolvedSearchParams.sort || "newest";

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* 1. HEADER & TOOLS */}
      <div className="sticky top-20 z-30 bg-white/90 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          
          <div className="flex items-center gap-4">
            <h1 className="font-oswald text-xl font-bold uppercase">
              {resolvedSearchParams.gender ? `${resolvedSearchParams.gender}'s Collection` : "Shop All"}
            </h1>
            <span className="text-xs text-concrete font-bold bg-neutral-100 px-2 py-1 rounded-full">
              {products.length} Items
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort Dropdown (Simple CSS Hover) */}
            <div className="relative group hidden md:block">
              <button className="flex items-center gap-2 text-sm font-bold hover:text-electric-blue">
                Sort By <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-neutral-100 shadow-xl rounded-lg p-2 hidden group-hover:block">
                <Link href={{ query: { ...resolvedSearchParams, sort: 'newest' } }} className="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 rounded-md">Newest</Link>
                <Link href={{ query: { ...resolvedSearchParams, sort: 'price-asc' } }} className="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 rounded-md">Price: Low-High</Link>
                <Link href={{ query: { ...resolvedSearchParams, sort: 'price-desc' } }} className="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 rounded-md">Price: High-Low</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-12">
          
          {/* 2. SIDEBAR FILTERS (Desktop) */}
          <aside className="hidden md:block w-64 space-y-8 sticky top-40 h-fit">
            {/* Brand Filter */}
            <div>
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wider">Brands</h3>
              <div className="space-y-2">
                {["All", "Nike", "Adidas", "New Balance"].map(brand => {
                  const isActive = activeBrand === brand;
                  const query = { ...resolvedSearchParams, brand: brand === "All" ? undefined : brand };
                  
                  return (
                    <Link key={brand} href={{ query }} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 border rounded-sm flex items-center justify-center ${isActive ? 'bg-black border-black' : 'border-neutral-300'}`}>
                        {isActive && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <span className={`text-sm ${isActive ? 'font-bold' : 'text-concrete group-hover:text-black'}`}>
                        {brand}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wider">Category</h3>
              <div className="space-y-2 flex flex-col items-start">
                {["All", "Lifestyle", "Running", "Skate", "Basketball"].map(cat => (
                  <Link 
                    key={cat}
                    href={{ query: { ...resolvedSearchParams, tag: cat === "All" ? undefined : cat } }}
                    className="text-sm text-concrete hover:text-electric-blue transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* 3. PRODUCT GRID */}
          <div className="flex-1">
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {products.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={{
                      id: product.id,
                      name: product.name,
                      brand: product.brand,
                      price: product.price,
                      image: product.images[0],
                      soldOut: false
                    }} 
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-xl text-concrete">No sneakers found matching your filters.</p>
                <Link 
                  href="/shop"
                  className="mt-4 inline-block text-electric-blue font-bold hover:underline"
                >
                  Clear All Filters
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}