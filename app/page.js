import { ArrowRight } from "lucide-react";
import ProductCard from "../components/ProductCard"; // We use the card you just built

// --- MOCK DATA (This will be replaced by MongoDB later) ---
const DROPS = [
  {
    id: 1,
    brand: "Nike",
    name: "Air Jordan 1 'Lost & Found'",
    price: 180,
    image: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=1000&auto=format&fit=crop",
    soldOut: false,
  },
  {
    id: 2,
    brand: "Adidas",
    name: "Yeezy Boost 350 V2 'Bone'",
    price: 230,
    image: "https://images.unsplash.com/photo-1584735174965-48c48d7edfde?q=80&w=1000&auto=format&fit=crop",
    soldOut: false,
  },
  {
    id: 3,
    brand: "New Balance",
    name: "550 'White Grey'",
    price: 110,
    image: "https://images.unsplash.com/photo-1539185441755-54339cf0e193?q=80&w=1000&auto=format&fit=crop",
    soldOut: true,
  },
  {
    id: 4,
    brand: "Nike",
    name: "Dunk Low 'Panda'",
    price: 110,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop",
    soldOut: false,
  }
];

export default function Home() {
  return (
    <main className="animate-fade-in">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[85vh] w-full bg-black overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-70">
          <img 
            src="https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-[2s]"
            alt="Hero"
          />
        </div>
        
        {/* Text Overlay */}
        <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full max-w-4xl">
          <div className="overflow-hidden">
            <p className="text-electric-blue font-bold tracking-[0.2em] uppercase mb-4 animate-fade-in">
              New Collection 2025
            </p>
          </div>
          <h1 className="font-oswald text-6xl md:text-9xl font-bold text-white leading-[0.9] mb-8 italic">
            RUN THE <br/> STREETS.
          </h1>
          <button className="bg-white text-black px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-electric-blue hover:text-white transition-colors shadow-lg">
            Shop The Drop <ArrowRight className="w-5 h-5" />
          </button>
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

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {DROPS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="mt-12 text-center md:hidden">
           <button className="border border-black px-6 py-3 rounded-full font-bold uppercase text-sm">View All Drops</button>
        </div>
      </section>

      {/* 3. BRAND TICKER (Simple) */}
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