import Link from "next/link";
import { Instagram, Twitter, Facebook } from "lucide-react";



export default function Footer() {
  return (
    <footer className="bg-white text-black border-t border-neutral-100 pt-12 md:pt-20 pb-10">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* GRID LAYOUT: 2 Columns on Mobile, 4 Columns on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-8 mb-12 md:mb-20">
          
          {/* 1. BRAND (Full width on mobile) */}
          <div className="col-span-2 md:col-span-1">
            <h2 className="font-oswald text-2xl font-bold italic tracking-tighter mb-4 md:mb-6">BUBASNEAKERS.</h2>
            <p className="text-concrete text-sm leading-relaxed max-w-xs">
              Curated streetwear and authentic footwear for the modern collector. Based in Nairobi, shipping worldwide.
            </p>
          </div>

          {/* 2. LINKS 1 (Left column on mobile) */}
          <div className="col-span-1">
            <h4 className="font-bold text-xs uppercase tracking-widest mb-4 md:mb-6">Shop</h4>
            <ul className="space-y-3 md:space-y-4 text-sm text-concrete">
              <li><Link href="/shop?tag=new" className="hover:text-black transition-colors">New Arrivals</Link></li>
              <li><Link href="/shop?gender=men" className="hover:text-black transition-colors">Men</Link></li>
              <li><Link href="/shop?gender=women" className="hover:text-black transition-colors">Women</Link></li>
              <li><Link href="/shop?tag=sale" className="hover:text-black transition-colors">Sale Archive</Link></li>
            </ul>
          </div>

          {/* 3. LINKS 2 (Right column on mobile) */}
          <div className="col-span-1">
            <h4 className="font-bold text-xs uppercase tracking-widest mb-4 md:mb-6">Support</h4>
            <ul className="space-y-3 md:space-y-4 text-sm text-concrete">
              <li><Link href="/account" className="hover:text-black transition-colors">My Account</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Shipping</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Returns</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* 4. SOCIAL (Full width on mobile) */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-bold text-xs uppercase tracking-widest mb-4 md:mb-6">Connect</h4>
            <div className="flex gap-4">
              <Link href="#" className="p-2 border border-neutral-200 rounded-full hover:bg-black hover:text-white transition-all"><Instagram className="w-4 h-4" /></Link>
              <Link href="#" className="p-2 border border-neutral-200 rounded-full hover:bg-black hover:text-white transition-all"><Twitter className="w-4 h-4" /></Link>
              <Link href="#" className="p-2 border border-neutral-200 rounded-full hover:bg-black hover:text-white transition-all"><Facebook className="w-4 h-4" /></Link>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-neutral-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-[10px] text-concrete uppercase tracking-widest">
            © 2025 BubaSneakers Inc.
          </p>
          <div className="flex gap-6 text-[10px] text-concrete uppercase tracking-widest">
            <Link href="#" className="hover:text-black">Privacy</Link>
            <Link href="#" className="hover:text-black">Terms</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}