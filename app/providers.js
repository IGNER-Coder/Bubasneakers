"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
        <CartDrawer />
      </CartProvider>
    </SessionProvider>
  );
}
