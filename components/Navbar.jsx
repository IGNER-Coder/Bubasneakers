"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Search, Menu, X, User, LogOut, LayoutDashboard, ArrowRight, Instagram, Twitter, Facebook } from "lucide-react";

// ----------------------------------------------------------------------
// ✅ PRODUCTION MODE: Real Imports Enabled
// ----------------------------------------------------------------------

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "../context/CartContext";
import CurrencyToggle from "./CurrencyToggle"; 

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { getTotalItems, toggleCart } = useCart();
  const { data: session, status } = useSession();
  const [count, setCount] = useState(0);

  // Sync cart count safely
  useEffect(() => {
    if (getTotalItems) {
      setCount(getTotalItems());
    }
  }, [getTotalItems]);

  // Scroll Logic
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click Outside User Menu Logic
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isUserMenuOpen && !e.target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isUserMenuOpen]);

  const isLoggedIn = status === 'authenticated';
  const isAdmin = session?.user?.role === 'admin';

  // Hide on checkout
  if (pathname && pathname.startsWith("/checkout")) return null;

  // --- ACTIVE LINK HELPER ---
  const isActive = (tag, gender) => {
    if (!searchParams) return false;
    if (gender) return searchParams.get("gender") === gender;
    if (tag) return searchParams.get("tag") === tag;
    return false;
  };

  const NavLink = ({ href, label, active }) => (
    <Link 
      href={href} 
      className={`relative group transition-colors duration-200 ${active ? 'text-black font-bold' : 'text-neutral-600 hover:text-black'}`}
    >
      {label}
      {/* Active Indicator Dot */}
      {active && (
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-black rounded-full" />
      )}
    </Link>
  );

  return (
    <>
      <nav className={`sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-100 transition-all duration-300 ${isScrolled ? 'shadow-sm' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center transition-all duration-300 ${isScrolled ? 'h-14' : 'h-16'}`}>
            
            {/* 1. LOGO */}
            <Link href="/" className="flex items-center gap-2 group focus:outline-none rounded-lg p-1">
              <div className="w-7 h-7 md:w-9 md:h-9 bg-black rounded-tr-lg rounded-bl-lg flex items-center justify-center transform group-hover:rotate-3 transition-transform duration-300">
                <span className="font-oswald text-white font-bold text-sm md:text-lg italic">B</span>
              </div>
              <span className="font-oswald text-xl md:text-2xl font-bold tracking-tighter italic truncate">
                BUBA<span className="text-electric-blue hidden sm:inline">SNEAKERS.</span>
              </span>
            </Link>

            {/* 2. DESKTOP NAV */}
            <div className="hidden md:flex items-center space-x-8 text-sm uppercase tracking-wide font-medium">
              <NavLink href="/shop?tag=new" label="New Arrivals" active={isActive("new")} />
              <NavLink href="/shop?gender=men" label="Men" active={isActive(null, "men")} />
              <NavLink href="/shop?gender=women" label="Women" active={isActive(null, "women")} />
              <NavLink href="/shop?tag=kids" label="Kids" active={isActive("kids")} />
              <Link 
                href="/shop?tag=sale" 
                className={`text-electric-blue font-bold hover:text-blue-700 transition-colors ${isActive("sale") ? 'underline decoration-2 underline-offset-4' : ''}`}
              >
                Archive
              </Link>
            </div>

            {/* 3. ICONS */}
            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
              
              {/* CURRENCY TOGGLE */}
              <div className="hidden sm:block">
                <CurrencyToggle />
              </div>

              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-neutral-100 rounded-full transition focus:outline-none"
                aria-label="Open search"
              >
                <Search className="w-5 h-5 text-black" />
              </button>

              {isLoggedIn ? (
                <div className="relative hidden md:block user-menu-container">
                    <button 
                       onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                       className="p-2 flex items-center hover:bg-neutral-100 rounded-full transition focus:outline-none"
                    >
                        <User className="w-5 h-5 text-black" />
                    </button>
                    
                    {isUserMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-neutral-100 shadow-xl rounded-lg p-2 text-sm z-50 animate-fade-in origin-top-right">
                          <div className="px-3 py-3 text-xs text-concrete border-b border-neutral-100 mb-1 font-medium">
                              Signed in as <br/>
                              <span className="text-black font-bold text-sm">{session.user.name}</span>
                          </div>
                          <Link href="/account" className="flex items-center gap-3 px-3 py-2 hover:bg-neutral-50 rounded-md font-medium transition-colors">
                              <User className="w-4 h-4 text-concrete" /> My Account
                          </Link>
                          {isAdmin && (
                              <Link href="/admin" className="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 rounded-md text-electric-blue font-bold transition-colors">
                                  <LayoutDashboard className="w-4 h-4" /> Admin Panel
                              </Link>
                          )}
                          <button 
                              onClick={() => signOut({ callbackUrl: '/login' })}
                              className="flex items-center gap-3 w-full text-left px-3 py-2 text-red-500 hover:bg-red-50 rounded-md mt-1 border-t border-neutral-100 pt-2 font-medium transition-colors"
                          >
                              <LogOut className="w-4 h-4" /> Log Out
                          </button>
                      </div>
                    )}
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className="text-sm font-bold text-black hover:text-electric-blue transition-colors hidden md:flex px-2"
                >
                  Sign In
                </Link>
              )}
              
              <button 
                onClick={toggleCart} 
                className="relative p-2 hover:bg-neutral-100 rounded-full transition group focus:outline-none"
              >
                <ShoppingBag className="w-5 h-5 text-black group-hover:scale-110 transition-transform" />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-electric-blue text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {count}
                  </span>
                )}
              </button>

              <button 
                className="md:hidden p-2 focus:outline-none"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
              >
                {isMobileOpen ? <X className="w-6 h-6 text-black" /> : <Menu className="w-6 h-6 text-black" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 4. MOBILE MENU */}
      <div className={`fixed inset-0 z-40 bg-white transition-transform duration-500 ease-in-out transform ${isMobileOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden flex flex-col`}>
          
          {/* Top Spacer */}
          <div className="h-20" />

          <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col">
            
            {/* SEARCH BAR */}
            <div className="relative mb-8">
                <input type="text" placeholder="Search sneakers..." className="w-full bg-neutral-100 p-4 rounded-xl text-lg font-sans font-medium pr-12 focus:outline-none focus:ring-2 focus:ring-black/5" />
                <Search className="w-6 h-6 absolute right-4 top-1/2 -translate-y-1/2 text-concrete" />
            </div>

            {/* Currency Toggle (Mobile Version) */}
            <div className="mb-6">
                <span className="text-xs font-bold text-concrete uppercase tracking-wider mb-2 block">Currency</span>
                <CurrencyToggle />
            </div>

            {/* BIG LINKS */}
            <nav className="flex flex-col space-y-6">
                {[
                    { href: "/shop?tag=new", label: "New Arrivals" },
                    { href: "/shop?gender=men", label: "Men" },
                    { href: "/shop?gender=women", label: "Women" },
                    { href: "/shop?tag=kids", label: "Kids" },
                    { href: "/shop?tag=sale", label: "Archive", color: "text-electric-blue" }
                ].map((link, idx) => (
                    <Link 
                        key={link.href} 
                        href={link.href} 
                        onClick={() => setIsMobileOpen(false)}
                        className={`font-oswald text-4xl font-bold uppercase tracking-wide hover:pl-4 transition-all duration-300 ${link.color || 'text-black'}`}
                        style={{ opacity: 0, animation: isMobileOpen ? `slide-in-right 0.4s ease-out forwards ${idx * 0.1}s` : 'none' }}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>

            <hr className="my-10 border-neutral-100" />

            {/* FOOTER ACTIONS */}
            <div className="mt-auto space-y-4" style={{ opacity: 0, animation: isMobileOpen ? `slide-in-right 0.5s ease-out forwards 0.6s` : 'none' }}>
                {isLoggedIn ? (
                    <>
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-medium">Hi, {session.user.name}</span>
                            {isAdmin && <span className="text-xs bg-black text-white px-2 py-1 rounded">ADMIN</span>}
                        </div>
                        <Link href="/account" onClick={() => setIsMobileOpen(false)} className="flex items-center gap-3 w-full p-4 bg-neutral-50 rounded-xl font-bold">
                            <User className="w-5 h-5" /> My Account
                        </Link>
                        <button onClick={() => signOut({ callbackUrl: '/login' })} className="flex items-center gap-3 w-full p-4 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors">
                            <LogOut className="w-5 h-5" /> Log Out
                        </button>
                    </>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/login" onClick={() => setIsMobileOpen(false)} className="flex justify-center items-center p-4 border border-neutral-200 rounded-xl font-bold">Sign In</Link>
                        <Link href="/register" onClick={() => setIsMobileOpen(false)} className="flex justify-center items-center p-4 bg-black text-white rounded-xl font-bold">Register</Link>
                    </div>
                )}
                
                {/* SOCIALS */}
                <div className="flex gap-4 justify-center pt-6">
                    <Instagram className="w-5 h-5 text-concrete hover:text-black transition-colors" />
                    <Twitter className="w-5 h-5 text-concrete hover:text-black transition-colors" />
                    <Facebook className="w-5 h-5 text-concrete hover:text-black transition-colors" />
                </div>
            </div>

          </div>
      </div>

      {/* Search Modal (Keep existing code for SearchModal here) */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

// --- SEARCH MODAL COMPONENT ---
const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const performSearch = async (query) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    
    try {
      const res = await fetch(`/api/search?q=${query}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (isOpen && searchTerm) {
        performSearch(searchTerm);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-neutral-100 p-4 md:p-6 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Search className="w-6 h-6 text-concrete" />
          <input 
            type="text" 
            placeholder="Search sneakers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 text-lg md:text-xl font-sans font-medium bg-transparent focus:outline-none focus:ring-0 placeholder-neutral-400"
            autoFocus 
          />
          <button 
            onClick={onClose} 
            className="p-3 bg-neutral-100 hover:bg-neutral-200 rounded-full transition active:scale-95"
            aria-label="Close search"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {!loading && searchTerm.length < 2 && (
          <div className="pt-10">
            <p className="text-neutral-600 text-sm font-medium mb-6 text-center">
              Try searching for a brand, style, or color
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {["Jordan", "Nike", "Yeezy", "Black Sneakers", "New Balance"].map(term => (
                  <button 
                    key={term}
                    onClick={() => setSearchTerm(term)}
                    className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-full text-sm font-medium transition-colors text-neutral-700"
                  >
                    {term}
                  </button>
              ))}
            </div>
          </div>
        )}
        
        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-concrete mb-4 border-b pb-2">
                Results ({results.length})
            </h3>
            {results.map(product => (
              <Link 
                key={product.id}
                href={`/product/${product.id}`}
                onClick={onClose}
                className="flex items-center gap-4 p-4 hover:bg-neutral-50 rounded-lg transition-colors duration-200 border border-transparent hover:border-neutral-200"
              >
                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0 bg-neutral-50" />
                <div className="flex-1">
                  <p className="font-semibold text-black text-base">{product.name}</p>
                  <p className="text-sm text-neutral-600 mt-0.5">{product.brand}</p>
                  <p className="text-base font-bold text-black mt-1">${product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {!loading && searchTerm.length >= 2 && results.length === 0 && (
             <p className="text-center text-concrete pt-10">No sneakers found matching "{searchTerm}".</p>
        )}
      </div>
    </div>
  );
};