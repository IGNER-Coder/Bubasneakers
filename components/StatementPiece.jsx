export default function StatementPiece() {
  return (
    <section className="w-full h-[70vh] bg-[#111111] flex flex-col items-center justify-center text-center px-4 my-24">
      <div className="max-w-4xl space-y-8">
        <h2 className="font-oswald text-5xl md:text-7xl lg:text-8xl text-white font-bold italic leading-none tracking-tight">
          "Curated, Not<br/>Compromised."
        </h2>
        <div className="h-1 w-24 bg-electric-blue mx-auto" />
        <p className="text-neutral-400 text-lg md:text-xl font-light max-w-xl mx-auto leading-relaxed">
          Every pair authenticated. Every drop intentional. <br/>
          Your sneaker obsession, elevated.
        </p>
      </div>
    </section>
  );
}