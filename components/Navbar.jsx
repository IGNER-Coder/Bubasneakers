"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Search, Menu, X, User, LogOut, LayoutDashboard, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname(); 
  const { getTotalItems, toggleCart } = useCart(); 
  const { data: session, status } = useSession(); 

  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (status !== 'loading') setCount(getTotalItems());
  }, [getTotalItems, status]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
  const isActive = (path) => pathname ? pathname.startsWith(path) : false;

  if (pathname === "/checkout") return null;

  return (
    <>
      <nav className={`sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-100 transition-all duration-300 ${isScrolled ? 'shadow-sm' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center transition-all duration-300 ${isScrolled ? 'h-14' : 'h-16'}`}>
            
            <Link href="/" className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-electric-blue rounded-lg p-1">
              <div className="w-7 h-7 md:w-9 md:h-9 bg-black rounded-tr-lg rounded-bl-lg flex items-center justify-center transform group-hover:rotate-3 transition-transform duration-300">
                <span className="font-oswald text-white font-bold text-sm md:text-lg italic">B</span>
              </div>
              <span className="font-oswald text-xl md:text-2xl font-bold tracking-tighter italic truncate">
                BUBA<span className="text-electric-blue hidden sm:inline">SNEAKERS.</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-7 text-base font-medium text-neutral-700">
              <Link 
                href="/shop?tag=new" 
                className={`hover:text-black transition-colors duration-200 ${isActive('/shop') && pathname.includes('tag=new') ? 'text-black font-semibold' : ''}`}
              >
                New Drops
              </Link>
              <Link 
                href="/shop?gender=men" 
                className={`hover:text-black transition-colors duration-200 ${isActive('/shop') && pathname.includes('gender=men') ? 'text-black font-semibold' : ''}`}
              >
                Men
              </Link>
              <Link 
                href="/shop?gender=women" 
                className={`hover:text-black transition-colors duration-200 ${isActive('/shop') && pathname.includes('gender=women') ? 'text-black font-semibold' : ''}`}
              >
                Women
              </Link>
              <Link 
                href="/shop?tag=kids" 
                className={`hover:text-black transition-colors duration-200 ${isActive('/shop') && pathname.includes('tag=kids') ? 'text-black font-semibold' : ''}`}
              >
                Kids
              </Link>
              <Link 
                href="/shop?tag=sale" 
                className="text-electric-blue hover:text-blue-700 transition-colors duration-200 font-semibold"
              >
                Sale
              </Link>
            </div>

            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
              
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-neutral-100 rounded-full transition focus:outline-none focus:ring-2 focus:ring-electric-blue"
                aria-label="Open search"
              >
                <Search className="w-5 h-5 text-black" />
              </button>

              {isLoggedIn ? (
                <div className="relative hidden md:block user-menu-container">
                    <button 
                       onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                       className="p-2 flex items-center hover:bg-neutral-100 rounded-full transition focus:outline-none focus:ring-2 focus:ring-electric-blue"
                       aria-label="User menu"
                    >
                        <User className="w-5 h-5 text-black" />
                    </button>
                    
                    {isUserMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-neutral-100 shadow-xl rounded-lg p-2 text-sm z-50 animate-fade-in origin-top-right">
                          <div className="px-3 py-2 text-xs text-concrete border-b border-neutral-100 mb-1 truncate font-medium">
                              {session.user.name}
                          </div>
                          <Link href="/account" className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-50 rounded-md font-medium">
                              <User className="w-4 h-4" /> My Account
                          </Link>
                          {isAdmin && (
                              <Link href="/admin" className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-50 rounded-md text-electric-blue font-bold">
                                  <LayoutDashboard className="w-4 h-4" /> Admin Panel
                              </Link>
                          )}
                          <button 
                              onClick={() => signOut({ callbackUrl: '/login' })}
                              className="flex items-center gap-2 w-full text-left px-3 py-2 text-red-500 hover:bg-red-50 rounded-md mt-1 border-t border-neutral-100 pt-2 font-medium"
                          >
                              <LogOut className="w-4 h-4" /> Log Out
                          </button>
                      </div>
                    )}
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className="text-base font-medium text-neutral-700 hover:text-black transition-colors duration-200 hidden md:flex focus:outline-none focus:ring-2 focus:ring-electric-blue rounded-md px-2"
                >
                  Sign In
                </Link>
              )}
              
              <button 
                onClick={toggleCart} 
                className="relative p-2 hover:bg-neutral-100 rounded-full transition group focus:outline-none focus:ring-2 focus:ring-electric-blue"
                aria-label={`Shopping cart with ${count} items`}
              >
                <ShoppingBag className="w-5 h-5 text-black group-hover:scale-110 transition-transform" />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-electric-blue text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {count}
                  </span>
                )}
              </button>

              <button 
                className="md:hidden p-2 focus:outline-none focus:ring-2 focus:ring-electric-blue rounded-full"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                aria-label={isMobileOpen ? "Close menu" : "Open menu"}
              >
                {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isMobileOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-white/95 backdrop-blur-xl border-t border-neutral-100 animate-slide-in overflow-y-auto">
          <div className="px-6 py-8 space-y-5 font-sans text-xl font-medium text-neutral-800">
            {isLoggedIn ? (
                <div className="pb-4 border-b border-neutral-100">
                    <div className="text-sm text-concrete mb-2">Signed in as {session.user.name}</div>
                    <Link href="/account" onClick={() => setIsMobileOpen(false)} className="block hover:text-electric-blue transition-colors py-2">My Account</Link>
                    <button 
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="block w-full text-left text-red-500 hover:text-red-700 transition-colors py-2"
                    >
                        Log Out
                    </button>
                </div>
            ) : (
                <div className="pb-4 border-b border-neutral-100">
                    <Link href="/login" onClick={() => setIsMobileOpen(false)} className="flex items-center justify-between hover:text-electric-blue transition-colors py-2">
                        Sign In <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link href="/register" onClick={() => setIsMobileOpen(false)} className="flex items-center justify-between text-concrete text-base py-2">
                        Create Account
                    </Link>
                </div>
            )}
            <Link href="/shop?tag=new" onClick={() => setIsMobileOpen(false)} className="block hover:text-electric-blue transition-colors">New Drops</Link>
            <Link href="/shop?gender=men" onClick={() => setIsMobileOpen(false)} className="block hover:text-electric-blue transition-colors">Men</Link>
            <Link href="/shop?gender=women" onClick={() => setIsMobileOpen(false)} className="block hover:text-electric-blue transition-colors">Women</Link>
            <Link href="/shop?tag=kids" onClick={() => setIsMobileOpen(false)} className="block hover:text-electric-blue transition-colors">Kids</Link>
            <Link href="/shop?tag=sale" onClick={() => setIsMobileOpen(false)} className="block text-electric-blue font-bold">Sale</Link>
          </div>
        </div>
      )}

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

// --- UPDATED SEARCH MODAL (REAL DATA) ---
const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // NEW: Real API Search
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

  // Debounce search to avoid spamming API
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