export default function MacroTexture() {
  return (
    <section className="relative h-[60vh] w-full overflow-hidden flex items-center">
      
      {/* 1. PARALLAX BACKGROUND */}
      {/* Note: 'bg-fixed' creates the parallax effect. 
          Replace the URL with your generated texture image later. */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=2000&auto=format&fit=crop')" 
        }}
      >
        {/* Overlay to make text readable */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* 2. MINIMAL CONTENT */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 w-full">
        <div className="max-w-lg">
          <span className="text-electric-blue font-bold tracking-[0.3em] uppercase text-xs mb-4 block animate-fade-in">
            Material Study
          </span>
          
          <h2 className="font-oswald text-5xl md:text-7xl font-bold text-white uppercase leading-none mb-6 drop-shadow-lg">
            UNCOMPROMISED<br/>QUALITY.
          </h2>
          
          <div className="w-20 h-1 bg-white mb-6" />
          
          <p className="text-neutral-200 text-lg font-light drop-shadow-md">
            Premium tumbled leather. Breathable mesh. <br/>
            Every stitch inspected for perfection.
          </p>
        </div>
      </div>

    </section>
  );
}