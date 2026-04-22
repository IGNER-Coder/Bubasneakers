"use client";

// ----------------------------------------------------------------------
// ✅ PRODUCTION READY PRODUCT CARD
// ----------------------------------------------------------------------
import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { formatPrice } = useCart(); // Get global helper

  // Check if a second image exists for the hover effect
  const hoverImage = product.images && product.images.length > 1 ? product.images[1] : null;

  return (
    <Link href={`/product/${product.id}`} className="group cursor-pointer flex flex-col h-full bg-white rounded-2xl p-2 transition-all hover:bg-neutral-50">
      <div className="relative aspect-[4/5] w-full bg-neutral-100/50 rounded-2xl overflow-hidden mb-3">
        
        {/* 1. MAIN IMAGE (Visible by default) */}
        <img 
          src={product.image} 
          alt={product.name}
          className={`w-full h-full object-cover object-center transition-all duration-700 ease-out p-4 ${
            hoverImage ? 'group-hover:opacity-0' : 'group-hover:scale-110'
          }`}
        />

        {/* 2. HOVER IMAGE (Hidden by default, fades in on hover) */}
        {hoverImage && (
          <img 
            src={hoverImage} 
            alt={product.name + " Alternate"}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out scale-105 p-4"
          />
        )}

        {/* Status Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
           {product.soldOut && (
             <div className="bg-black/80 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full shadow-sm">
               Sold Out
             </div>
           )}
           {product.isFeatured && !product.soldOut && (
             <div className="bg-white/90 backdrop-blur-md text-black text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full shadow-sm">
               New
             </div>
           )}
        </div>
      </div>

      <div className="flex flex-col flex-1 px-2 pb-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="flex items-center justify-between mb-1">
           <span className="text-neutral-400 text-[10px] font-semibold uppercase tracking-[0.2em]">
             {product.brand}
           </span>
        </div>
        
        <h3 className="font-oswald text-base font-medium text-black leading-snug uppercase group-hover:text-electric-blue transition-colors line-clamp-2">
          {product.name}
        </h3>
        
        <div className="mt-auto pt-3">
            <span className="font-sans text-sm font-medium text-concrete tracking-wide">
              {formatPrice(product.price)}
            </span>
        </div>
      </div>
    </Link>
  );
}