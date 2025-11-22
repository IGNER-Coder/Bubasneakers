"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import Link from "next/link"; 
import { usePathname } from "next/navigation"; 

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname(); 
  const { getTotalItems, toggleCart } = useCart(); 
  
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(getTotalItems());
  }, [getTotalItems]);

  // LOGIC: Hide on checkout
  if (pathname === "/checkout") return null;

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* 1. LOGO & BRAND (Resized for Mobile) */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-black rounded-tr-xl rounded-bl-xl flex items-center justify-center transform group-hover:rotate-3 transition-transform duration-300">
                <span className="font-oswald text-white font-bold text-lg md:text-xl italic">B</span>
              </div>
              <span className="font-oswald text-lg md:text-2xl font-bold tracking-tighter italic truncate">
                BUBA<span className="text-electric-blue">SNEAKERS.</span>
              </span>
            </Link>

            {/* 2. DESKTOP LINKS */}
            <div className="hidden md:flex space-x-8 text-sm font-bold text-concrete uppercase tracking-widest">
              <Link href="/shop?tag=new" className="hover:text-black transition-colors">Drops</Link>
              <Link href="/shop?gender=men" className="hover:text-black transition-colors">Men</Link>
              <Link href="/shop?gender=women" className="hover:text-black transition-colors">Women</Link>
              <Link href="/shop?tag=kids" className="hover:text-black transition-colors">Kids</Link>
              <Link href="/shop?tag=sale" className="text-electric-blue hover:text-blue-700 transition-colors">Sale</Link>
            </div>

            {/* 3. ICONS */}
            <div className="flex items-center gap-3 md:gap-4">
              <button className="p-2 hover:bg-neutral-100 rounded-full transition">
                <Search className="w-5 h-5 text-black" />
              </button>
              
              <button onClick={toggleCart} className="relative p-2 hover:bg-neutral-100 rounded-full transition group">
                <ShoppingBag className="w-5 h-5 text-black group-hover:scale-110 transition-transform" />
                {count > 0 && (
                  <span className="absolute top-0 right-0 bg-electric-blue text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {count}
                  </span>
                )}
              </button>

              <button 
                className="md:hidden p-2"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
              >
                {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 4. MOBILE MENU (Fixed Position Fix) */}
      {isMobileOpen && (
        <div className="fixed inset-0 top-20 z-40 bg-white/95 backdrop-blur-xl border-t border-neutral-100 animate-fade-in overflow-y-auto">
          <div className="px-6 py-8 space-y-6 font-oswald text-2xl uppercase tracking-wide">
            <Link href="/shop?tag=new" onClick={() => setIsMobileOpen(false)} className="block hover:text-electric-blue transition-colors">New Drops</Link>
            <Link href="/shop?gender=men" onClick={() => setIsMobileOpen(false)} className="block hover:text-electric-blue transition-colors">Men</Link>
            <Link href="/shop?gender=women" onClick={() => setIsMobileOpen(false)} className="block hover:text-electric-blue transition-colors">Women</Link>
            <Link href="/shop?tag=kids" onClick={() => setIsMobileOpen(false)} className="block hover:text-electric-blue transition-colors">Kids</Link>
            <Link href="/shop?tag=sale" onClick={() => setIsMobileOpen(false)} className="block text-electric-blue font-bold">Sale</Link>
          </div>
        </div>
      )}
    </>
  );
}