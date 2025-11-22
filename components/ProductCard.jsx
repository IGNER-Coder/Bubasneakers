"use client";

import { Plus } from "lucide-react";
import Link from "next/link";

export default function ProductCard({ product }) {
  const slug = product.name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, ''); // Generate a slug from the product name

  return (
    <Link href={`/product/${slug}`} className="group cursor-pointer">
      {/* 1. IMAGE AREA (4:5 Aspect Ratio) */}
      <div className="relative aspect-[4/5] bg-neutral-100 rounded-xl overflow-hidden mb-4">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
        />
        
        {/* Quick Add Button (Appears on Hover) */}
        <button className="absolute bottom-4 right-4 bg-white text-black p-3 rounded-full shadow-xl translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-electric-blue hover:text-white">
          <Plus className="w-5 h-5" />
        </button>

        {/* Sold Out Tag (Conditional) */}
        {product.soldOut && (
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1 uppercase tracking-widest">
            Sold Out
          </div>
        )}
      </div>

      {/* 2. TEXT AREA */}
      <div className="space-y-1">
        <p className="text-concrete text-xs font-bold uppercase tracking-wider">
          {product.brand}
        </p>
        <h3 className="font-oswald text-lg font-medium text-black leading-tight group-hover:text-electric-blue transition-colors">
          {product.name}
        </h3>
        <p className="font-sans text-sm font-bold">
          ${product.price}
        </p>
      </div>
    </Link>
  );
}