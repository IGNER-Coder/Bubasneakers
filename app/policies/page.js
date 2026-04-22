import Link from "next/link";
import { MessageCircle } from "lucide-react";

export const metadata = {
  title: "Shipping, Returns & FAQ",
  description:
    "BubaSneakers shipping policy, returns, and frequently asked questions. Nairobi delivery in 24hrs, nationwide shipping available.",
};

const WHATSAPP_URL = `https://wa.me/254797533977?text=${encodeURIComponent(
  "Hi BubaSneakers! I have a question about my order."
)}`;

const faqs = [
  {
    q: "Are your sneakers authentic?",
    a: "Yes — every pair is physically inspected by us before dispatch. We source from verified suppliers only. If a pair is ever found to be inauthentic, we will replace it or fully refund you.",
  },
  {
    q: "How do I place an order?",
    a: "Browse our collection, select your size, and click 'Place Order' or 'Order via WhatsApp'. A pre-filled WhatsApp message will open with your order details. We'll confirm availability and send you a payment link.",
  },
  {
    q: "How do I pay?",
    a: "We currently accept payment via M-Pesa. After you confirm your order on WhatsApp, we'll send you a payment link. Full payment is required before dispatch.",
  },
  {
    q: "Can I pick up from your shop?",
    a: "Yes! We're based in Nairobi. WhatsApp us to arrange a collection time and we'll have your pair ready.",
  },
  {
    q: "What sizes do you carry?",
    a: "We carry UK sizes 6–13 depending on the model. Available sizes are shown on each product page. WhatsApp us if you need a specific size not listed.",
  },
  {
    q: "Do you restock sold-out items?",
    a: "Sometimes — it depends on supplier availability. WhatsApp us with the specific model and size and we'll let you know as soon as it's back.",
  },
];

export default function PoliciesPage() {
  return (
    <div className="animate-fade-in bg-white">

      {/* Page Header */}
      <section className="bg-off-white py-16 px-6 border-b border-neutral-100">
        <div className="max-w-[900px] mx-auto">
          <h1 className="font-oswald text-4xl md:text-6xl font-bold uppercase mb-4">
            Policies & FAQ
          </h1>
          <p className="text-concrete text-base leading-relaxed">
            Everything you need to know about ordering, delivery, payments, and returns.
            Still have questions?{" "}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] font-semibold hover:underline"
            >
              WhatsApp us directly.
            </a>
          </p>
        </div>
      </section>

      <div className="max-w-[900px] mx-auto px-6 py-16 space-y-16">

        {/* Shipping Policy */}
        <section id="shipping">
          <h2 className="font-oswald text-2xl font-bold uppercase mb-6 pb-4 border-b border-neutral-100">
            🚚 Shipping Policy
          </h2>
          <div className="space-y-4 text-concrete leading-relaxed">
            <div className="bg-off-white rounded-xl p-6">
              <h3 className="font-bold text-black mb-2">Nairobi Delivery — Free</h3>
              <p>
                Orders confirmed and paid by <strong className="text-black">3:00 PM</strong> are 
                dispatched the same day and delivered within <strong className="text-black">24 hours</strong>. 
                Delivery within Nairobi is free of charge.
              </p>
            </div>
            <div className="bg-off-white rounded-xl p-6">
              <h3 className="font-bold text-black mb-2">Nationwide Shipping — Paid</h3>
              <p>
                We ship to all counties in Kenya via courier. Delivery takes{" "}
                <strong className="text-black">3–5 business days</strong>. 
                Shipping fees are calculated based on your location and quoted to you on WhatsApp 
                before payment is requested.
              </p>
            </div>
            <div className="bg-off-white rounded-xl p-6">
              <h3 className="font-bold text-black mb-2">Shop Pickup — Free</h3>
              <p>
                You can also collect your order directly from our shop in{" "}
                <strong className="text-black">Nairobi</strong>. 
                WhatsApp us to arrange a time and we&apos;ll have your pair ready.
              </p>
            </div>
          </div>
        </section>

        {/* Returns Policy */}
        <section id="returns">
          <h2 className="font-oswald text-2xl font-bold uppercase mb-6 pb-4 border-b border-neutral-100">
            🔄 Returns & Exchanges
          </h2>
          <div className="space-y-4 text-concrete leading-relaxed">
            <p>
              We inspect every pair before dispatch, so returns are rare. However, we are fair:
            </p>
            <ul className="space-y-3">
              {[
                "If we dispatched the wrong size — we will exchange it at no extra cost to you.",
                "If a pair is found to be inauthentic — we will replace it or fully refund you.",
                "Size exchanges (customer changed mind) are handled case by case — WhatsApp us and we'll do our best.",
                "Returns must be initiated within 24 hours of receiving your order.",
                "Items must be unworn, in original condition, and in the original box.",
              ].map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-electric-blue font-bold mt-0.5">→</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq">
          <h2 className="font-oswald text-2xl font-bold uppercase mb-6 pb-4 border-b border-neutral-100">
            ❓ Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map(({ q, a }, i) => (
              <div key={i} className="border-b border-neutral-100 pb-6 last:border-0">
                <h3 className="font-bold text-black mb-2">{q}</h3>
                <p className="text-concrete leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Still need help */}
        <section className="bg-black rounded-2xl p-8 text-center">
          <h3 className="font-oswald text-2xl font-bold uppercase text-white mb-3">
            Still Have Questions?
          </h3>
          <p className="text-white/50 text-sm mb-6">
            We&apos;re on WhatsApp — the fastest way to get an answer.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-green-500 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp
          </a>
        </section>

      </div>
    </div>
  );
}
