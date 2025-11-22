"use client";

import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

// ----------------------------------------------------------------------
// ⚠️ FOR VERCEL DEPLOYMENT:
// 1. Uncomment the line below:
// import Link from "next/link";
// 2. Delete the "MOCK LINK" section below.
// ----------------------------------------------------------------------

// --- MOCK LINK (Keep for Preview, Delete for Vercel) ---
const Link = ({ href, children, className, ...props }) => (
  <a href={href} className={className} {...props}>{children}</a>
);
// -------------------------------------------------------

export default function CartDrawer() {
  const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={toggleCart}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in">
        
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-neutral-100 flex justify-between items-center bg-white z-10">
          <h2 className="font-oswald text-2xl font-bold uppercase">Your Bag ({getTotalItems()})</h2>
          <button onClick={toggleCart} className="p-2 hover:bg-neutral-100 rounded-full active:scale-90 transition-transform">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-400 gap-4">
              <div className="p-4 bg-neutral-50 rounded-full">
                <ShoppingBag className="w-8 h-8 opacity-30" />
              </div>
              <p className="font-medium">Your bag is empty.</p>
              <button onClick={toggleCart} className="text-black underline text-sm font-bold">Start Shopping</button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-4 group">
                {/* Image */}
                <div className="w-24 h-24 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-neutral-100 p-2">
                  <img 
                    src={item.images?.[0] || item.image} 
                    alt={item.name} 
                    className="w-full h-full object-contain mix-blend-multiply" 
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-sm leading-tight line-clamp-2 pr-4">{item.name}</h3>
                      <p className="font-bold text-sm">${item.price * item.quantity}</p>
                    </div>
                    <p className="text-xs text-concrete mt-1 font-medium">Size: {item.size}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    {/* Mobile-Friendly Qty Control */}
                    <div className="flex items-center bg-neutral-100 rounded-lg border border-neutral-200 h-9">
                      <button 
                        onClick={() => updateQuantity(item.id, item.size, -1)} 
                        className="h-full px-3 hover:bg-neutral-200 active:bg-neutral-300 transition-colors rounded-l-lg flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.size, 1)} 
                        className="h-full px-3 hover:bg-neutral-200 active:bg-neutral-300 transition-colors rounded-r-lg flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    
                    {/* Delete Button */}
                    <button 
                      onClick={() => removeFromCart(item.id, item.size)} 
                      className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-neutral-100 bg-neutral-50 pb-8 md:pb-6">
            <div className="flex justify-between mb-4 text-lg font-bold font-oswald items-end">
              <span className="text-base font-sans text-concrete font-normal uppercase tracking-wider">Subtotal</span>
              <span className="text-2xl">${getTotalPrice()}</span>
            </div>
            <Link href="/checkout" onClick={toggleCart}>
              <button className="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-widest hover:bg-electric-blue active:scale-[0.98] transition-all shadow-lg">
                Checkout Now
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}