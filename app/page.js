import { ArrowRight } from "lucide-react";
import ProductCard from "../components/ProductCard";
import connectToDatabase from "../lib/db";
import Product from "../models/Product";

// --- FETCH DATA ---
async function getProducts() {
  try {
    await connectToDatabase();
    // Fetch 4 featured products
    const products = await Product.find({ isFeatured: true }).limit(4).lean();
    
    return products.map(p => ({
      id: p._id.toString(),
      name: p.name,
      brand: p.brand,
      price: p.price,
      image: p.images && p.images.length > 0 ? p.images[0] : '', // Safety check
      soldOut: false
    }));
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="animate-fade-in">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[85vh] w-full bg-black overflow-hidden">
        <div className="absolute inset-0 opacity-70">
          <img 
            src="https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-[2s]"
            alt="Hero"
          />
        </div>
        
        {/* Content: Centered on Mobile, Left on Desktop */}
        <div className="absolute inset-0 p-8 md:p-16 w-full flex flex-col justify-center items-center text-center md:justify-end md:items-start md:text-left">
          <div className="max-w-4xl">
            <p className="text-electric-blue font-bold tracking-[0.2em] uppercase mb-4 animate-fade-in">
              New Collection 2025
            </p>
            <h1 className="font-oswald text-6xl md:text-9xl font-bold text-white leading-[0.9] mb-8 italic">
              RUN THE <br/> STREETS.
            </h1>
            <button className="bg-white text-black px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-electric-blue hover:text-white transition-colors shadow-lg mx-auto md:mx-0">
              Shop The Drop <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. THE LATEST DROPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-oswald text-4xl md:text-5xl font-bold uppercase mb-2">Just Dropped</h2>
            <p className="text-concrete">The latest heat, verified authentic.</p>
          </div>
          <a href="/shop" className="hidden md:block font-bold border-b-2 border-black pb-1 hover:text-electric-blue hover:border-electric-blue transition">
            View All
          </a>
        </div>

        {/* GRID FIX: Ensure consistent gap and column sizing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-concrete col-span-4 text-center py-10">Loading Drops from Cloud...</p>
          )}
        </div>
        
        <div className="mt-12 text-center md:hidden">
           <button className="border border-black px-6 py-3 rounded-full font-bold uppercase text-sm">View All Drops</button>
        </div>
      </section>

      {/* 3. BRAND TICKER */}
      <section className="border-t border-b border-neutral-100 py-12 mb-20">
         <div className="max-w-7xl mx-auto px-4 flex justify-between items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-500 overflow-x-auto gap-12 scrollbar-hide">
            <span className="text-2xl font-oswald font-bold shrink-0">NIKE</span>
            <span className="text-2xl font-oswald font-bold shrink-0">ADIDAS</span>
            <span className="text-2xl font-oswald font-bold shrink-0">NEW BALANCE</span>
            <span className="text-2xl font-oswald font-bold shrink-0">YEEZY</span>
            <span className="text-2xl font-oswald font-bold shrink-0">JORDAN</span>
         </div>
      </section>

    </main>
  );
}