"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, ShoppingCart, MessageCircle } from "lucide-react";
import { useCart } from "../context/CartContext";

const WHATSAPP_NUMBER = "254797533977";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi BubaSneakers! I'd like to browse your collection."
)}`;

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cart, toggleCart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Hide on checkout and admin pages
  if (pathname.startsWith("/checkout") || pathname.startsWith("/admin")) return null;

  const NavButton = ({ isActive, icon: Icon, label, onClick, badge }) => (
     <button
        onClick={onClick}
        className={`relative flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors ${
          isActive ? "text-black" : "text-concrete hover:text-black"
        }`}
        aria-label={label}
      >
        <div className="relative">
          <Icon className={`w-6 h-6 ${isActive ? "stroke-2" : "stroke-[1.5]"}`} />
          {badge > 0 && (
             <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {badge > 9 ? "9+" : badge}
             </span>
          )}
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? "text-black" : "text-concrete"}`}>
          {label}
        </span>
      </button>
  );

  const NavLinkItem = ({ href, icon: Icon, label }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`relative flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors ${
          isActive ? "text-black" : "text-concrete hover:text-black"
        }`}
        aria-label={label}
      >
        <Icon className={`w-6 h-6 ${isActive ? "stroke-2" : "stroke-[1.5]"}`} />
        <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? "text-black" : "text-concrete"}`}>
          {label}
        </span>
      </Link>
    );
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-neutral-100 pb-safe">
      <div className="flex items-center justify-around h-[72px] px-2">
        
        <NavLinkItem href="/" icon={Home} label="Home" />
        <NavLinkItem href="/shop" icon={ShoppingBag} label="Shop" />
        
        <NavButton 
           onClick={toggleCart}
           icon={ShoppingCart}
           label="Cart"
           badge={cartCount}
           isActive={false} // Cart button just opens drawer, it's not a 'current page' state usually.
        />

        {/* WhatsApp Order Action */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 px-4 py-2"
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-6 h-6 text-[#25D366] stroke-2" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#25D366]">Order</span>
        </a>

      </div>
    </nav>
  );
}
