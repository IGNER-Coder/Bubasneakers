"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false); // 🔒 Safety Lock

  // 1. LOAD CART (Run once on mount)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("buba_cart");
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error("Failed to parse cart", e);
        }
      }
      setIsInitialized(true); // 🔓 Unlock saving
    }
  }, []);

  // 2. SAVE CART (Run only after initialization)
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem("buba_cart", JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  // --- HELPER: ID CHECKER ---
  // Ensures we match items even if one ID is a string "1" and the other is number 1
  const isSameItem = (item, productId, size) => {
    return String(item.id) === String(productId) && String(item.size) === String(size);
  };

  // --- CORE LOGIC ---
  const addToCart = (product, size, quantity) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => 
        isSameItem(item, product.id, size)
      );

      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + quantity
        };
        return newCart;
      } else {
        // Ensure we save the ID as a string to prevent future mismatch
        return [...prevCart, { ...product, id: String(product.id), size, quantity }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, size) => {
    setCart((prev) => prev.filter((item) => !isSameItem(item, productId, size)));
  };

  const updateQuantity = (productId, size, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (isSameItem(item, productId, size)) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // --- HELPERS ---
  const toggleCart = () => setIsCartOpen((prev) => !prev);
  
  const getTotalItems = () => cart.reduce((acc, item) => acc + item.quantity, 0);
  
  const getTotalPrice = () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen, 
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);