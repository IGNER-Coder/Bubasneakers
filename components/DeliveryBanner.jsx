import { MapPin, Truck } from "lucide-react";

export default function DeliveryBanner() {
  return (
    <section className="bg-black text-white py-12 md:py-16">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 md:divide-x md:divide-white/10">
          
          {/* Nairobi */}
          <div className="flex items-start gap-5 md:pr-12">
            <div className="w-12 h-12 rounded-xl border border-electric-blue/40 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-electric-blue" />
            </div>
            <div>
              <h3 className="font-oswald text-xl font-bold uppercase mb-1">
                Nairobi Delivery
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Order confirmed by <span className="text-white font-semibold">3PM</span> → delivered to your door within{" "}
                <span className="text-white font-semibold">24 hours</span>.
                Free delivery within Nairobi.
              </p>
            </div>
          </div>

          {/* Nationwide */}
          <div className="flex items-start gap-5 md:pl-12">
            <div className="w-12 h-12 rounded-xl border border-white/20 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-white/60" />
            </div>
            <div>
              <h3 className="font-oswald text-xl font-bold uppercase mb-1">
                Nationwide Shipping
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                We ship to all counties via courier parcel.{" "}
                <span className="text-white font-semibold">3–5 business days.</span> Shipping fee quoted on order confirmation.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
