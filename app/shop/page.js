import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import ProductCard from "../../components/ProductCard";
import ShopClientWrapper from "../../components/ShopClientWrapper";
import connectToDatabase from "../../lib/db";
import Product from "../../models/Product";
import Link from "next/link";

async function getProducts(resolvedSearchParams) {
  await connectToDatabase();

  const filter = {};
  const sort = {};

  if (resolvedSearchParams.brand && resolvedSearchParams.brand !== "All") {
    filter.brand = { $regex: new RegExp(`^${resolvedSearchParams.brand}$`, "i") };
  }
  
  if (resolvedSearchParams.gender && resolvedSearchParams.gender !== "all") {
    filter.gender = { $regex: new RegExp(resolvedSearchParams.gender, "i") };
  }
  
  if (resolvedSearchParams.tag && resolvedSearchParams.tag !== "all") {
    if (resolvedSearchParams.tag === "new") {
      filter.isFeatured = true;
    } else {
      filter.category = { $regex: new RegExp(resolvedSearchParams.tag, "i") };
    }
  }

  if (resolvedSearchParams.priceRange) {
    const priceMap = {
      "under-3k": { $lt: 3000 },
      "3k-6k": { $gte: 3000, $lte: 6000 },
      "6k-10k": { $gte: 6000, $lte: 10000 },
      "over-10k": { $gt: 10000 }
    };
    if (priceMap[resolvedSearchParams.priceRange]) {
      filter.price = priceMap[resolvedSearchParams.priceRange];
    }
  }

  if (resolvedSearchParams.onSale === 'true') {
    filter.price = { $lt: 4000 }; 
  }

  if (resolvedSearchParams.sort === "price-asc") {
    sort.price = 1; 
  } else if (resolvedSearchParams.sort === "price-desc") {
    sort.price = -1; 
  } else {
    sort.createdAt = -1; 
  }

  const products = await Product.find(filter).sort(sort).lean();

  return products.map(p => ({
    ...p,
    id: p._id.toString(),
    _id: p._id.toString(),
    image: p.images && p.images.length > 0 ? p.images[0] : '',
    images: p.images || [],
    sizes: p.sizes ? p.sizes.map(s => ({
      size: s.size,
      stock: s.stock,
      _id: s._id ? s._id.toString() : undefined
    })) : [],
    soldOut: p.sizes && p.sizes.length > 0 ? p.sizes.reduce((sum, s) => sum + s.stock, 0) === 0 : true
  }));
}

