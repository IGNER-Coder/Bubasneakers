"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, MapPin, ChevronRight, Loader2, LogOut, LayoutDashboard, Heart } from "lucide-react";
import { useState, useEffect } from "react";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || status === 'loading') {
    return (
        <div className="min-h-screen flex items-center justify-center bg-off-white">
            <Loader2 className="w-8 h-8 animate-spin text-black" />
        </div>
    );
  }

  if (status === 'unauthenticated') {
    redirect('/login');
  }

  const user = session.user;
  const isAdmin = user.role === 'admin'; 
  const username = user.name.split(' ')[0];

  return (
    <div className="min-h-screen bg-off-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <h1 className="font-oswald text-4xl font-bold uppercase mb-2">Hello, {username}!</h1>
        <p className="text-lg text-concrete mb-10">Welcome to your BUBASNEAKERS Dashboard.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 🏆 ADMIN PANEL (Only visible to You) */}
          {isAdmin && (
            <Link href="/admin" className="block p-6 bg-black text-white rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-l-4 border-electric-blue col-span-1 md:col-span-2">
              <div className="flex items-center gap-4">
                <LayoutDashboard className="w-8 h-8 text-electric-blue" />
                <div>
                  <h2 className="font-bold text-xl uppercase tracking-wider mb-1">Admin Command Center</h2>
                  <p className="text-neutral-400 text-sm">Manage orders, products, and revenue.</p>
                </div>
                <ChevronRight className="w-5 h-5 ml-auto text-white" />
              </div>
            </Link>
          )}

          {/* 1. PROFILE (Primary Action) */}
          <Link href="/account/profile" className="block p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-black">
            <div className="flex items-center gap-4">
              <MapPin className="w-8 h-8 text-black" />
              <div>
                <h2 className="font-bold text-xl uppercase tracking-wider mb-1">My Details</h2>
                <p className="text-concrete text-sm">Manage shipping addresses and contact info.</p>
              </div>
              <ChevronRight className="w-5 h-5 ml-auto text-concrete" />
            </div>
          </Link>

          {/* 2. WISHLIST */}
          <Link href="/wishlist" className="block p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-pink-500">
            <div className="flex items-center gap-4">
              <Heart className="w-8 h-8 text-pink-500" />
              <div>
                <h2 className="font-bold text-xl uppercase tracking-wider mb-1">My Wishlist</h2>
                <p className="text-concrete text-sm">Your curated list of favorites.</p>
              </div>
              <ChevronRight className="w-5 h-5 ml-auto text-concrete" />
            </div>
          </Link>
          
          {/* 3. LOGOUT */}
          <button 
            onClick={() => window.location.href = '/api/auth/signout'} 
            className="w-full text-left p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 opacity-90 border-l-4 border-red-500 col-span-1 md:col-span-2"
          >
            <div className="flex items-center gap-4">
              <LogOut className="w-8 h-8 text-red-500" />
              <div>
                <h2 className="font-bold text-xl uppercase tracking-wider mb-1 text-red-600">Log Out</h2>
                <p className="text-concrete text-sm">Securely sign out of your account.</p>
              </div>
              <ChevronRight className="w-5 h-5 ml-auto text-concrete" />
            </div>
          </button>

        </div>
        
        <div className="mt-12 text-center text-concrete">
            <Link href="/" className="font-bold hover:underline">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}