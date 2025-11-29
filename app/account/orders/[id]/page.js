"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Package, Truck, CheckCircle, MapPin, Clock, Loader2 } from "lucide-react";

export default function OrderDetailsPage() {
  const params = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (error) {
        console.error("Failed to load order");
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchOrder();
  }, [params.id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!order) return <div className="min-h-screen flex items-center justify-center">Order not found</div>;

  // Timeline Logic
  const steps = ['Processing', 'Paid', 'Shipped', 'Delivered'];
  const currentStepIndex = steps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-off-white py-12 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        
        <Link href="/account/orders" className="inline-flex items-center text-concrete hover:text-black mb-8 font-bold text-sm uppercase tracking-wider">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Orders
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* Header */}
          <div className="p-8 border-b border-neutral-100">
            <div className="flex justify-between items-start mb-2">
              <h1 className="font-oswald text-3xl font-bold uppercase">Order #{order._id.slice(-6)}</h1>
              <span className="bg-black text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                {order.status}
              </span>
            </div>
            <p className="text-concrete text-sm">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>

          {/* Tracking Timeline */}
          <div className="p-8 bg-neutral-50 border-b border-neutral-100">
            <h3 className="font-bold text-sm uppercase tracking-wider mb-6">Shipment Progress</h3>
            <div className="relative flex justify-between items-center z-10">
              {/* Connecting Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-neutral-200 -z-10" />
              <div 
                className="absolute top-1/2 left-0 h-1 bg-electric-blue -z-10 transition-all duration-1000" 
                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              />

              {steps.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                
                return (
                  <div key={step} className="flex flex-col items-center gap-2 bg-neutral-50 px-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isCompleted ? 'bg-electric-blue border-electric-blue text-white' : 'bg-white border-neutral-300 text-neutral-300'
                    }`}>
                      {idx === 0 && <Clock className="w-4 h-4" />}
                      {idx === 1 && <CheckCircle className="w-4 h-4" />}
                      {idx === 2 && <Truck className="w-4 h-4" />}
                      {idx === 3 && <Package className="w-4 h-4" />}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wide ${isCurrent ? 'text-electric-blue' : 'text-concrete'}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details */}
          <div className="p-8 grid md:grid-cols-2 gap-8">
            
            {/* Items */}
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Items</h3>
              <div className="space-y-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden shrink-0">
                       {/* Assuming image is saved in item or fallback */}
                       <img src={item.image || "/placeholder.jpg"} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{item.name}</p>
                      <p className="text-xs text-concrete">Size: {item.size} | Qty: {item.quantity}</p>
                      <p className="text-sm font-bold mt-1">KES {item.priceAtPurchase}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider mb-2">Delivery Address</h3>
                <div className="text-sm text-concrete leading-relaxed">
                  <p className="text-black font-bold">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}</p>
                  <p>{order.shippingAddress.phone}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider mb-2">Payment</h3>
                <p className="text-sm text-concrete">Method: <span className="text-black font-bold">{order.paymentMethod}</span></p>
                <p className="text-sm text-concrete">Total: <span className="text-black font-bold text-lg">KES {order.totalAmount}</span></p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}