"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";

// ----------------------------------------------------------------------
// ⚠️ FOR VERCEL DEPLOYMENT:
// 1. Uncomment the two lines below:
import Link from "next/link";
import { usePathname } from "next/navigation";
//
// 2. Delete the "MOCK COMPONENTS" section below.
// ----------------------------------------------------------------------

// --- MOCK COMPONENTS (Keep for Preview, Delete for Vercel) ---


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
            
            {/* 1. LOGO & BRAND */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-black rounded-tr-xl rounded-bl-xl flex items-center justify-center transform group-hover:rotate-3 transition-transform duration-300">
                <span className="font-oswald text-white font-bold text-xl italic">B</span>
              </div>
              <span className="font-oswald text-2xl font-bold tracking-tighter italic">
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
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-neutral-100 rounded-full transition">
                <Search className="w-5 h-5 text-black" />
              </button>
              
              {/* Cart Toggle Button */}
              <button onClick={toggleCart} className="relative p-2 hover:bg-neutral-100 rounded-full transition group">
                <ShoppingBag className="w-5 h-5 text-black group-hover:scale-110 transition-transform" />
                {count > 0 && (
                  <span className="absolute top-0 right-0 bg-electric-blue text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {count}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
              >
                {isMobileOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 4. MOBILE MENU */}
      {isMobileOpen && (
        <div className="md:hidden bg-white border-b border-neutral-100 absolute w-full z-40 animate-fade-in">
          <div className="px-4 pt-2 pb-6 space-y-2 font-oswald text-xl uppercase">
            <Link href="/shop?tag=new" className="block px-3 py-2 hover:bg-neutral-50 rounded-md">New Drops</Link>
            <Link href="/shop?gender=men" className="block px-3 py-2 hover:bg-neutral-50 rounded-md">Men</Link>
            <Link href="/shop?gender=women" className="block px-3 py-2 hover:bg-neutral-50 rounded-md">Women</Link>
            <Link href="/shop?tag=kids" className="block px-3 py-2 hover:bg-neutral-50 rounded-md">Kids</Link>
            <Link href="/shop?tag=sale" className="block px-3 py-2 text-electric-blue font-bold">Sale</Link>
          </div>
        </div>
      )}
    </>
  );
}