"use client";

import { ArrowRight } from "lucide-react";

// ----------------------------------------------------------------------
// ⚠️ FOR VERCEL DEPLOYMENT:
// 1. Uncomment the real imports below:
// import Link from "next/link"; 
// import Image from "next/image";
//
// 2. DELETE the "PREVIEW MOCKS" section below.
// ----------------------------------------------------------------------

// --- PREVIEW MOCKS (DELETE FOR VERCEL) ---
const Link = ({ href, children, className, ...props }) => (
  <a href={href} className={className} {...props}>{children}</a>
);
const Image = ({ src, alt, className, fill, style }) => (
  <img 
    src={src} 
    alt={alt} 
    className={className}
    style={{ ...style, position: fill ? 'absolute' : 'static', height: '100%', width: '100%', inset: 0, objectFit: 'cover' }} 
  />
);
// ----------------------------------------

export default function Hero() {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden bg-zinc-900">
      
      {/* 1. BACKGROUND IMAGE (EDITORIAL COVER SHOT) */}
      <div className="absolute inset-0">
        <Image
          src="https://res.cloudinary.com/doevklqj6/image/upload/v1764408817/Hero_Img_rcsgb9.png"
          alt="Jordan 4 Retro Military Blue sneaker editorial shot"
          fill
          priority
          className="object-cover object-center opacity-90 hover:scale-105 transition-transform duration-[15s] ease-out"
          quality={90}
        />
        
        {/* Gradient Overlay for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay" />
      </div>
      
      {/* 2. MAIN CONTENT */}
      <div className="relative z-10 h-full w-full max-w-[1400px] mx-auto px-6 flex flex-col justify-end pb-20 md:pb-32">
        <div className="space-y-8 max-w-5xl">
          
          {/* Eyebrow */}
          <span 
            className="text-electric-blue text-xs md:text-sm font-bold uppercase tracking-[0.2em] block opacity-0 animate-slide-up-fade"
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            Winter '25 Feature
          </span>

          {/* TITLE */}
          <h1 
            className="font-oswald text-[3.5rem] md:text-[8vw] leading-[0.9] font-bold italic text-white drop-shadow-2xl opacity-0 animate-slide-up-fade"
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            JORDAN 4 <span className="text-neutral-400">RETRO</span>
          </h1>

          {/* DETAILS & CTA */}
          <div 
            className="flex flex-col items-start gap-8 opacity-0 animate-slide-up-fade"
            style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
          >
            <h3 className="text-xl md:text-3xl font-serif italic text-white/90 drop-shadow-md max-w-xl">
              Military Blue — A Legacy Restored.
            </h3>

            <Link href="/shop?tag=new">
              <button 
                className="bg-white text-black px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-electric-blue hover:text-white transition-all duration-300 ease-out flex items-center gap-3 shadow-2xl hover:shadow-electric-blue/50 active:scale-95 group"
                aria-label="Explore the Jordan 4 Retro collection"
              >
                Explore The Story <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
          </div>

        </div>
      </div>

      {/* 3. SCROLL INDICATOR */}
      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 opacity-0 animate-fade-in"
        style={{ animationDelay: '1200ms', animationFillMode: 'forwards' }}
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white to-transparent opacity-50" />
      </div>

    </section>
  );
}