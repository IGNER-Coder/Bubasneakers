"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Search, Menu, X, User, LogOut, LayoutDashboard, ArrowRight, Instagram, Twitter, Facebook } from "lucide-react";

// ----------------------------------------------------------------------
// ⚠️ FOR VERCEL DEPLOYMENT:
// 1. Uncomment the real imports below.
// 2. DELETE the Mock Section.
// ----------------------------------------------------------------------

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useSession, signOut } from "next-auth/react";
// import { useCart } from "../context/CartContext";
// import Image from "next/image"; // Needed for the menu image

// --- MOCK SECTION (DELETE THIS BLOCK FOR VERCEL) ---
const useCart = () => ({ getTotalItems: () => 3, toggleCart: () => console.log('Cart Toggled') });
const Link = ({ href, children, className, ...props }) => <a href={href} className={className} {...props}>{children}</a>;
const usePathname = () => "/"; 
const useSession = () => ({ data: { user: { name: 'Admin User', role: 'admin' } }, status: 'unauthenticated' }); 
const signOut = ({ callbackUrl }) => alert(`Logging out. Redirecting to ${callbackUrl}`);
const Image = ({ src, alt, className }) => <img src={src} alt={alt} className={className} />;
// ----------------------------------------------------

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

  // Scroll Logic
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Disable scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileOpen]);

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
  const isActive = (path) => pathname ? pathname.startsWith(path) : false;

  if (pathname === "/checkout") return null;

  return (
    <>
      <nav className={`sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-100 transition-all duration-300 ${isScrolled ? 'shadow-sm' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center transition-all duration-300 ${isScrolled ? 'h-14' : 'h-16'}`}>
            
            {/* 1. LOGO */}
            <Link href="/" className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-electric-blue rounded-lg p-1 z-50">
              <div className="w-7 h-7 md:w-9 md:h-9 bg-black rounded-tr-lg rounded-bl-lg flex items-center justify-center transform group-hover:rotate-3 transition-transform duration-300">
                <span className="font-oswald text-white font-bold text-sm md:text-lg italic">B</span>
              </div>
              <span className="font-oswald text-xl md:text-2xl font-bold tracking-tighter italic truncate">
                BUBA<span className="text-electric-blue hidden sm:inline">SNEAKERS.</span>
              </span>
            </Link>

            {/* 2. DESKTOP NAV */}
            <div className="hidden md:flex items-center space-x-7 text-base font-medium text-neutral-700">
              <Link href="/shop?tag=new" className="hover:text-black transition-colors">New Drops</Link>
              <Link href="/shop?gender=men" className="hover:text-black transition-colors">Men</Link>
              <Link href="/shop?gender=women" className="hover:text-black transition-colors">Women</Link>
              <Link href="/shop?tag=kids" className="hover:text-black transition-colors">Kids</Link>
              <Link href="/shop?tag=sale" className="text-electric-blue hover:text-blue-700 font-bold transition-colors">Sale</Link>
            </div>

            {/* 3. ICONS */}
            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0 z-50">
              
              <button onClick={() => setIsSearchOpen(true)} className="p-2 hover:bg-neutral-100 rounded-full transition">
                <Search className="w-5 h-5 text-black" />
              </button>

              {isLoggedIn ? (
                <div className="relative hidden md:block user-menu-container">
                    <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="p-2 hover:bg-neutral-100 rounded-full transition">
                        <User className="w-5 h-5 text-black" />
                    </button>
                    {isUserMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-neutral-100 shadow-xl rounded-lg p-2 text-sm z-50 animate-fade-in">
                          <div className="px-3 py-2 text-xs text-concrete border-b border-neutral-100 mb-1 font-medium">{session.user.name}</div>
                          <Link href="/account" className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-50 rounded-md font-medium"><User className="w-4 h-4" /> My Account</Link>
                          {isAdmin && <Link href="/admin" className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-50 rounded-md text-electric-blue font-bold"><LayoutDashboard className="w-4 h-4" /> Admin Panel</Link>}
                          <button onClick={() => signOut({ callbackUrl: '/login' })} className="flex items-center gap-2 w-full text-left px-3 py-2 text-red-500 hover:bg-red-50 rounded-md mt-1 border-t border-neutral-100 pt-2 font-medium"><LogOut className="w-4 h-4" /> Log Out</button>
                      </div>
                    )}
                </div>
              ) : (
                <Link href="/login" className="text-base font-medium text-neutral-700 hover:text-black transition-colors hidden md:flex px-2">Sign In</Link>
              )}
              
              <button onClick={toggleCart} className="relative p-2 hover:bg-neutral-100 rounded-full transition group">
                <ShoppingBag className="w-5 h-5 text-black group-hover:scale-110 transition-transform" />
                {count > 0 && <span className="absolute -top-1 -right-1 bg-electric-blue text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{count}</span>}
              </button>

              {/* Mobile Menu Button - FIXED: Added text-black to icons and hover state */}
              <button 
                className="md:hidden p-2 hover:bg-neutral-100 rounded-full transition active:scale-90" 
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                aria-label="Toggle menu"
              >
                {isMobileOpen ? <X className="w-6 h-6 text-black" /> : <Menu className="w-6 h-6 text-black" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 4. MOBILE MENU (EDITORIAL DESIGN) */}
      <div className={`fixed inset-0 z-40 bg-white transition-transform duration-500 ease-in-out transform ${isMobileOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden flex flex-col`}>
          
          {/* Top Spacer (Behind Navbar) */}
          <div className="h-20" />

          <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col">
            
            {/* SEARCH BAR */}
            <div className="relative mb-10">
                <input type="text" placeholder="Search sneakers..." className="w-full bg-neutral-100 p-4 rounded-xl text-lg font-sans font-medium pr-12 focus:outline-none focus:ring-2 focus:ring-black/5" />
                <Search className="w-6 h-6 absolute right-4 top-1/2 -translate-y-1/2 text-concrete" />
            </div>

            {/* BIG LINKS (Staggered Animation) */}
            <nav className="flex flex-col space-y-6">
                {[
                    { href: "/shop?tag=new", label: "New Drops" },
                    { href: "/shop?gender=men", label: "Men" },
                    { href: "/shop?gender=women", label: "Women" },
                    { href: "/shop?tag=kids", label: "Kids" },
                    { href: "/shop?tag=sale", label: "Sale", color: "text-electric-blue" }
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

            {/* VISUAL FEATURE (The "Ad" Slot) */}
            <div className="bg-neutral-100 rounded-2xl p-6 flex items-center gap-6 mb-10" style={{ opacity: 0, animation: isMobileOpen ? `slide-in-right 0.5s ease-out forwards 0.5s` : 'none' }}>
                <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shrink-0 shadow-sm">
                     {/* Replace with a real featured product image */}
                     <img src="https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=200" className="w-full h-full object-cover" alt="Featured" />
                </div>
                <div>
                    <p className="text-xs font-bold text-concrete uppercase tracking-wider mb-1">Trending Now</p>
                    <h4 className="font-oswald text-xl font-bold uppercase leading-none mb-2">Jordan 1 Lost & Found</h4>
                    <Link href="/shop?tag=new" onClick={() => setIsMobileOpen(false)} className="text-sm font-bold underline decoration-electric-blue underline-offset-4">Shop Now</Link>
                </div>
            </div>

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

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

// --- SEARCH MODAL (SAME AS BEFORE) ---
const SearchModal = ({ isOpen, onClose }) => {
    // ... (Keep existing search logic) ...
    // For brevity in this specific response, I'm collapsing this part since it didn't change from the last working version.
    // In your actual file, ensure the SearchModal code from the previous step is here!
    return null; 
};