"use client";

import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import Link from "next/link"; // Add this at the top

export default function CartDrawer() {
  const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={toggleCart}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-fade-in">
        
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
          <h2 className="font-oswald text-2xl font-bold uppercase">Your Bag ({getTotalItems()})</h2>
          <button onClick={toggleCart} className="p-2 hover:bg-neutral-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-400">
              <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
              <p>Your bag is empty.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-4">
                {/* Image */}
                <div className="w-20 h-20 bg-neutral-50 rounded-lg overflow-hidden flex-shrink-0 border border-neutral-100">
                  <img src={item.images?.[0] || item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm leading-tight">{item.name}</h3>
                    <p className="text-xs text-concrete mt-1">Size: {item.size} | {item.brand}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    {/* Qty Control */}
                    <div className="flex items-center bg-neutral-100 rounded-md">
                      <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} className="p-1 px-2 hover:bg-neutral-200"><Minus className="w-3 h-3" /></button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)} className="p-1 px-2 hover:bg-neutral-200"><Plus className="w-3 h-3" /></button>
                    </div>
                    
                    {/* Price & Delete */}
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm">${item.price * item.quantity}</span>
                      <button onClick={() => removeFromCart(item.id, item.size)} className="text-neutral-300 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-neutral-100 bg-neutral-50">
            <div className="flex justify-between mb-4 text-lg font-bold font-oswald">
              <span>TOTAL</span>
              <span>${getTotalPrice()}</span>
            </div>
            
            {/* WRAP THE BUTTON IN LINK */}
            <Link href="/checkout" onClick={toggleCart}>
              <button className="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-widest hover:bg-electric-blue transition-colors">
                Checkout
              </button>
            </Link>
            
          </div>
        )}
      </div>
    </div>
  );
}