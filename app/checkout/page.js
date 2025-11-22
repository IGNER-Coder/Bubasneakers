"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, CreditCard, Smartphone, ShieldCheck, Lock } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function CheckoutPage() {
  const { cartTotal } = useCart();
  const [isClient, setIsClient] = useState(false);
  
  // Payment State
  const [paymentMethod, setPaymentMethod] = useState("card"); // 'card' | 'mpesa'

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-off-white">
      
      {/* Minimal Header */}
      <header className="bg-white border-b border-neutral-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
             <div className="w-8 h-8 bg-black flex items-center justify-center rounded-tr-lg rounded-bl-lg">
               <span className="font-oswald text-white font-bold italic">B</span>
             </div>
             <span className="font-oswald text-xl font-bold tracking-tighter">CHECKOUT</span>
          </Link>
          <Link href="/" className="text-sm font-bold text-concrete hover:text-black flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* LEFT COLUMN: INPUTS */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* 1. Contact */}
            <section>
              <h2 className="font-oswald text-2xl font-bold uppercase mb-6">1. Contact Information</h2>
              <div className="grid grid-cols-2 gap-4">
                 <input type="email" placeholder="Email Address" className="col-span-2 w-full bg-white border border-neutral-200 p-4 rounded-lg focus:outline-none focus:border-black transition-colors" />
              </div>
            </section>

            {/* 2. Shipping */}
            <section>
              <h2 className="font-oswald text-2xl font-bold uppercase mb-6">2. Shipping Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="w-full bg-white border border-neutral-200 p-4 rounded-lg" />
                <input type="text" placeholder="Last Name" className="w-full bg-white border border-neutral-200 p-4 rounded-lg" />
                <input type="text" placeholder="Address" className="col-span-2 w-full bg-white border border-neutral-200 p-4 rounded-lg" />
                <input type="text" placeholder="City" className="w-full bg-white border border-neutral-200 p-4 rounded-lg" />
                <input type="text" placeholder="Phone" className="w-full bg-white border border-neutral-200 p-4 rounded-lg" />
              </div>
            </section>

            {/* 3. Payment Method (FIXED) */}
            <section>
              <h2 className="font-oswald text-2xl font-bold uppercase mb-6">3. Payment Method</h2>
              <div className="grid grid-cols-2 gap-4">
                
                {/* CARD BUTTON - Added type="button" */}
                <button 
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-6 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
                    paymentMethod === "card" 
                      ? "bg-neutral-50 border-2 border-black ring-1 ring-black shadow-sm" 
                      : "bg-white border border-neutral-200 hover:bg-neutral-50 text-concrete"
                  }`}
                >
                  <CreditCard className={`w-8 h-8 ${paymentMethod === "card" ? "text-black" : "text-concrete"}`} />
                  <span className="font-bold text-sm">Card Payment</span>
                </button>

                {/* M-PESA BUTTON - Added type="button" */}
                <button 
                  type="button"
                  onClick={() => setPaymentMethod("mpesa")}
                  className={`p-6 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
                    paymentMethod === "mpesa" 
                      ? "bg-green-50 border-2 border-green-600 ring-1 ring-green-600 shadow-sm" 
                      : "bg-white border border-neutral-200 hover:bg-neutral-50 text-concrete"
                  }`}
                >
                  <Smartphone className={`w-8 h-8 ${paymentMethod === "mpesa" ? "text-green-600" : "text-concrete"}`} />
                  <span className={`font-bold text-sm ${paymentMethod === "mpesa" ? "text-green-700" : ""}`}>M-Pesa</span>
                </button>

              </div>

              {/* Logic Display */}
              <div className="mt-6 bg-neutral-50 p-4 rounded-lg flex items-start gap-3 border border-neutral-100">
                <Lock className="w-5 h-5 text-concrete shrink-0" />
                <p className="text-xs text-concrete leading-relaxed">
                  {paymentMethod === "card" 
                    ? "Your transaction is secured with SSL encryption. We accept VISA, Mastercard, and Amex."
                    : "After clicking 'Pay', you will receive an M-Pesa prompt on your phone number provided above."
                  }
                </p>
              </div>
            </section>

            <button className="w-full bg-black text-white py-6 rounded-full font-bold text-lg uppercase tracking-widest hover:bg-electric-blue transition-colors shadow-xl">
              {paymentMethod === "card" ? `Pay $${cartTotal}` : `Pay with M-Pesa`}
            </button>

          </div>

          {/* RIGHT COLUMN: SUMMARY */}
          <div className="lg:col-span-5">
             <OrderSummary />
          </div>

        </div>
      </div>
    </div>
  );
}

// Helper Component
function OrderSummary() {
  const { cart, cartTotal } = useCart();
  
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100 sticky top-24">
      <h3 className="font-oswald text-xl font-bold uppercase mb-6">Order Summary</h3>
      <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 scrollbar-hide">
        {cart.length === 0 ? (
            <p className="text-concrete">Your cart is empty.</p>
        ) : (
          cart.map((item, idx) => (
            <div key={`${item.id}-${item.size}-${idx}`} className="flex gap-4">
              <div className="w-16 h-16 bg-neutral-50 rounded-md overflow-hidden border border-neutral-100 relative">
                <img src={item.images?.[0] || item.image} className="w-full h-full object-cover" />
                <span className="absolute top-0 right-0 bg-concrete text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-bl-md">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm">{item.name}</h4>
                <p className="text-xs text-concrete">Size: {item.size}</p>
              </div>
              <p className="font-bold text-sm">${item.price * item.quantity}</p>
            </div>
          ))
        )}
      </div>
      <div className="space-y-4 border-t border-neutral-100 pt-6">
        <div className="flex justify-between text-sm">
          <span className="text-concrete">Subtotal</span>
          <span className="font-bold">${cartTotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-concrete">Shipping</span>
          <span className="text-electric-blue font-bold uppercase text-xs tracking-wider">Free</span>
        </div>
        <div className="flex justify-between text-xl font-bold font-oswald pt-4 border-t border-neutral-100">
          <span>Total</span>
          <span>${cartTotal}</span>
        </div>
      </div>
    </div>
  )
}