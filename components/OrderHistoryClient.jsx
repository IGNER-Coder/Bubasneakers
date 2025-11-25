"use client";

import { ChevronLeft, Package, CheckCircle, Truck, XCircle, DollarSign, Clock } from "lucide-react";
import Link from "next/link";

const StatusBadge = ({ status }) => {
  const baseStyle = "text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1";
  switch (status) {
    case 'Delivered':
      return <span className={`${baseStyle} bg-green-100 text-green-700`}><CheckCircle className="w-3 h-3" /> Delivered</span>;
    case 'Shipped':
      return <span className={`${baseStyle} bg-blue-100 text-electric-blue`}><Truck className="w-3 h-3" /> Shipped</span>;
    case 'Processing':
      return <span className={`${baseStyle} bg-yellow-100 text-yellow-700`}><Clock className="w-3 h-3" /> Processing</span>;
    case 'Cancelled':
      return <span className={`${baseStyle} bg-red-100 text-red-700`}><XCircle className="w-3 h-3" /> Cancelled</span>;
    default:
      return <span className={`${baseStyle} bg-neutral-100 text-concrete`}>{status}</span>;
  }
};

export default function OrderHistoryClient({ orders }) {
  
  return (
    <div className="min-h-screen bg-off-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <Link href="/account" className="inline-flex items-center text-concrete hover:text-black mb-8 transition-colors text-sm font-bold uppercase tracking-wider group">
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        
        <h1 className="font-oswald text-4xl font-bold uppercase mb-2">Order History</h1>
        <p className="text-lg text-concrete mb-10">You have successfully placed {orders.length} orders since joining BUBASNEAKERS.</p>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-neutral-100">
            <Package className="w-12 h-12 mx-auto text-concrete mb-4" />
            <p className="text-xl font-bold text-concrete">No Orders Found</p>
            <Link href="/shop" className="mt-4 inline-block text-electric-blue hover:underline">Start Your Collection</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-black/10">
                <div className="flex justify-between items-start border-b border-neutral-100 pb-4 mb-4">
                  <div>
                    <p className="text-xs text-concrete font-bold uppercase">Order #</p>
                    <p className="font-mono text-sm text-black">{order._id.slice(-8)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-concrete font-bold uppercase text-right">Date</p>
                    <p className="font-bold text-sm text-black">{order.createdAt}</p>
                  </div>
                </div>
                
                {/* Status and Tracking */}
                <div className="flex justify-between items-center mb-4">
                    <StatusBadge status={order.status} />
                    {order.trackingNumber && order.status === 'Shipped' && (
                        <a 
                            href={`#tracking-${order.trackingNumber}`} 
                            className="text-electric-blue text-sm font-bold hover:underline"
                        >
                            Track: {order.trackingNumber}
                        </a>
                    )}
                </div>

                {/* Items Summary */}
                <div className="space-y-3 pt-3">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex items-center gap-4">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-12 h-12 object-cover rounded-md flex-shrink-0 border border-neutral-100" 
                      />
                      <div className="flex-1">
                        <p className="font-bold text-sm line-clamp-1">{item.name}</p>
                        <p className="text-xs text-concrete">Size {item.size} x {item.quantity}</p>
                      </div>
                      <p className="font-bold text-sm">${item.priceAtPurchase * item.quantity}</p>
                    </div>
                  ))}
                </div>

                {/* Footer Totals */}
                <div className="mt-4 pt-4 border-t border-neutral-100 flex justify-between items-center">
                    <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-black" />
                        <span className="font-oswald text-xl font-bold">Total: ${order.totalAmount}</span>
                    </div>
                    <button className="text-sm font-bold text-black border border-black px-4 py-2 rounded-full hover:bg-black hover:text-white transition-colors">
                        View Details
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}