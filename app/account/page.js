"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, ShoppingBag, MapPin, Settings, ChevronRight, Loader2, LogOut } from "lucide-react";
import { useState, useEffect } from "react"; // For client-side rendering

export default function AccountPage() {
  // Use session to gate-check the user
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

  // Security Check: If not logged in, redirect them immediately.
  if (status === 'unauthenticated') {
    redirect('/login');
  }

  const user = session.user;
  const username = user.name.split(' ')[0]; // Use first name for a friendly greeting

  return (
    <div className="min-h-screen bg-off-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <h1 className="font-oswald text-4xl font-bold uppercase mb-2">Hello, {username}!</h1>
        <p className="text-lg text-concrete mb-10">Welcome to your BUBASNEAKERS Dashboard.</p>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 1. ORDERS */}
          <Link href="/account/orders" className="block p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-electric-blue">
            <div className="flex items-center gap-4">
              <ShoppingBag className="w-8 h-8 text-electric-blue" />
              <div>
                <h2 className="font-bold text-xl uppercase tracking-wider mb-1">My Orders</h2>
                <p className="text-concrete text-sm">Track shipments, view history, and process returns.</p>
              </div>
              <ChevronRight className="w-5 h-5 ml-auto text-concrete" />
            </div>
          </Link>

          {/* 2. PROFILE & ADDRESS */}
          <Link href="/account/profile" className="block p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-black">
            <div className="flex items-center gap-4">
              <MapPin className="w-8 h-8 text-black" />
              <div>
                <h2 className="font-bold text-xl uppercase tracking-wider mb-1">My Details</h2>
                <p className="text-concrete text-sm">Update shipping addresses and contact information.</p>
              </div>
              <ChevronRight className="w-5 h-5 ml-auto text-concrete" />
            </div>
          </Link>

          {/* 3. WISHLIST (Placeholder for future) */}
          <Link href="/wishlist" className="block p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 opacity-80">
            <div className="flex items-center gap-4">
              <User className="w-8 h-8 text-concrete" />
              <div>
                <h2 className="font-bold text-xl uppercase tracking-wider mb-1">Wishlist (Coming Soon)</h2>
                <p className="text-concrete text-sm">Save your favorite drops for later.</p>
              </div>
              <ChevronRight className="w-5 h-5 ml-auto text-concrete" />
            </div>
          </Link>
          
          {/* 4. LOGOUT (Safety link) */}
          <button 
            onClick={() => window.location.href = '/api/auth/signout'} // Direct signout link
            className="w-full text-left p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 opacity-90 border-l-4 border-red-500"
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
        
        {/* Mobile quick links */}
        <div className="mt-12 text-center text-concrete">
            <Link href="/" className="font-bold hover:underline">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}