"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Search, Menu, X, User, LogOut, LayoutDashboard, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // NEW: Search State
  const pathname = usePathname(); 
  const { getTotalItems, toggleCart } = useCart(); 
  const { data: session, status } = useSession(); 

  const [count, setCount] = useState(0);
  useEffect(() => {
    // Only run the mock logic if the session status is available
    if (status !== 'loading') {
        setCount(getTotalItems());
    }
  }, [getTotalItems, status]);

  const isLoggedIn = status === 'authenticated';
  const isAdmin = session?.user?.role === 'admin';

  // LOGIC: Hide on checkout
  if (pathname === "/checkout") return null;

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* 1. LOGO & BRAND */}
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

            {/* 3. ICONS (Search, Cart, User - ALWAYS 3 SLOTS) */}
            <div className="flex items-center gap-3 md:gap-4">
              
              {/* SEARCH ICON - Slot 1 (Always Visible) */}
              <button 
                onClick={() => setIsSearchOpen(true)} // ⬅️ NEW: Open Search Modal
                className="p-2 hover:bg-neutral-100 rounded-full transition"
              >
                <Search className="w-5 h-5 text-black" />
              </button>

              {/* USER / LOGIN STATUS - Slot 2 (Conditional) */}
              {isLoggedIn ? (
                // LOGGED IN VIEW: User Icon + Dropdown
                <div className="relative group hidden md:block"> {/* Hide dropdown menu on mobile */}
                    <Link href="/account" className="p-2 flex items-center hover:bg-neutral-100 rounded-full transition">
                        <User className="w-5 h-5 text-black" />
                    </Link>
                    {/* Hover Dropdown Menu */}
                    <div className="absolute right-0 top-full mt-3 w-48 bg-white border border-neutral-100 shadow-xl rounded-lg p-2 text-sm z-50 opacity-0 group-hover:opacity-100 group-hover:block hidden transition-opacity duration-200">
                        <div className="px-3 py-2 text-xs text-concrete border-b border-neutral-100 mb-1 truncate">
                            {session.user.name}
                        </div>
                        <Link href="/account" className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-50 rounded-md">
                            <User className="w-4 h-4" /> My Account
                        </Link>
                        {/* ADMIN LINK REMOVED FROM NAVBAR - Must type /admin */}
                        <button 
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            className="flex items-center gap-2 w-full text-left px-3 py-2 text-red-500 hover:bg-red-50 rounded-md mt-1 border-t border-neutral-100 pt-2"
                        >
                            <LogOut className="w-4 h-4" /> Log Out
                        </button>
                    </div>
                </div>
              ) : (
                // LOGGED OUT VIEW: Login Text Link (Hidden on Mobile)
                <Link href="/login" className="flex items-center gap-2 text-sm font-bold text-black hover:text-electric-blue transition hidden md:flex">
                    Login
                </Link>
              )}
              
              {/* CART TOGGLE - Slot 3 (Always Functional) */}
              <button onClick={toggleCart} className="relative p-2 hover:bg-neutral-100 rounded-full transition group">
                <ShoppingBag className="w-5 h-5 text-black group-hover:scale-110 transition-transform" />
                {count > 0 && (
                  <span className="absolute top-0 right-0 bg-electric-blue text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {count}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button - Slot 4 */}
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

      {/* 4. MOBILE MENU (Fixed Position) */}
      {isMobileOpen && (
        <div className="fixed inset-0 top-20 z-40 bg-white/95 backdrop-blur-xl border-t border-neutral-100 animate-fade-in overflow-y-auto">
          <div className="px-6 py-8 space-y-6 font-oswald text-2xl uppercase tracking-wide">
            
            {/* Login/Logout on Mobile */}
            {isLoggedIn ? (
                // Logged In Mobile Menu
                <>
                    <Link href="/account" onClick={() => setIsMobileOpen(false)} className="block hover:text-electric-blue transition-colors">My Account</Link>
                    <button 
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="block w-full text-left text-red-500 hover:text-red-700 transition-colors"
                    >
                        Log Out
                    </button>
                </>
            ) : (
                <Link href="/login" onClick={() => setIsMobileOpen(false)} className="block hover:text-electric-blue transition-colors">Log In / Register</Link>
            )}
            
            <hr className="border-neutral-100" />
            <Link href="/shop?tag=new" onClick={() => setIsMobileOpen(false)} className="block hover:text-electric-blue transition-colors">New Drops</Link>
            <Link href="/shop?gender=men" onClick={() => setIsMobileOpen(false)} className="block hover:text-electric-blue transition-colors">Men</Link>
            <Link href="/shop?gender=women" onClick={() => setIsMobileOpen(false)} className="block hover:text-electric-blue transition-colors">Women</Link>
            <Link href="/shop?tag=kids" onClick={() => setIsMobileOpen(false)} className="block hover:text-electric-blue transition-colors">Kids</Link>
            <Link href="/shop?tag=sale" onClick={() => setIsMobileOpen(false)} className="block text-electric-blue font-bold">Sale</Link>
          </div>
        </div>
      )}

      {/* 5. SEARCH MODAL (Full-Screen Overlay) */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

// ----------------------------------------------------------------------
// 2. SEARCH MODAL COMPONENT
// ----------------------------------------------------------------------

const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // This will hit a real API route later
  const realSearch = async (query) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    setLoading(true);
    try {
      const response = await fetch(`/api/products/search?q=${query}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Failed to fetch search results:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only search on input changes if the modal is open
    if (isOpen) {
        realSearch(searchTerm);
    }
  }, [searchTerm, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-xl animate-fade-in overflow-y-auto">
      
      {/* Search Input Bar */}
      <div className="sticky top-0 bg-white border-b border-neutral-100 p-4 md:p-6 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Search className="w-6 h-6 text-concrete" />
          <input 
            type="text" 
            placeholder="Search for Jordan, Yeezy, or Black/White..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 text-lg md:text-xl font-oswald uppercase font-bold bg-transparent focus:outline-none placeholder-concrete placeholder:text-sm md:placeholder:text-base"
            autoFocus 
          />
          <button 
            onClick={onClose} 
            className="p-3 bg-neutral-100 hover:bg-neutral-200 rounded-full transition active:scale-95"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>
      
      {/* Results Area */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading && (
          <p className="text-center text-concrete text-lg flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Searching...
          </p>
        )}
        
        {results.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-concrete mb-4 border-b pb-2">
                Results ({results.length})
            </h3>
            {results.map(product => (
              <Link 
                key={product.id}
                href={`/product/${product.id}`}
                onClick={onClose}
                className="flex items-center gap-4 p-3 hover:bg-neutral-50 rounded-xl transition"
              >
                <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-md flex-shrink-0" />
                <div>
                  <p className="font-bold text-black">{product.name}</p>
                  <p className="text-sm text-concrete">{product.brand} | ${product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && searchTerm.length >= 2 && results.length === 0 && (
            <p className="text-center text-concrete text-base md:text-lg pt-10">
                No matching sneakers found for "{searchTerm}".
            </p>
        )}

        {!loading && searchTerm.length < 2 && (
            <div className="pt-10 text-center">
                <p className="text-concrete text-base md:text-lg font-bold uppercase tracking-wider">
                    Type at least 2 characters to search.
                </p>
            </div>
        )}

      </div>
    </div>
  );
};