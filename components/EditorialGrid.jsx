"use client";

// ----------------------------------------------------------------------
// ⚠️ FOR VERCEL DEPLOYMENT:
// 1. Uncomment the line below:
import Link from "next/link"; 

import { ArrowUpRight } from "lucide-react"; 



export default function EditorialGrid() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-32">
      
      {/* Layout: Flex Scroll on Mobile, Grid on Desktop */}
      {/* 'snap-x' enables the slideshow feeling on mobile */}
      <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-8 h-[500px] md:h-[800px] overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        
        {/* 1. LARGE LIFESTYLE CARD (Left) */}
        <div className="min-w-[85vw] md:min-w-0 md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-sm bg-neutral-100 snap-center border border-neutral-100">
          <img 
            src="https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1200&auto=format&fit=crop" 
            alt="Courtside Culture"
            className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
          <div className="absolute bottom-8 left-8 z-10">
            <h3 className="font-oswald text-4xl md:text-5xl text-white italic uppercase mb-2 drop-shadow-md">
              Courtside Culture
            </h3>
            <Link href="/shop?gender=men" className="inline-flex items-center gap-2 text-white font-bold border-b border-white pb-1 hover:text-electric-blue hover:border-electric-blue transition-all">
              Shop Men's Collection <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 2. MEDIUM PRODUCT CARD (Top Right) */}
        <div className="min-w-[85vw] md:min-w-0 relative group bg-[#F5F5F5] rounded-sm overflow-hidden p-8 flex flex-col justify-between border border-neutral-100 snap-center">
          <div className="relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-concrete">The Return</span>
            <h3 className="font-oswald text-3xl text-black mt-1 leading-none">New Balance<br/>550</h3>
          </div>
          
          <img 
            src="new2.jpg" 
            alt="NB 550"
            className="absolute bottom-0 right-0 w-[120%] h-auto object-contain mix-blend-multiply translate-x-10 translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700 z-0"
          />

          <div className="relative z-10 mt-4">
            <Link href="/shop?brand=New Balance" className="px-6 py-2 border border-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors bg-white/50 backdrop-blur-sm md:bg-transparent">
              Shop Now
            </Link>
          </div>
        </div>

        {/* 3. SMALL CARD (Bottom Right) */}
        <div className="min-w-[85vw] md:min-w-0 relative group bg-black text-white rounded-sm overflow-hidden snap-center">
           <img 
            src="women 1.jpg" 
            alt="Running"
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 p-6 text-center z-10">
             <h3 className="font-oswald text-3xl text-white uppercase tracking-widest mb-4">Women's<br/>Exclusives</h3>
             <Link href="/shop?gender=women" className="px-8 py-3 border border-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                Browse
             </Link>
          </div>
        </div>

      </div>
    </section>
  );
}