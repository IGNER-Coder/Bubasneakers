"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import ProductCard from "../../components/ProductCard";

// --- EXTENDED MOCK DATA ---
const ALL_PRODUCTS = [
  { id: 1, brand: "Nike", name: "Air Jordan 1 'Lost & Found'", price: 180, gender: "men", category: "lifestyle", image: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=1000" },
  { id: 2, brand: "Adidas", name: "Yeezy Boost 350 V2 'Bone'", price: 230, gender: "men", category: "lifestyle", image: "https://images.unsplash.com/photo-1584735174965-48c48d7edfde?q=80&w=1000" },
  { id: 3, brand: "New Balance", name: "550 'White Grey'", price: 110, gender: "women", category: "lifestyle", image: "https://images.unsplash.com/photo-1539185441755-54339cf0e193?q=80&w=1000" },
  { id: 4, brand: "Nike", name: "Dunk Low 'Panda'", price: 110, gender: "men", category: "skate", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000" },
  { id: 5, brand: "Nike", name: "Air Max 90", price: 130, gender: "women", category: "running", image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000" },
  { id: 6, brand: "Adidas", name: "Samba OG", price: 100, gender: "men", category: "lifestyle", image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000" },
  { id: 7, brand: "Vans", name: "Old Skool", price: 75, gender: "kids", category: "skate", image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1000" },
  { id: 8, brand: "New Balance", name: "9060 'Rain Cloud'", price: 150, gender: "men", category: "lifestyle", image: "https://images.unsplash.com/photo-1623609163859-ca93c959b98a?q=80&w=1000" },
];

export default function ShopPage({ searchParams }) {
  // Filters State
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeBrand, setActiveBrand] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest"); // 'newest', 'price-asc', 'price-desc'

  // --- FILTER LOGIC ---
  const filteredProducts = useMemo(() => {
    let result = [...ALL_PRODUCTS];

    // 1. Filter by Brand
    if (activeBrand !== "All") {
      result = result.filter(p => p.brand === activeBrand);
    }

    // 2. Filter by Category
    if (activeCategory !== "All") {
      result = result.filter(p => p.category === activeCategory);
    }

    // 3. Sort
    if (sortOrder === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [activeBrand, activeCategory, sortOrder]);

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* 1. HEADER & TOOLS */}
      <div className="sticky top-20 z-30 bg-white/90 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          
          <div className="flex items-center gap-4">
            <h1 className="font-oswald text-xl font-bold uppercase">Shop All</h1>
            <span className="text-xs text-concrete font-bold bg-neutral-100 px-2 py-1 rounded-full">
              {filteredProducts.length} Items
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="relative group hidden md:block">
              <button className="flex items-center gap-2 text-sm font-bold hover:text-electric-blue">
                Sort By <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-neutral-100 shadow-xl rounded-lg p-2 hidden group-hover:block">
                <button onClick={() => setSortOrder("newest")} className="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 rounded-md">Newest</button>
                <button onClick={() => setSortOrder("price-asc")} className="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 rounded-md">Price: Low-High</button>
                <button onClick={() => setSortOrder("price-desc")} className="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 rounded-md">Price: High-Low</button>
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <button 
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden p-2 hover:bg-neutral-100 rounded-full"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
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
                {["All", "Nike", "Adidas", "New Balance", "Vans"].map(brand => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 border rounded-sm flex items-center justify-center ${activeBrand === brand ? 'bg-black border-black' : 'border-neutral-300'}`}>
                      {activeBrand === brand && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <input 
                      type="radio" 
                      name="brand" 
                      className="hidden" 
                      onChange={() => setActiveBrand(brand)}
                    />
                    <span className={`text-sm ${activeBrand === brand ? 'font-bold' : 'text-concrete group-hover:text-black'}`}>
                      {brand}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wider">Category</h3>
              <div className="space-y-2">
                {["All", "Lifestyle", "Running", "Skate", "Basketball"].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat.toLowerCase())}
                    className={`block text-sm text-left w-full py-1 hover:text-electric-blue transition-colors ${activeCategory === cat.toLowerCase() ? 'font-bold text-black underline' : 'text-concrete'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* 3. PRODUCT GRID */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-xl text-concrete">No sneakers found.</p>
                <button 
                  onClick={() => {setActiveBrand("All"); setActiveCategory("All");}}
                  className="mt-4 text-electric-blue font-bold hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 4. MOBILE FILTER DRAWER */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative w-3/4 bg-white h-full shadow-2xl p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-oswald text-xl font-bold">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)}><X /></button>
            </div>
            
            {/* Mobile Brand Options */}
            <div className="mb-8">
              <h3 className="font-bold mb-4">Brand</h3>
              <div className="flex flex-wrap gap-2">
                {["All", "Nike", "Adidas", "New Balance"].map(brand => (
                  <button
                    key={brand}
                    onClick={() => setActiveBrand(brand)}
                    className={`px-4 py-2 rounded-full text-sm border ${activeBrand === brand ? 'bg-black text-white border-black' : 'border-neutral-200'}`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full bg-black text-white py-4 rounded-full font-bold uppercase"
            >
              View {filteredProducts.length} Items
            </button>
          </div>
        </div>
      )}

    </div>
  );
}