import { ShieldCheck, Clock, MessageCircle, MapPin } from "lucide-react";

const signals = [
  { icon: ShieldCheck, text: "Every Pair Authenticated" },
  { icon: Clock, text: "Nairobi Delivery in 24hrs" },
  { icon: MessageCircle, text: "Order via WhatsApp" },
  { icon: MapPin, text: "Premium Seller Based in Kenya" },
];

export default function TrustBar() {
  return (
    <div className="bg-black text-white py-3 overflow-hidden">
      {/* Mobile: horizontal scroll. Desktop: flex row centered */}
      <div className="flex items-center gap-8 px-6 overflow-x-auto scrollbar-hide md:justify-center">
        {signals.map(({ icon: Icon, text }, i) => (
          <div
            key={i}
            className="flex items-center gap-2 shrink-0 text-xs font-bold uppercase tracking-widest"
          >
            <Icon className="w-3.5 h-3.5 text-electric-blue shrink-0" />
            <span className="whitespace-nowrap">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
