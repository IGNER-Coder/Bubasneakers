import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import ProductCard from "../../components/ProductCard";
import ShopClientWrapper from "../../components/ShopClientWrapper";
import connectToDatabase from "../../lib/db";
import Product from "../../models/Product";
import Link from "next/link";

// --- 1. SERVER SIDE DATA FETCHING ---
async function getProducts(resolvedSearchParams) {
  await connectToDatabase();

  const filter = {};
  const sort = {};

  // A. Brand Filter
  if (resolvedSearchParams.brand && resolvedSearchParams.brand !== "All") {
    filter.brand = resolvedSearchParams.brand;
  }
  
  // B. Gender Filter
  if (resolvedSearchParams.gender && resolvedSearchParams.gender !== "all") {
    filter.gender = { $regex: new RegExp(resolvedSearchParams.gender, "i") };
  }
  
  // C. Tag/Category Filter
  if (resolvedSearchParams.tag && resolvedSearchParams.tag !== "all") {
    if (resolvedSearchParams.tag === "new") {
      filter.isFeatured = true;
    } else {
      filter.category = { $regex: new RegExp(resolvedSearchParams.tag, "i") };
    }
  }

  // D. Price Range Filter
  if (resolvedSearchParams.priceRange) {
    const priceMap = {
      "under-100": { $lt: 100 },
      "100-150": { $gte: 100, $lte: 150 },
      "150-200": { $gte: 150, $lte: 200 },
      "over-200": { $gt: 200 }
    };
    if (priceMap[resolvedSearchParams.priceRange]) {
      filter.price = priceMap[resolvedSearchParams.priceRange];
    }
  }

  // E. On Sale Filter
  if (resolvedSearchParams.onSale === 'true') {
    filter.price = { $lt: 150 }; 
  }

  // F. Sorting Logic
  if (resolvedSearchParams.sort === "price-asc") {
    sort.price = 1; 
  } else if (resolvedSearchParams.sort === "price-desc") {
    sort.price = -1; 
  } else {
    sort.createdAt = -1; 
  }

  // G. The Query
  const products = await Product.find(filter).sort(sort).lean();

  // H. SERIALIZATION
  return products.map(p => ({
    ...p,
    id: p._id.toString(),
    _id: p._id.toString(),
    image: p.images && p.images.length > 0 ? p.images[0] : '',
    sizes: p.sizes ? p.sizes.map(s => ({
      size: s.size,
      stock: s.stock,
      _id: s._id ? s._id.toString() : undefined
    })) : []
  }));
}

