export default function Marquee() {
  return (
    <div className="relative flex overflow-x-hidden bg-black py-4 border-y border-white/10">
      <div className="animate-marquee whitespace-nowrap flex gap-8">
        {/* We repeat the text to ensure seamless looping */}
        <MarqueeText />
        <MarqueeText />
        <MarqueeText />
        <MarqueeText />
      </div>
    </div>
  );
}

const MarqueeText = () => (
  <div className="flex items-center gap-8 text-white/80 font-oswald text-xl md:text-2xl font-bold uppercase tracking-widest">
    <span>⚡ New Drops Every Friday</span>
    <span className="text-electric-blue">•</span>
    <span>Authenticity Guaranteed</span>
    <span className="text-electric-blue">•</span>
    <span>Free Shipping Within Nairobi</span>
    <span className="text-electric-blue">•</span>
    <span>Buba Sneakers Exclusive</span>
    <span className="text-electric-blue">•</span>
  </div>
);