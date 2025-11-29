"use client";

import { Plus } from "lucide-react";

// ----------------------------------------------------------------------
// ⚠️ FOR VERCEL DEPLOYMENT:
// 1. UNCOMMENT the real imports below:
import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { formatPrice } = useCart(); // Get global helper

  // Check if a second image exists for the hover effect
  const hoverImage = product.images && product.images.length > 1 ? product.images[1] : null;

  return (
    <Link href={`/product/${product.id}`} className="group cursor-pointer block h-full">
      
      <div className="relative aspect-square w-full bg-neutral-50 rounded-lg overflow-hidden mb-3">
        
        {/* 1. MAIN IMAGE (Visible by default) */}
        {/* If there is a hover image, we fade this one out on hover. If not, we just zoom it. */}
        <img 
          src={product.image} 
          alt={product.name}
          className={`w-full h-full object-cover object-center transition-all duration-500 ease-out ${
            hoverImage ? 'group-hover:opacity-0' : 'group-hover:scale-[1.03]'
          }`}
        />

        {/* 2. HOVER IMAGE (Hidden by default, fades in on hover) */}
        {hoverImage && (
          <img 
            src={hoverImage} 
            alt={product.name + " Alternate"}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out scale-[1.03]"
          />
        )}
        
        {/* Quick Add Button */}
        <button 
          onClick={(e) => {
            e.preventDefault(); 
            e.stopPropagation();
            console.log("Quick add logic here");
          }}
          className="absolute bottom-3 right-3 bg-white text-black p-2.5 rounded-full shadow-lg translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-black hover:text-white z-10 active:scale-95"
          aria-label="Quick add to cart"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
        </button>

        {product.soldOut && (
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-md z-10">
            Sold Out
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <p className="text-neutral-500 text-xs font-medium uppercase tracking-wide">
          {product.brand}
        </p>
        
        <h3 className="font-sans text-base font-semibold text-black leading-snug group-hover:text-electric-blue transition-colors line-clamp-2">
          {product.name}
        </h3>
        
        {/* DYNAMIC PRICE */}
        <p className="font-sans text-base font-bold text-black mt-2">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}