export default async function ShopPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const products = await getProducts(resolvedSearchParams);
  
  const activeBrand = resolvedSearchParams.brand || "All";
  const activeSort = resolvedSearchParams.sort || "newest";

  const activeFilterCount = [
    resolvedSearchParams.brand && resolvedSearchParams.brand !== "All",
    resolvedSearchParams.gender && resolvedSearchParams.gender !== "all",
    resolvedSearchParams.tag && resolvedSearchParams.tag !== "all",
    resolvedSearchParams.priceRange && resolvedSearchParams.priceRange !== "all",
    resolvedSearchParams.onSale === 'true'
  ].filter(Boolean).length;

  // --- REUSABLE FILTER UI WITH ACCORDIONS ---
  const FilterContent = (
    <div className="space-y-6">
      
      {/* 1. Brand Filter (Collapsible) */}
      <details className="group" open>
        <summary className="flex justify-between items-center font-sans font-semibold text-sm text-black cursor-pointer list-none mb-4">
          Brands
          <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
        </summary>
        <div className="space-y-3 pl-1 animate-fade-in">
          {["All", "Nike", "Adidas", "New Balance", "Puma", "Reebok"].map(brand => {
            const isActive = activeBrand === brand;
            const query = { ...resolvedSearchParams, brand: brand === "All" ? undefined : brand };
            
            return (
              <Link key={brand} href={{ query }} className="flex items-center gap-3 cursor-pointer group/item transition-all">
                <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${isActive ? 'bg-black border-black' : 'border-neutral-300 group-hover/item:border-neutral-500'}`}>
                  {isActive && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm transition-colors ${isActive ? 'font-semibold text-black' : 'text-neutral-600 group-hover/item:text-black'}`}>
                  {brand}
                </span>
              </Link>
            );
          })}
        </div>
      </details>
      
      <div className="h-px w-full bg-neutral-100" />

      {/* 2. Category Filter */}
      <details className="group" open>
        <summary className="flex justify-between items-center font-sans font-semibold text-sm text-black cursor-pointer list-none mb-4">
          Category
          <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
        </summary>
        <div className="space-y-3 pl-1 animate-fade-in">
          {["All", "Lifestyle", "Running", "Basketball", "Skateboarding", "Training"].map(cat => {
            const isActive = resolvedSearchParams.tag === cat.toLowerCase() || (!resolvedSearchParams.tag && cat === "All");
            const query = { ...resolvedSearchParams, tag: cat === "All" ? undefined : cat.toLowerCase() };
            
            return (
              <Link key={cat} href={{ query }} className="flex items-center gap-3 cursor-pointer group/item transition-all">
                <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all ${isActive ? 'border-black' : 'border-neutral-300 group-hover/item:border-neutral-500'}`}>
                  {isActive && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                </div>
                <span className={`text-sm transition-colors ${isActive ? 'font-semibold text-black' : 'text-neutral-600 group-hover/item:text-black'}`}>
                  {cat}
                </span>
              </Link>
            );
          })}
        </div>
      </details>

      <div className="h-px w-full bg-neutral-100" />

      {/* 3. Gender Filter */}
      <details className="group">
        <summary className="flex justify-between items-center font-sans font-semibold text-sm text-black cursor-pointer list-none mb-4">
          Gender
          <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
        </summary>
        <div className="space-y-3 pl-1 animate-fade-in">
          {[
            { value: "all", label: "All" },
            { value: "men", label: "Men" },
            { value: "women", label: "Women" },
            { value: "kids", label: "Kids" },
          ].map(option => {
            const isActive = resolvedSearchParams.gender === option.value || (!resolvedSearchParams.gender && option.value === "all");
            const query = { ...resolvedSearchParams, gender: option.value === "all" ? undefined : option.value };
            
            return (
              <Link key={option.value} href={{ query }} className="flex items-center gap-3 cursor-pointer group/item transition-all">
                <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all ${isActive ? 'border-black' : 'border-neutral-300 group-hover/item:border-neutral-500'}`}>
                  {isActive && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                </div>
                <span className={`text-sm transition-colors ${isActive ? 'font-semibold text-black' : 'text-neutral-600 group-hover/item:text-black'}`}>
                  {option.label}
                </span>
              </Link>
            );
          })}
        </div>
      </details>

      <div className="h-px w-full bg-neutral-100" />

      {/* 4. Price Range Filter */}
      <details className="group">
        <summary className="flex justify-between items-center font-sans font-semibold text-sm text-black cursor-pointer list-none mb-4">
          Price
          <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
        </summary>
        <div className="space-y-3 pl-1 animate-fade-in">
          {[
            { value: "all", label: "All Prices" },
            { value: "under-100", label: "Under $100" },
            { value: "100-150", label: "$100 - $150" },
            { value: "150-200", label: "$150 - $200" },
            { value: "over-200", label: "Over $200" }
          ].map(option => {
            const isActive = resolvedSearchParams.priceRange === option.value || (!resolvedSearchParams.priceRange && option.value === "all");
            const query = { ...resolvedSearchParams, priceRange: option.value === "all" ? undefined : option.value };
            
            return (
              <Link key={option.value} href={{ query }} className="flex items-center gap-3 cursor-pointer group/item transition-all">
                <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all ${isActive ? 'border-black' : 'border-neutral-300 group-hover/item:border-neutral-500'}`}>
                  {isActive && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                </div>
                <span className={`text-sm transition-colors ${isActive ? 'font-semibold text-black' : 'text-neutral-600 group-hover/item:text-black'}`}>
                  {option.label}
                </span>
              </Link>
            );
          })}
        </div>
      </details>

      {/* On Sale Toggle */}
      <div className="pt-4">
        <Link 
          href={{ query: { ...resolvedSearchParams, onSale: resolvedSearchParams.onSale ? undefined : 'true' } }}
          className="flex items-center justify-between cursor-pointer group py-2"
        >
          <span className="text-sm font-medium text-neutral-700 group-hover:text-black transition-colors">
            On Sale Only
          </span>
          <div className={`w-11 h-6 rounded-full transition-all relative ${resolvedSearchParams.onSale ? 'bg-electric-blue' : 'bg-neutral-300'}`}>
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${resolvedSearchParams.onSale ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </div>
        </Link>
      </div>

      {/* Clear Filters Button */}
      {activeFilterCount > 0 && (
        <Link href="/shop" className="flex items-center justify-center gap-2 w-full py-3 px-4 border-2 border-neutral-200 rounded-lg text-sm font-semibold text-neutral-700 hover:border-black hover:text-black transition-all mt-6">
          <X className="w-4 h-4" /> Clear All Filters
        </Link>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* 1. HEADER & TOOLS */}
      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          
          {/* Page Title */}
          <div className="flex items-center gap-3">
            <h1 className="font-sans text-2xl font-semibold text-black">
              {resolvedSearchParams.gender 
                ? `${resolvedSearchParams.gender.charAt(0).toUpperCase() + resolvedSearchParams.gender.slice(1)}'s Sneakers`
                : "All Sneakers"
              }
            </h1>
            <span className="text-xs text-neutral-600 font-medium bg-neutral-100 px-3 py-1.5 rounded-full">
              {products.length}
            </span>
          </div>

          {/* Client Wrapper */}
          <ShopClientWrapper 
             resolvedSearchParams={resolvedSearchParams}
             activeFilterCount={activeFilterCount}
             activeSort={activeSort}
             mobileFilters={FilterContent} 
          >
            {/* The Grid is rendered below as children */}
          </ShopClientWrapper>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-12">
          
          {/* 2. SIDEBAR FILTERS */}
          <aside className="hidden lg:block w-64 space-y-8 sticky top-32 h-fit">
            {FilterContent}
          </aside>

          {/* 3. PRODUCT GRID */}
          <div className="flex-1">
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-xl text-concrete">No sneakers found matching your filters.</p>
                <Link href="/shop" className="mt-4 inline-block text-electric-blue font-bold hover:underline">
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