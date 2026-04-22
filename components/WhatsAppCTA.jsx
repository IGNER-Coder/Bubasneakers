import { MessageCircle, ArrowRight } from "lucide-react";

const WHATSAPP_NUMBER = "254797533977";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi BubaSneakers! I'd like to browse your collection and place an order."
)}`;

export default function WhatsAppCTA() {
  return (
    <section className="py-20 md:py-28 bg-[#0A0A0A]">
      <div className="max-w-[800px] mx-auto px-6 text-center">

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#25D366] flex items-center justify-center mx-auto mb-8">
          <MessageCircle className="w-8 h-8 text-white" strokeWidth={1.5} />
        </div>

        {/* Heading */}
        <h2 className="font-oswald text-4xl md:text-6xl font-bold uppercase text-white leading-tight mb-4">
          Got Questions? <br />
          <span className="text-[#25D366]">Just WhatsApp Us.</span>
        </h2>

        <p className="text-white/50 text-base md:text-lg leading-relaxed mb-10 max-w-lg mx-auto">
          We reply fast. Ask about a specific size, request a pair we don't have listed, 
          or just check what just dropped at the shop.
        </p>

        {/* CTA */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-[#25D366] text-white px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-green-500 transition-all duration-300 shadow-2xl shadow-green-900/30 group active:scale-95"
        >
          <MessageCircle className="w-5 h-5" />
          Chat on WhatsApp
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>

        <p className="text-white/25 text-xs mt-6 uppercase tracking-widest">
          Usually replies within 30 minutes
        </p>
      </div>
    </section>
  );
}
