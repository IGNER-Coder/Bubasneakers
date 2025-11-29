"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Currency State
  const [currency, setCurrency] = useState("KES"); 
  const [exchangeRate, setExchangeRate] = useState(129); // Default fallback

  // 1. LOAD CART & CURRENCY
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("buba_cart");
      if (savedCart) {
        try { setCart(JSON.parse(savedCart)); } catch (e) { console.error(e); }
      }
      const savedCurrency = localStorage.getItem("buba_currency");
      if (savedCurrency) setCurrency(savedCurrency);
      
      setIsInitialized(true);
    }
  }, []);

  // 2. FETCH REAL-TIME RATES
  useEffect(() => {
    const fetchRates = async () => {
      try {
        // Using a free standard API for rates
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await res.json();
        if (data && data.rates && data.rates.KES) {
          setExchangeRate(data.rates.KES);
          console.log("Updated Exchange Rate:", data.rates.KES);
        }
      } catch (error) {
        console.error("Failed to fetch rates, using fallback:", error);
      }
    };

    fetchRates();
  }, []);

  // 3. SAVE CART
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem("buba_cart", JSON.stringify(cart));
      localStorage.setItem("buba_currency", currency);
    }
  }, [cart, currency, isInitialized]);

  // --- PRICE HELPER ---
  const formatPrice = (amountInKES) => {
    if (!amountInKES && amountInKES !== 0) return "";
    
    if (currency === "KES") {
      return `KES ${amountInKES.toLocaleString()}`;
    } else {
      // Convert KES -> USD using real-time rate
      const usdAmount = amountInKES / exchangeRate;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(usdAmount);
    }
  };

  // --- CART OPERATIONS ---
  const isSameItem = (item, productId, size) => {
    return String(item.id) === String(productId) && String(item.size) === String(size);
  };

  const addToCart = (product, size, quantity) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => isSameItem(item, product.id, size));
      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex] = { ...newCart[existingIndex], quantity: newCart[existingIndex].quantity + quantity };
        return newCart;
      } else {
        return [...prevCart, { ...product, id: String(product.id), size, quantity }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, size) => {
    setCart((prev) => prev.filter((item) => !isSameItem(item, productId, size)));
  };

  const updateQuantity = (productId, size, delta) => {
    setCart((prev) => prev.map((item) => {
      if (isSameItem(item, productId, size)) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

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
        currency,
        setCurrency,
        formatPrice // Now uses real-time rate
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);