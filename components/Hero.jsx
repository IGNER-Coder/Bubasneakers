"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden">
      {/* 1. BACKGROUND IMAGE (EDITORIAL COVER SHOT) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          // Ensure 'jia-ye-erHlzWCN6zQ-unsplash.jpg' is in your /public folder
          backgroundImage: "url('/Hero img.png')" 
        }}
      >
        {/* Editorial Overlay - for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>
      
      {/* 2. MAIN CONTENT CONTAINER */}
      <div className="relative z-10 h-full w-full max-w-[1400px] mx-auto px-6 flex flex-col justify-end pb-16 md:pb-24">
        <div className="animate-fade-in">
          {/* Eyebrow */}
          <span className="text-electric-blue text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-4 block">
            Winter '25 Feature
          </span>

          {/* HERO TITLE (Massive Editorial Type) */}
          <h1 className="font-oswald text-6xl md:text-[120px] leading-[0.9] font-bold italic text-white mb-6 drop-shadow-lg max-w-4xl">
            JORDAN 4 <span className="text-neutral-200">RETRO</span>
          </h1>

          {/* DETAILS & CTA */}
          <div className="flex flex-col items-start gap-6">
            <div className="space-y-2">
              <h3 className="text-xl md:text-3xl font-serif italic text-white drop-shadow-md">
                Military Blue — A Legacy Restored
              </h3>
              <p className="text-lg font-bold text-white">$225.00</p>
            </div>

            <Link href="/shop?tag=new">
              <button className="bg-white text-black px-8 py-4 rounded-full font-medium text-sm uppercase tracking-widest hover:bg-electric-blue hover:text-white transition-all flex items-center gap-3 shadow-xl">
                Explore The Story <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}