export default async function ShopPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const products = await getProducts(resolvedSearchParams);
  
  // Create an explicit case-insensitive brand resolution
  const activeBrand = resolvedSearchParams.brand 
    ? ["Nike", "Jordan", "Adidas", "New Balance", "Yeezy", "Puma", "Reebok"].find(b => b.toLowerCase() === resolvedSearchParams.brand.toLowerCase()) || resolvedSearchParams.brand
    : "All";
    
  const activeSort = resolvedSearchParams.sort || "newest";

  const activeFilterCount = [
    resolvedSearchParams.brand && resolvedSearchParams.brand !== "All",
    resolvedSearchParams.gender && resolvedSearchParams.gender !== "all",
    resolvedSearchParams.tag && resolvedSearchParams.tag !== "all",
    resolvedSearchParams.priceRange && resolvedSearchParams.priceRange !== "all",
    resolvedSearchParams.onSale === 'true'
  ].filter(Boolean).length;

  // --- REUSABLE FILTER UI ---
  const FilterContent = (
    <div className="space-y-6">
      {/* Brand Filter */}
      <details className="group" open>
        <summary className="flex justify-between items-center font-oswald text-base uppercase tracking-widest font-bold text-black cursor-pointer list-none mb-4 outline-none">
          Brands
          <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
        </summary>
        <div className="space-y-3 pl-1 animate-fade-in">
          {["All", "Nike", "Adidas", "New Balance", "Puma", "Reebok", "Jordan", "Yeezy"].map(brand => {
            const isActive = activeBrand === brand;
            const query = { ...resolvedSearchParams, brand: brand === "All" ? undefined : brand.toLowerCase() };
            
            return (
              <Link key={brand} href={{ query }} className="flex items-center gap-3 cursor-pointer group/item transition-all">
                <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${isActive ? 'bg-black border-black shadow-[0_0_0_2px_rgba(0,0,0,0.1)]' : 'border-neutral-300 group-hover/item:border-neutral-500'}`}>
                  {isActive && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm transition-colors ${isActive ? 'font-bold text-black' : 'text-neutral-600 group-hover/item:text-black font-medium'}`}>
                  {brand}
                </span>
              </Link>
            );
          })}
        </div>
      </details>
      
      <div className="h-px w-full bg-neutral-100" />

      {/* Category Filter */}
      <details className="group" open>
        <summary className="flex justify-between items-center font-oswald text-base uppercase tracking-widest font-bold text-black cursor-pointer list-none mb-4 outline-none">
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
                  {isActive && <div className="w-2.5 h-2.5 bg-black rounded-full shadow-sm" />}
                </div>
                <span className={`text-sm transition-colors ${isActive ? 'font-bold text-black' : 'text-neutral-600 group-hover/item:text-black font-medium'}`}>
                  {cat}
                </span>
              </Link>
            );
          })}
        </div>
      </details>

      <div className="h-px w-full bg-neutral-100" />

      {/* Gender Filter */}
      <details className="group" open>
        <summary className="flex justify-between items-center font-oswald text-base uppercase tracking-widest font-bold text-black cursor-pointer list-none mb-4 outline-none">
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
                  {isActive && <div className="w-2.5 h-2.5 bg-black rounded-full shadow-sm" />}
                </div>
                <span className={`text-sm transition-colors ${isActive ? 'font-bold text-black' : 'text-neutral-600 group-hover/item:text-black font-medium'}`}>
                  {option.label}
                </span>
              </Link>
            );
          })}
        </div>
      </details>

      <div className="h-px w-full bg-neutral-100" />

      {/* Price Range Filter */}
      <details className="group">
        <summary className="flex justify-between items-center font-oswald text-base uppercase tracking-widest font-bold text-black cursor-pointer list-none mb-4 outline-none">
          Price
          <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
        </summary>
        <div className="space-y-3 pl-1 animate-fade-in">
          {[
            { value: "all", label: "All Prices" },
            { value: "under-3k", label: "Under Ksh 3,000" },
            { value: "3k-6k", label: "Ksh 3,000 - 6,000" },
            { value: "6k-10k", label: "Ksh 6,000 - 10,000" },
            { value: "over-10k", label: "Over Ksh 10,000" }
          ].map(option => {
            const isActive = resolvedSearchParams.priceRange === option.value || (!resolvedSearchParams.priceRange && option.value === "all");
            const query = { ...resolvedSearchParams, priceRange: option.value === "all" ? undefined : option.value };
            
            return (
              <Link key={option.value} href={{ query }} className="flex items-center gap-3 cursor-pointer group/item transition-all">
                <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all ${isActive ? 'border-black' : 'border-neutral-300 group-hover/item:border-neutral-500'}`}>
                  {isActive && <div className="w-2.5 h-2.5 bg-black rounded-full shadow-sm" />}
                </div>
                <span className={`text-sm transition-colors ${isActive ? 'font-bold text-black' : 'text-neutral-600 group-hover/item:text-black font-medium'}`}>
                  {option.label}
                </span>
              </Link>
            );
          })}
        </div>
      </details>

      <div className="h-px w-full bg-neutral-100" />

      {/* On Sale Toggle */}
      <div className="pt-2">
        <Link 
          href={{ query: { ...resolvedSearchParams, onSale: resolvedSearchParams.onSale ? undefined : 'true' } }}
          className="flex items-center justify-between cursor-pointer group py-2"
        >
          <span className="font-oswald text-base uppercase tracking-widest font-bold text-neutral-800 group-hover:text-black transition-colors">
            On Sale Only
          </span>
          <div className={`w-11 h-6 rounded-full transition-all relative ${resolvedSearchParams.onSale ? 'bg-black shadow-[0_0_10px_rgba(0,0,0,0.3)]' : 'bg-neutral-300'}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform ${resolvedSearchParams.onSale ? 'translate-x-6' : 'translate-x-1'}`} />
          </div>
        </Link>
      </div>

      {/* Clear Filters Button */}
      {activeFilterCount > 0 && (
        <Link href="/shop" className="flex items-center justify-center gap-2 w-full py-4 px-4 bg-white border-2 border-neutral-200 rounded-xl text-xs font-bold uppercase tracking-widest text-neutral-600 hover:border-black hover:text-black transition-all mt-6 active:scale-95">
          <X className="w-4 h-4" /> Clear All Filters
        </Link>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* 1. HEADER & TOOLS (REDESIGNED) */}
      <div className="bg-transparent border-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
             
             {/* Item Count */}
             <div className="flex items-center shrink-0">
               <span className="text-xs font-bold font-sans bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full">
                 {products.length} Sneakers
               </span>
             </div>

             {/* Action Buttons (Filter & Sort) */}
             <div className="w-full lg:w-auto">
                <ShopClientWrapper 
                   resolvedSearchParams={resolvedSearchParams}
                   activeFilterCount={activeFilterCount}
                   activeSort={activeSort}
                   mobileFilters={FilterContent} 
                />
             </div>

          </div>
          


        </div>
      </div>

      {/* Grid Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-12">
          
          {/* 2. SIDEBAR FILTERS (DESKTOP) */}
          <aside className="hidden lg:block w-64 space-y-8 sticky top-56 h-[calc(100vh-14rem)] overflow-y-auto scrollbar-hide shrink-0 pb-10">
            {FilterContent}
          </aside>

          {/* 3. PRODUCT GRID */}
          <div className="flex-1">
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-12">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
                   <SlidersHorizontal className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="font-oswald text-2xl uppercase tracking-wider font-bold mb-2">No Matches Found</h3>
                <p className="text-base text-concrete mb-8 max-w-md">We couldn't find any sneakers matching your current filter selections.</p>
                <Link href="/shop" className="bg-black text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-neutral-800 transition shadow-lg shadow-black/10 active:scale-95">
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