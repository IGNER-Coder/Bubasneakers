"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, CreditCard, Smartphone, ShieldCheck, Lock, Loader2, MessageCircle } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cart, getTotalPrice } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  
  const cartTotal = getTotalPrice();
  
  const [isClient, setIsClient] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("whatsapp"); 
  
  // ⚠️ REPLACE WITH YOUR BUSINESS PHONE NUMBER (No +)
  const MERCHANT_PHONE = "254797533977"; 

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    phone: ""
  });

  useEffect(() => {
    setIsClient(true);
    if (session?.user) {
        setFormData(prev => ({ ...prev, email: session.user.email, firstName: session.user.name.split(' ')[0] }));
    }
  }, [session]);

  if (!isClient) return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    if (!formData.phone || !formData.firstName) {
      alert("Please fill in your contact details.");
      return;
    }

    if (paymentMethod !== "whatsapp") {
      alert("This payment method is coming soon. Please use WhatsApp for now.");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Save Order to MongoDB
      const orderData = {
        userId: session?.user?.id || null, 
        items: cart,
        totalAmount: cartTotal,
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          address: formData.address,
          city: formData.city,
          phone: formData.phone,
        },
        paymentMethod: "WhatsApp", 
        status: "Processing"
      };

      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const orderJson = await orderRes.json();

      if (orderRes.ok) {
        // 2. Construct the Detailed WhatsApp Message (CLEAN VERSION)
        const orderIdShort = orderJson.orderId ? orderJson.orderId.slice(-6).toUpperCase() : "NEW";
        
        const itemList = cart.map(i => 
            `- ${i.name} (Size ${i.size}) x${i.quantity} : KES ${(i.price * i.quantity).toLocaleString()}`
        ).join('\n'); 
        
        const shippingDetails = `Name: ${formData.firstName} ${formData.lastName}\nAddress: ${formData.address}, ${formData.city}\nPhone: ${formData.phone}`;

        const rawMessage = `*NEW ORDER #${orderIdShort}*\n\nHello Buba! I want to finalize my order:\n\n*ITEMS:*\n${itemList}\n\n*TOTAL: KES ${cartTotal.toLocaleString()}*\n\n*SHIPPING DETAILS:*\n${shippingDetails}\n\nPlease provide payment details.`;
        
        const whatsappUrl = `https://wa.me/${MERCHANT_PHONE}?text=${encodeURIComponent(rawMessage)}`;

        // 3. Redirect
        window.location.href = whatsappUrl;
      } else {
        alert("Failed to save order. Please try again.");
      }

    } catch (error) {
      console.error(error);
      alert("Network error.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-off-white">
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
          
          <div className="lg:col-span-7 space-y-10">
            
            <section>
              <h2 className="font-oswald text-2xl font-bold uppercase mb-6">1. Contact & Shipping</h2>
              <div className="grid grid-cols-2 gap-4">
                 <input name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" placeholder="First Name" className="w-full bg-white border border-neutral-200 p-4 rounded-lg focus:border-black outline-none transition-colors" />
                 <input name="lastName" value={formData.lastName} onChange={handleInputChange} type="text" placeholder="Last Name" className="w-full bg-white border border-neutral-200 p-4 rounded-lg focus:border-black outline-none transition-colors" />
                 <input name="phone" value={formData.phone} onChange={handleInputChange} type="text" placeholder="Phone Number" className="col-span-2 w-full bg-white border border-neutral-200 p-4 rounded-lg focus:border-black outline-none transition-colors" />
                 <input name="address" value={formData.address} onChange={handleInputChange} type="text" placeholder="Address (e.g. Building, Street)" className="col-span-2 w-full bg-white border border-neutral-200 p-4 rounded-lg focus:border-black outline-none transition-colors" />
                 <input name="city" value={formData.city} onChange={handleInputChange} type="text" placeholder="City / Location" className="col-span-2 w-full bg-white border border-neutral-200 p-4 rounded-lg focus:border-black outline-none transition-colors" />
                 <input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="Email Address (Optional)" className="col-span-2 w-full bg-white border border-neutral-200 p-4 rounded-lg focus:outline-none focus:border-black transition-colors" />
              </div>
            </section>

            <section>
              <h2 className="font-oswald text-2xl font-bold uppercase mb-6">2. Payment Method</h2>
              <div className="space-y-4">
                
                <div 
                  onClick={() => setPaymentMethod("whatsapp")}
                  className={`relative p-6 bg-green-50 border-2 ${paymentMethod === "whatsapp" ? "border-green-500 ring-1 ring-green-500" : "border-green-200"} rounded-xl flex items-center gap-4 cursor-pointer shadow-sm transition-all`}
                >
                  <div className="bg-green-500 p-3 rounded-full text-white">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-green-900">Order via WhatsApp</h3>
                    <p className="text-xs text-green-800">Fastest. Pay via M-Pesa Till Number.</p>
                  </div>
                  <div className="ml-auto">
                    <div className={`w-5 h-5 rounded-full border-2 border-green-600 flex items-center justify-center ${paymentMethod === "whatsapp" ? "bg-green-600" : ""}`}>
                        {paymentMethod === "whatsapp" && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </div>
                </div>

                <div className="relative p-6 bg-white border border-neutral-200 rounded-xl flex items-center gap-4 opacity-50 cursor-not-allowed grayscale">
                  <div className="bg-neutral-100 p-3 rounded-full text-concrete">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-concrete">Instant M-Pesa Prompt</h3>
                    <p className="text-xs text-concrete">Automated STK Push</p>
                  </div>
                  <span className="ml-auto bg-neutral-200 text-concrete text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">
                    Coming Soon
                  </span>
                </div>

                 <div className="relative p-6 bg-white border border-neutral-200 rounded-xl flex items-center gap-4 opacity-50 cursor-not-allowed grayscale">
                  <div className="bg-neutral-100 p-3 rounded-full text-concrete">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-concrete">Card Payment</h3>
                    <p className="text-xs text-concrete">Visa / Mastercard</p>
                  </div>
                  <span className="ml-auto bg-neutral-200 text-concrete text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">
                    Coming Soon
                  </span>
                </div>

              </div>
            </section>

            <button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-[#25D366] text-white py-6 rounded-full font-bold text-lg uppercase tracking-widest hover:bg-green-600 transition-colors shadow-xl flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isProcessing ? <Loader2 className="animate-spin" /> : `Complete on WhatsApp`}
            </button>

            <div className="flex items-center justify-center gap-2 text-concrete text-xs font-bold uppercase tracking-widest mt-4">
                <Lock className="w-3 h-3" /> Secure Checkout
            </div>

          </div>
          
          <div className="lg:col-span-5">
             {/* Order Summary Component with Fixed Image Handling */}
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100 sticky top-24">
                <h3 className="font-oswald text-xl font-bold uppercase mb-6">Order Summary</h3>
                
                <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 scrollbar-hide">
                  {cart.length === 0 ? (
                      <p className="text-concrete">Your cart is empty.</p>
                  ) : (
                    cart.map((item, idx) => (
                      <div key={`${item.id}-${item.size}-${idx}`} className="flex gap-4">
                        <div className="w-16 h-16 bg-neutral-50 rounded-md overflow-hidden border border-neutral-100 relative">
                          {/* ✅ FIX: Robust image source check to handle both array and string formats */}
                          <img 
                            src={
                              (item.images && item.images.length > 0) ? item.images[0] : 
                              (item.image ? item.image : "/placeholder.jpg")
                            } 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                          />
                          <span className="absolute top-0 right-0 bg-concrete text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-bl-md">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm line-clamp-2">{item.name}</h4>
                          <p className="text-xs text-concrete">Size: {item.size}</p>
                        </div>
                        <p className="font-bold text-sm">${item.price * item.quantity}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="space-y-4 border-t border-neutral-100 pt-6">
                  <div className="flex justify-between text-sm"><span className="text-concrete">Subtotal</span><span className="font-bold">KES {cartTotal.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-concrete">Shipping</span><span className="text-electric-blue font-bold uppercase text-xs tracking-wider">Free</span></div>
                  <div className="flex justify-between text-xl font-bold font-oswald pt-4 border-t border-neutral-100"><span>Total</span><span>KES {cartTotal.toLocaleString()}</span></div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}