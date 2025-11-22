"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Heart, Minus, Plus, ChevronLeft, Truck, ShieldCheck } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function ProductView({ product }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(null);
  // Default to the first image, or the only image if array is empty
  const [mainImage, setMainImage] = useState(product.images?.[0] || product.image);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size first!"); 
      return;
    }
    // Pass the full product object plus the selected size/qty
    addToCart(product, selectedSize, quantity);
  };

  return (
    <div className="min-h-screen bg-white pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb */}
        <Link href="/" className="inline-flex items-center text-concrete hover:text-black mb-8 transition-colors text-sm font-bold uppercase tracking-wider group">
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Drops
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-4 lg:gap-6">
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide lg:w-20 flex-shrink-0">
              {product.images?.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`relative w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                    mainImage === img ? 'border-black opacity-100 ring-1 ring-black' : 'border-transparent opacity-60 hover:opacity-100 hover:border-neutral-200'
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="Thumbnail" />
                </button>
              ))}
            </div>
            
            {/* Main Image */}
            <div className="flex-1 relative group cursor-zoom-in">
               <div className="relative w-full aspect-[4/5] lg:aspect-auto h-full lg:h-[75vh] flex items-start justify-center">
                 <img 
                   src={mainImage} 
                   className="w-full h-full object-contain object-center lg:object-top group-hover:scale-105 transition-transform duration-700 ease-in-out" 
                   alt={product.name} 
                 />
               </div>
               <button className="absolute top-0 right-0 p-3 bg-white rounded-full shadow-lg hover:scale-110 transition text-neutral-400 hover:text-red-500 z-10">
                  <Heart className="w-6 h-6 fill-current" />
               </button>
            </div>
          </div>

          {/* RIGHT: Details */}
          <div className="lg:col-span-5 sticky top-24 h-fit flex flex-col pl-0 lg:pl-8">
            
            <div className="mb-6">
               <div className="flex items-center justify-between mb-2">
                 <span className="text-concrete font-bold tracking-widest uppercase text-xs">{product.brand}</span>
                 <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-bold text-black underline decoration-neutral-300 underline-offset-4">4.9 (128 Reviews)</span>
                 </div>
               </div>
               <h1 className="font-oswald text-4xl md:text-5xl font-bold uppercase leading-none mb-2">{product.name}</h1>
               <p className="text-xl text-concrete font-medium">{product.category}</p>
            </div>

            <div className="text-3xl font-bold mb-8 font-sans border-b border-neutral-100 pb-8">
              ${product.price}
            </div>

            {/* Size Selector (Handling DB Object Structure) */}
            <div className="mb-8">
              <div className="flex justify-between mb-4">
                <span className="font-bold text-sm uppercase tracking-wide">Select Size (US)</span>
                <button className="text-sm text-concrete underline hover:text-black">Size Guide</button>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {product.sizes?.map((sizeObj) => (
                  <button
                    key={sizeObj.size}
                    disabled={sizeObj.stock === 0}
                    onClick={() => setSelectedSize(sizeObj.size)}
                    className={`py-3 rounded border font-bold text-sm transition-all duration-200 ${
                      sizeObj.stock === 0 
                        ? 'bg-neutral-100 text-neutral-300 border-transparent cursor-not-allowed decoration-slice line-through' 
                        : selectedSize === sizeObj.size 
                          ? 'bg-black text-white border-black' 
                          : 'bg-white text-black border-neutral-200 hover:border-black'
                    }`}
                  >
                    {sizeObj.size}
                  </button>
                ))}
              </div>
              {!selectedSize && (
                <p className="text-red-500 text-xs mt-3 font-bold animate-pulse">
                  * Please select a size to continue
                </p>
              )}
            </div>

            <div className="space-y-4 mb-8">
               <div className="flex gap-4">
                 <div className="flex items-center bg-neutral-100 rounded-full px-4 gap-4 border border-neutral-200">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="hover:text-electric-blue"><Minus className="w-4 h-4" /></button>
                    <span className="font-bold w-4 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="hover:text-electric-blue"><Plus className="w-4 h-4" /></button>
                 </div>

                 <button 
                   disabled={!selectedSize}
                   onClick={handleAddToCart}
                   className={`flex-1 py-4 rounded-full font-bold text-lg uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 ${
                     selectedSize 
                      ? 'bg-black text-white hover:bg-electric-blue hover:scale-[1.02] active:scale-95' 
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                   }`}
                 >
                   {selectedSize ? 'Add To Bag' : 'Select Size'}
                 </button>
               </div>
               <p className="text-center text-xs text-concrete">Free shipping on orders over $200.</p>
            </div>

            {/* Static Trust Badges */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <Truck className="w-6 h-6 text-concrete" />
                <div className="text-xs">
                  <p className="font-bold text-black">Fast Delivery</p>
                  <p className="text-concrete">2-3 Business Days</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <ShieldCheck className="w-6 h-6 text-concrete" />
                <div className="text-xs">
                  <p className="font-bold text-black">Authenticity</p>
                  <p className="text-concrete">Verified by Buba</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-neutral-100">
              <h3 className="font-oswald text-lg font-bold mb-3 uppercase">About The Shoe</h3>
              <p className="text-concrete leading-relaxed text-sm">
                {product.description}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}