"use client";

import { useState, useEffect, useRef } from "react";
import { Star, Heart, Minus, Plus, ChevronLeft, Truck, ShieldCheck, Loader2, MessageCircle } from "lucide-react";
import Link from "next/link"; 
import { useCart } from "../context/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProductView({ product }) {
  const { addToCart, formatPrice } = useCart(); 
  const { data: session } = useSession();
  const router = useRouter();

  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImage, setMainImage] = useState(product.images?.[0] || product.image);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const imageScrollRef = useRef(null);
  
  const handleWhatsAppBuy = () => {
    if (!selectedSize) return;
    const phone = "254797533977";
    const msg = `Hi BubaSneakers! I want to order the ${product.name} (${product.brand}) in Size ${selectedSize}. Quantity: ${quantity}. Price: ${formatPrice(product.price)}. Is it available for delivery?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };
  
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    const checkWishlist = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await fetch(`/api/wishlist?email=${session.user.email}`);
        if (res.ok) {
          const wishlistIds = await res.json();
          const productId = product._id?.toString() || product.id?.toString();
          if (wishlistIds.includes(productId)) setIsWishlisted(true);
        }
      } catch (error) {
        console.error("Failed to sync wishlist", error);
      }
    };
    checkWishlist();
  }, [session, product]);

  const handleWishlistToggle = async () => {
    if (!session) return router.push("/login");
    const previousState = isWishlisted;
    setIsWishlisted(!isWishlisted);
    setWishlistLoading(true);

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id || product.id, email: session.user.email }),
      });
      if (!res.ok) {
        setIsWishlisted(previousState);
      }
    } catch {
      setIsWishlisted(previousState);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size first!"); 
      return;
    }
    addToCart(product, selectedSize, quantity);
  };
  
  const handleScroll = () => {
    if (imageScrollRef.current) {
        const scrollPosition = imageScrollRef.current.scrollLeft;
        const width = imageScrollRef.current.offsetWidth;
        const index = Math.round(scrollPosition / width);
        setActiveImageIndex(index);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-32 lg:pb-20 animate-fade-in relative">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-0 sm:py-8">
        
        <Link href="/" className="hidden lg:inline-flex items-center text-concrete hover:text-black mb-8 transition-colors text-sm font-bold uppercase tracking-wider group">
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Drops
        </Link>

        {/* Mobile Header Back Button (Visible only on mobile) */}
        <div className="lg:hidden absolute top-4 left-4 z-20">
             <Link href="/" className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md">
                 <ChevronLeft className="w-6 h-6 text-black" />
             </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-12">
          
          {/* LEFT: Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-4 lg:gap-6 relative">
            
            {/* Desktop Thumbnails */}
            <div className="hidden lg:flex flex-col gap-4 overflow-y-auto w-20 flex-shrink-0 scrollbar-hide py-2">
              {product.images?.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    mainImage === img ? 'border-black opacity-100 ring-4 ring-black/5' : 'border-transparent opacity-60 hover:opacity-100 hover:border-neutral-200'
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover bg-neutral-50" alt="Thumbnail" />
                </button>
              ))}
            </div>
            
            {/* Mobile & Desktop Main Image Area */}
            <div className="flex-1 relative group bg-neutral-50 lg:bg-transparent lg:cursor-zoom-in">
               
               {/* Mobile Swipeable Gallery */}
               <div 
                 ref={imageScrollRef}
                 onScroll={handleScroll}
                 className="lg:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-hide w-full h-[55vh] max-h-[500px]"
               >
                  {product.images && product.images.length > 0 ? (
                    product.images.map((img, idx) => (
                        <div key={idx} className="w-full h-full flex-shrink-0 snap-center flex items-center justify-center p-8">
                             <img src={img} className="max-w-full max-h-full object-contain drop-shadow-2xl" alt={`${product.name} - View ${idx + 1}`} />
                        </div>
                    ))
                  ) : (
                    <div className="w-full h-full flex-shrink-0 flex items-center justify-center p-8">
                         <img src={product.image} className="max-w-full max-h-full object-contain drop-shadow-2xl" alt={`${product.name}`} />
                    </div>
                  )}
               </div>

               {/* Mobile Image Counter Overlay */}
               {product.images?.length > 1 && (
                   <div className="lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold font-sans shadow-sm text-concrete">
                       {activeImageIndex + 1} / {product.images.length}
                   </div>
               )}

               {/* Desktop Main Image */}
               <div className="hidden lg:flex relative w-full h-[75vh] items-center justify-center bg-neutral-50 rounded-2xl overflow-hidden p-10">
                 <img 
                   src={mainImage} 
                   className="w-full h-full object-contain object-center drop-shadow-2xl group-hover:scale-110 transition-transform duration-700 ease-out" 
                   alt={product.name} 
                 />
               </div>
               
               {/* WISHLIST BUTTON */}
               <button 
                 onClick={handleWishlistToggle}
                 disabled={wishlistLoading}
                 className={`absolute top-4 right-4 lg:top-6 lg:right-6 p-3 rounded-full shadow-lg hover:scale-110 transition z-10 ${
                    isWishlisted 
                        ? 'bg-red-50 text-red-500' 
                        : 'bg-white text-neutral-400 hover:text-red-500'
                 }`}
               >
                  {wishlistLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />}
               </button>
            </div>
          </div>

          {/* RIGHT: Details */}
          <div className="lg:col-span-5 relative text-left">
            <div className="sticky top-24 pt-6 lg:pt-0 px-4 sm:px-0">
                
                <div className="mb-6">
                   <div className="flex items-center justify-between mb-2">
                     <span className="text-electric-blue font-bold tracking-widest uppercase text-xs">{product.brand}</span>
                     <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-bold text-black border-b border-black">4.9 (128)</span>
                     </div>
                   </div>
                   <h1 className="font-oswald text-3xl md:text-5xl font-bold uppercase leading-tight mb-2 tracking-tight">{product.name}</h1>
                   <p className="text-lg lg:text-xl text-concrete font-medium">{product.category}</p>
                </div>

                <div className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8 font-sans text-black flex items-end gap-3">
                  {formatPrice(product.price)}
                  <span className="text-xs text-concrete uppercase tracking-widest font-normal pb-1">Taxes Incl.</span>
                </div>

                {/* Size Selector */}
                <div className="mb-8">
                  <div className="flex justify-between items-end mb-4">
                    <span className="font-bold text-sm uppercase tracking-wide">Select Size <span className="text-concrete font-normal">(US)</span></span>
                    <button className="text-xs font-bold text-concrete underline hover:text-black transition-colors uppercase tracking-widest">Size Guide</button>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 lg:gap-3">
                    {product.sizes?.map((sizeObj) => {
                      const isLowStock = sizeObj.stock > 0 && sizeObj.stock <= 2;
                      const isOutOfStock = sizeObj.stock === 0;
                      return (
                        <div key={sizeObj.size} className="relative">
                          <button
                            disabled={isOutOfStock}
                            onClick={() => setSelectedSize(sizeObj.size)}
                            className={`w-full py-3 lg:py-4 rounded-xl border font-bold text-sm transition-all duration-200 ${
                              isOutOfStock 
                                ? 'bg-neutral-50 text-neutral-300 border-neutral-100 cursor-not-allowed text-opacity-50' 
                                : selectedSize === sizeObj.size 
                                  ? 'bg-black text-white border-black shadow-md shadow-black/10 scale-[1.02]' 
                                  : 'bg-white text-black border-neutral-200 hover:border-black'
                            }`}
                          >
                            {sizeObj.size}
                            {isOutOfStock && <div className="absolute inset-x-0 top-1/2 h-[1px] bg-neutral-300 -rotate-12 pointer-events-none"></div>}
                          </button>
                          {isLowStock && <span className="absolute -top-2 -right-1 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-tight shadow-sm z-10">Low</span>}
                        </div>
                      );
                    })}
                  </div>
                  {!selectedSize && (
                    <p className="text-red-500 text-xs mt-3 font-bold animate-pulse">
                      * Please select a size
                    </p>
                  )}
                </div>

                {/* MAIN ACTIONS (Visible on all breakpoints) */}
                <div className="flex flex-col gap-4 mb-8">
                   <div className="flex gap-4">
                     <div className="flex items-center bg-neutral-50 rounded-full px-4 gap-4 border border-neutral-200 shrink-0">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-concrete hover:text-black transition-colors"><Minus className="w-4 h-4" /></button>
                        <span className="font-bold w-4 text-center font-sans text-lg">{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} className="text-concrete hover:text-black transition-colors"><Plus className="w-4 h-4" /></button>
                     </div>
                     <button 
                       onClick={handleAddToCart}
                       className="flex-1 py-4 md:py-5 rounded-full font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 bg-black text-white hover:bg-neutral-800 hover:scale-[1.01] active:scale-95 shadow-lg shadow-black/10"
                     >
                       Add To Cart
                     </button>
                   </div>
                   
                   <button 
                       disabled={!selectedSize}
                       onClick={handleWhatsAppBuy}
                       className={`w-full py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 border ${
                         selectedSize 
                          ? 'bg-white text-black border-neutral-200 hover:border-black active:scale-95' 
                          : 'bg-transparent text-neutral-300 border-neutral-100 cursor-not-allowed'
                       }`}
                     >
                       <MessageCircle className="w-4 h-4" />
                       Buy via WhatsApp
                   </button>
                </div>

                {/* ACCORDIONS */}
                <div className="space-y-0 border-t border-neutral-100 mt-6 lg:mt-8 mb-8">
                  <details className="group border-b border-neutral-100" open>
                    <summary className="flex items-center justify-between font-oswald text-lg lg:text-xl font-bold uppercase py-5 cursor-pointer list-none !outline-none">
                      About The Shoe
                      <span className="transition group-open:rotate-180 bg-neutral-50 p-2 rounded-full text-black">
                        <ChevronLeft className="w-4 h-4 -rotate-90" />
                      </span>
                    </summary>
                    <div className="text-concrete leading-relaxed text-sm pb-6 animate-fade-in pr-4">
                      {product.description}
                    </div>
                  </details>
                  
                  <details className="group border-b border-neutral-100">
                    <summary className="flex items-center justify-between font-oswald text-lg lg:text-xl font-bold uppercase py-5 cursor-pointer list-none !outline-none">
                      Delivery & Returns
                      <span className="transition group-open:rotate-180 bg-neutral-50 p-2 rounded-full text-black">
                        <ChevronLeft className="w-4 h-4 -rotate-90" />
                      </span>
                    </summary>
                    <div className="pb-6 animate-fade-in">
                      <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl mb-4">
                        <div className="p-2 bg-white rounded-full shadow-sm"><Truck className="w-5 h-5 text-black" /></div>
                        <div className="text-sm">
                          <p className="font-bold text-black">Express Delivery</p>
                          <p className="text-concrete mt-0.5">2-3 Business Days in Nairobi</p>
                        </div>
                      </div>
                      <p className="text-sm text-concrete leading-relaxed px-1">We offer easy returns within 7 days of delivery for unworn items in original packaging. Terms apply.</p>
                    </div>
                  </details>

                  <details className="group border-b border-neutral-100">
                    <summary className="flex items-center justify-between font-oswald text-lg lg:text-xl font-bold uppercase py-5 cursor-pointer list-none !outline-none">
                      Authenticity Guarantee
                      <span className="transition group-open:rotate-180 bg-neutral-50 p-2 rounded-full text-black">
                        <ChevronLeft className="w-4 h-4 -rotate-90" />
                      </span>
                    </summary>
                    <div className="pb-6 animate-fade-in">
                      <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
                        <div className="p-2 bg-white rounded-full shadow-sm"><ShieldCheck className="w-5 h-5 text-electric-blue" /></div>
                        <div className="text-sm">
                          <p className="font-bold text-black">100% Authentic</p>
                          <p className="text-concrete mt-0.5">Every sneaker is rigorously inspected by our experts before shipping.</p>
                        </div>
                      </div>
                    </div>
                  </details>
                </div>
                
            </div>
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM ACTION BAR (MOBILE ONLY) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-xl border-t border-neutral-100 lg:hidden z-40 transform transition-transform duration-300">
         <div className="flex items-center gap-3 md:gap-4 max-w-7xl mx-auto">
            {/* Quantity Selector Mini */}
            <div className="flex items-center justify-between bg-neutral-100 rounded-xl px-2 h-[52px] w-20 md:w-24 shrink-0 border border-neutral-200">
               <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-concrete active:text-black"><Minus className="w-3 h-3" /></button>
               <span className="font-bold font-sans text-sm">{quantity}</span>
               <button onClick={() => setQuantity(quantity + 1)} className="p-2 text-concrete active:text-black"><Plus className="w-3 h-3" /></button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="flex-1 h-[52px] rounded-xl font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 bg-black text-white active:scale-95 shadow-xl shadow-black/20 whitespace-nowrap overflow-hidden text-ellipsis"
            >
              Add To Cart
            </button>
            
            {/* WhatsApp Icon Only */}
            <button
               disabled={!selectedSize}
               onClick={handleWhatsAppBuy}
               className={`h-[52px] w-[52px] flex items-center justify-center shrink-0 rounded-xl border transition-all ${
                 selectedSize ? 'bg-white text-black border-neutral-200 active:bg-neutral-50 active:scale-95 mt-0' : 'bg-transparent text-neutral-300 border-neutral-100 cursor-not-allowed'
               }`}
               aria-label="Buy via WhatsApp"
            >
               <MessageCircle className="w-5 h-5 flex-shrink-0" />
            </button>
         </div>
         {/* Safe Area Spacer */}
         <div className="h-safe-bottom"></div>
      </div>

    </div>
  );
}