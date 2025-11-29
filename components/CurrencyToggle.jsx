"use client";

import { useCart } from "../context/CartContext"; // ✅ Real Import

export default function CurrencyToggle() {
  const { currency, setCurrency } = useCart();

  return (
    <button
      onClick={() => setCurrency(currency === "KES" ? "USD" : "KES")}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-200 hover:border-black transition-colors text-xs font-bold font-mono tracking-wider bg-white"
    >
      <span className={currency === "KES" ? "text-black" : "text-concrete"}>KES</span>
      <span className="text-neutral-300">|</span>
      <span className={currency === "USD" ? "text-black" : "text-concrete"}>USD</span>
    </button>
  );
}