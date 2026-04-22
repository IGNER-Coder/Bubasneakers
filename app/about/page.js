import Link from "next/link";
import { ShieldCheck, MapPin, MessageCircle, ArrowRight } from "lucide-react";

export const metadata = {
  title: "About Us",
  description:
    "BubaSneakers is a Kenya-based premium sneaker boutique. We authenticate every pair and deliver nationwide.",
};

const WHATSAPP_URL = `https://wa.me/254797533977?text=${encodeURIComponent(
  "Hi BubaSneakers! I'd like to learn more about your store."
)}`;

export default function AboutPage() {
  return (
    <div className="animate-fade-in">

      {/* Hero */}
      <section className="bg-black text-white py-24 md:py-36 px-6">
        <div className="max-w-[1400px] mx-auto">
          <span className="text-electric-blue text-xs font-bold uppercase tracking-[0.2em] block mb-4">
            About BubaSneakers
          </span>
          <h1 className="font-oswald text-5xl md:text-8xl font-bold uppercase leading-none mb-6 max-w-4xl">
            Premium Sneakers. <br />
            <span className="text-electric-blue">Based in Kenya.</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-2xl">
            We're bringing the global sneaker boutique experience directly to you.
            Exclusive drops. Hand-verified authenticity. Delivered fast.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 md:py-28 bg-white px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">

          {/* Photo placeholder */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100">
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-black flex items-center justify-center">
              <div className="text-center text-white/20 p-8">
                <MapPin className="w-12 h-12 mx-auto mb-4 opacity-40" />
                <p className="font-oswald text-lg uppercase tracking-widest">Shop Photo</p>
                <p className="text-xs mt-2">Replace with real photo of your sneaker collection or shop</p>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
              <p className="font-oswald text-sm font-bold uppercase">The Boutique</p>
              <p className="text-xs text-concrete">Nairobi, Kenya</p>
            </div>
          </div>

          {/* Story text */}
          <div>
            <h2 className="font-oswald text-3xl md:text-4xl font-bold uppercase mb-6">
              The BubaSneakers Mission
            </h2>
            <div className="space-y-4 text-concrete leading-relaxed">
              <p>
                BubaSneakers was born out of a simple frustration: finding authentic, high-quality sneakers 
                in Nairobi shouldn&apos;t require risking your money on obvious fakes or waiting weeks for shipping.
              </p>
              <p>
                We operate as a premium boutique based in Kenya. We&apos;ve built direct relationships with trusted suppliers so we can 
                offer you the absolute best from brands like Jordan, Nike, and Yeezy.
              </p>
              <p>
                Every pair that leaves our hands has been physically inspected. We check the 
                stitching, the box, the sole, the tags — everything. If we wouldn&apos;t wear it, 
                we won&apos;t sell it.
              </p>
              <p className="text-black font-semibold">
                No middlemen. No fakes. Just heat, delivered with honesty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Authentication Process */}
      <section className="py-20 md:py-28 bg-off-white px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <span className="text-electric-blue text-xs font-bold uppercase tracking-[0.2em] block mb-3">
              Our Promise
            </span>
            <h2 className="font-oswald text-4xl md:text-5xl font-bold uppercase">
              How We Authenticate
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Source Verification",
                description:
                  "We buy only from suppliers we&apos;ve vetted personally. No unknown sellers, no online resellers we can&apos;t verify.",
              },
              {
                step: "02",
                title: "Physical Inspection",
                description:
                  "Every pair is physically inspected: stitching, materials, sole construction, labeling and box integrity.",
              },
              {
                step: "03",
                title: "Your Guarantee",
                description:
                  "If a pair is ever found to be inauthentic after you receive it, we will replace it or refund you. Full stop.",
              },
            ].map(({ step, title, description }) => (
              <div
                key={step}
                className="bg-white rounded-2xl p-8 border border-neutral-100"
              >
                <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center mb-5">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold text-electric-blue uppercase tracking-widest block mb-2">
                  Step {step}
                </span>
                <h3 className="font-oswald text-xl font-bold uppercase mb-3">{title}</h3>
                <p className="text-concrete text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-black text-white px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="font-oswald text-4xl md:text-5xl font-bold uppercase mb-4">
            Looking for a specific pair?
          </h2>
          <p className="text-white/50 text-base mb-10">
            WhatsApp is the fastest way to reach us. Drop us a picture of what you want.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-green-500 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Us
            </a>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all group"
            >
              Browse Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <p className="text-white/30 text-xs mt-8 uppercase tracking-widest">
            Based in Nairobi, Kenya
          </p>
        </div>
      </section>
    </div>
  );
}
