"use client";

import { Plus } from "lucide-react";
import Link from "next/link";



export default function ProductCard({ product }) {
  return (
    <Link href={`/product/${product.id}`} className="group cursor-pointer block h-full">
      
      {/* 1. IMAGE AREA (Square 1:1 Ratio) */}
      <div className="relative aspect-square w-full bg-neutral-50 rounded-lg overflow-hidden mb-3">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
        />
        
        {/* Quick Add Button */}
        <button 
          onClick={(e) => {
            e.preventDefault(); // Prevent Link navigation
            e.stopPropagation();
            // TODO: Open size selector modal with product ID
            console.log("Open size selector for:", product.id);
          }}
          className="absolute bottom-3 right-3 bg-white text-black p-2.5 rounded-full shadow-lg translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-black hover:text-white z-10 active:scale-95"
          aria-label="Quick add to cart"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
        </button>

        {/* Sold Out Tag */}
        {product.soldOut && (
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-md">
            Sold Out
          </div>
        )}
      </div>

      {/* 2. TEXT AREA (Refined) */}
      <div className="space-y-1.5">
        {/* Brand - Small & Subtle */}
        <p className="text-neutral-500 text-xs font-medium uppercase tracking-wide">
          {product.brand}
        </p>
        
        {/* Product Name - Main Focus */}
        <h3 className="font-sans text-base font-semibold text-black leading-snug group-hover:text-electric-blue transition-colors line-clamp-2">
          {product.name}
        </h3>
        
        {/* Price - Bold & Clear */}
        <p className="font-sans text-base font-bold text-black mt-2">
          ${product.price}
        </p>
      </div>
    </Link>
  );
}