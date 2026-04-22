import { Search, MessageCircle, Package } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Browse Our Collection",
    description:
      "Explore authenticated sneakers curated from our premium network. Filter by brand, size, and gender.",
  },
  {
    icon: MessageCircle,
    number: "02",
    title: "Place Your Order via WhatsApp",
    description:
      "Select your size, tap 'Place Order' and a message fires to us on WhatsApp — with your full order details pre-filled.",
  },
  {
    icon: Package,
    number: "03",
    title: "We Confirm & Deliver",
    description:
      "We verify your pair, send you a payment link via M-Pesa, then dispatch. Nairobi: within 24hrs. Nationwide: 3–5 days.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 md:py-28 bg-off-white">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="text-electric-blue text-xs font-bold uppercase tracking-[0.2em] block mb-3">
            Simple Process
          </span>
          <h2 className="font-oswald text-4xl md:text-5xl font-bold uppercase">
            How It Works
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map(({ icon: Icon, number, title, description }) => (
            <div
              key={number}
              className="relative flex flex-col items-start md:items-center md:text-center gap-5"
            >
              {/* Step number + icon */}
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className="absolute -top-3 -right-3 font-oswald text-xs font-bold text-electric-blue bg-white border border-electric-blue/20 px-1.5 py-0.5 rounded-md">
                  {number}
                </span>
              </div>

              {/* Content */}
              <div>
                <h3 className="font-oswald text-xl font-bold uppercase mb-2">
                  {title}
                </h3>
                <p className="text-concrete text-sm leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Connector line (desktop only, not on last item) */}
              {number !== "03" && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] right-[calc(-50%+40px)] h-[1px] bg-neutral-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
