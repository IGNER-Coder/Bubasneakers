import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";

const WHATSAPP_NUMBER = "254797533977";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi BubaSneakers! I'd like to browse your collection and place an order."
)}`;

export default function OwnerStrip() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Text side */}
          <div className="order-2 md:order-1">
            <span className="text-electric-blue text-xs font-bold uppercase tracking-[0.2em] block mb-4">
              Premium Sneakers
            </span>
            <h2 className="font-oswald text-4xl md:text-5xl font-bold uppercase leading-tight mb-6">
              Based in <br />
              <span className="text-electric-blue">Kenya.</span>
            </h2>
            <p className="text-concrete text-base leading-relaxed mb-4">
              BubaSneakers is your trusted plug for authentic streetwear. We source directly, authenticate
              every pair by hand, and bring the premium boutique experience straight to your phone.
            </p>
            <p className="text-concrete text-base leading-relaxed mb-8">
              No fakes. No complications. Just heat, delivered with honesty.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/about">
                <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 hover:border-electric-blue hover:text-electric-blue transition-colors group">
                  Our Guarantee <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#25D366] hover:opacity-80 transition-opacity"
              >
                <MessageCircle className="w-4 h-4" />
                Chat With Us
              </a>
            </div>
          </div>

          {/* Visual side */}
          <div className="order-1 md:order-2">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100">
              {/* Placeholder — replace with real shop/owner photo */}
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-black flex items-center justify-center">
                <div className="text-center text-white/20 p-8">
                  <p className="font-oswald text-lg uppercase tracking-widest">Add Shop Photo Here</p>
                  <p className="text-xs mt-2 font-inter">Replace this div with a real image of your collection or shop</p>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                <p className="font-oswald text-sm font-bold uppercase">BubaSneakers</p>
                <p className="text-xs text-concrete">Nairobi, Kenya</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
