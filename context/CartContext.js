"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load from LocalStorage on start (Client-side only)
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
    }
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("buba_cart", JSON.stringify(cart));
    }
  }, [cart]);

  // --- CORE LOGIC ---
  
  const addToCart = (product, size, quantity) => {
    setCart((prevCart) => {
      // Check if item exists (Composite Key: ID + Size)
      const existingIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.size === size
      );

      if (existingIndex > -1) {
        // Clone and update quantity
        const newCart = [...prevCart];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + quantity
        };
        return newCart;
      } else {
        // Add new item
        return [...prevCart, { ...product, size, quantity }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, size) => {
    setCart((prev) => prev.filter((item) => !(item.id === productId && item.size === size)));
  };

  const updateQuantity = (productId, size, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === productId && item.size === size) {
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